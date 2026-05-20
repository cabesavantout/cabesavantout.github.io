"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createFieldReport, updateFieldReport } from "@/app/(app)/field-reports/actions";
import { createTaskFromFieldReport } from "@/app/(app)/tasks/actions";
import {
  Badge,
  Button,
  FilterChip,
  EmptyState,
  Notice,
  PageHeader,
  Panel,
  StatCard,
} from "@/components/ui";
import type { CitizenOption, FieldReportListItem, PollingStationOption } from "@/lib/postgres";

const supportLevelLabels: Record<string, string> = {
  unknown: "Soutien inconnu",
  opposed: "Opposition",
  skeptical: "Réservé",
  neutral: "Neutre",
  supportive: "Favorable",
  volunteer: "Volontaire",
};

const priorityLabels: Record<string, string> = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
  critical: "Critique",
};

const statusLabels: Record<string, string> = {
  new: "Nouveau",
  qualified: "Qualifié",
  in_progress: "En traitement",
  closed: "Traité",
};

type InboxFilter = "all" | "new" | "urgent" | "in_progress" | "without_task";

function getPriorityTone(priority: string) {
  if (priority === "critical" || priority === "high") return "warning" as const;
  if (priority === "medium") return "accent" as const;
  return "neutral" as const;
}

function getStatusTone(status: string) {
  if (status === "new") return "warning" as const;
  if (status === "in_progress") return "accent" as const;
  if (status === "closed") return "pine" as const;
  return "neutral" as const;
}

function getSentimentLabel(sentiment: number | null) {
  if (sentiment === null) return null;
  if (sentiment <= -1) return "Tension";
  if (sentiment >= 1) return "Positif";
  return "Mitigé";
}

function getReportRank(report: FieldReportListItem) {
  if (report.priority === "critical" || report.priority === "high") return 1;
  if (report.status === "new") return 2;
  if (!report.linkedTaskId) return 3;
  if (report.status === "in_progress" || report.status === "qualified") return 4;
  return 5;
}

function matchesFilter(report: FieldReportListItem, filter: InboxFilter) {
  switch (filter) {
    case "new":
      return report.status === "new";
    case "urgent":
      return report.priority === "critical" || report.priority === "high";
    case "in_progress":
      return report.status === "in_progress" || report.status === "qualified";
    case "without_task":
      return !report.linkedTaskId;
    default:
      return true;
  }
}

function getContextLabel(report: FieldReportListItem) {
  const parts = [
    report.citizenName ?? null,
    report.neighborhood ?? null,
    report.pollingStationCode ? `Bureau ${report.pollingStationCode}` : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" · ") : "Signal non rattaché";
}

function FieldReportRow({
  report,
  canManageReports,
  canManageTasks,
  onOpen,
}: {
  report: FieldReportListItem;
  canManageReports: boolean;
  canManageTasks: boolean;
  onOpen: (report: FieldReportListItem) => void;
}) {
  const sentimentLabel = getSentimentLabel(report.sentiment);

  return (
    <article className="rounded-[1.25rem] border border-line bg-elevated p-4">
      <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,1.45fr)_auto_auto_minmax(0,1fr)_auto] xl:items-center">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink sm:text-base">
            {report.topic ?? "Retour terrain"}
          </p>
          <p className="mt-1 text-sm leading-6 text-muted">{getContextLabel(report)}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge tone={getStatusTone(report.status)}>
            {statusLabels[report.status] ?? report.status}
          </Badge>
          <Badge tone={getPriorityTone(report.priority)}>
            {priorityLabels[report.priority] ?? report.priority}
          </Badge>
          {!report.linkedTaskId ? <Badge tone="warning">Sans tâche</Badge> : null}
        </div>

        <div className="text-sm text-muted">{report.reportedAtLabel}</div>

        <div className="min-w-0">
          <p className="text-sm leading-6 text-muted">
            {sentimentLabel ? `${sentimentLabel} · ` : ""}
            {report.tags.length > 0 ? report.tags.slice(0, 2).map((tag) => `#${tag}`).join(" ") : "À qualifier"}
          </p>
        </div>

        <div className="flex flex-wrap justify-start gap-2 xl:justify-end">
          {canManageReports ? (
            <Button type="button" variant="secondary" onClick={() => onOpen(report)}>
              Qualifier
            </Button>
          ) : null}
          {canManageTasks && !report.linkedTaskId ? (
            <form action={createTaskFromFieldReport}>
              <input type="hidden" name="reportId" value={report.id} />
              <Button type="submit" variant="secondary">
                Créer une tâche
              </Button>
            </form>
          ) : report.linkedTaskId ? (
            <Link
              href="/tasks"
              className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
            >
              Voir la tâche
            </Link>
          ) : null}
          {report.citizenId ? (
            <Link
              href="/citizens"
              className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
            >
              Voir le citoyen
            </Link>
          ) : null}
          <Button type="button" variant="secondary" onClick={() => onOpen(report)}>
            Ouvrir
          </Button>
        </div>
      </div>
    </article>
  );
}

