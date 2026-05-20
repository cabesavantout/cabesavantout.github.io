import { cache } from "react";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

type CsvRow = Record<string, string>;

export type CommuneElectionSnapshot = {
  electionId: string;
  electionType: string;
  electionYear: number;
  roundNumber: number;
  dateScrutin: string | null;
  inscrits: number | null;
  votants: number | null;
  exprimes: number | null;
  turnoutPct: number | null;
  topLabel: string | null;
  topCandidate: string | null;
  topNuance: string | null;
  topVotes: number | null;
  topShare: number | null;
  sourceLabel: string;
};

export type CommuneElectionTypeSummary = {
  electionType: string;
  label: string;
  latest: CommuneElectionSnapshot | null;
  electionCount: number;
  averageTurnoutPct: number | null;
};

export type CommuneElectoralAnalysisData = {
  latestElection: CommuneElectionSnapshot | null;
  latestByType: CommuneElectionTypeSummary[];
  history: CommuneElectionSnapshot[];
  electionDocuments?: Array<{
    label: string;
    href: string;
    note: string;
    electionType: string | null;
    electionYear: number | null;
    roundNumber?: number | null;
    electionId?: string | null;
    sourcePath?: string | null;
  }>;
  municipalDocuments?: Array<{
    label: string;
    href: string;
    note: string;
    year: string | null;
  }>;
  sequences?: CommuneElectionSequence[];
};

export type CommuneElectionSequence = {
  electionId: string;
  electionType: string;
  electionYear: number;
  roundNumber: number;
  dateScrutin: string | null;
  turnoutPct: number | null;
  topLabel: string | null;
  topCandidate: string | null;
  topShare: number | null;
  bureauCoverageCount: number;
  bureauHighlights: Array<{
    pollingStationCode: string;
    turnoutPct: number | null;
    topLabel: string | null;
    topShare: number | null;
    note: string;
  }>;
  documents: Array<{
    label: string;
    href: string;
    note: string;
  }>;
  municipalDocuments: Array<{
    label: string;
    href: string;
    note: string;
  }>;
};

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

function formatPercent(value: number | null) {
  if (value === null) return "N/A";
  return `${value.toFixed(1)} %`;
}

function getElectionTypeLabel(electionType: string) {
  switch (electionType) {
    case "municipales":
      return "Municipales";
    case "presidentielles":
      return "Présidentielles";
    case "legislatives":
      return "Législatives";
    case "regionales":
      return "Régionales";
    case "departementales":
      return "Départementales";
    case "cantonales":
      return "Cantonales";
    case "europeennes":
      return "Européennes";
    default:
      return electionType;
  }
}

function humanizeFileName(value: string) {
  return value
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeAscii(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatElectionDocumentLabel(relativePath: string) {
  const fileName = relativePath.split("/").pop() ?? relativePath;
  const humanized = humanizeFileName(fileName);
  return humanized.charAt(0).toUpperCase() + humanized.slice(1);
}

function getElectionDocumentNote(relativePath: string) {
  if (relativePath.endsWith(".csv")) {
    return "Fichier source local des résultats électoraux.";
  }

  if (relativePath.endsWith(".md")) {
    return "Note locale de contexte, de méthode ou de validation.";
  }

  if (relativePath.endsWith(".html")) {
    return "Capture locale de page source ou d'affichage communal.";
  }

  return "Document local conservé dans l'archive électorale.";
}

function parseRoundNumber(relativePath: string) {
  const roundMatch = relativePath.match(/(?:_|-)([12])(er|eme)?_tour/i) ?? relativePath.match(/t([12])\b/i);
  return roundMatch ? Number(roundMatch[1]) : null;
}

function buildElectionId(electionType: string | null, electionYear: number | null, roundNumber: number | null) {
  if (!electionType || !electionYear || !roundNumber) return null;
  return `${electionType}-${electionYear}-t${roundNumber}`;
}

function getDocumentPriorityScore(relativePath: string) {
  if (relativePath.endsWith(".md")) return 0;
  if (relativePath.endsWith(".html")) return 1;
  if (relativePath.endsWith(".csv")) return 2;
  return 3;
}

async function walkFiles(basePath: string, relativePrefix: string): Promise<string[]> {
  const entries = await readdir(basePath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = join(basePath, entry.name);
      const relativePath = `${relativePrefix}/${entry.name}`;

      if (entry.isDirectory()) {
        return walkFiles(absolutePath, relativePath);
      }

      return [relativePath];
    }),
  );

  return files.flat();
}

