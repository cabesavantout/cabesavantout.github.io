"use client";

import { useMemo, useState } from "react";
import {
  createMeeting,
  createMeetingAction,
  createMeetingNote,
} from "@/app/(app)/meetings/actions";
import {
  Badge,
  Button,
  EmptyState,
  Notice,
  PageHeader,
  Panel,
} from "@/components/ui";
import type { ActiveUserOption, MeetingListItem } from "@/lib/postgres";

type MeetingStage = "upcoming" | "in_progress" | "completed";

function parseMeetingDate(value: string) {
  const normalized = value.includes(" ") ? value.replace(" ", "T") : value;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getMeetingStage(meeting: MeetingListItem): MeetingStage {
  const normalizedStatus = meeting.status.toLowerCase();

  if (["completed", "done", "closed"].includes(normalizedStatus)) {
    return "completed";
  }

  if (["in_progress", "running", "live"].includes(normalizedStatus)) {
    return "in_progress";
  }

  const startsAt = parseMeetingDate(meeting.startsAtLabel);
  if (!startsAt) return "upcoming";

  return startsAt.getTime() < Date.now() ? "completed" : "upcoming";
}

function getMeetingRank(meeting: MeetingListItem) {
  const stage = getMeetingStage(meeting);

  if (stage === "in_progress") return 1;
  if (stage === "upcoming") return 2;
  return 3;
}

function compareMeetings(a: MeetingListItem, b: MeetingListItem) {
  const rankDiff = getMeetingRank(a) - getMeetingRank(b);
  if (rankDiff !== 0) return rankDiff;

  const dateA = parseMeetingDate(a.startsAtLabel)?.getTime() ?? 0;
  const dateB = parseMeetingDate(b.startsAtLabel)?.getTime() ?? 0;

  if (getMeetingStage(a) === "completed" && getMeetingStage(b) === "completed") {
    return dateB - dateA;
  }

  return dateA - dateB;
}

function MeetingStatusBadge({ status }: { status: MeetingStage }) {
  const config = {
    upcoming: { label: "À venir", tone: "accent" as const },
    in_progress: { label: "En cours", tone: "warning" as const },
    completed: { label: "Tenue", tone: "pine" as const },
  }[status];

  return <Badge tone={config.tone}>{config.label}</Badge>;
}

function MeetingOriginBadge({ origin }: { origin: MeetingListItem["origin"] }) {
  if (origin !== "mairie") return null;
  return <Badge tone="pine">Source mairie</Badge>;
}

function MeetingHeroCard({
  meeting,
  onOpen,
}: {
  meeting: MeetingListItem;
  onOpen: (meeting: MeetingListItem) => void;
}) {
  return (
    <article className="rounded-[1.5rem] border border-line bg-panel p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <MeetingStatusBadge status={getMeetingStage(meeting)} />
            <MeetingOriginBadge origin={meeting.origin} />
            {meeting.openActionsCount > 0 ? (
              <Badge tone="warning">{meeting.openActionsCount} action(s) ouverte(s)</Badge>
            ) : null}
          </div>

          <h2 className="section-title mt-4 text-[1.45rem] font-semibold leading-tight text-ink sm:text-[1.75rem]">
            {meeting.title}
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted">
            {meeting.startsAtLabel}
            {meeting.location ? ` · ${meeting.location}` : ""}
          </p>

          <p className="mt-4 max-w-readable text-sm leading-6 text-muted">
            {meeting.description || "Aucun objectif saisi. Ajoutez un cap clair avant la réunion."}
          </p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
            <span>{meeting.notesCount} note(s)</span>
            <span>{meeting.openActionsCount} action(s) à suivre</span>
            <span>{meeting.createdByName ?? "Créateur non renseigné"}</span>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button type="button" onClick={() => onOpen(meeting)}>
            Ouvrir
          </Button>
          <Button type="button" variant="secondary" onClick={() => onOpen(meeting)}>
            Préparer
          </Button>
        </div>
      </div>
    </article>
  );
}

function MeetingRow({
  meeting,
  actionLabel,
  onOpen,
}: {
  meeting: MeetingListItem;
  actionLabel: string;
  onOpen: (meeting: MeetingListItem) => void;
}) {
  const stage = getMeetingStage(meeting);

  return (
    <article className="rounded-[1.25rem] border border-line bg-elevated p-4">
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1.4fr)_auto_auto_auto_auto] lg:items-center">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink sm:text-base">{meeting.title}</p>
          <p className="mt-1 text-sm leading-6 text-muted">
            {meeting.startsAtLabel}
            {meeting.location ? ` · ${meeting.location}` : ""}
          </p>
        </div>

        <MeetingStatusBadge status={stage} />
        <MeetingOriginBadge origin={meeting.origin} />

        <div className="min-w-0 text-sm text-muted">
          <span>{meeting.notesCount} note(s)</span>
        </div>

        <div className="min-w-0 text-sm text-muted">
          <span>{meeting.openActionsCount} action(s) ouverte(s)</span>
        </div>

        <div className="flex justify-start lg:justify-end">
          <Button type="button" variant="secondary" onClick={() => onOpen(meeting)}>
            {actionLabel}
          </Button>
        </div>
      </div>
    </article>
  );
}

