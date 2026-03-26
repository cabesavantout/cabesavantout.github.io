import {
  createFieldReport,
  updateFieldReport,
} from "@/app/(app)/field-reports/actions";
import { createTaskFromFieldReport } from "@/app/(app)/tasks/actions";
import { Badge, PageHeader, Panel } from "@/components/ui";
import type {
  CitizenOption,
  FieldReportListItem,
  PollingStationOption,
} from "@/lib/postgres";

const supportLevelLabels: Record<string, string> = {
  unknown: "Soutien inconnu",
  opposed: "Opposition",
  skeptical: "Réservé",
  neutral: "Neutre",
  supportive: "Favorable",
  volunteer: "Volontaire",
};

const priorityLabels: Record<string, string> = {
  low: "Priorité basse",
  medium: "Priorité moyenne",
  high: "Priorité haute",
  critical: "Priorité critique",
};

const statusLabels: Record<string, string> = {
  new: "Nouveau",
  qualified: "Qualifié",
  in_progress: "En traitement",
  closed: "Clos",
};

export function FieldReportsPage({
  canCreateReports,
  canManageReports,
  canManageTasks,
  citizens,
  pollingStations,
  reports,
  success,
  error,
  filters,
}: {
  canCreateReports: boolean;
  canManageReports: boolean;
  canManageTasks: boolean;
  citizens: CitizenOption[];
  pollingStations: PollingStationOption[];
  reports: FieldReportListItem[];
  success?: string;
  error?: string;
  filters: {
    q: string;
    supportLevel: string;
    status: string;
    pollingStationCode: string;
  };
}) {
  return (
    <div>
      <PageHeader
        eyebrow="Terrain"
        title="Retours habitants"
        description="Saisir, qualifier et traiter les remontées du terrain."
      />

      <Panel
        title="Recherche et filtres"
        subtitle="Filtrer rapidement les retours par texte, soutien, statut ou bureau de vote."
      >
        <form className="grid gap-3 lg:grid-cols-[1.6fr_repeat(3,minmax(0,1fr))_auto]">
          <input
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
            name="q"
            type="search"
            placeholder="Rechercher un sujet, résumé, quartier ou citoyen"
            defaultValue={filters.q}
          />
          <select
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
            name="supportLevel"
            defaultValue={filters.supportLevel}
          >
            <option value="">Tous les soutiens</option>
            {Object.entries(supportLevelLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
            name="status"
            defaultValue={filters.status}
          >
            <option value="">Tous les statuts</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
            name="pollingStationCode"
            defaultValue={filters.pollingStationCode}
          >
            <option value="">Tous les bureaux</option>
            {pollingStations.map((station) => (
              <option key={`filter-${station.code}`} value={station.code}>
                {station.label}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white transition hover:bg-ink/90"
              type="submit"
            >
              Filtrer
            </button>
            <a
              className="rounded-2xl border border-line bg-white px-4 py-3 text-sm font-medium text-ink transition hover:bg-sand"
              href="/field-reports"
            >
              Réinitialiser
            </a>
          </div>
        </form>
      </Panel>

      {success ? (
        <div className="mb-6 mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
        </div>
      ) : null}

      {error ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div>
          {canCreateReports ? (
            <details className="group mt-8 sm:mt-10">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-[30px] border border-accent/20 bg-[linear-gradient(135deg,rgba(168,57,39,0.1),rgba(255,255,255,0.86))] px-5 py-5 shadow-panel transition hover:border-accent/35 sm:px-6">
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-accent">
                    Action
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-ink sm:text-2xl">
                    Ajouter un retour
                  </h3>
                </div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-3xl leading-none text-white shadow-sm transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="mt-4">
                <Panel title="Nouveau retour" subtitle="Saisie simple d'une remontée terrain.">
                  <form action={createFieldReport} className="space-y-4 text-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-medium">Citoyen connu</span>
                  <select
                    className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                    name="citizenId"
                    defaultValue=""
                  >
                    <option value="">Non rattaché</option>
                    {citizens.map((citizen) => (
                      <option key={citizen.id} value={citizen.id}>
                        {citizen.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Quartier</span>
                  <input
                    className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                    name="neighborhood"
                    type="text"
                    placeholder="Ex. Centre"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Bureau de vote</span>
                  <select
                    className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                    name="pollingStationCode"
                    defaultValue=""
                  >
                    <option value="">Non renseigné</option>
                    {pollingStations.map((station) => (
                      <option key={station.code} value={station.code}>
                        {station.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Sujet</span>
                  <input
                    className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                    name="topic"
                    type="text"
                    placeholder="Ex. Stationnement"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Source</span>
                  <select
                    className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                    name="source"
                    defaultValue="terrain"
                  >
                    <option value="terrain">Terrain</option>
                    <option value="telephone">Téléphone</option>
                    <option value="mail">Mail</option>
                    <option value="reunion">Réunion</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Niveau de soutien</span>
                  <select
                    className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                    name="supportLevel"
                    defaultValue="unknown"
                  >
                    <option value="unknown">Soutien inconnu</option>
                    <option value="opposed">Opposition</option>
                    <option value="skeptical">Réservé</option>
                    <option value="neutral">Neutre</option>
                    <option value="supportive">Favorable</option>
                    <option value="volunteer">Volontaire</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Priorité</span>
                  <select
                    className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                    name="priority"
                    defaultValue="medium"
                  >
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                    <option value="critical">Critique</option>
                  </select>
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Tags</span>
                  <input
                    className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                    name="tags"
                    type="text"
                    placeholder="voirie, tranquillité, école"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Sentiment</span>
                  <select
                    className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                    name="sentiment"
                    defaultValue=""
                  >
                    <option value="">Non renseigné</option>
                    <option value="-2">Très négatif</option>
                    <option value="-1">Négatif</option>
                    <option value="0">Neutre</option>
                    <option value="1">Positif</option>
                    <option value="2">Très positif</option>
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Résumé</span>
                <textarea
                  className="min-h-[140px] w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                  name="summary"
                  placeholder="Synthèse du retour habitant"
                  required
                />
              </label>
              <div className="flex justify-end">
                <button
                  className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white transition hover:bg-ink/90"
                  type="submit"
                >
                  Enregistrer
                </button>
              </div>
                  </form>
                </Panel>
              </div>
            </details>
          ) : null}
        </div>

        <Panel
          title="Retours"
          subtitle="Dernières remontées terrain."
        >
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="rounded-2xl border border-line/70 bg-sand/70 p-5 text-sm text-ink/65">
                Aucun retour terrain enregistré pour le moment.
              </div>
            ) : reports.map((report) => (
              <article
                key={report.id}
                className="rounded-3xl border border-line/80 bg-sand/70 p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {report.neighborhood ? <Badge tone="neutral">{report.neighborhood}</Badge> : null}
                  {report.topic ? <Badge tone="accent">{report.topic}</Badge> : null}
                  <Badge tone={canManageReports ? "pine" : "warning"}>
                    {report.source}
                  </Badge>
                  {report.pollingStationCode ? (
                    <Badge tone="neutral">Bureau {report.pollingStationCode}</Badge>
                  ) : null}
                  <Badge tone={report.supportLevel === "supportive" || report.supportLevel === "volunteer" ? "pine" : report.supportLevel === "opposed" ? "warning" : "neutral"}>
                    {supportLevelLabels[report.supportLevel] ?? report.supportLevel}
                  </Badge>
                  <Badge tone={report.priority === "high" || report.priority === "critical" ? "warning" : "neutral"}>
                    {priorityLabels[report.priority] ?? report.priority}
                  </Badge>
                  <Badge tone={report.status === "closed" ? "pine" : report.status === "new" ? "accent" : "neutral"}>
                    {statusLabels[report.status] ?? report.status}
                  </Badge>
                  {report.sentiment !== null ? (
                    <Badge tone={report.sentiment >= 0 ? "pine" : "warning"}>
                      Sentiment {report.sentiment}
                    </Badge>
                  ) : null}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{report.topic ?? "Retour terrain"}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/70">{report.summary}</p>
                {report.citizenName ? (
                  <p className="mt-3 text-sm font-medium text-ink/70">
                    Fiche liée : {report.citizenName}
                  </p>
                ) : null}
                {report.linkedTaskTitle ? (
                  <p className="mt-2 text-sm font-medium text-ink/70">
                    Tâche liée : {report.linkedTaskTitle}
                  </p>
                ) : null}
                {report.tags.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {report.tags.map((tag) => (
                      <Badge key={`${report.id}-${tag}`} tone="neutral">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}
                <p className="mt-4 text-sm text-ink/55">
                  {report.authorName ?? "N/A"} · {report.reportedAtLabel}
                </p>
                {canManageTasks && !report.linkedTaskId ? (
                  <form action={createTaskFromFieldReport} className="mt-4">
                    <input type="hidden" name="reportId" value={report.id} />
                    <button
                      className="rounded-2xl border border-line bg-white px-4 py-3 text-sm font-medium text-ink transition hover:bg-sand"
                      type="submit"
                    >
                      Créer une tâche depuis ce retour
                    </button>
                  </form>
                ) : null}
                {canManageReports ? (
                  <form action={updateFieldReport} className="mt-4 grid gap-3 lg:grid-cols-2">
                    <input type="hidden" name="reportId" value={report.id} />
                    <label className="block">
                      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-ink/55">
                        Citoyen
                      </span>
                      <select
                        className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                        name="citizenId"
                        defaultValue={report.citizenId ?? ""}
                      >
                        <option value="">Non rattaché</option>
                        {citizens.map((citizen) => (
                          <option key={`${report.id}-${citizen.id}`} value={citizen.id}>
                            {citizen.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-ink/55">
                        Source
                      </span>
                      <select
                        className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                        name="source"
                        defaultValue={report.source}
                      >
                        <option value="terrain">Terrain</option>
                        <option value="telephone">Téléphone</option>
                        <option value="mail">Mail</option>
                        <option value="reunion">Réunion</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-ink/55">
                        Bureau de vote
                      </span>
                      <select
                        className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                        name="pollingStationCode"
                        defaultValue={report.pollingStationCode ?? ""}
                      >
                        <option value="">Non renseigné</option>
                        {pollingStations.map((station) => (
                          <option key={`${report.id}-${station.code}`} value={station.code}>
                            {station.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-ink/55">
                        Soutien
                      </span>
                      <select
                        className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                        name="supportLevel"
                        defaultValue={report.supportLevel}
                      >
                        <option value="unknown">Soutien inconnu</option>
                        <option value="opposed">Opposition</option>
                        <option value="skeptical">Réservé</option>
                        <option value="neutral">Neutre</option>
                        <option value="supportive">Favorable</option>
                        <option value="volunteer">Volontaire</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-ink/55">
                        Priorité
                      </span>
                      <select
                        className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                        name="priority"
                        defaultValue={report.priority}
                      >
                        <option value="low">Basse</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Haute</option>
                        <option value="critical">Critique</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-ink/55">
                        Statut
                      </span>
                      <select
                        className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                        name="status"
                        defaultValue={report.status}
                      >
                        <option value="new">Nouveau</option>
                        <option value="qualified">Qualifié</option>
                        <option value="in_progress">En traitement</option>
                        <option value="closed">Clos</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-ink/55">
                        Sentiment
                      </span>
                      <select
                        className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                        name="sentiment"
                        defaultValue={report.sentiment === null ? "" : String(report.sentiment)}
                      >
                        <option value="">Non renseigné</option>
                        <option value="-2">Très négatif</option>
                        <option value="-1">Négatif</option>
                        <option value="0">Neutre</option>
                        <option value="1">Positif</option>
                        <option value="2">Très positif</option>
                      </select>
                    </label>
                    <label className="block lg:col-span-2">
                      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-ink/55">
                        Tags
                      </span>
                      <input
                        className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                        name="tags"
                        type="text"
                        defaultValue={report.tags.join(", ")}
                        placeholder="voirie, écoute, sécurité"
                      />
                    </label>
                    <div className="lg:col-span-2 flex justify-end">
                      <button
                        className="rounded-2xl border border-line bg-white px-4 py-3 text-sm font-medium text-ink transition hover:bg-sand"
                        type="submit"
                      >
                        Mettre à jour
                      </button>
                    </div>
                  </form>
                ) : null}
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
