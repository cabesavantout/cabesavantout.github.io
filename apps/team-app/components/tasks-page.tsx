import { createTask, updateTask } from "@/app/(app)/tasks/actions";
import { Badge, PageHeader, Panel } from "@/components/ui";
import type { ActiveUserOption, TaskListItem } from "@/lib/postgres";

const priorityLabels: Record<string, string> = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
  critical: "Critique",
};

const statusLabels: Record<string, string> = {
  todo: "À faire",
  in_progress: "En cours",
  blocked: "Bloquée",
  done: "Terminée",
  cancelled: "Annulée",
};

export function TasksPage({
  canManageTasks,
  tasks,
  activeUsers,
  success,
  error,
}: {
  canManageTasks: boolean;
  tasks: TaskListItem[];
  activeUsers: ActiveUserOption[];
  success?: string;
  error?: string;
}) {
  return (
    <div>
      <PageHeader
        eyebrow="Execution"
        title="Tâches et assignations"
        description="Créer, assigner et suivre les tâches utiles à la campagne."
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

      {canManageTasks ? (
        <details className="mb-6 group">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-[30px] border border-accent/20 bg-[linear-gradient(135deg,rgba(168,57,39,0.1),rgba(255,255,255,0.86))] px-5 py-5 shadow-panel transition hover:border-accent/35 sm:px-6">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-accent">
                Action
              </p>
              <h3 className="mt-2 text-xl font-semibold text-ink sm:text-2xl">
                Ajouter une tâche
              </h3>
            </div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-3xl leading-none text-white shadow-sm transition group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="mt-4">
            <Panel title="Nouvelle tâche" subtitle="Créer une action simple à suivre.">
            <form action={createTask} className="grid gap-4 lg:grid-cols-[1.2fr_1fr_220px]">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Titre</span>
                <input
                  className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                  name="title"
                  type="text"
                  placeholder="Ex. finaliser la liste des responsables"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Description</span>
                <input
                  className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                  name="description"
                  type="text"
                  placeholder="Contexte ou détail utile"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
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
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Échéance</span>
                  <input
                    className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                    name="dueAt"
                    type="datetime-local"
                  />
                </label>
              </div>
              <div className="lg:col-span-3 flex justify-end">
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

      <Panel title="Tâches" subtitle="Suivi courant de l'exécution.">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-ink/55">
              <tr>
                <th className="pb-3 font-medium">Tâche</th>
                <th className="pb-3 font-medium">Responsable</th>
                <th className="pb-3 font-medium">Priorité</th>
                <th className="pb-3 font-medium">Statut</th>
                <th className="pb-3 font-medium">Échéance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {tasks.length === 0 ? (
                <tr>
                  <td className="py-6 text-ink/60" colSpan={5}>
                    Aucune tâche enregistrée pour le moment.
                  </td>
                </tr>
              ) : tasks.map((task) => (
                <tr key={task.id}>
                  <td className="py-4">
                    <p className="font-medium">{task.title}</p>
                    <p className="mt-1 text-ink/60">{task.description}</p>
                    {task.sourceFieldReportId ? (
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-ink/45">
                        Issu d'un retour terrain
                        {task.sourceFieldReportTopic ? ` · ${task.sourceFieldReportTopic}` : ""}
                      </p>
                    ) : null}
                  </td>
                  <td className="py-4">
                    {canManageTasks ? (
                      <form action={updateTask} className="flex min-w-[180px] flex-col gap-2">
                        <input type="hidden" name="taskId" value={task.id} />
                        <select
                          className="rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none transition focus:border-accent"
                          name="assignedTo"
                          defaultValue={task.assignedTo ?? ""}
                        >
                          <option value="">Non assigné</option>
                          {activeUsers.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.fullName}
                            </option>
                          ))}
                        </select>
                        <select
                          className="rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none transition focus:border-accent"
                          name="status"
                          defaultValue={task.status}
                        >
                          <option value="todo">À faire</option>
                          <option value="in_progress">En cours</option>
                          <option value="blocked">Bloqué</option>
                          <option value="done">Terminé</option>
                          <option value="cancelled">Annulé</option>
                        </select>
                        <button
                          className="rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium text-ink transition hover:bg-sand"
                          type="submit"
                        >
                          Mettre à jour
                        </button>
                      </form>
                    ) : (
                      task.ownerName ?? "Non assigné"
                    )}
                  </td>
                  <td className="py-4">
                    <Badge tone={task.priority === "critical" ? "warning" : "neutral"}>
                      {priorityLabels[task.priority] ?? task.priority}
                    </Badge>
                  </td>
                  <td className="py-4">
                    <Badge
                      tone={
                        task.status === "in_progress"
                          ? "accent"
                          : task.status === "done"
                            ? "pine"
                            : "warning"
                      }
                    >
                      {statusLabels[task.status] ?? task.status}
                    </Badge>
                  </td>
                  <td className="py-4 text-ink/65">{task.dueAtLabel ?? "Sans échéance"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