const loadElectionDocuments = cache(async () => {
  const basePath = join(process.cwd(), "..", "..", "data", "elections");
  const files = await walkFiles(basePath, "data/elections");

  return files
    .filter((relativePath) => !relativePath.endsWith(".gitkeep"))
    .filter((relativePath) => !relativePath.includes("/normalized/"))
    .map((relativePath) => {
      const parts = relativePath.split("/");
      const electionType = parts[2] && parts[2] !== "archives" ? parts[2] : null;
      const yearMatch = relativePath.match(/(20\d{2}|19\d{2})/);
      const electionYear = yearMatch ? Number(yearMatch[1]) : null;
      const roundNumber = parseRoundNumber(relativePath);
      const electionId = buildElectionId(electionType, electionYear, roundNumber);

      return {
        label: formatElectionDocumentLabel(relativePath),
        href: `/api/documents?path=${encodeURIComponent(relativePath)}`,
        note: getElectionDocumentNote(relativePath),
        electionType,
        electionYear,
        roundNumber,
        electionId,
        sourcePath: relativePath,
      };
    })
    .sort((left, right) => {
      if ((right.electionYear ?? 0) !== (left.electionYear ?? 0)) {
        return (right.electionYear ?? 0) - (left.electionYear ?? 0);
      }

      if ((left.roundNumber ?? 99) !== (right.roundNumber ?? 99)) {
        return (left.roundNumber ?? 99) - (right.roundNumber ?? 99);
      }

      const priorityDiff = getDocumentPriorityScore(left.sourcePath ?? left.href) - getDocumentPriorityScore(right.sourcePath ?? right.href);
      if (priorityDiff !== 0) return priorityDiff;

      return left.label.localeCompare(right.label, "fr");
    });
});

function getMunicipalElectionNote(label: string) {
  if (/prochain conseil|conseil municipal/i.test(label)) {
    return "Source municipale liée au conseil, utile pour suivre convocations et actes autour des décisions publiques.";
  }

  return "Source municipale détectée depuis les actes municipaux, à relier manuellement aux séquences électorales si besoin.";
}

function inferMunicipalCategory(label: string, relativePath: string) {
  const haystack = `${normalizeAscii(label).toLowerCase()} ${normalizeAscii(relativePath).toLowerCase()}`;

  if (
    haystack.includes("proces verbal") ||
    haystack.includes("compte rendu") ||
    haystack.includes("pv")
  ) {
    return "proces_verbal";
  }

  if (haystack.includes("convocation") || haystack.includes("ordre du jour")) {
    return "convocation";
  }

  if (haystack.includes("deliberation") || haystack.includes("conseil municipal") || haystack.includes("dcm")) {
    return "deliberation";
  }

  return "document";
}

function extractMunicipalSessionDate(value: string) {
  const codeMatch = value.match(/DCM(\d{2})(\d{2})(\d{2})/i);
  if (!codeMatch) return null;

  const [, day, month, year] = codeMatch;
  const fullYear = Number(year) >= 70 ? `19${year}` : `20${year}`;
  return `${fullYear}-${month}-${day}`;
}

