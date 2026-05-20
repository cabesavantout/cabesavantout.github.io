"use client";

import { useMemo, useState } from "react";
import { EmptyState, FilterChip, PageHeader, Panel, StatCard } from "@/components/ui";
import type { MunicipalDocumentsPageData } from "@/lib/postgres";

type DocumentFilter = "all" | "budget" | "deliberation" | "proces_verbal" | "convocation" | "arrete";

const filterLabels: Record<DocumentFilter, string> = {
  all: "Tous",
  budget: "Budget",
  deliberation: "Délibérations",
  proces_verbal: "PV",
  convocation: "Convocations",
  arrete: "Arrêtés",
};

function getCategoryLabel(category: string) {
  switch (category) {
    case "budget":
      return "Budget";
    case "deliberation":
      return "Délibération";
    case "proces_verbal":
      return "Procès-verbal";
    case "convocation":
      return "Convocation";
    case "arrete":
      return "Arrêté";
    case "marche_public":
      return "Marché public";
    case "urbanisme":
      return "Urbanisme";
    default:
      return "Document";
  }
}

function matchesFilter(category: string, filter: DocumentFilter) {
  if (filter === "all") return true;
  return category === filter;
}

export function DocumentsPage({ data }: { data: MunicipalDocumentsPageData }) {
  const [activeFilter, setActiveFilter] = useState<DocumentFilter>("all");
  const [activeYear, setActiveYear] = useState<string>("all");

  const availableYears = useMemo(
    () =>
      Array.from(new Set(data.documents.map((document) => document.year).filter(Boolean) as string[])).sort((a, b) =>
        b.localeCompare(a),
      ),
    [data.documents],
  );

  const visibleDocuments = useMemo(
    () =>
      data.documents
        .filter((document) => matchesFilter(document.category, activeFilter))
        .filter((document) => activeYear === "all" || document.year === activeYear)
        .slice(0, 24),
    [data.documents, activeFilter, activeYear],
  );
  const priorityDocuments = useMemo(
    () =>
      [...data.documents]
        .sort((left, right) => {
          const leftWeight = left.category === "budget" ? 0 : left.category === "convocation" ? 1 : left.category === "proces_verbal" ? 2 : 3;
          const rightWeight = right.category === "budget" ? 0 : right.category === "convocation" ? 1 : right.category === "proces_verbal" ? 2 : 3;
          if (leftWeight !== rightWeight) return leftWeight - rightWeight;
          if ((left.year ?? "") !== (right.year ?? "")) return (right.year ?? "").localeCompare(left.year ?? "");
          return left.label.localeCompare(right.label, "fr");
        })
        .slice(0, 6),
    [data.documents],
  );

  return (
    <div>
      <PageHeader
        eyebrow="Documents"
        title="Actes municipaux"
        description="Retrouver rapidement la bonne piece municipale avant de replonger dans l'historique complet."
      />

      <section className="grid gap-3 sm:grid-cols-3">
        {data.stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} tone={stat.tone ?? "default"} />
        ))}
      </section>

      <div className="mt-6">
        <Panel
          title="Pieces a rouvrir d'abord"
          subtitle="Les documents qui servent le plus souvent a verifier une decision, une seance ou un arbitrage budgetaire."
        >
          {priorityDocuments.length > 0 ? (
            <div className="mb-6 grid gap-3 lg:grid-cols-2">
              {priorityDocuments.map((document) => (
                <article key={`priority-${document.href}`} className="rounded-[1.25rem] border border-line bg-elevated p-4">
                  <p className="text-sm font-semibold text-ink">{document.label}</p>
                  <p className="mt-1 text-sm text-muted">
                    {getCategoryLabel(document.category)}
                    {document.year ? ` · ${document.year}` : ""}
                    {document.sourceOrigin === "local_archive" ? " · archive locale" : " · site mairie"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">{document.note}</p>
                  <a
                    className="mt-3 inline-flex min-h-[2.5rem] items-center justify-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-sand"
                    href={document.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Ouvrir
                  </a>
                </article>
              ))}
            </div>
          ) : null}

          <div className="border-t border-line pt-5">
            <h3 className="text-sm font-semibold text-ink">Archive filtrable</h3>
            <p className="mt-1 text-sm text-muted">
              Affinez seulement si la piece prioritaire n'est pas la bonne.
            </p>

          <div className="mb-3 flex flex-wrap gap-2">
            {(Object.keys(filterLabels) as DocumentFilter[]).map((filter) => (
              <FilterChip key={filter} active={activeFilter === filter} onClick={() => setActiveFilter(filter)}>
                {filterLabels[filter]}
              </FilterChip>
            ))}
          </div>

          {availableYears.length > 0 ? (
            <div className="mb-4 flex flex-wrap gap-2">
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
            {visibleDocuments.length} document{visibleDocuments.length > 1 ? "s" : ""} visible
            {visibleDocuments.length > 1 ? "s" : ""}
            {activeYear !== "all" ? ` en ${activeYear}` : ""}.
          </p>

            {visibleDocuments.length > 0 ? (
              <div className="space-y-3">
                {visibleDocuments.map((document) => (
                  <article key={document.href} className="rounded-[1.25rem] border border-line bg-elevated p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">{document.label}</p>
                      <p className="mt-1 text-sm text-muted">
                        {getCategoryLabel(document.category)}
                        {document.year ? ` · ${document.year}` : ""}
                        {document.kind === "pdf" ? " · PDF" : ""}
                        {document.sourceOrigin === "local_archive" ? " · archive locale" : " · site mairie"}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted">{document.note}</p>
                    </div>
                    <a
                      className="inline-flex min-h-[2.5rem] shrink-0 items-center justify-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-sand"
                      href={document.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Ouvrir
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Aucun document dans ce filtre"
              description="Changez de type, revenez à toutes les années ou relancez le refresh des actes municipaux."
            />
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
