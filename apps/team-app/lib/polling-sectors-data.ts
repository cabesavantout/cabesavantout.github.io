import { cache } from "react";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getSectorStreetHints, getTeamCoverageData, hasDatabaseUrl, type SectorCoverageItem } from "@/lib/postgres";

type ManualSectorStreetRow = {
  sector_code: string;
  polling_station_code: string;
  street_name: string;
  source: string;
  notes: string;
};

export type PollingSectorMapItem = SectorCoverageItem & {
  streets: string[];
  streetCount: number;
  streetSource: "manual" | "citizens" | "mixed" | "none";
};

function normalizePollingStationCode(code: string | null | undefined) {
  if (!code) return "";
  return String(code).trim().padStart(4, "0");
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

function parseCsv<T extends Record<string, string>>(content: string) {
  const lines = content.trim().split(/\r?\n/);
  if (lines.length <= 1) return [];

  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce<Record<string, string>>((row, header, index) => {
      row[header] = values[index] ?? "";
      return row;
    }, {}) as T;
  });
}

const loadManualSectorStreetRows = cache(async () => {
  const path = join(process.cwd(), "..", "..", "data", "territory", "cabestany-sector-streets.csv");

  try {
    const content = await readFile(path, "utf-8");
    return parseCsv<ManualSectorStreetRow>(content);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return [];
    throw error;
  }
});

function mergeStreetSources(
  sector: SectorCoverageItem,
  citizenStreetMap: Map<string, string[]>,
  manualStreetMap: Map<string, string[]>,
): Pick<PollingSectorMapItem, "streets" | "streetSource"> {
  const citizenStreets = citizenStreetMap.get(normalizePollingStationCode(sector.pollingStationCode)) ?? [];
  const manualStreets = manualStreetMap.get(sector.code) ?? [];
  const merged = [...new Set([...manualStreets, ...citizenStreets])].sort((left, right) =>
    left.localeCompare(right, "fr"),
  );

  const streetSource: PollingSectorMapItem["streetSource"] =
    manualStreets.length > 0 && citizenStreets.length > 0
      ? "mixed"
      : manualStreets.length > 0
        ? "manual"
        : citizenStreets.length > 0
          ? "citizens"
          : "none";

  return { streets: merged, streetSource };
}

export const getPollingSectorMapData = cache(async (): Promise<PollingSectorMapItem[]> => {
  if (!hasDatabaseUrl()) {
    return [];
  }

  const [teamCoverage, streetHints, manualRows] = await Promise.all([
    getTeamCoverageData().catch(() => ({
      sectors: [],
      uncoveredCount: 0,
      coveredCount: 0,
      urgentSectorCount: 0,
      priorityLeaders: [],
      actionBuckets: {
        assignThisWeek: [],
        reviewPolitically: [],
        activateField: [],
      },
    })),
    getSectorStreetHints().catch(() => []),
    loadManualSectorStreetRows(),
  ]);

  const citizenStreetMap = new Map(
    streetHints.map((item) => [normalizePollingStationCode(item.pollingStationCode), item.streets] as const),
  );
  const manualStreetMap = new Map<string, string[]>();

  for (const row of manualRows) {
    if (!row.sector_code || !row.street_name) continue;
    const current = manualStreetMap.get(row.sector_code) ?? [];
    current.push(row.street_name);
    manualStreetMap.set(row.sector_code, [...new Set(current)]);
  }

  return teamCoverage.sectors.map((sector) => {
    const { streets, streetSource } = mergeStreetSources(sector, citizenStreetMap, manualStreetMap);
    return {
      ...sector,
      streets,
      streetCount: streets.length,
      streetSource,
    };
  });
});
