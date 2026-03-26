import { Badge, PageHeader, Panel, StatCard } from "@/components/ui";
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

export function FieldAnalysisPage({
  data,
}: {
  data: FieldAnalysisData;
}) {
  return (
    <div>
      <PageHeader
        eyebrow="Terrain"
        title="Analyse terrain"
        description="Voir rapidement les thèmes, les bureaux qui remontent et les urgences encore ouvertes."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Retours total" value={String(data.summary.totalReports)} />
        <StatCard label="Retours ouverts" value={String(data.summary.openReports)} tone="accent" />
        <StatCard label="Urgences actives" value={String(data.summary.urgentReports)} tone="pine" />
        <StatCard label="Fiches liées" value={String(data.summary.linkedCitizens)} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel
          title="Thèmes qui remontent"
          subtitle="Ce qui se répète déjà."
        >
          <div className="space-y-4">
            {data.topicBreakdown.map((topic) => (
              <div
                key={topic.topic}
                className="flex items-center justify-between rounded-2xl border border-line/70 bg-sand/70 p-4"
              >
                <p className="font-medium text-ink">{topic.topic}</p>
                <Badge tone="accent">{topic.reportCount} retours</Badge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Lecture par niveau de soutien"
          subtitle="Répartition actuelle des remontées."
        >
          <div className="space-y-4">
            {data.supportBreakdown.map((support) => (
              <div
                key={support.supportLevel}
                className="flex items-center justify-between rounded-2xl border border-line/70 bg-white/80 p-4"
              >
                <p className="font-medium text-ink">
                  {supportLevelLabels[support.supportLevel] ?? support.supportLevel}
                </p>
                <Badge tone={support.supportLevel === "supportive" || support.supportLevel === "volunteer" ? "pine" : support.supportLevel === "opposed" ? "warning" : "neutral"}>
                  {support.reportCount} retours
                </Badge>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Panel
          title="Bureaux de vote qui remontent"
          subtitle="Relier les signaux terrain aux secteurs électoraux."
        >
          <div className="space-y-4">
            {data.stationBreakdown.map((station) => (
              <article
                key={`${station.pollingStationCode}-${station.placeName ?? "na"}`}
                className="rounded-3xl border border-line/80 bg-white/80 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">
                      {station.pollingStationCode === "Non rattaché"
                        ? "Non rattaché à un bureau"
                        : `Bureau ${station.pollingStationCode}`}
                    </p>
                    {station.placeName ? (
                      <p className="mt-1 text-sm text-ink/65">{station.placeName}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="accent">{station.reportCount} retours</Badge>
                    {station.urgentCount > 0 ? (
                      <Badge tone="warning">{station.urgentCount} urgents</Badge>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel
          title="Urgences ouvertes"
          subtitle="Retours à traiter ou arbitrer en priorité."
        >
          <div className="space-y-4">
            {data.urgentReports.length === 0 ? (
              <div className="rounded-2xl border border-line/70 bg-sand/70 p-5 text-sm text-ink/65">
                Aucune urgence ouverte pour le moment.
              </div>
            ) : data.urgentReports.map((report) => (
              <article
                key={report.id}
                className="rounded-3xl border border-line/80 bg-sand/70 p-5"
              >
                <div className="flex flex-wrap gap-2">
                  {report.pollingStationCode ? (
                    <Badge tone="neutral">Bureau {report.pollingStationCode}</Badge>
                  ) : null}
                  <Badge tone="accent">
                    {supportLevelLabels[report.supportLevel] ?? report.supportLevel}
                  </Badge>
                  <Badge tone="warning">
                    {statusLabels[report.status] ?? report.status}
                  </Badge>
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  {report.topic ?? "Retour prioritaire"}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink/70">{report.summary}</p>
                <p className="mt-4 text-sm text-ink/55">{report.reportedAtLabel}</p>
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
