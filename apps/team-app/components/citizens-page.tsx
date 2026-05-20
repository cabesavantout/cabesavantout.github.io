"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createCitizen, updateCitizen } from "@/app/(app)/citizens/actions";
import { Badge, Button, EmptyState, Notice, PageHeader, Panel } from "@/components/ui";
import type { CitizenListItem, PollingStationOption } from "@/lib/postgres";

const supportLevelLabels: Record<string, string> = {
  unknown: "Soutien inconnu",
  opposed: "Opposé",
  skeptical: "Réservé",
  neutral: "Neutre",
  supportive: "Favorable",
  volunteer: "Volontaire",
};

const reportStatusLabels: Record<string, string> = {
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

type CitizenFilter = "all" | "supportive" | "skeptical" | "opposed" | "volunteer" | "follow_up";

function getSupportTone(level: string) {
  if (level === "supportive" || level === "volunteer") return "pine" as const;
  if (level === "skeptical") return "warning" as const;
  if (level === "opposed") return "danger" as const;
  return "neutral" as const;
}

function getNextAction(citizen: CitizenListItem) {
  if (citizen.relatedTasks.some((task) => task.status !== "done" && task.status !== "cancelled")) {
    return "Suivre la tâche ouverte";
  }

  if (citizen.supportLevel === "volunteer") return "À mobiliser";
  if (citizen.supportLevel === "supportive") return "À activer";
  if (citizen.supportLevel === "skeptical") return "À relancer";
  if (citizen.supportLevel === "opposed") return "Suivi recommandé";
  return "À qualifier";
}

function getLastSignal(citizen: CitizenListItem) {
  const report = citizen.recentReports[0];
  if (!report) return "Aucun signal récent";
  return `${report.topic ?? "Retour terrain"} · ${report.reportedAtLabel}`;
}

function hasOpenTask(citizen: CitizenListItem) {
  return citizen.relatedTasks.some((task) => task.status !== "done" && task.status !== "cancelled");
}

function matchesFilter(citizen: CitizenListItem, filter: CitizenFilter) {
  switch (filter) {
    case "supportive":
      return citizen.supportLevel === "supportive";
    case "skeptical":
      return citizen.supportLevel === "skeptical";
    case "opposed":
      return citizen.supportLevel === "opposed";
    case "volunteer":
      return citizen.supportLevel === "volunteer";
    case "follow_up":
      return hasOpenTask(citizen) || citizen.supportLevel === "skeptical";
    default:
      return true;
  }
}

function getCitizenRank(citizen: CitizenListItem) {
  if (hasOpenTask(citizen)) return 1;
  if (citizen.supportLevel === "skeptical") return 2;
  if (citizen.supportLevel === "volunteer") return 3;
  if (citizen.recentReports.length > 0) return 4;
  return 5;
}

function CitizenRow({
  citizen,
  canManageCitizens,
  onOpen,
}: {
  citizen: CitizenListItem;
  canManageCitizens: boolean;
  onOpen: (citizen: CitizenListItem) => void;
}) {
  const openTask = hasOpenTask(citizen);
  const lastReport = citizen.recentReports[0];

  return (
    <article className="rounded-[1.25rem] border border-line bg-elevated p-4">
      <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)_auto] xl:items-center">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink sm:text-base">{citizen.fullName}</p>
          <p className="mt-1 text-sm leading-6 text-muted">
            {citizen.neighborhood ?? "Quartier non renseigné"}
            {citizen.pollingStationCode ? ` · Bureau ${citizen.pollingStationCode}` : ""}
          </p>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <Badge tone={getSupportTone(citizen.supportLevel)}>
              {supportLevelLabels[citizen.supportLevel] ?? citizen.supportLevel}
            </Badge>
            {openTask ? <Badge tone="warning">Tâche ouverte</Badge> : null}
            <Badge tone="accent">{getNextAction(citizen)}</Badge>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-sm leading-6 text-muted">{getLastSignal(citizen)}</p>
          {citizen.tags.length > 0 ? (
            <p className="mt-1 text-sm text-muted">{citizen.tags.slice(0, 2).map((tag) => `#${tag}`).join(" ")}</p>
          ) : null}
          {lastReport ? (
            <p className="mt-1 text-sm text-muted">
              {reportStatusLabels[lastReport.status] ?? lastReport.status}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap justify-start gap-2 xl:justify-end">
          <Button type="button" variant="secondary" onClick={() => onOpen(citizen)}>
            Ouvrir
          </Button>
          <Link
            href="/tasks"
            className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
          >
            Créer tâche
          </Link>
          <Link
            href="/field-reports"
            className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
          >
            Voir retours
          </Link>
        </div>
      </div>
    </article>
  );
}

function CitizenDrawer({
  citizen,
  canManageCitizens,
  pollingStations,
  onClose,
}: {
  citizen: CitizenListItem;
  canManageCitizens: boolean;
  pollingStations: PollingStationOption[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Fermer le détail"
        className="absolute inset-0 bg-ink/30"
        onClick={onClose}
      />

      <aside className="absolute inset-y-0 right-0 w-full max-w-3xl overflow-y-auto border-l border-line bg-base shadow-panel">
        <div className="sticky top-0 z-10 border-b border-line bg-base/95 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <Badge tone={getSupportTone(citizen.supportLevel)}>
                  {supportLevelLabels[citizen.supportLevel] ?? citizen.supportLevel}
                </Badge>
                {hasOpenTask(citizen) ? <Badge tone="warning">Tâche ouverte</Badge> : null}
              </div>
              <h2 className="section-title mt-3 text-[1.35rem] font-semibold text-ink">{citizen.fullName}</h2>
              <p className="mt-1 text-sm leading-6 text-muted">
                {citizen.neighborhood ?? "Quartier non renseigné"}
                {citizen.pollingStationCode ? ` · Bureau ${citizen.pollingStationCode}` : ""}
              </p>
            </div>
            <Button type="button" variant="secondary" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>

        <div className="space-y-6 px-4 py-5 sm:px-6">
          <Panel title="Fiche" subtitle="Informations utiles pour décider du prochain contact.">
            <div className="space-y-3 text-sm leading-6 text-muted">
              <p>{citizen.notes || "Aucune note de contexte."}</p>
              <div className="flex flex-wrap gap-3">
                {citizen.phone ? <span>{citizen.phone}</span> : null}
                {citizen.email ? <span>{citizen.email}</span> : null}
                {citizen.address ? <span>{citizen.address}</span> : null}
              </div>
              <p>
                <span className="font-medium text-ink">Prochaine action</span>
                {` · ${getNextAction(citizen)}`}
              </p>
            </div>
          </Panel>

          <Panel title="Retours terrain" subtitle="Derniers signaux relationnels connus.">
            {citizen.recentReports.length > 0 ? (
              <div className="space-y-3">
                {citizen.recentReports.map((report) => (
                  <article key={report.id} className="rounded-2xl border border-line bg-elevated p-4">
                    <p className="text-sm font-medium text-ink">{report.topic ?? "Retour terrain"}</p>
                    <p className="mt-1 text-sm text-muted">
                      {reportStatusLabels[report.status] ?? report.status} · {report.reportedAtLabel}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">{report.summary}</p>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState title="Aucun retour lié" description="Aucun signal terrain n'est encore rattaché à cette fiche." />
            )}
          </Panel>

          <Panel title="Tâches" subtitle="Suivi opérationnel lié au citoyen.">
            {citizen.relatedTasks.length > 0 ? (
              <div className="space-y-3">
                {citizen.relatedTasks.map((task) => (
                  <article key={task.id} className="rounded-2xl border border-line bg-elevated p-4">
                    <p className="text-sm font-medium text-ink">{task.title}</p>
                    <p className="mt-1 text-sm text-muted">
                      {taskStatusLabels[task.status] ?? task.status}
                      {task.dueAtLabel ? ` · ${task.dueAtLabel}` : ""}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState title="Aucune tâche liée" description="Aucune action n'est encore ouverte pour ce citoyen." />
            )}
          </Panel>

          {canManageCitizens ? (
            <Panel title="Éditer" subtitle="Mise à jour complète de la fiche hors de la liste principale.">
              <form action={updateCitizen} className="grid gap-4">
                <input type="hidden" name="citizenId" value={citizen.id} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Nom complet</span>
                    <input
                      className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                      name="fullName"
                      type="text"
                      defaultValue={citizen.fullName}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Téléphone</span>
                    <input
                      className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                      name="phone"
                      type="text"
                      defaultValue={citizen.phone ?? ""}
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Email</span>
                    <input
                      className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                      name="email"
                      type="email"
                      defaultValue={citizen.email ?? ""}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Niveau de soutien</span>
                    <select
                      className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
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
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Quartier</span>
                    <input
                      className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                      name="neighborhood"
                      type="text"
                      defaultValue={citizen.neighborhood ?? ""}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Bureau</span>
                    <select
                      className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                      name="pollingStationCode"
                      defaultValue={citizen.pollingStationCode ?? ""}
                    >
                      <option value="">Non rattaché</option>
                      {pollingStations.map((station) => (
                        <option key={station.code} value={station.code}>
                          {station.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink">Adresse</span>
                  <input
                    className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                    name="address"
                    type="text"
                    defaultValue={citizen.address ?? ""}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink">Tags</span>
                  <input
                    className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                    name="tags"
                    type="text"
                    defaultValue={citizen.tags.join(", ")}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink">Notes</span>
                  <textarea
                    className="min-h-[7rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                    name="notes"
                    defaultValue={citizen.notes ?? ""}
                  />
                </label>
                <div className="flex justify-end">
                  <Button type="submit">Mettre à jour</Button>
                </div>
              </form>
            </Panel>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

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
  const [activeFilter, setActiveFilter] = useState<CitizenFilter>("all");
  const [selectedCitizenId, setSelectedCitizenId] = useState<string | null>(null);

  const sortedCitizens = useMemo(
    () =>
      [...citizens].sort((left, right) => {
        const rankDiff = getCitizenRank(left) - getCitizenRank(right);
        if (rankDiff !== 0) return rankDiff;
        return left.fullName.localeCompare(right.fullName, "fr");
      }),
    [citizens],
  );
  const visibleCitizens = useMemo(
    () => sortedCitizens.filter((citizen) => matchesFilter(citizen, activeFilter)),
    [sortedCitizens, activeFilter],
  );
  const selectedCitizen = citizens.find((citizen) => citizen.id === selectedCitizenId) ?? null;

  return (
    <div>
      <PageHeader
        eyebrow="Relations"
        title="Citoyens"
        description="Les fiches à suivre et les prochaines relances utiles."
      />

      {success ? <Notice>{success}</Notice> : null}
      {error ? <Notice tone="error">{error}</Notice> : null}

      <Panel
        title="Liste des citoyens"
        subtitle="Une vue CRM compacte pour savoir qui relancer, mobiliser ou surveiller."
        actions={
          canManageCitizens ? (
            <details className="group">
              <summary className="inline-flex min-h-[2.5rem] cursor-pointer list-none items-center rounded-2xl bg-ink px-4 text-sm font-medium text-white transition hover:bg-ink/92">
                Ajouter
              </summary>
              <div className="mt-3 w-[min(92vw,46rem)] rounded-[1.25rem] border border-line bg-panel p-4 shadow-panel">
                <form action={createCitizen} className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Nom complet</span>
                      <input className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent" name="fullName" type="text" required />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Téléphone</span>
                      <input className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent" name="phone" type="text" />
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Email</span>
                      <input className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent" name="email" type="email" />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Niveau de soutien</span>
                      <select className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent" name="supportLevel" defaultValue="unknown">
                        {Object.entries(supportLevelLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Quartier</span>
                      <input className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent" name="neighborhood" type="text" />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Bureau</span>
                      <select className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent" name="pollingStationCode" defaultValue="">
                        <option value="">Non rattaché</option>
                        {pollingStations.map((station) => (
                          <option key={station.code} value={station.code}>{station.label}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Notes</span>
                    <textarea className="min-h-[7rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent" name="notes" />
                  </label>
                  <div className="flex justify-end">
                    <Button type="submit">Enregistrer</Button>
                  </div>
                </form>
              </div>
            </details>
          ) : undefined
        }
      >
        <form className="mb-4 grid gap-3 lg:grid-cols-[1.5fr_repeat(2,minmax(0,1fr))_auto]">
          <input
            className="w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
            name="q"
            type="search"
            placeholder="Rechercher un nom, mail, téléphone ou quartier"
            defaultValue={filters.q}
          />
          <select
            className="w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
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
            className="w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
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
          <div className="flex gap-3">
            <button className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white" type="submit">
              Rechercher
            </button>
            <a className="rounded-2xl border border-line bg-panel px-4 py-3 text-sm font-medium text-ink" href="/citizens">
              Réinitialiser
            </a>
          </div>
        </form>

        <div className="mb-4 flex flex-wrap gap-2">
          {[
            { key: "all" as const, label: "Tous" },
            { key: "supportive" as const, label: "Favorables" },
            { key: "skeptical" as const, label: "Réservés" },
            { key: "opposed" as const, label: "Opposés" },
            { key: "volunteer" as const, label: "Volontaires" },
            { key: "follow_up" as const, label: "À relancer" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveFilter(item.key)}
              className={
                activeFilter === item.key
                  ? "inline-flex min-h-[2.5rem] items-center rounded-full border border-ink bg-ink px-3.5 text-sm font-medium text-white transition"
                  : "inline-flex min-h-[2.5rem] items-center rounded-full border border-line bg-panel px-3.5 text-sm font-medium text-muted transition hover:bg-elevated hover:text-ink"
              }
            >
              {item.label}
            </button>
          ))}
        </div>

        {visibleCitizens.length > 0 ? (
          <div className="space-y-3">
            {visibleCitizens.map((citizen) => (
              <CitizenRow
                key={citizen.id}
                canManageCitizens={canManageCitizens}
                citizen={citizen}
                onOpen={(item) => setSelectedCitizenId(item.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucune fiche citoyen"
            description="Aucune personne ne correspond à ce filtre pour le moment."
          />
        )}
      </Panel>

      {selectedCitizen ? (
        <CitizenDrawer
          canManageCitizens={canManageCitizens}
          citizen={selectedCitizen}
          onClose={() => setSelectedCitizenId(null)}
          pollingStations={pollingStations}
        />
      ) : null}
    </div>
  );
}
