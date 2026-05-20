import Link from "next/link";
import { EmptyState, PageHeader, Panel, StatCard, Badge, Button } from "@/components/ui";
import type { FieldAnalysisData } from "@/lib/postgres";

const supportLevelLabels: Record<string, string> = {
  unknown: "Soutien inconnu",
  opposed: "Opposition",
  skeptical: "Réservé",
  neutral: "Neutre",
  supportive: "Favorable",
  volunteer: "Volontaire",
};

const statusLabels: Record<string, string> = {
  new: "Nouveau",
  qualified: "Qualifié",
  in_progress: "En traitement",
  closed: "Clos",
};

function getStationSignalLabel(reportCount: number, urgentCount: number) {
  if (urgentCount > 0) return `${urgentCount} urgence(s) ouverte(s)`;
  return `${reportCount} retours actifs`;
}

function getStationAction(reportCount: number, urgentCount: number) {
  if (urgentCount > 0) return "Ouvrir les retours urgents et préparer une réponse locale.";
  if (reportCount >= 3) return "Comparer les signaux du secteur et vérifier la couverture terrain.";
  return "Surveiller les prochains retours avant arbitrage.";
}

export function FieldAnalysisPage({
  data,
}: {
  data: FieldAnalysisData;
}) {
  const priorityStation = data.stationBreakdown[0] ?? null;
  const secondaryStations = data.stationBreakdown.slice(1, 3);
  const mainTopics = data.topicBreakdown.slice(0, 3);
  const urgentReports = data.urgentReports.slice(0, 5);

  return (
    <div>
      <PageHeader
        eyebrow="Analyse"
        title="Analyse terrain"
        description="Lire les signaux terrain consolidés pour arbitrer rapidement où agir."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Retours ouverts"
          value={String(data.summary.openReports)}
          tone="accent"
          detail="Demandent encore une qualification ou une action."
        />
        <StatCard
          label="Urgences actives"
          value={String(data.summary.urgentReports)}
          tone="default"
          detail="Doivent influencer l'arbitrage du jour."
        />
        <StatCard
          label="Fiches liées"
          value={String(data.summary.linkedCitizens)}
          tone="pine"
          detail="Permettent de relier terrain et CRM."
        />
      </div>

      <div className="mt-6 space-y-6">
        <Panel
          title="Zone à lire maintenant"
          subtitle="La zone qui concentre actuellement le plus de signaux terrain."
        >
          {priorityStation ? (
            <article className="rounded-[1.5rem] border border-line bg-panel p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={priorityStation.urgentCount > 0 ? "warning" : "accent"}>
                      {priorityStation.pollingStationCode === "Non rattaché"
                        ? "Non rattaché"
                        : `Zone ${priorityStation.pollingStationCode}`}
                    </Badge>
                    <Badge tone="neutral">{priorityStation.reportCount} retours</Badge>
                  </div>

                  <h2 className="section-title mt-4 text-[1.35rem] font-semibold text-ink sm:text-[1.55rem]">
                    {priorityStation.placeName ?? "Zone sans lieu renseigné"}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {getStationSignalLabel(priorityStation.reportCount, priorityStation.urgentCount)}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {getStationAction(priorityStation.reportCount, priorityStation.urgentCount)}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <Link
                    href="/field-reports"
                    className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-elevated"
                  >
                    Voir les retours
                  </Link>
                  <Link
                    href="/polling-stations"
                    className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-elevated"
                  >
                    Ouvrir la carte
                  </Link>
                </div>
              </div>

              {secondaryStations.length > 0 ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {secondaryStations.map((station) => (
                    <article key={`${station.pollingStationCode}-${station.placeName ?? "na"}`} className="rounded-2xl border border-line bg-elevated p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-ink">
                            {station.pollingStationCode === "Non rattaché"
                              ? "Non rattaché"
                              : `Zone ${station.pollingStationCode}`}
                          </p>
                          <p className="mt-1 text-sm text-muted">{station.placeName ?? "Lieu non renseigné"}</p>
                        </div>
                        <p className="text-sm text-muted">{station.reportCount} retours</p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}
            </article>
          ) : (
            <EmptyState
              title="Aucune zone à lire"
              description="Les retours terrain ne distinguent encore aucune zone particulière."
            />
          )}
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel
            title="Thèmes à arbitrer"
            subtitle="Les sujets les plus présents dans les retours terrain."
          >
            {mainTopics.length > 0 ? (
              <div className="space-y-3">
                {mainTopics.map((topic) => (
                  <article
                    key={topic.topic}
                    className="flex items-center justify-between rounded-[1.25rem] border border-line bg-elevated p-4"
                  >
                    <p className="text-sm font-medium text-ink">{topic.topic}</p>
                    <p className="text-sm text-muted">{topic.reportCount} retours</p>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Aucun thème dominant"
                description="Les signaux terrain ne montrent pas encore de motif assez net pour arbitrer."
              />
            )}
          </Panel>

          <Panel
            title="Urgences à comparer"
            subtitle="Les remontées qui doivent influencer la décision aujourd'hui."
          >
            {urgentReports.length > 0 ? (
              <div className="space-y-3">
                {urgentReports.map((report) => (
                  <article key={report.id} className="rounded-[1.25rem] border border-line bg-elevated p-4">
                    <div className="flex flex-wrap gap-2">
                      {report.pollingStationCode ? (
                        <Badge tone="warning">Zone {report.pollingStationCode}</Badge>
                      ) : null}
                      <Badge tone="accent">
                        {supportLevelLabels[report.supportLevel] ?? report.supportLevel}
                      </Badge>
                      <Badge tone="neutral">
                        {statusLabels[report.status] ?? report.status}
                      </Badge>
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-ink">
                      {report.topic ?? "Retour prioritaire"}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{report.summary}</p>
                    <p className="mt-2 text-sm text-muted">{report.reportedAtLabel}</p>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Aucune urgence ouverte"
                description="Aucun retour terrain n'exige d'action immédiate."
              />
            )}
          </Panel>
        </div>

        <Panel
          title="Actions utiles"
          subtitle="Sorties rapides vers les écrans qui permettent d'agir."
        >
          <div className="flex flex-wrap gap-2">
            <Link
              href="/field-reports"
              className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-elevated"
            >
              Traiter les retours
            </Link>
            <Link
              href="/polling-stations"
              className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-elevated"
            >
              Voir la carte
            </Link>
            <Link
              href="/team"
              className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-elevated"
            >
              Vérifier la couverture
            </Link>
          </div>
        </Panel>
      </div>
    </div>
  );
}
