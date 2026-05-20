import { cache } from "react";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getEnrichedPollingStationsGeoJson } from "@/lib/geojson";
import { getPollingStations, hasDatabaseUrl } from "@/lib/postgres";

type CsvRow = Record<string, string>;

type TurnoutSnapshot = {
  electionId: string;
  electionYear: number;
  electionType: string;
  roundNumber: number;
  turnoutPct: number | null;
};

export type PollingStationMapRecord = {
  pollingStationCode: string;
  pollingStationNumber: number;
  placeName: string;
  address: string | null;
  isCentralizer: boolean;
  geometryType: string | null;
  reportCount: number;
  urgentCount: number;
  opposedOrSkepticalCount: number;
  recentTurnoutPct: number | null;
  historicalTurnoutAvg: number | null;
  turnoutTrendPct: number | null;
  electionsCount: number;
  latestElectionLabel: string | null;
};

function normalizePollingStationCode(code: string | null | undefined) {
  if (!code) return "";
  const value = String(code).trim();
  const parts = value.split("_");
  return (parts[parts.length - 1] ?? value).padStart(4, "0");
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function parseCsv(content: string) {
  const lines = content.trim().split(/\r?\n/);
  if (lines.length === 0) return [];

  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce<CsvRow>((row, header, index) => {
      row[header] = values[index] ?? "";
      return row;
    }, {});
  });
}

function parseNumber(value: string | null | undefined) {
  if (!value) return null;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function formatElectionLabel(snapshot: TurnoutSnapshot | null) {
  if (!snapshot) return null;
  return `${snapshot.electionType} ${snapshot.electionYear} T${snapshot.roundNumber}`;
}

const loadPollingStationHistory = cache(async () => {
  const turnoutPath = join(
    process.cwd(),
    "..",
    "..",
    "data",
    "elections",
    "normalized",
    "cabestany-election-turnout-by-bv.csv",
  );

  const turnoutCsv = await readFile(turnoutPath, "utf-8");
  const turnoutRows = parseCsv(turnoutCsv);

  const turnoutByStation = new Map<string, TurnoutSnapshot[]>();
  for (const row of turnoutRows) {
    const code = normalizePollingStationCode(row.polling_station_code);
    const snapshot: TurnoutSnapshot = {
      electionId: row.election_id,
      electionYear: Number(row.election_year),
      electionType: row.election_type,
      roundNumber: Number(row.round_number),
      turnoutPct: parseNumber(row.votants_pct_inscrits),
    };
    turnoutByStation.set(code, [...(turnoutByStation.get(code) ?? []), snapshot]);
  }

  for (const snapshots of turnoutByStation.values()) {
    snapshots.sort((left, right) => {
      if (left.electionYear !== right.electionYear) return left.electionYear - right.electionYear;
      if (left.roundNumber !== right.roundNumber) return left.roundNumber - right.roundNumber;
      return left.electionType.localeCompare(right.electionType);
    });
  }

  return turnoutByStation;
});

export const getPollingStationsMapData = cache(async (): Promise<PollingStationMapRecord[]> => {
  const [geoJson, turnoutByStation, dbStations] = await Promise.all([
    getEnrichedPollingStationsGeoJson(),
    loadPollingStationHistory(),
    hasDatabaseUrl() ? getPollingStations().catch(() => []) : Promise.resolve([]),
  ]);

  const dbByCode = new Map(
    dbStations.map((station) => [normalizePollingStationCode(station.pollingStationCode), station] as const),
  );

  return geoJson.features
    .map((feature) => {
      const code = normalizePollingStationCode(feature.properties.codeBureauVote);
      const dbStation = dbByCode.get(code);
      const turnoutHistory = turnoutByStation.get(code) ?? [];
      const turnoutValues = turnoutHistory.map((entry) => entry.turnoutPct).filter((value): value is number => value !== null);
      const latestSnapshot = turnoutHistory[turnoutHistory.length - 1] ?? null;
      const recentSlices = turnoutValues.slice(-4);
      const recentAverage =
        recentSlices.length > 0
          ? recentSlices.reduce((sum, value) => sum + value, 0) / recentSlices.length
          : null;
      const historicalAverage =
        turnoutValues.length > 0
          ? turnoutValues.reduce((sum, value) => sum + value, 0) / turnoutValues.length
          : null;
      const turnoutTrendPct =
        recentAverage !== null && historicalAverage !== null ? recentAverage - historicalAverage : null;

      return {
        pollingStationCode: code,
        pollingStationNumber: Number(feature.properties.numeroBureauVote ?? code),
        placeName: feature.properties.place_name || dbStation?.placeName || `Bureau ${code}`,
        address: feature.properties.address || dbStation?.address || null,
        isCentralizer:
          String(feature.properties.is_centralizer).toLowerCase() === "true" || dbStation?.isCentralizer || false,
        geometryType: dbStation?.geometryType ?? feature.geometry.type ?? null,
        reportCount: dbStation?.reportCount ?? 0,
        urgentCount: dbStation?.urgentCount ?? 0,
        opposedOrSkepticalCount: dbStation?.opposedOrSkepticalCount ?? 0,
        recentTurnoutPct: recentAverage ?? latestSnapshot?.turnoutPct ?? null,
        historicalTurnoutAvg: historicalAverage,
        turnoutTrendPct,
        electionsCount: turnoutHistory.length,
        latestElectionLabel: formatElectionLabel(latestSnapshot),
      } satisfies PollingStationMapRecord;
    })
    .sort((left, right) => left.pollingStationNumber - right.pollingStationNumber);
});
