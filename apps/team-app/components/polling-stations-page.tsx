import { Badge, PageHeader, Panel, StatCard } from "@/components/ui";
import type { PollingStationRecord } from "@/lib/postgres";
import { PollingStationsMapShell } from "@/components/polling-stations-map-shell";
import type { GeoJsonFeatureCollection } from "@/lib/geojson";

export function PollingStationsPage({
  stations,
  geoJson,
}: {
  stations: PollingStationRecord[];
  geoJson: GeoJsonFeatureCollection | null;
}) {
  const validatedCount = stations.filter((station) => station.hasValidatedResults).length;
  const centralizer = stations.find((station) => station.isCentralizer);
  const topTurnout = stations
    .filter((station) => station.votants2026 !== null)
    .sort((a, b) => (b.votants2026 ?? 0) - (a.votants2026 ?? 0))[0];

  return (
    <div>
      <PageHeader
        eyebrow="Électoral"
        title="Bureaux de vote"
        description="Lieux, adresses, contours et état des résultats municipaux 2026."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Bureaux total" value={String(stations.length)} />
        <StatCard label="Bureaux validés 2026 T1" value={String(validatedCount)} tone="accent" />
        <StatCard
          label="Bureau centralisateur"
          value={centralizer ? centralizer.pollingStationCode : "N/A"}
          tone="pine"
        />
        <StatCard
          label="Plus forte participation"
          value={topTurnout ? topTurnout.pollingStationCode : "N/A"}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel
          title="Carte des bureaux"
          subtitle="Contours géographiques enrichis avec les adresses et les résultats validés."
        >
          {geoJson ? (
            <PollingStationsMapShell data={geoJson} />
          ) : (
            <div className="rounded-2xl border border-line/70 bg-sand/70 p-5 text-sm text-ink/65">
              GeoJSON non chargé.
            </div>
          )}
        </Panel>
      </div>

      <div className="mt-6">
        <Panel
          title="Bureaux"
          subtitle="Chaque fiche combine le lieu de vote et l'état de la donnée électorale."
        >
          {stations.length === 0 ? (
            <div className="rounded-2xl border border-line/70 bg-sand/70 p-5 text-sm text-ink/65">
              Aucun bureau chargé. Définir `DATABASE_URL` dans l'environnement
              de l'app pour lire les données PostgreSQL locales.
            </div>
          ) : (
            <div className="space-y-4">
              {stations.map((station) => (
                <article
                  key={station.pollingStationCode}
                  className="rounded-3xl border border-line/80 bg-sand/70 p-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="neutral">Bureau {station.pollingStationNumber}</Badge>
                    <Badge tone={station.hasValidatedResults ? "pine" : "warning"}>
                      {station.hasValidatedResults
                        ? "Résultats validés"
                        : "Résultats manquants"}
                    </Badge>
                    {station.isCentralizer ? (
                      <Badge tone="accent">Centralisateur</Badge>
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold">{station.placeName}</h3>
                      <p className="mt-1 text-sm text-ink/70">{station.address}</p>
                      <p className="mt-2 break-words text-sm text-ink/55">
                        Code {station.pollingStationCode} · géométrie{" "}
                        {station.geometryType ?? "N/A"}
                      </p>
                    </div>
                    {station.topCandidateLabel ? (
                      <div className="w-full rounded-2xl border border-line/70 bg-white/80 px-4 py-3 text-sm lg:max-w-[320px]">
                        <p className="font-medium">{station.topCandidateLabel}</p>
                        <p className="mt-1 text-ink/65">
                          {station.topCandidateVotes} voix
                          {station.topCandidateGroup
                            ? ` · ${station.topCandidateGroup}`
                            : ""}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  {station.hasValidatedResults ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-line/70 bg-white/70 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-ink/50">
                          Inscrits
                        </p>
                        <p className="mt-2 text-lg font-semibold">
                          {station.inscrits2026}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-line/70 bg-white/70 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-ink/50">
                          Votants
                        </p>
                        <p className="mt-2 text-lg font-semibold">
                          {station.votants2026}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-line/70 bg-white/70 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-ink/50">
                          Exprimés
                        </p>
                        <p className="mt-2 text-lg font-semibold">
                          {station.exprimes2026}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
