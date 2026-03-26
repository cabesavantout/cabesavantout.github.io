import { Badge, PageHeader, Panel } from "@/components/ui";
import type { SearchResultsData } from "@/lib/postgres";

const supportLevelLabels: Record<string, string> = {
  unknown: "Soutien inconnu",
  opposed: "Opposition",
  skeptical: "Réservé",
  neutral: "Neutre",
  supportive: "Favorable",
  volunteer: "Volontaire",
};

const fieldReportStatusLabels: Record<string, string> = {
  new: "Nouveau",
  qualified: "Qualifié",
  in_progress: "En traitement",
  closed: "Clos",
};

const taskStatusLabels: Record<string, string> = {
  todo: "À faire",
  in_progress: "En cours",
  blocked: "Bloquée",
  done: "Terminée",
  cancelled: "Annulée",
};

const taskPriorityLabels: Record<string, string> = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
  critical: "Critique",
};

export function SearchPage({
  data,
}: {
  data: SearchResultsData;
}) {
  const totalResults =
    data.citizens.length + data.fieldReports.length + data.tasks.length;

  return (
    <div>
      <PageHeader
        eyebrow="Recherche"
        title="Recherche transversale"
        description="Retrouver rapidement une fiche citoyen, un retour terrain ou une tâche."
      />

      <Panel
        title="Recherche"
        subtitle="Interroger plusieurs modules d’un coup depuis une seule barre de recherche."
      >
        <form className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            className="w-full rounded-2xl border border-line bg-sand px-4 py-3 text-sm outline-none transition focus:border-accent"
            name="q"
            type="search"
            placeholder="Nom, sujet, résumé, téléphone, adresse, tâche..."
            defaultValue={data.query}
          />
          <div className="flex gap-3">
            <button
              className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white transition hover:bg-ink/90"
              type="submit"
            >
              Rechercher
            </button>
            <a
              className="rounded-2xl border border-line bg-white px-4 py-3 text-sm font-medium text-ink transition hover:bg-sand"
              href="/search"
            >
              Réinitialiser
            </a>
          </div>
        </form>
      </Panel>

      <div className="mb-6 mt-6 rounded-2xl border border-line/70 bg-white/80 px-4 py-3 text-sm text-ink/70">
        {data.query
          ? `${totalResults} résultat(s) pour “${data.query}”.`
          : "Lancez une recherche pour interroger plusieurs modules d’un coup."}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Citoyens" subtitle="Fiches correspondantes.">
          <div className="space-y-3">
            {data.citizens.length === 0 ? (
              <p className="text-sm text-ink/60">Aucun résultat.</p>
            ) : data.citizens.map((citizen) => (
              <article key={citizen.id} className="rounded-2xl border border-line/70 bg-sand/70 p-4">
                <p className="font-medium text-ink">{citizen.fullName}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge tone="neutral">
                    {supportLevelLabels[citizen.supportLevel] ?? citizen.supportLevel}
                  </Badge>
                  {citizen.pollingStationCode ? (
                    <Badge tone="accent">Bureau {citizen.pollingStationCode}</Badge>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Retours terrain" subtitle="Retours correspondants.">
          <div className="space-y-3">
            {data.fieldReports.length === 0 ? (
              <p className="text-sm text-ink/60">Aucun résultat.</p>
            ) : data.fieldReports.map((report) => (
              <article key={report.id} className="rounded-2xl border border-line/70 bg-sand/70 p-4">
                <p className="font-medium text-ink">{report.topic ?? "Retour terrain"}</p>
                <p className="mt-2 text-sm leading-6 text-ink/65">{report.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone={report.status === "closed" ? "pine" : report.status === "new" ? "accent" : "warning"}>
                    {fieldReportStatusLabels[report.status] ?? report.status}
                  </Badge>
                  {report.citizenName ? <Badge tone="neutral">{report.citizenName}</Badge> : null}
                  {report.pollingStationCode ? (
                    <Badge tone="accent">Bureau {report.pollingStationCode}</Badge>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Tâches" subtitle="Actions correspondantes.">
          <div className="space-y-3">
            {data.tasks.length === 0 ? (
              <p className="text-sm text-ink/60">Aucun résultat.</p>
            ) : data.tasks.map((task) => (
              <article key={task.id} className="rounded-2xl border border-line/70 bg-sand/70 p-4">
                <p className="font-medium text-ink">{task.title}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone={task.status === "done" ? "pine" : task.status === "in_progress" ? "accent" : "warning"}>
                    {taskStatusLabels[task.status] ?? task.status}
                  </Badge>
                  <Badge tone={task.priority === "critical" || task.priority === "high" ? "warning" : "neutral"}>
                    {taskPriorityLabels[task.priority] ?? task.priority}
                  </Badge>
                  {task.ownerName ? <Badge tone="neutral">{task.ownerName}</Badge> : null}
                </div>
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
