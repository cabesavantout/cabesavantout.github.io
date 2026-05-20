"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, FilterChip, PageHeader, Panel, StatCard } from "@/components/ui";
import type { CommuneElectoralAnalysisData } from "@/lib/commune-elections";

type ElectionFilter = "all" | "municipales" | "presidentielles" | "legislatives" | "regionales" | "europeennes";

function formatPercent(value: number | null) {
  if (value === null) return "N/A";
  return `${value.toFixed(1)} %`;
}

function formatDate(value: string | null) {
  if (!value) return "Date non renseignée";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(value));
}

function formatPointDelta(current: number | null, previous: number | null) {
  if (current === null || previous === null) return null;
  const delta = current - previous;
  if (delta === 0) return "stable";
  return `${delta > 0 ? "+" : ""}${delta.toFixed(1)} pts`;
}

export function ElectoralAnalysisPage({ data }: { data: CommuneElectoralAnalysisData }) {
  const availableFilters = useMemo(
    () =>
      [
        { key: "all" as const, label: "Vue actuelle" },
        ...data.latestByType.map((item) => ({
          key: item.electionType as Exclude<ElectionFilter, "all">,
          label: item.label,
        })),
      ] satisfies Array<{ key: ElectionFilter; label: string }>,
    [data.latestByType],
  );

  const [activeFilter, setActiveFilter] = useState<ElectionFilter>(data.latestElection?.electionType as ElectionFilter ?? "all");

  const selectedSummary =
    activeFilter === "all"
      ? null
      : data.latestByType.find((item) => item.electionType === activeFilter) ?? null;

  const primarySnapshot = selectedSummary?.latest ?? data.latestElection;
  const visibleElectionDocuments = useMemo(
    () =>
      (data.electionDocuments ?? [])
        .filter((document) => !primarySnapshot?.electionType || document.electionType === primarySnapshot.electionType)
        .filter((document) => !primarySnapshot?.electionYear || document.electionYear === primarySnapshot.electionYear)
        .slice(0, 6),
    [data.electionDocuments, primarySnapshot],
  );
  const visibleMunicipalDocuments = useMemo(
    () => (data.municipalDocuments ?? []).slice(0, 4),
    [data.municipalDocuments],
  );
  const selectedSequence = useMemo(
    () =>
      (data.sequences ?? []).find((sequence) => sequence.electionId === primarySnapshot?.electionId) ?? null,
    [data.sequences, primarySnapshot?.electionId],
  );
  const comparableHistory =
    activeFilter === "all"
      ? data.history
      : data.history.filter((snapshot) => snapshot.electionType === activeFilter);
  const previousComparable = comparableHistory[1] ?? null;
  const turnoutDelta = formatPointDelta(primarySnapshot?.turnoutPct ?? null, previousComparable?.turnoutPct ?? null);

  return (
    <div>
      <PageHeader
        eyebrow="Analyse"
        title="Élections"
        description="Lire l'évolution du vote à Cabestany à partir des scrutins communaux consolidés depuis 2010."
      />

      <Panel
        title="Lecture communale"
        subtitle="Une seule famille de scrutin à la fois pour comprendre ce qui a bougé sans surcharger la lecture."
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {availableFilters.map((filter) => (
            <FilterChip key={filter.key} active={activeFilter === filter.key} onClick={() => setActiveFilter(filter.key)}>
              {filter.label}
            </FilterChip>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard
            label="Scrutin suivi"
            value={
              primarySnapshot
                ? `${primarySnapshot.sourceLabel} ${primarySnapshot.electionYear}`
                : "Aucun scrutin"
            }
            detail={primarySnapshot ? `Tour ${primarySnapshot.roundNumber} · ${formatDate(primarySnapshot.dateScrutin)}` : "Les données communales sont vides."}
          />
          <StatCard
            label="Participation"
            value={formatPercent(primarySnapshot?.turnoutPct ?? null)}
            tone="accent"
            detail={turnoutDelta ? `Écart vs scrutin comparable précédent: ${turnoutDelta}` : "Pas de comparaison disponible."}
          />
          <StatCard
            label="Tête"
            value={primarySnapshot?.topLabel ?? primarySnapshot?.topCandidate ?? "Non renseignée"}
            tone="pine"
            detail={
              primarySnapshot?.topShare !== null && primarySnapshot?.topShare !== undefined
                ? `${formatPercent(primarySnapshot.topShare)} des exprimés`
                : "Score non renseigné."
            }
          />
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-elevated p-4">
              <p className="text-sm font-medium text-muted">Lecture politique</p>
              <p className="mt-2 text-sm leading-6 text-ink">
                {activeFilter === "all"
                  ? "La page s'ouvre sur le dernier scrutin consolidé, puis laisse choisir une famille d'élection pour éviter de mélanger les séquences."
                  : `La lecture est centrée sur les ${selectedSummary?.label.toLowerCase() ?? "scrutins sélectionnés"}, pour comparer des scrutins vraiment comparables dans le temps.`}
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-elevated p-4">
              <p className="text-sm font-medium text-muted">Scrutin comparable précédent</p>
              <p className="mt-2 text-base font-semibold text-ink">
                {previousComparable
                  ? `${previousComparable.sourceLabel} ${previousComparable.electionYear} · tour ${previousComparable.roundNumber}`
                  : "Aucun scrutin comparable"}
              </p>
              <p className="mt-1 text-sm text-muted">
                {previousComparable ? formatDate(previousComparable.dateScrutin) : "Il faut au moins deux scrutins comparables pour mesurer une évolution."}
              </p>
              {previousComparable ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge tone="accent">{formatPercent(previousComparable.turnoutPct)} participation</Badge>
                  <Badge tone="pine">
                    {previousComparable.topLabel ?? previousComparable.topCandidate ?? "Tête non renseignée"}
                  </Badge>
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            {(selectedSummary ? [selectedSummary] : data.latestByType).map((item) => (
              <article key={item.electionType} className="rounded-2xl border border-line bg-elevated p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">{item.label}</p>
                    <p className="mt-1 text-sm text-muted">
                      {item.latest
                        ? `${item.latest.electionYear} · tour ${item.latest.roundNumber}`
                        : "Aucun scrutin"}
                    </p>
                  </div>
                  <Badge tone="accent">
                    {item.latest ? formatPercent(item.latest.turnoutPct) : "N/A"}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-muted">
                  {item.latest?.topLabel ?? item.latest?.topCandidate ?? "Tête non renseignée"}
                  {item.latest?.topShare !== null && item.latest?.topShare !== undefined
                    ? ` · ${formatPercent(item.latest.topShare)}`
                    : ""}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {item.electionCount} scrutin{item.electionCount > 1 ? "s" : ""} disponibles
                  {item.averageTurnoutPct !== null ? ` · moyenne ${formatPercent(item.averageTurnoutPct)}` : ""}
                </p>
              </article>
            ))}

            <article className="rounded-2xl border border-line bg-elevated p-4">
              <p className="text-sm font-medium text-muted">Prochaine lecture utile</p>
              <p className="mt-2 text-sm leading-6 text-ink">
                Passez dans l'historique électoral pour relire les scrutins un par un, combiner type et année et vérifier rapidement une séquence précise.
              </p>
              <div className="mt-4">
                <Link
                  href="/elections/history"
                  className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
                >
                  Voir l'historique électoral
                </Link>
              </div>
            </article>
          </div>
        </div>
      </Panel>

      <div className="mt-6">
        <Panel
          title="Pièces et bureaux associés"
          subtitle="Le scrutin sélectionné doit rester lisible avec ses bureaux les plus fragiles et les documents qui permettent de le relire."
        >
          <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-ink">Bureaux à relire</h3>
              {selectedSequence?.bureauHighlights.length ? (
                selectedSequence.bureauHighlights.map((bureau) => (
                  <article key={bureau.pollingStationCode} className="rounded-2xl border border-line bg-elevated p-4">
                    <p className="text-sm font-medium text-ink">Bureau {bureau.pollingStationCode}</p>
                    <p className="mt-1 text-sm text-muted">{bureau.note}</p>
                  </article>
                ))
              ) : (
                <p className="text-sm text-muted">Aucun détail bureau n'est encore rattaché automatiquement à ce scrutin.</p>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-ink">Sources électorales locales</h3>
              {selectedSequence?.documents.length ? (
                selectedSequence.documents.map((document) => (
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
              ) : visibleElectionDocuments.length > 0 ? (
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
                <p className="text-sm text-muted">Aucun fichier local correspondant à cette séquence n'est encore visible.</p>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-ink">Actes municipaux liés</h3>
              {(selectedSequence?.municipalDocuments.length ? selectedSequence.municipalDocuments : visibleMunicipalDocuments).length > 0 ? (
                (selectedSequence?.municipalDocuments.length ? selectedSequence.municipalDocuments : visibleMunicipalDocuments).map((document) => (
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
        </Panel>
      </div>

      <div className="mt-6">
        <Panel
          title="Actions liées"
          subtitle="Après la synthèse, ouvre la carte ou les retours terrain pour préparer l'action."
        >
          <div className="flex flex-wrap gap-2">
            <Link
              href="/elections/history"
              className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
            >
              Voir l'historique électoral
            </Link>
            <Link
              href="/polling-stations"
              className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
            >
              Ouvrir la carte
            </Link>
            <Link
              href="/field-reports"
              className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
            >
              Voir les retours terrain
            </Link>
          </div>
        </Panel>
      </div>
    </div>
  );
}
