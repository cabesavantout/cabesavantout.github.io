import {
  createCitizen,
  updateCitizen,
} from "@/app/(app)/citizens/actions";
import { Badge, PageHeader, Panel } from "@/components/ui";
import type { CitizenListItem, PollingStationOption } from "@/lib/postgres";

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

export function CitizensPage({
  canManageCitizens,
  citizens,
  error,
  filters,
  pollingStations,
  success,
}: {
  canManageCitizens: boolean;
  citizens: CitizenListItem[];
  error?: string;
  filters: {
    q: string;
    supportLevel: string;
    pollingStationCode: string;
  };
  pollingStations: PollingStationOption[];
  success?: string;
}) {
  return (
    <div>
      <PageHeader
        eyebrow="CRM"
        title="Citoyens"
        description="Fiches habitants et soutiens reliées au terrain et aux bureaux de vote."
      />

      <Panel
        title="Recherche et filtres"
        subtitle="Filtrer rapidement les fiches par nom, soutien ou bureau de vote."
      >
        <form className="grid gap-3 lg:grid-cols-[1.5fr_repeat(2,minmax(0,1fr))_auto]">
          <input
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
            name="q"
            type="search"
            placeholder="Rechercher un nom, mail, téléphone ou quartier"
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
              href="/citizens"
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

      {canManageCitizens ? (
        <details className="mb-6 mt-8 group sm:mt-10">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-[30px] border border-accent/20 bg-[linear-gradient(135deg,rgba(168,57,39,0.1),rgba(255,255,255,0.86))] px-5 py-5 shadow-panel transition hover:border-accent/35 sm:px-6">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-accent">
                Action
              </p>
              <h3 className="mt-2 text-xl font-semibold text-ink sm:text-2xl">
                Ajouter une fiche
              </h3>
            </div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-3xl leading-none text-white shadow-sm transition group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="mt-4">
            <Panel title="Nouvelle fiche" subtitle="Créer un habitant ou un soutien à suivre.">
              <form action={createCitizen} className="space-y-4 text-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Nom complet</span>
                  <input
                    className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                    name="fullName"
                    type="text"
                    placeholder="Ex. Jeanne Martin"
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Téléphone</span>
                  <input
                    className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                    name="phone"
                    type="text"
                    placeholder="06 00 00 00 00"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Email</span>
                  <input
                    className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                    name="email"
                    type="email"
                    placeholder="habitants@example.com"
                  />
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
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Adresse</span>
                <input
                  className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                  name="address"
                  type="text"
                  placeholder="Adresse ou repère utile"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Niveau de soutien</span>
                  <select
                    className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                    name="supportLevel"
                    defaultValue="unknown"
                  >
                    {Object.entries(supportLevelLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Tags</span>
                  <input
                    className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                    name="tags"
                    type="text"
                    placeholder="parents, commerce, sécurité"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Notes</span>
                <textarea
                  className="min-h-[120px] w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                  name="notes"
                  placeholder="Contexte, attentes, points de vigilance"
                />
              </label>

              <div className="flex justify-end">
                <button
                  className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white transition hover:bg-ink/90"
                  type="submit"
                >
                  Enregistrer la fiche
                </button>
              </div>
              </form>
            </Panel>
          </div>
        </details>
      ) : null}

      <Panel
        title="Fiches"
        subtitle="Habitants et soutiens suivis par l'équipe."
      >
        <div className="space-y-4">
          {citizens.length === 0 ? (
            <div className="rounded-2xl border border-line/70 bg-sand/70 p-5 text-sm text-ink/65">
              Aucune fiche citoyen enregistrée pour le moment.
            </div>
          ) : citizens.map((citizen) => (
              <article
                key={citizen.id}
                className="rounded-3xl border border-line/80 bg-sand/70 p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={citizen.supportLevel === "supportive" || citizen.supportLevel === "volunteer" ? "pine" : citizen.supportLevel === "opposed" ? "warning" : "neutral"}>
                    {supportLevelLabels[citizen.supportLevel] ?? citizen.supportLevel}
                  </Badge>
                  {citizen.neighborhood ? <Badge tone="neutral">{citizen.neighborhood}</Badge> : null}
                  {citizen.pollingStationCode ? (
                    <Badge tone="accent">Bureau {citizen.pollingStationCode}</Badge>
                  ) : null}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{citizen.fullName}</h3>
                <div className="mt-3 space-y-1 text-sm text-ink/70">
                  {citizen.phone ? <p>Téléphone : {citizen.phone}</p> : null}
                  {citizen.email ? <p>Email : {citizen.email}</p> : null}
                  {citizen.address ? <p>Adresse : {citizen.address}</p> : null}
                </div>
                {citizen.notes ? (
                  <p className="mt-3 text-sm leading-6 text-ink/70">{citizen.notes}</p>
                ) : null}
                {citizen.tags.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {citizen.tags.map((tag) => (
                      <Badge key={`${citizen.id}-${tag}`} tone="neutral">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}
                <p className="mt-4 text-sm text-ink/55">
                  {citizen.createdByName ?? "N/A"} · Mise à jour {citizen.updatedAtLabel}
                </p>

                <div className="mt-5 grid gap-4 xl:grid-cols-2">
                  <div className="rounded-2xl border border-line/70 bg-white/70 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink/55">
                      Derniers retours
                    </p>
                    <div className="mt-3 space-y-3">
                      {citizen.recentReports.length === 0 ? (
                        <p className="text-sm text-ink/60">Aucun retour lié pour le moment.</p>
                      ) : citizen.recentReports.map((report) => (
                        <div key={report.id} className="rounded-2xl border border-line/60 bg-sand/70 p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge tone={report.status === "closed" ? "pine" : report.status === "new" ? "accent" : "warning"}>
                              {fieldReportStatusLabels[report.status] ?? report.status}
                            </Badge>
                          </div>
                          <p className="mt-2 font-medium text-ink">
                            {report.topic ?? "Retour terrain"}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-ink/65">
                            {report.summary}
                          </p>
                          <p className="mt-2 text-xs text-ink/50">{report.reportedAtLabel}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-line/70 bg-white/70 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink/55">
                      Tâches liées
                    </p>
                    <div className="mt-3 space-y-3">
                      {citizen.relatedTasks.length === 0 ? (
                        <p className="text-sm text-ink/60">Aucune tâche liée pour le moment.</p>
                      ) : citizen.relatedTasks.map((task) => (
                        <div key={task.id} className="rounded-2xl border border-line/60 bg-sand/70 p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge tone={task.status === "done" ? "pine" : task.status === "in_progress" ? "accent" : "warning"}>
                              {taskStatusLabels[task.status] ?? task.status}
                            </Badge>
                          </div>
                          <p className="mt-2 font-medium text-ink">{task.title}</p>
                          <p className="mt-2 text-xs text-ink/50">
                            {task.dueAtLabel ? `Échéance ${task.dueAtLabel}` : "Sans échéance"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {canManageCitizens ? (
                  <form action={updateCitizen} className="mt-4 grid gap-3 lg:grid-cols-2">
                    <input type="hidden" name="citizenId" value={citizen.id} />
                    <label className="block">
                      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-ink/55">
                        Nom complet
                      </span>
                      <input
                        className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                        name="fullName"
                        type="text"
                        defaultValue={citizen.fullName}
                        required
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-ink/55">
                        Téléphone
                      </span>
                      <input
                        className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                        name="phone"
                        type="text"
                        defaultValue={citizen.phone ?? ""}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-ink/55">
                        Email
                      </span>
                      <input
                        className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                        name="email"
                        type="email"
                        defaultValue={citizen.email ?? ""}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-ink/55">
                        Quartier
                      </span>
                      <input
                        className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                        name="neighborhood"
                        type="text"
                        defaultValue={citizen.neighborhood ?? ""}
                      />
                    </label>
                    <label className="block lg:col-span-2">
                      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-ink/55">
                        Adresse
                      </span>
                      <input
                        className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                        name="address"
                        type="text"
                        defaultValue={citizen.address ?? ""}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-ink/55">
                        Bureau de vote
                      </span>
                      <select
                        className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                        name="pollingStationCode"
                        defaultValue={citizen.pollingStationCode ?? ""}
                      >
                        <option value="">Non renseigné</option>
                        {pollingStations.map((station) => (
                          <option key={`${citizen.id}-${station.code}`} value={station.code}>
                            {station.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-ink/55">
                        Niveau de soutien
                      </span>
                      <select
                        className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                        name="supportLevel"
                        defaultValue={citizen.supportLevel}
                      >
                        {Object.entries(supportLevelLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
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
                        defaultValue={citizen.tags.join(", ")}
                      />
                    </label>
                    <label className="block lg:col-span-2">
                      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-ink/55">
                        Notes
                      </span>
                      <textarea
                        className="min-h-[100px] w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                        name="notes"
                        defaultValue={citizen.notes ?? ""}
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
  );
}