function MeetingDetailDrawer({
  meeting,
  activeUsers,
  canManageMeetings,
  onClose,
}: {
  meeting: MeetingListItem;
  activeUsers: ActiveUserOption[];
  canManageMeetings: boolean;
  onClose: () => void;
}) {
  const canEditMeeting = canManageMeetings && meeting.origin === "internal";
  const openActions = meeting.actions.filter((action) => !action.isDone);
  const completedActions = meeting.actions.filter((action) => action.isDone);

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
              <div className="flex flex-wrap items-center gap-2">
                <MeetingStatusBadge status={getMeetingStage(meeting)} />
                <MeetingOriginBadge origin={meeting.origin} />
                {meeting.openActionsCount > 0 ? (
                  <Badge tone="warning">{meeting.openActionsCount} action(s) ouverte(s)</Badge>
                ) : null}
              </div>
              <h2 className="section-title mt-3 text-[1.35rem] font-semibold text-ink">
                {meeting.title}
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted">
                {meeting.startsAtLabel}
                {meeting.location ? ` · ${meeting.location}` : ""}
              </p>
            </div>

            <Button type="button" variant="secondary" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>

        <div className="space-y-6 px-4 py-5 sm:px-6">
          <Panel
            title="Préparer"
            subtitle="Le cap, le contexte et ce qui doit être prêt avant le rendez-vous."
          >
            <div className="space-y-4">
              <p className="text-sm leading-6 text-muted">
                {meeting.description || "Aucune description. Ajoutez un objectif et les points à traiter."}
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-line bg-elevated p-4 text-sm">
                  <p className="font-medium text-ink">Lieu</p>
                  <p className="mt-1 text-muted">{meeting.location || "À confirmer"}</p>
                </div>
                <div className="rounded-2xl border border-line bg-elevated p-4 text-sm">
                  <p className="font-medium text-ink">Notes</p>
                  <p className="mt-1 text-muted">{meeting.notesCount} point(s) déjà saisi(s)</p>
                </div>
                <div className="rounded-2xl border border-line bg-elevated p-4 text-sm">
                  <p className="font-medium text-ink">Suivi</p>
                  <p className="mt-1 text-muted">{meeting.openActionsCount} action(s) à faire avancer</p>
                </div>
              </div>
            </div>
          </Panel>

          <Panel
            title="Notes"
            subtitle="Informations, points de contexte et matière de compte-rendu."
          >
            {meeting.notes.length > 0 ? (
              <div className="space-y-3">
                {meeting.notes.map((note) => (
                  <article key={note.id} className="rounded-2xl border border-line bg-elevated p-4">
                    <p className="text-sm leading-6 text-ink">{note.body}</p>
                    <p className="mt-2 text-sm text-muted">
                      {note.authorName ?? "Auteur non renseigné"} · {note.createdAtLabel}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Aucune note"
                description="Ajoutez les points à retenir pour préparer ou clôturer la réunion."
              />
            )}

            {canEditMeeting ? (
              <form action={createMeetingNote} className="mt-4 grid gap-3 rounded-2xl border border-line bg-elevated p-4">
                <input type="hidden" name="meetingId" value={meeting.id} />
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink">Nouvelle note</span>
                  <textarea
                    className="min-h-[8rem] w-full rounded-2xl border border-line bg-panel px-4 py-3 text-sm outline-none transition focus:border-accent"
                    name="body"
                    placeholder="Contexte, décision, point d'attention, élément de compte-rendu."
                    required
                  />
                </label>
                <div className="flex justify-end">
                  <Button type="submit" variant="secondary">
                    Ajouter la note
                  </Button>
                </div>
              </form>
            ) : meeting.origin === "mairie" ? (
              <div className="rounded-[1.25rem] border border-line bg-elevated px-4 py-3 text-sm text-muted">
                Réunion importée depuis le site de la mairie. La date est visible ici mais le suivi reste en lecture seule.
              </div>
            ) : null}
          </Panel>

          <Panel
            title="Décisions"
            subtitle="Points actés et matière à transformer en suivi."
          >
            {meeting.notes.length > 0 ? (
              <div className="space-y-3">
                {meeting.notes.slice(0, 3).map((note) => (
                  <article key={note.id} className="rounded-2xl border border-line bg-elevated p-4">
                    <p className="text-sm leading-6 text-ink">{note.body}</p>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Aucune décision visible"
                description="Les décisions apparaîtront ici dès qu'une note ou un compte-rendu les explicite."
              />
            )}
          </Panel>

          <Panel
            title="Actions"
            subtitle="Ce qui doit être lancé ou suivi après la réunion."
          >
            <div className="space-y-4">
              {openActions.length > 0 ? (
                <div className="space-y-3">
                  {openActions.map((action) => (
                    <article key={action.id} className="rounded-2xl border border-line bg-elevated p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="warning">Ouverte</Badge>
                        {action.dueAtLabel ? <Badge tone="accent">{action.dueAtLabel}</Badge> : null}
                      </div>
                      <p className="mt-3 text-sm font-medium text-ink">{action.title}</p>
                      <p className="mt-1 text-sm text-muted">
                        {action.ownerName ?? "Sans responsable"}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Aucune action ouverte"
                  description="Le suivi est à jour pour cette réunion."
                />
              )}

              {completedActions.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-ink">Actions closes</p>
                  {completedActions.map((action) => (
                    <article key={action.id} className="rounded-2xl border border-line bg-panel p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="pine">Terminée</Badge>
                      </div>
                      <p className="mt-3 text-sm font-medium text-ink">{action.title}</p>
                    </article>
                  ))}
                </div>
              ) : null}

              {canEditMeeting ? (
                <form action={createMeetingAction} className="grid gap-4 rounded-2xl border border-line bg-elevated p-4">
                  <input type="hidden" name="meetingId" value={meeting.id} />
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Nouvelle action</span>
                    <input
                      className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-panel px-4 py-3 text-sm outline-none transition focus:border-accent"
                      name="title"
                      type="text"
                      placeholder="Ex. préparer les points d'arbitrage"
                      required
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Responsable</span>
                      <select
                        className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-panel px-4 py-3 text-sm outline-none transition focus:border-accent"
                        name="ownerId"
                        defaultValue=""
                      >
                        <option value="">Sans responsable</option>
                        {activeUsers.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.fullName}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Échéance</span>
                      <input
                        className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-panel px-4 py-3 text-sm outline-none transition focus:border-accent"
                        name="dueAt"
                        type="datetime-local"
                      />
                    </label>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" variant="secondary">
                      Ajouter l'action
                    </Button>
                  </div>
                </form>
              ) : null}
            </div>
          </Panel>
        </div>
      </aside>
    </div>
  );
}

export function MeetingsPage({
  canManageMeetings,
  meetings,
  activeUsers,
  success,
  error,
}: {
  canManageMeetings: boolean;
  meetings: MeetingListItem[];
  activeUsers: ActiveUserOption[];
  success?: string;
  error?: string;
}) {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);

  const sortedMeetings = useMemo(() => [...meetings].sort(compareMeetings), [meetings]);
  const upcomingMunicipalMeetings = useMemo(
    () =>
      sortedMeetings
        .filter((meeting) => meeting.origin === "mairie" && getMeetingStage(meeting) !== "completed")
        .slice(0, 3),
    [sortedMeetings],
  );
  const historicalMunicipalMeetings = useMemo(
    () =>
      sortedMeetings
        .filter((meeting) => meeting.origin === "mairie" && getMeetingStage(meeting) === "completed")
        .slice(0, 8),
    [sortedMeetings],
  );

  const upcomingMeetings = useMemo(
    () =>
      sortedMeetings.filter(
        (meeting) => meeting.origin === "internal" && getMeetingStage(meeting) !== "completed",
      ),
    [sortedMeetings],
  );
  const recentMeetings = useMemo(
    () =>
      sortedMeetings.filter(
        (meeting) => meeting.origin === "internal" && getMeetingStage(meeting) === "completed",
      ),
    [sortedMeetings],
  );

  const heroMeeting = upcomingMeetings[0] ?? null;
  const preparationMeetings = heroMeeting
    ? upcomingMeetings.filter((meeting) => meeting.id !== heroMeeting.id).slice(0, 4)
    : upcomingMeetings.slice(0, 4);
  const recentItems = recentMeetings.slice(0, 5);
  const selectedMeeting = sortedMeetings.find((meeting) => meeting.id === selectedMeetingId) ?? null;

  return (
    <div>
      <PageHeader
        eyebrow="Réunions"
        title="Réunions"
        description="Préparer les prochains rendez-vous et suivre ce qui en sort."
      />

      {success ? <Notice>{success}</Notice> : null}
      {error ? <Notice tone="error">{error}</Notice> : null}

      <div className="space-y-6">
        {upcomingMunicipalMeetings.length > 0 ? (
          <Panel
            title="Conseils municipaux à venir"
            subtitle="Dates officielles relevées sur le site de la mairie pour les prochaines séances publiées."
          >
            <div className="space-y-3">
              {upcomingMunicipalMeetings.map((meeting) => (
                <MeetingRow
                  key={meeting.id}
                  meeting={meeting}
                  actionLabel="Voir la fiche"
                  onOpen={(item) => setSelectedMeetingId(item.id)}
                />
              ))}
            </div>
          </Panel>
        ) : null}

        {historicalMunicipalMeetings.length > 0 ? (
          <Panel
            title="Historique des conseils municipaux publiés"
            subtitle="Archives visibles des séances relevées sur le site de la mairie."
          >
            <div className="space-y-3">
              {historicalMunicipalMeetings.map((meeting) => (
                <MeetingRow
                  key={meeting.id}
                  meeting={meeting}
                  actionLabel="Voir la fiche"
                  onOpen={(item) => setSelectedMeetingId(item.id)}
                />
              ))}
            </div>
          </Panel>
        ) : null}

        <Panel
          title="Prochaine réunion"
          subtitle="Le rendez-vous le plus utile à préparer maintenant."
          actions={
            canManageMeetings ? (
              <details className="group">
                <summary className="inline-flex min-h-[2.5rem] cursor-pointer list-none items-center rounded-2xl bg-ink px-4 text-sm font-medium text-white transition hover:bg-ink/92">
                  Nouvelle réunion
                </summary>
                <div className="mt-3 w-[min(92vw,40rem)] rounded-[1.25rem] border border-line bg-panel p-4 shadow-panel">
                  <form action={createMeeting} className="grid gap-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Titre</span>
                      <input
                        className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                        name="title"
                        type="text"
                        required
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Description</span>
                      <textarea
                        className="min-h-[7rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                        name="description"
                        placeholder="Objectif du rendez-vous, points à arbitrer, préparation attendue."
                      />
                    </label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-ink">Lieu</span>
                        <input
                          className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                          name="location"
                          type="text"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-ink">Début</span>
                        <input
                          className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                          name="startsAt"
                          type="datetime-local"
                          required
                        />
                      </label>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Enregistrer</Button>
                    </div>
                  </form>
                </div>
              </details>
            ) : undefined
          }
        >
          {heroMeeting ? (
            <MeetingHeroCard meeting={heroMeeting} onOpen={(meeting) => setSelectedMeetingId(meeting.id)} />
          ) : (
            <EmptyState
              title="Aucune réunion à venir"
              description="Le calendrier est vide. Ajoutez un prochain rendez-vous pour relancer la préparation."
            />
          )}
        </Panel>

        <Panel
          title="À préparer"
          subtitle="Les prochains rendez-vous qui demandent encore un cadrage, des notes ou un suivi."
        >
          {preparationMeetings.length > 0 ? (
            <div className="space-y-3">
              {preparationMeetings.map((meeting) => (
                <MeetingRow
                  key={meeting.id}
                  meeting={meeting}
                  actionLabel="Ouvrir"
                  onOpen={(item) => setSelectedMeetingId(item.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Rien d'autre à préparer"
              description="La prochaine réunion concentre l'essentiel du travail à lancer."
            />
          )}
        </Panel>

        <Panel
          title="Réunions récentes"
          subtitle="Retrouver vite les rendez-vous tenus et le suivi qui en découle."
        >
          {recentItems.length > 0 ? (
            <div className="space-y-3">
              {recentItems.map((meeting) => (
                <MeetingRow
                  key={meeting.id}
                  meeting={meeting}
                  actionLabel="Voir le suivi"
                  onOpen={(item) => setSelectedMeetingId(item.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Aucune réunion récente"
              description="Les réunions passées apparaîtront ici pour retrouver notes, décisions et actions."
            />
          )}
        </Panel>
      </div>

      {selectedMeeting ? (
        <MeetingDetailDrawer
          activeUsers={activeUsers}
          canManageMeetings={canManageMeetings}
          meeting={selectedMeeting}
          onClose={() => setSelectedMeetingId(null)}
        />
      ) : null}
    </div>
  );
}
