"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { EmptyState, FilterChip, Notice, PageHeader, Panel } from "@/components/ui";
import { PollingStationsMapShell } from "@/components/polling-stations-map-shell";
import type { GeoJsonFeatureCollection } from "@/lib/geojson";
import type { PollingStationMapRecord } from "@/lib/polling-stations-data";
import type { PollingSectorMapItem } from "@/lib/polling-sectors-data";

type StationFilter = "all" | "urgent" | "active" | "quiet" | "missing";
type RiskLevel = "high" | "medium" | "low" | "insufficient";

type PriorityStation = PollingStationMapRecord & {
  riskLevel: RiskLevel;
  riskLabel: string;
  categoryLabel: string;
  reason: string;
  signalsLabel: string;
};

function enrichStation(station: PollingStationMapRecord): PriorityStation {
  if (station.urgentCount > 0) {
    return {
      ...station,
      riskLevel: "high",
      riskLabel: "Urgent",
      categoryLabel: "À traiter",
      reason: "Le terrain remonte déjà une alerte qualifiée sur cette zone.",
      signalsLabel: `${station.reportCount} signaux · ${station.urgentCount} urgents`,
    };
  }

  if (station.reportCount > 0 || station.opposedOrSkepticalCount > 0) {
    return {
      ...station,
      riskLevel: "medium",
      riskLabel: "Actif",
      categoryLabel: "À suivre",
      reason:
        station.opposedOrSkepticalCount > 0
          ? "Les retours terrain signalent un secteur qui demande encore de la présence."
          : "Des remontées existent déjà sur cette zone et demandent un suivi.",
      signalsLabel: station.reportCount > 0 ? `${station.reportCount} signaux terrain` : "Pas d'alerte terrain majeure",
    };
  }

  if (station.reportCount === 0 && station.urgentCount === 0) {
    return {
      ...station,
      riskLevel: "low",
      riskLabel: "Calme",
      categoryLabel: "Sans signal",
      reason: "Aucune remontée terrain ne distingue actuellement cette zone des autres.",
      signalsLabel: "Aucun signal remonté",
    };
  }

  return {
    ...station,
    riskLevel: "insufficient",
    riskLabel: "À compléter",
    categoryLabel: "Données terrain incomplètes",
    reason: "La zone manque encore de remontées consolidées pour une lecture utile.",
    signalsLabel: "Lecture incomplète",
  };
}

function matchesFilter(station: PriorityStation, filter: StationFilter) {
  switch (filter) {
    case "urgent":
      return station.riskLevel === "high";
    case "active":
      return station.riskLevel === "medium";
    case "quiet":
      return station.riskLevel === "low";
    case "missing":
      return station.riskLevel === "insufficient";
    default:
      return true;
  }
}

function sortStations(stations: PriorityStation[]) {
  const weight: Record<RiskLevel, number> = {
    high: 0,
    medium: 1,
    low: 2,
    insufficient: 3,
  };

  return [...stations].sort((left, right) => {
    const riskDiff = weight[left.riskLevel] - weight[right.riskLevel];
    if (riskDiff !== 0) return riskDiff;

    const signalDiff =
      right.urgentCount + right.opposedOrSkepticalCount + right.reportCount -
      (left.urgentCount + left.opposedOrSkepticalCount + left.reportCount);
    if (signalDiff !== 0) return signalDiff;

    return left.pollingStationNumber - right.pollingStationNumber;
  });
}

function getLegendItems() {
  return [
    { color: "#b42318", label: "Urgent" },
    { color: "#f79009", label: "Actif" },
    { color: "#12715b", label: "Calme" },
    { color: "#98a2b3", label: "À compléter" },
  ];
}

function getSectorStatus(sector: PollingSectorMapItem) {
  if (!sector.primaryOwnerId) return "À affecter";
  if (sector.urgentReportCount > 0) return "Urgent";
  if (sector.streetCount === 0) return "Rues à compléter";
  return "Couvert";
}

function getSectorStatusTone(sector: PollingSectorMapItem) {
  if (!sector.primaryOwnerId) return "text-warning";
  if (sector.urgentReportCount > 0) return "text-danger";
  if (sector.streetCount === 0) return "text-info";
  return "text-pine";
}

function getSectorAction(sector: PollingSectorMapItem) {
  if (!sector.primaryOwnerId) {
    return "Affecter un responsable avant la prochaine séquence terrain.";
  }

  if (sector.streetCount === 0) {
    return "Compléter les rues du secteur pour préparer un tractage propre.";
  }

  if (sector.urgentReportCount > 0) {
    return "Croiser les rues avec les retours urgents avant le prochain passage.";
  }

  return "Le secteur est exploitable pour organiser une tournée de tractage.";
}

function sortSectors(sectors: PollingSectorMapItem[]) {
  return [...sectors].sort((left, right) => {
    const leftWeight = !left.primaryOwnerId ? 0 : left.urgentReportCount > 0 ? 1 : left.streetCount === 0 ? 2 : 3;
    const rightWeight = !right.primaryOwnerId ? 0 : right.urgentReportCount > 0 ? 1 : right.streetCount === 0 ? 2 : 3;

    if (leftWeight !== rightWeight) {
      return leftWeight - rightWeight;
    }

    if (left.priorityRank !== right.priorityRank) {
      return left.priorityRank - right.priorityRank;
    }

    return left.label.localeCompare(right.label, "fr");
  });
}

