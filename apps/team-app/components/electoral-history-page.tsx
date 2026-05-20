"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FilterChip, PageHeader, Panel } from "@/components/ui";
import type { CommuneElectoralAnalysisData } from "@/lib/commune-elections";

type ElectionFilter = "all" | "municipales" | "presidentielles" | "legislatives" | "regionales";

function formatPercent(value: number | null) {
  if (value === null) return "N/A";
  return `${value.toFixed(1)} %`;
}

function formatDate(value: string | null) {
  if (!value) return "Date non renseignée";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(value));
}

function matchesFilter(electionType: string, filter: ElectionFilter) {
  if (filter === "all") return true;
  return electionType === filter;
}

export function ElectoralHistoryPage({ data }: { data: CommuneElectoralAnalysisData }) {
  const [activeFilter, setActiveFilter] = useState<ElectionFilter>("all");
  const [activeYear, setActiveYear] = useState<string>("all");

  const availableYears = useMemo(
    () => Array.from(new Set(data.history.map((snapshot) => String(snapshot.electionYear)))).sort((a, b) => b.localeCompare(a)),
    [data.history],
  );

  const visibleHistory = useMemo(
    () =>
      data.history
        .filter((snapshot) => matchesFilter(snapshot.electionType, activeFilter))
        .filter((snapshot) => activeYear === "all" || String(snapshot.electionYear) === activeYear),
    [data.history, activeFilter, activeYear],
  );
  const visibleElectionDocuments = useMemo(
    () =>
      (data.electionDocuments ?? [])
        .filter((document) => activeFilter === "all" || document.electionType === activeFilter)
        .filter((document) => activeYear === "all" || String(document.electionYear) === activeYear)
        .slice(0, 8),
    [data.electionDocuments, activeFilter, activeYear],
  );
  const visibleMunicipalDocuments = useMemo(
    () => (data.municipalDocuments ?? []).slice(0, 4),
    [data.municipalDocuments],
  );
  const visibleSequences = useMemo(
    () =>
      (data.sequences ?? [])
        .filter((sequence) => matchesFilter(sequence.electionType, activeFilter))
        .filter((sequence) => activeYear === "all" || String(sequence.electionYear) === activeYear),
    [data.sequences, activeFilter, activeYear],
  );

  return (
    <div>
      <PageHeader
        eyebrow="Analyse"
        title="Historique électoral"
        description="Comparer les séquences électorales consolidées de Cabestany pour voir ce qui bouge vraiment dans le temps."
      />

      <Panel
        title="Chronologie des scrutins"
        subtitle="Une chronologie courte pour relire les scrutins utiles sans mélanger synthèse communale et détails secondaires."
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {[
            { key: "all" as const, label: "Tous" },
            { key: "municipales" as const, label: "Municipales" },
            { key: "presidentielles" as const, label: "Présidentielles" },
            { key: "legislatives" as const, label: "Législatives" },
            { key: "regionales" as const, label: "Régionales" },
          ].map((item) => (
            <FilterChip key={item.key} active={activeFilter === item.key} onClick={() => setActiveFilter(item.key)}>
              {item.label}
            </FilterChip>
          ))}
        </div>

        {availableYears.length > 0 ? (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <FilterChip active={activeYear === "all"} onClick={() => setActiveYear("all")}>
              Toutes années
            </FilterChip>
            {availableYears.map((year) => (
              <FilterChip key={year} active={activeYear === year} onClick={() => setActiveYear(year)}>
                {year}
              </FilterChip>
            ))}
          </div>
        ) : null}

        <p className="mb-4 text-sm text-muted">
          {visibleHistory.length} scrutin{visibleHistory.length > 1 ? "s" : ""} visible
          {visibleHistory.length > 1 ? "s" : ""}
          {activeYear !== "all" ? ` en ${activeYear}` : ""}.
        </p>

        <div className="space-y-3">
          {visibleHistory.map((snapshot) => {
            const sequence = visibleSequences.find((item) => item.electionId === snapshot.electionId);

            return (
              <article key={snapshot.electionId} className="rounded-2xl border border-line bg-elevated p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-ink">
                      {snapshot.sourceLabel} {snapshot.electionYear}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {formatDate(snapshot.dateScrutin)} · tour {snapshot.roundNumber} · participation {formatPercent(snapshot.turnoutPct)}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      Tête: {snapshot.topLabel ?? snapshot.topCandidate ?? "N/A"}
                      {snapshot.topShare !== null ? ` · ${formatPercent(snapshot.topShare)}` : ""}
                    </p>
                  </div>
                  {sequence?.bureauHighlights[0] ? (
                    <p className="max-w-xs text-sm text-muted">
                      Bureau à surveiller: {sequence.bureauHighlights[0].pollingStationCode} · {sequence.bureauHighlights[0].note}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        {visibleHistory.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Aucun scrutin ne correspond à ce filtre.</p>
        ) : null}

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-ink">Sources électorales locales</h3>
            {visibleElectionDocuments.length > 0 ? (
              visibleElectionDocuments.map((document) => (
                <article key={document.href} className="rounded-2xl border border-line bg-elevated p-4">
                  <p className="text-sm font-medium text-ink">{document.label}</p>
                  <p className="mt-1 text-sm text-muted">{document.note}</p>
                  <a
                    href={document.href}
                    className="mt-3 inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
                  >
                    Ouvrir la source
                  </a>
                </article>
              ))
            ) : (
              <p className="text-sm text-muted">Aucune source locale ne correspond à ce filtre.</p>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-ink">Actes municipaux liés</h3>
            {visibleMunicipalDocuments.length > 0 ? (
              visibleMunicipalDocuments.map((document) => (
                <article key={document.href} className="rounded-2xl border border-line bg-elevated p-4">
                  <p className="text-sm font-medium text-ink">{document.label}</p>
                  <p className="mt-1 text-sm text-muted">{document.note}</p>
                  <a
                    href={document.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
                  >
                    Ouvrir l'acte
                  </a>
                </article>
              ))
            ) : (
              <p className="text-sm text-muted">Aucun acte municipal lié n'est encore remonté automatiquement.</p>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/elections"
            className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
          >
            Voir la synthèse
          </Link>
          <Link
            href="/polling-stations"
            className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
          >
            Ouvrir la carte
          </Link>
        </div>
      </Panel>
    </div>
  );
}
