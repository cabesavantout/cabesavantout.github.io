import {
  createMeeting,
  createMeetingAction,
  createMeetingNote,
} from "@/app/(app)/meetings/actions";
import { Badge, PageHeader, Panel } from "@/components/ui";
import type { ActiveUserOption, MeetingListItem } from "@/lib/postgres";

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
  return (
    <div>
      <PageHeader
        eyebrow="Coordination"
        title="Réunions et actions"
        description="Préparer les réunions, consigner les notes et suivre les actions qui en sortent."
      />

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

      {canManageMeetings ? (
        <details className="mb-6 group">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-[30px] border border-accent/20 bg-[linear-gradient(135deg,rgba(168,57,39,0.1),rgba(255,255,255,0.86))] px-5 py-5 shadow-panel transition hover:border-accent/35 sm:px-6">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-accent">
                Action
              </p>
              <h3 className="mt-2 text-xl font-semibold text-ink sm:text-2xl">
                Ajouter une réunion
              </h3>
            </div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-3xl leading-none text-white shadow-sm transition group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="mt-4">
            <Panel title="Nouvelle réunion" subtitle="Créer un rendez-vous avec son contexte minimal.">
            <form action={createMeeting} className="grid gap-4 lg:grid-cols-[1fr_1fr]">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Titre</span>
                <input
                  className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                  name="title"
                  type="text"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Lieu</span>
                <input
                  className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                  name="location"
                  type="text"
                />
              </label>
              <label className="block lg:col-span-2">
                <span className="mb-2 block text-sm font-medium">Description</span>
                <input
                  className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                  name="description"
                  type="text"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Début</span>
                <input
                  className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                  name="startsAt"
                  type="datetime-local"
                  required
                />
              </label>
              <div className="flex items-end justify-end">
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

      <div className="space-y-6">
        {meetings.length === 0 ? (
          <Panel title="Réunions" subtitle="Données réelles lues depuis PostgreSQL.">
            <p className="text-sm text-ink/65">Aucune réunion enregistrée pour le moment.</p>
          </Panel>
        ) : meetings.map((meeting) => (
          <Panel
            key={meeting.id}
            title={meeting.title}
            subtitle={`${meeting.startsAtLabel}${meeting.location ? ` · ${meeting.location}` : ""}`}
          >
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-sm font-medium text-ink/70">Description</p>
                <div className="mt-3 rounded-2xl border border-line/70 bg-sand/70 px-4 py-3 text-sm text-ink/75">
                  {meeting.description || "Aucune description saisie."}
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-ink/70">Notes</p>
                  <div className="mt-3 space-y-3">
                    {meeting.notes.length === 0 ? (
                      <div className="rounded-2xl border border-line/70 bg-white/70 px-4 py-3 text-sm text-ink/60">
                        Aucune note pour le moment.
                      </div>
                    ) : (
                      meeting.notes.map((note) => (
                        <div
                          key={note.id}
                          className="rounded-2xl border border-line/70 bg-white/70 px-4 py-3 text-sm"
                        >
                          <p className="text-ink/80">{note.body}</p>
                          <p className="mt-2 text-xs text-ink/55">
                            {note.authorName ?? "N/A"} · {note.createdAtLabel}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-ink/70">Suivi</p>
                <div className="mt-3 space-y-3">
                  <div className="rounded-2xl border border-line/70 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">Statut</p>
                      <Badge tone={meeting.status === "planned" ? "accent" : "pine"}>
                        {meeting.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-ink/65">
                      Créé par {meeting.createdByName ?? "N/A"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-line/70 px-4 py-3 text-sm text-ink/65">
                    {meeting.notesCount} note(s) · {meeting.openActionsCount} action(s) ouverte(s)
                  </div>
                  <div className="rounded-2xl border border-line/70 px-4 py-3">
                    <p className="text-sm font-medium text-ink/70">Actions</p>
                    <div className="mt-3 space-y-3">
                      {meeting.actions.length === 0 ? (
                        <p className="text-sm text-ink/60">Aucune action liée.</p>
                      ) : (
                        meeting.actions.map((action) => (
                          <div key={action.id} className="rounded-2xl bg-sand/60 px-3 py-3 text-sm">
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-medium">{action.title}</p>
                              <Badge tone={action.isDone ? "pine" : "accent"}>
                                {action.isDone ? "Terminée" : "Ouverte"}
                              </Badge>
                            </div>
                            <p className="mt-1 text-ink/60">
                              {action.ownerName ?? "Sans propriétaire"}
                              {action.dueAtLabel ? ` · ${action.dueAtLabel}` : ""}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {canManageMeetings ? (
                <div className="xl:col-span-2 grid gap-4 lg:grid-cols-2">
                  <form action={createMeetingNote} className="rounded-2xl border border-line/70 bg-white/70 p-4">
                    <input type="hidden" name="meetingId" value={meeting.id} />
                    <p className="mb-3 text-sm font-medium text-ink/80">Ajouter une note</p>
                    <textarea
                      className="min-h-[120px] w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                      name="body"
                      placeholder="Résumé, décision, point d'attention"
                      required
                    />
                    <div className="mt-3 flex justify-end">
                      <button
                        className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white transition hover:bg-ink/90"
                        type="submit"
                      >
                        Ajouter la note
                      </button>
                    </div>
                  </form>

                  <form action={createMeetingAction} className="rounded-2xl border border-line/70 bg-white/70 p-4">
                    <input type="hidden" name="meetingId" value={meeting.id} />
                    <p className="mb-3 text-sm font-medium text-ink/80">Ajouter une action</p>
                    <div className="space-y-3">
                      <input
                        className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                        name="title"
                        type="text"
                        placeholder="Action à lancer"
                        required
                      />
                      <select
                        className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                        name="ownerId"
                        defaultValue=""
                      >
                        <option value="">Sans propriétaire</option>
                        {activeUsers.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.fullName}
                          </option>
                        ))}
                      </select>
                      <input
                        className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                        name="dueAt"
                        type="datetime-local"
                      />
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white transition hover:bg-ink/90"
                        type="submit"
                      >
                        Ajouter l'action
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
