import Link from "next/link";
import { Badge, PageHeader, Panel, StatCard } from "@/components/ui";
import type { DashboardData } from "@/lib/postgres";

export function DashboardPage({
  data,
}: {
  data: DashboardData;
}) {
  const badgeTone = (tone?: "default" | "accent" | "pine") =>
    tone === "accent" ? "accent" : tone === "pine" ? "pine" : "neutral";
  const activityLabel = (kind: string) =>
    kind === "field_report"
      ? "Retour terrain"
      : kind === "task"
        ? "Tâche"
        : kind === "citizen"
          ? "Citoyen"
          : "Activité";

  return (
    <div>
      <PageHeader
        eyebrow="Pilotage"
        title="Tableau de bord général"
        description="Vue rapide pour voir les urgences, la couverture, les réunions et l'activité récente."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            tone={stat.tone ?? "default"}
            value={stat.value}
          />
        ))}
      </div>

      <div className="mt-6">
        <Panel
          title="Actions du jour"
          subtitle="Liens directs vers les écrans utiles maintenant."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {data.actionItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group rounded-3xl border border-line/80 bg-sand/70 p-5 transition hover:-translate-y-0.5 hover:border-accent/35 hover:bg-white/80"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-ink">{item.label}</p>
                  <Badge tone={badgeTone(item.tone)}>Ouvrir</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink/68">
                  {item.summary}
                </p>
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Panel
          title="Priorités immédiates"
          subtitle="Ce qui doit remonter en premier."
        >
          <div className="space-y-4">
            {data.priorityHighlights.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-line/80 bg-sand/80 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium">{item.label}</p>
                    <p className="mt-1 text-sm text-ink/65">
                      {item.summary}
                    </p>
                  </div>
                  <Badge tone={badgeTone(item.tone)}>{item.value}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Secteurs à surveiller"
          subtitle="Secteurs les plus exposés."
        >
          <div className="space-y-3">
            {data.sectorAlerts.length > 0 ? (
              data.sectorAlerts.map((item) => (
                <div
                  key={item.sectorLabel}
                  className="rounded-2xl border border-line/80 px-4 py-3"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">{item.sectorLabel}</p>
                      <p className="mt-1 text-sm text-ink/65">
                        Responsable : {item.ownerName ?? "non affecté"}
                      </p>
                    </div>
                    <Badge tone={item.urgentCount > 0 ? "accent" : "neutral"}>
                      Score {item.priorityScore}
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge tone="neutral">{item.reportCount} retours</Badge>
                    <Badge tone={item.urgentCount > 0 ? "warning" : "neutral"}>
                      {item.urgentCount} urgents
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-line/80 px-4 py-5 text-sm text-ink/60">
                Aucun secteur ne remonte comme prioritaire pour l’instant.
              </p>
            )}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Panel
          title="Réunions à venir"
          subtitle="Sept prochains jours."
        >
          <div className="space-y-3">
            {data.upcomingMeetings.length > 0 ? (
              data.upcomingMeetings.map((item) => (
                <article
                  key={`${item.title}-${item.startsAtLabel}`}
                  className="rounded-2xl border border-line/80 bg-sand/70 p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-medium sm:pr-4">{item.title}</h3>
                    <Badge tone="pine">{item.startsAtLabel}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-ink/65">
                    {item.location ? `Lieu : ${item.location}` : "Lieu à préciser"}
                  </p>
                </article>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-line/80 px-4 py-5 text-sm text-ink/60">
                Aucune réunion planifiée sur les sept prochains jours.
              </p>
            )}
          </div>
        </Panel>

        <Panel
          title="Activité récente"
          subtitle="Dernières créations utiles."
        >
          <div className="space-y-3">
            {data.recentActivity.length > 0 ? (
              data.recentActivity.map((item) => (
                <article
                  key={`${item.kind}-${item.title}-${item.happenedAtLabel}`}
                  className="rounded-2xl border border-line/80 px-4 py-3"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <Badge tone="neutral">{activityLabel(item.kind)}</Badge>
                      <p className="font-medium">{item.title}</p>
                      <p className="mt-1 text-sm text-ink/65">{item.summary}</p>
                    </div>
                    <Badge tone="neutral">{item.happenedAtLabel}</Badge>
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-line/80 px-4 py-5 text-sm text-ink/60">
                Aucune activité récente à afficher.
              </p>
            )}
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel
          title="Équipe"
          subtitle="Repères simples sur la couverture active."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {data.teamHighlights.map((item) => (
              <article
                key={item.label}
                className="rounded-3xl border border-line/80 bg-sand/70 p-5"
              >
                <h3 className="text-lg font-semibold">{item.label}</h3>
                <p className="mt-3 break-words text-2xl font-semibold sm:text-3xl">
                  {item.value}
                </p>
                <p className="mt-3 text-sm text-ink/70">{item.summary}</p>
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