const loadMunicipalElectionDocuments = cache(async () => {
  const path = join(process.cwd(), "..", "..", "data", "mairie-documents", "actes-municipaux-links.csv");
  const localRoots = [
    join(process.cwd(), "..", "..", "data", "mairie-documents", "deliberations_conseils_municipaux"),
    join(process.cwd(), "..", "..", "data", "mairie-documents", "liste_des_deliberations"),
  ];

  try {
    const content = await readFile(path, "utf-8");
    const indexedDocuments = parseCsv(content)
      .filter((row) => {
        const haystack = `${row.label ?? ""} ${row.tags ?? ""} ${row.url ?? ""}`.toLowerCase();
        return (
          ["deliberation", "proces_verbal", "convocation"].includes(row.category ?? "") ||
          haystack.includes("conseil") ||
          haystack.includes("municipal")
        );
      })
      .map((row) => ({
        label: row.label ?? "",
        href: row.url ?? "",
        note: getMunicipalElectionNote(row.label ?? ""),
        year: row.year || null,
        sessionDate: extractMunicipalSessionDate(`${row.label ?? ""} ${row.url ?? ""} ${row.path ?? ""}`),
      }))
      .filter((document) => Boolean(document.label) && Boolean(document.href));

    const localDocuments = (
      await Promise.all(
        localRoots.map(async (rootPath) => {
          try {
            const rootName = rootPath.split("/").pop() ?? "mairie-documents";
            return await walkFiles(rootPath, `data/mairie-documents/${rootName}`);
          } catch {
            return [];
          }
        }),
      )
    )
      .flat()
      .filter((relativePath) => relativePath.toLowerCase().endsWith(".pdf"))
      .map((relativePath) => {
        const label = formatElectionDocumentLabel(relativePath);
        const category = inferMunicipalCategory(label, relativePath);
        const yearMatch = relativePath.match(/(20\d{2}|19\d{2})/);

        return {
          label,
          href: `/api/documents?path=${encodeURIComponent(relativePath)}`,
          note: getMunicipalElectionNote(label),
          year: yearMatch?.[1] ?? null,
          category,
          sessionDate: extractMunicipalSessionDate(relativePath),
        };
      })
      .filter((document) => ["deliberation", "proces_verbal", "convocation"].includes(document.category));

    const seen = new Set<string>();

    return [...indexedDocuments, ...localDocuments]
      .filter((document) => {
        const key = `${document.href}::${document.label}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((left, right) => {
        if ((left.year ?? "") !== (right.year ?? "")) {
          return (right.year ?? "").localeCompare(left.year ?? "");
        }

        if ((left.sessionDate ?? "") !== (right.sessionDate ?? "")) {
          return (right.sessionDate ?? "").localeCompare(left.sessionDate ?? "");
        }

        return left.label.localeCompare(right.label, "fr");
      })
      .slice(0, 12)
      .map(({ label, href, note, year }) => ({
        label,
        href,
        note,
        year,
      }));
  } catch {
    return [];
  }
});

function toElectionId(row: CsvRow) {
  return `${row.election_type}-${row.election_year}-t${row.round_number}`;
}

const loadCommuneElectionHistory = cache(async (): Promise<CommuneElectionSnapshot[]> => {
  const path = join(
    process.cwd(),
    "..",
    "..",
    "data",
    "elections",
    "normalized",
    "cabestany-election-results-commune-all.csv",
  );

  const content = await readFile(path, "utf-8");
  const rows = parseCsv(content);
  const grouped = new Map<string, CsvRow[]>();

  for (const row of rows) {
    if (row.commune_code !== "66028") continue;
    const electionId = toElectionId(row);
    grouped.set(electionId, [...(grouped.get(electionId) ?? []), row]);
  }

  return [...grouped.entries()]
    .map(([electionId, electionRows]) => {
      const base = electionRows[0];
      const topRow = [...electionRows].sort((left, right) => {
        const votesDiff = (parseNumber(right.voix) ?? 0) - (parseNumber(left.voix) ?? 0);
        if (votesDiff !== 0) return votesDiff;
        return (left.liste ?? "").localeCompare(right.liste ?? "", "fr");
      })[0];

      return {
        electionId,
        electionType: base.election_type,
        electionYear: Number(base.election_year),
        roundNumber: Number(base.round_number),
        dateScrutin: base.date_scrutin || null,
        inscrits: parseNumber(base.inscrits),
        votants: parseNumber(base.votants),
        exprimes: parseNumber(base.exprimes),
        turnoutPct: parseNumber(base.votants_pct_inscrits),
        topLabel: topRow?.liste || null,
        topCandidate: topRow?.conduite_par || null,
        topNuance: topRow?.nuance || null,
        topVotes: parseNumber(topRow?.voix),
        topShare: parseNumber(topRow?.voix_pct_exprimes),
        sourceLabel: getElectionTypeLabel(base.election_type),
      } satisfies CommuneElectionSnapshot;
    })
    .sort((left, right) => {
      if (left.electionYear !== right.electionYear) return right.electionYear - left.electionYear;
      if (left.dateScrutin !== right.dateScrutin) {
        return (right.dateScrutin ?? "").localeCompare(left.dateScrutin ?? "");
      }
      return right.roundNumber - left.roundNumber;
    });
});

const loadElectionBureauHighlights = cache(async () => {
  const turnoutPath = join(
    process.cwd(),
    "..",
    "..",
    "data",
    "elections",
    "normalized",
    "cabestany-election-turnout-by-bv.csv",
  );
  const municipal2026Path = join(
    process.cwd(),
    "..",
    "..",
    "data",
    "elections",
    "municipales",
    "2026-municipales-cabestany-bv-validated-long.csv",
  );

  const bureauMap = new Map<
    string,
    Map<
      string,
      {
        pollingStationCode: string;
        turnoutPct: number | null;
        topLabel: string | null;
        topShare: number | null;
      }
    >
  >();

  try {
    const turnoutContent = await readFile(turnoutPath, "utf-8");
    const turnoutRows = parseCsv(turnoutContent);

    for (const row of turnoutRows) {
      if (row.commune_code !== "66028") continue;

      const electionId = buildElectionId(
        row.election_type || null,
        parseNumber(row.election_year),
        parseNumber(row.round_number),
      );

      if (!electionId || !row.polling_station_code) continue;

      const electionMap = bureauMap.get(electionId) ?? new Map();
      electionMap.set(row.polling_station_code, {
        pollingStationCode: row.polling_station_code,
        turnoutPct: parseNumber(row.votants_pct_inscrits),
        topLabel: null,
        topShare: null,
      });
      bureauMap.set(electionId, electionMap);
    }
  } catch {
    // noop: local turnout file can be absent
  }

  try {
    const municipalContent = await readFile(municipal2026Path, "utf-8");
    const municipalRows = parseCsv(municipalContent);
    const grouped = new Map<string, CsvRow[]>();

    for (const row of municipalRows) {
      const electionId = buildElectionId(
        row.election_type || null,
        parseNumber(row.election_year),
        parseNumber(row.round_number),
      );
      if (!electionId || !row.polling_station_code) continue;

      const key = `${electionId}::${row.polling_station_code}`;
      grouped.set(key, [...(grouped.get(key) ?? []), row]);
    }

    for (const [key, rows] of grouped.entries()) {
      const [electionId, pollingStationCode] = key.split("::");
      const topRow = [...rows].sort((left, right) => (parseNumber(right.votes) ?? 0) - (parseNumber(left.votes) ?? 0))[0];
      const electionMap = bureauMap.get(electionId) ?? new Map();
      const existing = electionMap.get(pollingStationCode);
      const votants = parseNumber(rows[0]?.votants);
      const inscrits = parseNumber(rows[0]?.inscrits);
      const exprimes = parseNumber(rows[0]?.exprimes);
      const topVotes = parseNumber(topRow?.votes);

      electionMap.set(pollingStationCode, {
        pollingStationCode,
        turnoutPct: existing?.turnoutPct ?? (votants !== null && inscrits !== null ? (votants / inscrits) * 100 : null),
        topLabel: topRow?.candidate_group ?? topRow?.candidate_label ?? null,
        topShare: topVotes !== null && exprimes !== null ? (topVotes / exprimes) * 100 : null,
      });
      bureauMap.set(electionId, electionMap);
    }
  } catch {
    // noop
  }

  const result = new Map<string, CommuneElectionSequence["bureauHighlights"]>();

  for (const [electionId, bureaus] of bureauMap.entries()) {
    const rows = [...bureaus.values()]
      .sort((left, right) => {
        const turnoutDiff = (left.turnoutPct ?? 999) - (right.turnoutPct ?? 999);
        if (turnoutDiff !== 0) return turnoutDiff;
        return left.pollingStationCode.localeCompare(right.pollingStationCode, "fr");
      })
      .slice(0, 3)
      .map((bureau) => ({
        ...bureau,
        note:
          bureau.topLabel && bureau.topShare !== null
            ? `Participation ${formatPercent(bureau.turnoutPct)} · tête ${bureau.topLabel} (${formatPercent(bureau.topShare)}).`
            : `Participation ${formatPercent(bureau.turnoutPct)}.`,
      }));

    result.set(electionId, rows);
  }

  return result;
});

export const getCommuneElectoralAnalysisData = cache(async (): Promise<CommuneElectoralAnalysisData> => {
  const [history, electionDocuments, municipalDocuments, bureauHighlightsByElection] = await Promise.all([
    loadCommuneElectionHistory(),
    loadElectionDocuments(),
    loadMunicipalElectionDocuments(),
    loadElectionBureauHighlights(),
  ]);
  const groupedByType = new Map<string, CommuneElectionSnapshot[]>();

  for (const snapshot of history) {
    groupedByType.set(snapshot.electionType, [...(groupedByType.get(snapshot.electionType) ?? []), snapshot]);
  }

  const latestByType = [...groupedByType.entries()]
    .map(([electionType, snapshots]) => {
      const turnoutValues = snapshots.map((snapshot) => snapshot.turnoutPct).filter((value): value is number => value !== null);
      return {
        electionType,
        label: getElectionTypeLabel(electionType),
        latest: snapshots[0] ?? null,
        electionCount: snapshots.length,
        averageTurnoutPct:
          turnoutValues.length > 0
            ? turnoutValues.reduce((sum, value) => sum + value, 0) / turnoutValues.length
            : null,
      } satisfies CommuneElectionTypeSummary;
    })
    .sort((left, right) => left.label.localeCompare(right.label, "fr"));

  const sequences = history.map((snapshot) => {
    const documents = (electionDocuments ?? [])
      .filter((document) => document.electionId === snapshot.electionId)
      .slice(0, 4)
      .map((document) => ({
        label: document.label,
        href: document.href,
        note: document.note,
      }));

    const linkedMunicipalDocuments = (municipalDocuments ?? [])
      .filter((document) => !document.year || String(snapshot.electionYear) === document.year)
      .slice(0, 3);

    const bureauHighlights = bureauHighlightsByElection.get(snapshot.electionId) ?? [];

    return {
      electionId: snapshot.electionId,
      electionType: snapshot.electionType,
      electionYear: snapshot.electionYear,
      roundNumber: snapshot.roundNumber,
      dateScrutin: snapshot.dateScrutin,
      turnoutPct: snapshot.turnoutPct,
      topLabel: snapshot.topLabel,
      topCandidate: snapshot.topCandidate,
      topShare: snapshot.topShare,
      bureauCoverageCount: bureauHighlights.length,
      bureauHighlights,
      documents,
      municipalDocuments: linkedMunicipalDocuments,
    } satisfies CommuneElectionSequence;
  });

  return {
    latestElection: history[0] ?? null,
    latestByType,
    history,
    electionDocuments,
    municipalDocuments,
    sequences,
  };
});