export function PollingStationsPage({
  stations,
  sectors,
  geoJson,
  mapError,
}: {
  stations: PollingStationMapRecord[];
  sectors: PollingSectorMapItem[];
  geoJson: GeoJsonFeatureCollection | null;
  mapError?: string | null;
}) {
  const [activeFilter, setActiveFilter] = useState<StationFilter>("all");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const mapPanelRef = useRef<HTMLDivElement | null>(null);

  const enrichedStations = useMemo(() => sortStations(stations.map(enrichStation)), [stations]);
  const sortedSectors = useMemo(() => sortSectors(sectors), [sectors]);
  const visibleStations = useMemo(
    () => enrichedStations.filter((station) => matchesFilter(station, activeFilter)),
    [enrichedStations, activeFilter],
  );
  const priorityStations = visibleStations.slice(0, 5);
  const urgentCount = enrichedStations.filter((station) => station.urgentCount > 0).length;
  const activeCount = enrichedStations.filter((station) => station.reportCount > 0).length;

  return (
    <div>
      <PageHeader
        eyebrow="Territoire"
        title="Carte"
        description="Lire le territoire, repérer les zones sensibles et organiser l'action."
      />

      {mapError ? <Notice tone="error">{mapError}</Notice> : null}

      <div className="mt-6">
        <Panel
          title="Carte"
          subtitle={
            urgentCount > 0
              ? `${urgentCount} zone${urgentCount > 1 ? "s demandent" : " demande"} une attention immédiate.`
              : activeCount > 0
                ? `${activeCount} zone${activeCount > 1 ? "s ont" : " a"} des remontées terrain à suivre.`
                : "Aucune zone ne se distingue actuellement dans les remontées terrain."
          }
        >
          <div ref={mapPanelRef}>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {[
                { key: "all" as const, label: "Tous" },
                { key: "urgent" as const, label: "Urgentes" },
                { key: "active" as const, label: "Actives" },
                { key: "quiet" as const, label: "Calmes" },
                { key: "missing" as const, label: "À compléter" },
              ].map((item) => (
                <FilterChip
                  key={item.key}
                  onClick={() => setActiveFilter(item.key)}
                  active={activeFilter === item.key}
                >
                  {item.label}
                </FilterChip>
              ))}
            </div>

            <div className="mb-4 flex flex-wrap gap-4 rounded-2xl border border-line bg-elevated px-4 py-3">
              {getLegendItems().map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-muted">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {geoJson && visibleStations.length > 0 ? (
              <PollingStationsMapShell
                data={geoJson}
                selectedCode={selectedCode}
                stations={visibleStations}
              />
            ) : geoJson && stations.length > 0 ? (
              <EmptyState
                title="Aucune zone visible avec ce filtre"
                description="Élargissez le filtre pour afficher des zones sur la carte."
              />
            ) : (
              <EmptyState
                title="Carte indisponible"
                description="Les contours des bureaux ne sont pas encore disponibles pour une lecture géographique."
              />
            )}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Panel
          title="Zones prioritaires"
          subtitle="Une liste courte fondée sur les remontées terrain disponibles."
        >
          {priorityStations.length > 0 ? (
            <div className="space-y-3">
              {priorityStations.map((station) => (
                <article key={station.pollingStationCode} className="rounded-[1.25rem] border border-line bg-elevated p-4">
                  <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto] lg:items-center">
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-ink">
                        Zone {station.pollingStationNumber} · {station.placeName}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {station.riskLabel} · {station.categoryLabel}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm text-ink">{station.reason}</p>
                      <p className="mt-1 text-sm text-muted">{station.signalsLabel}</p>
                    </div>

                    <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCode(station.pollingStationCode);
                          mapPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
                      >
                        Voir sur la carte
                      </button>
                      <Link
                        href="/field-reports"
                        className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
                      >
                        Voir les retours
                      </Link>
                      <Link
                        href="/team"
                        className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
                      >
                        Voir l'équipe
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Aucune zone à afficher"
              description="Aucune zone ne correspond à ce filtre pour le moment."
            />
          )}
        </Panel>

        <Panel
          title="Actions secondaires"
          subtitle="Secteurs et équipe servent ici de support d'exécution, pas de lecture principale."
        >
          {sortedSectors.length > 0 ? (
            <div className="space-y-3">
              {sortedSectors.slice(0, 3).map((sector) => (
                <article key={sector.id} className="rounded-[1.25rem] border border-line bg-elevated p-4">
                  <p className="text-sm font-semibold text-ink">{sector.label}</p>
                  <p className={`mt-1 text-sm ${getSectorStatusTone(sector)}`}>
                    {getSectorStatus(sector)}
                    {sector.pollingStationCode ? ` · Bureau ${sector.pollingStationCode}` : ""}
                  </p>
                  <p className="mt-2 text-sm text-muted">{getSectorAction(sector)}</p>
                  <p className="mt-1 text-sm text-muted">
                    {sector.primaryOwnerName ?? "Aucun responsable principal"}
                    {sector.streetCount > 0 ? ` · ${sector.streetCount} rue${sector.streetCount > 1 ? "s" : ""} connue${sector.streetCount > 1 ? "s" : ""}` : ""}
                  </p>
                </article>
              ))}

              <div className="flex flex-wrap gap-2 pt-2">
                <Link
                  href="/field-reports"
                  className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
                >
                  Voir les retours
                </Link>
                <Link
                  href="/team"
                  className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
                >
                  Voir l'équipe
                </Link>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Aucun secteur exploitable"
              description="Ajoutez ou synchronisez les secteurs de couverture pour organiser le tractage par zone."
            />
          )}
        </Panel>
      </div>
    </div>
  );
}
