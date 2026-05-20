"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createTask, updateTask } from "@/app/(app)/tasks/actions";
import { Badge, Button, EmptyState, Notice, PageHeader, Panel, StatCard } from "@/components/ui";
import type { ActiveUserOption, TaskListItem } from "@/lib/postgres";

const priorityLabels: Record<string, string> = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
  critical: "Critique",
};

const priorityTone: Record<string, "neutral" | "warning" | "accent"> = {
  low: "neutral",
  medium: "neutral",
  high: "accent",
  critical: "warning",
};

const statusLabels: Record<string, string> = {
  todo: "À faire",
  in_progress: "En cours",
  blocked: "Bloquée",
  done: "Terminée",
  cancelled: "Annulée",
};

const statusTone: Record<string, "neutral" | "pine" | "warning"> = {
  todo: "neutral",
  in_progress: "pine",
  blocked: "warning",
  done: "pine",
  cancelled: "neutral",
};

type TaskFilter = "all" | "critical" | "blocked" | "overdue" | "unassigned";

function parseDueDate(value: string | null) {
  if (!value) return null;
  const isoCandidate = value.includes(" ") ? value.replace(" ", "T") : value;
  const parsed = new Date(isoCandidate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isTaskOverdue(task: TaskListItem) {
  if (!task.dueAtLabel || task.status === "done" || task.status === "cancelled") {
    return false;
  }

  const dueDate = parseDueDate(task.dueAtLabel);
  if (!dueDate) return false;

  return dueDate.getTime() < Date.now();
}

function getTaskRank(task: TaskListItem) {
  if (task.priority === "critical") return 1;
  if (task.status === "blocked") return 2;
  if (isTaskOverdue(task)) return 3;
  if (!task.assignedTo) return 4;
  if (task.priority === "high") return 5;
  if (task.status === "in_progress") return 6;
  return 7;
}

function matchesFilter(task: TaskListItem, filter: TaskFilter) {
  switch (filter) {
    case "critical":
      return task.priority === "critical";
    case "blocked":
      return task.status === "blocked";
    case "overdue":
      return isTaskOverdue(task);
    case "unassigned":
      return !task.assignedTo;
    default:
      return true;
  }
}

function TaskQuickActions({
  task,
  activeUsers,
}: {
  task: TaskListItem;
  activeUsers: ActiveUserOption[];
}) {
  return (
    <div className="space-y-2">
      <form action={updateTask} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <input type="hidden" name="taskId" value={task.id} />
        <select
          className="min-h-[2.5rem] rounded-2xl border border-line bg-panel px-3.5 py-2 text-sm outline-none transition focus:border-accent"
          name="assignedTo"
          defaultValue={task.assignedTo ?? ""}
          aria-label={`Responsable pour ${task.title}`}
        >
          <option value="">Non assignée</option>
          {activeUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.fullName}
            </option>
          ))}
        </select>
        <select
          className="min-h-[2.5rem] rounded-2xl border border-line bg-panel px-3.5 py-2 text-sm outline-none transition focus:border-accent"
          name="status"
          defaultValue={task.status}
          aria-label={`Statut pour ${task.title}`}
        >
          <option value="todo">À faire</option>
          <option value="in_progress">En cours</option>
          <option value="blocked">Bloquée</option>
          <option value="done">Terminée</option>
          <option value="cancelled">Annulée</option>
        </select>
        <Button size="sm" type="submit" variant="secondary">
          Mettre à jour
        </Button>
      </form>

      <div className="flex flex-wrap gap-3">
        {task.sourceFieldReportId ? (
          <Link href="/field-reports" className="text-sm font-medium text-ink underline-offset-4 hover:underline">
            Voir le retour terrain
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function TaskRow({
  task,
  activeUsers,
  canManageTasks,
}: {
  task: TaskListItem;
  activeUsers: ActiveUserOption[];
  canManageTasks: boolean;
}) {
  const overdue = isTaskOverdue(task);
  const unassigned = !task.assignedTo;

  return (
    <article className="rounded-[1.25rem] border border-line bg-elevated p-4">
      <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,1.4fr)_auto_auto_minmax(0,0.9fr)_minmax(0,0.95fr)] xl:items-start">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink sm:text-base">{task.title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge tone={statusTone[task.status] ?? "neutral"}>
              {statusLabels[task.status] ?? task.status}
            </Badge>
            <Badge tone={priorityTone[task.priority] ?? "neutral"}>
              {priorityLabels[task.priority] ?? task.priority}
            </Badge>
            {overdue ? <Badge tone="warning">Échue</Badge> : null}
            {unassigned ? <Badge tone="neutral">Non assignée</Badge> : null}
            {task.sourceFieldReportId ? <Badge tone="accent">Terrain</Badge> : null}
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">Responsable</p>
          <p className="mt-1 text-sm text-ink">{task.ownerName ?? "Non assignée"}</p>
        </div>

        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">Échéance</p>
          <p className="mt-1 text-sm text-ink">{task.dueAtLabel ?? "Aucune"}</p>
        </div>

        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">Contexte</p>
          <p className="mt-1 text-sm leading-6 text-muted">
            {task.sourceFieldReportId
              ? `Retour terrain${task.sourceFieldReportTopic ? ` · ${task.sourceFieldReportTopic}` : ""}`
              : task.status === "blocked"
                ? "Tâche bloquée, à débloquer ou réassigner."
                : overdue
                  ? "Retard à traiter aujourd'hui."
                  : "Suivi normal."}
          </p>
        </div>

        <div className="min-w-0">
          {canManageTasks ? (
            <TaskQuickActions task={task} activeUsers={activeUsers} />
          ) : (
            <p className="text-sm text-muted">Lecture seule</p>
          )}
        </div>
      </div>
    </article>
  );
}

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
  const [activeFilter, setActiveFilter] = useState<TaskFilter>("all");

  const sortedTasks = useMemo(
    () =>
      [...tasks].sort((a, b) => {
        const rankDiff = getTaskRank(a) - getTaskRank(b);
        if (rankDiff !== 0) return rankDiff;

        const dueA = parseDueDate(a.dueAtLabel)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        const dueB = parseDueDate(b.dueAtLabel)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        if (dueA !== dueB) return dueA - dueB;

        return a.title.localeCompare(b.title, "fr");
      }),
    [tasks],
  );

  const visibleTasks = useMemo(
    () => sortedTasks.filter((task) => matchesFilter(task, activeFilter)),
    [sortedTasks, activeFilter],
  );

  const criticalCount = tasks.filter((task) => task.priority === "critical").length;
  const blockedCount = tasks.filter((task) => task.status === "blocked").length;
  const unassignedCount = tasks.filter((task) => !task.assignedTo).length;

  return (
    <div>
      <PageHeader
        eyebrow="Tâches"
        title="Tâches"
        description="Les actions à faire avancer aujourd’hui."
      />

      {success ? <Notice>{success}</Notice> : null}
      {error ? <Notice tone="error">{error}</Notice> : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Critiques"
          value={String(criticalCount)}
          tone="accent"
          detail="Demandent un arbitrage ou une relance immédiate."
        />
        <StatCard
          label="Bloquées"
          value={String(blockedCount)}
          tone="default"
          detail="À débloquer ou réassigner aujourd'hui."
        />
        <StatCard
          label="Sans responsable"
          value={String(unassignedCount)}
          tone="pine"
          detail="À attribuer pour éviter l'inertie."
        />
      </div>

      <div className="mt-6">
        <Panel
          title="Tâches prioritaires"
          subtitle="Triées par criticité, blocage, retard puis absence d'assignation."
          actions={
            canManageTasks ? (
              <div className="relative">
                <details className="group">
                  <summary className="inline-flex min-h-[2.5rem] cursor-pointer list-none items-center rounded-2xl bg-ink px-4 text-sm font-medium text-white transition hover:bg-ink/92">
                    Nouvelle tâche
                  </summary>
                  <div className="absolute right-0 z-10 mt-3 w-[min(92vw,42rem)] rounded-[1.25rem] border border-line bg-panel p-4 shadow-panel">
                    <form action={createTask} className="grid gap-4">
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-ink">Titre</span>
                        <input
                          className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                          name="title"
                          type="text"
                          placeholder="Ex. rappeler les responsables de secteur"
                          required
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-ink">Description</span>
                        <textarea
                          className="min-h-[7rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                          name="description"
                          placeholder="Contexte utile, blocage éventuel, prochaine étape attendue."
                        />
                      </label>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-2 block text-sm font-medium text-ink">Priorité</span>
                          <select
                            className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
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
                          <span className="mb-2 block text-sm font-medium text-ink">Échéance</span>
                          <input
                            className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                            name="dueAt"
                            type="datetime-local"
                          />
                        </label>
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit">Enregistrer</Button>
                      </div>
                    </form>
                  </div>
                </details>
              </div>
            ) : undefined
          }
        >
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              { key: "all" as const, label: "Toutes" },
              { key: "critical" as const, label: "Critiques" },
              { key: "blocked" as const, label: "Bloquées" },
              { key: "overdue" as const, label: "Échues" },
              { key: "unassigned" as const, label: "Non assignées" },
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

          {visibleTasks.length === 0 ? (
            <EmptyState
              title="Aucune tâche dans ce filtre"
              description="Le pilotage est à jour pour ce segment. Essayez un autre filtre ou créez une nouvelle tâche."
            />
          ) : (
            <div className="space-y-3">
              {visibleTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  activeUsers={activeUsers}
                  canManageTasks={canManageTasks}
                />
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