function FieldReportDrawer({
  report,
  canManageReports,
  canManageTasks,
  citizens,
  pollingStations,
  onClose,
}: {
  report: FieldReportListItem;
  canManageReports: boolean;
  canManageTasks: boolean;
  citizens: CitizenOption[];
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
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={getStatusTone(report.status)}>
                  {statusLabels[report.status] ?? report.status}
                </Badge>
                <Badge tone={getPriorityTone(report.priority)}>
                  {priorityLabels[report.priority] ?? report.priority}
                </Badge>
                {!report.linkedTaskId ? <Badge tone="warning">Sans tâche</Badge> : null}
              </div>
              <h2 className="section-title mt-3 text-[1.35rem] font-semibold text-ink">
                {report.topic ?? "Retour terrain"}
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted">
                {getContextLabel(report)} · {report.reportedAtLabel}
              </p>
            </div>
            <Button type="button" variant="secondary" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>

        <div className="space-y-6 px-4 py-5 sm:px-6">
          <Panel
            title="Signal"
            subtitle="Le retour terrain à qualifier et transformer en action."
          >
            <div className="space-y-4">
              <p className="text-sm leading-6 text-muted">{report.summary}</p>
              <div className="flex flex-wrap gap-2">
                {report.tags.map((tag) => (
                  <Badge key={tag} tone="neutral">#{tag}</Badge>
                ))}
                {report.tags.length === 0 ? <Badge tone="neutral">Aucun tag</Badge> : null}
                {report.sentiment !== null ? (
                  <Badge tone="accent">{getSentimentLabel(report.sentiment) ?? "Sentiment"}</Badge>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-muted">
                <span>{report.authorName ?? "Auteur non renseigné"}</span>
                <span>{report.source}</span>
                {report.linkedTaskTitle ? <span>Tâche liée: {report.linkedTaskTitle}</span> : null}
              </div>
            </div>
          </Panel>

          {canManageReports ? (
            <Panel
              title="Qualifier"
              subtitle="Mettre à jour le statut, le niveau de soutien et le contexte utile."
            >
              <form action={updateFieldReport} className="grid gap-4">
                <input type="hidden" name="reportId" value={report.id} />
                <input type="hidden" name="source" value={report.source} />

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Statut</span>
                    <select
                      className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                      name="status"
                      defaultValue={report.status}
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={`status-${value}`} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Priorité</span>
                    <select
                      className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                      name="priority"
                      defaultValue={report.priority}
                    >
                      {Object.entries(priorityLabels).map(([value, label]) => (
                        <option key={`priority-${value}`} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Niveau de soutien</span>
                    <select
                      className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                      name="supportLevel"
                      defaultValue={report.supportLevel}
                    >
                      {Object.entries(supportLevelLabels).map(([value, label]) => (
                        <option key={`support-${value}`} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Sentiment</span>
                    <select
                      className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                      name="sentiment"
                      defaultValue={report.sentiment === null ? "" : String(report.sentiment)}
                    >
                      <option value="">Non renseigné</option>
                      <option value="-2">Très négatif</option>
                      <option value="-1">Négatif</option>
                      <option value="0">Mitigé</option>
                      <option value="1">Positif</option>
                      <option value="2">Très positif</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Citoyen</span>
                    <select
                      className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                      name="citizenId"
                      defaultValue={report.citizenId ?? ""}
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
                    <span className="mb-2 block text-sm font-medium text-ink">Bureau</span>
                    <select
                      className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                      name="pollingStationCode"
                      defaultValue={report.pollingStationCode ?? ""}
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
                  <span className="mb-2 block text-sm font-medium text-ink">Tags</span>
                  <input
                    className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                    name="tags"
                    type="text"
                    defaultValue={report.tags.join(", ")}
                    placeholder="voirie, quartier, sécurité"
                  />
                </label>

                <div className="flex justify-end">
                  <Button type="submit">Mettre à jour</Button>
                </div>
              </form>
            </Panel>
          ) : null}

          <Panel
            title="Action"
            subtitle="Transformer ce signal en tâche ou naviguer vers l'entité liée."
          >
            <div className="flex flex-wrap gap-2">
              {canManageTasks && !report.linkedTaskId ? (
                <form action={createTaskFromFieldReport}>
                  <input type="hidden" name="reportId" value={report.id} />
                  <Button type="submit">Créer une tâche</Button>
                </form>
              ) : null}
              {report.linkedTaskId ? (
                <Link
                  href="/tasks"
                  className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
                >
                  Voir la tâche liée
                </Link>
              ) : null}
              {report.citizenId ? (
                <Link
                  href="/citizens"
                  className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
                >
                  Voir le citoyen
                </Link>
              ) : null}
              <Link
                href="/polling-stations"
                className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
              >
                Ouvrir la carte
              </Link>
            </div>
          </Panel>
        </div>
      </aside>
    </div>
  );
}

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
  const [activeFilter, setActiveFilter] = useState<InboxFilter>("all");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const sortedReports = useMemo(
    () =>
      [...reports].sort((left, right) => {
        const rankDiff = getReportRank(left) - getReportRank(right);
        if (rankDiff !== 0) return rankDiff;
        return right.reportedAtLabel.localeCompare(left.reportedAtLabel, "fr");
      }),
    [reports],
  );

  const visibleReports = useMemo(
    () => sortedReports.filter((report) => matchesFilter(report, activeFilter)),
    [sortedReports, activeFilter],
  );

  const newCount = reports.filter((report) => report.status === "new").length;
  const urgentCount = reports.filter((report) => report.priority === "critical" || report.priority === "high").length;
  const withoutTaskCount = reports.filter((report) => !report.linkedTaskId).length;
  const selectedReport = reports.find((report) => report.id === selectedReportId) ?? null;

  return (
    <div>
      <PageHeader
        eyebrow="Remontées"
        title="Retours terrain"
        description="Les remontées à qualifier, prioriser et transformer en action."
      />

      {success ? <Notice>{success}</Notice> : null}
      {error ? <Notice tone="error">{error}</Notice> : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Nouveaux"
          value={String(newCount)}
          tone="accent"
          detail="Demandent une première qualification."
        />
        <StatCard
          label="Urgents"
          value={String(urgentCount)}
          tone="default"
          detail="À arbitrer ou transformer en action rapidement."
        />
        <StatCard
          label="Sans tâche"
          value={String(withoutTaskCount)}
          tone="pine"
          detail="N'ont pas encore de relais d'exécution."
        />
      </div>

      <div className="mt-6">
        <Panel
          title="À traiter maintenant"
          subtitle="Triés par urgence, nouveauté, absence de tâche puis suivi en cours."
          actions={
            canCreateReports ? (
              <details className="group">
                <summary className="inline-flex min-h-[2.5rem] cursor-pointer list-none items-center rounded-2xl bg-ink px-4 text-sm font-medium text-white transition hover:bg-ink/92">
                  Nouveau retour
                </summary>
                <div className="mt-3 w-[min(92vw,46rem)] rounded-[1.25rem] border border-line bg-panel p-4 shadow-panel">
                  <form action={createFieldReport} className="grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-ink">Sujet</span>
                        <input
                          className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                          name="topic"
                          type="text"
                          placeholder="Ex. stationnement"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-ink">Citoyen</span>
                        <select
                          className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
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
                    </div>

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
                        <span className="mb-2 block text-sm font-medium text-ink">Niveau de soutien</span>
                        <select
                          className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
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
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-ink">Quartier</span>
                        <input
                          className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                          name="neighborhood"
                          type="text"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-ink">Bureau</span>
                        <select
                          className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                          name="pollingStationCode"
                          defaultValue=""
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

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-ink">Tags</span>
                        <input
                          className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                          name="tags"
                          type="text"
                          placeholder="voirie, sécurité"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-ink">Sentiment</span>
                        <select
                          className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                          name="sentiment"
                          defaultValue=""
                        >
                          <option value="">Non renseigné</option>
                          <option value="-2">Très négatif</option>
                          <option value="-1">Négatif</option>
                          <option value="0">Mitigé</option>
                          <option value="1">Positif</option>
                          <option value="2">Très positif</option>
                        </select>
                      </label>
                    </div>

                    <input type="hidden" name="source" value="terrain" />

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Résumé</span>
                      <textarea
                        className="min-h-[8rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                        name="summary"
                        placeholder="Le signal, son contexte et ce qu'il faudrait faire ensuite."
                        required
                      />
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
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              { key: "all" as const, label: "Tous" },
              { key: "new" as const, label: "Nouveaux" },
              { key: "urgent" as const, label: "Urgents" },
              { key: "in_progress" as const, label: "En traitement" },
              { key: "without_task" as const, label: "Sans tâche" },
            ].map((item) => (
            <FilterChip
              key={item.key}
              onClick={() => setActiveFilter(item.key)}
              active={activeFilter === item.key}
            >
              {item.label}
            </FilterChip>
          ))}
        </div>

          {visibleReports.length > 0 ? (
            <div className="space-y-3">
              {visibleReports.map((report) => (
                <FieldReportRow
                  key={report.id}
                  canManageReports={canManageReports}
                  canManageTasks={canManageTasks}
                  report={report}
                  onOpen={(item) => setSelectedReportId(item.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Aucun retour dans ce filtre"
              description="Essayez un autre filtre ou créez un nouveau retour à traiter."
            />
          )}
        </Panel>
      </div>

      {selectedReport ? (
        <FieldReportDrawer
          canManageReports={canManageReports}
          canManageTasks={canManageTasks}
          citizens={citizens}
          onClose={() => setSelectedReportId(null)}
          pollingStations={pollingStations}
          report={selectedReport}
        />
      ) : null}
    </div>
  );
}
