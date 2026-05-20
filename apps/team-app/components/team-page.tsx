"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { assignSectorOwner } from "@/app/(app)/team/actions";
import {
  Badge,
  Button,
  EmptyState,
  Notice,
  PageHeader,
  Panel,
  StatCard,
} from "@/components/ui";
import type { ActiveUserOption, SectorCoverageItem, TeamCoverageData } from "@/lib/postgres";

type SectorFilter = "all" | "unassigned" | "urgent" | "covered" | "watch";
type CoverageStatus = "covered" | "unassigned" | "partial";

function getCoverageStatus(sector: SectorCoverageItem): CoverageStatus {
  if (!sector.primaryOwnerId) return "unassigned";
  if (sector.urgentReportCount > 0 || sector.reportCount > 0) return "partial";
  return "covered";
}

function getCoverageLabel(status: CoverageStatus) {
  if (status === "unassigned") return "À affecter";
  if (status === "partial") return "À suivre";
  return "Couvert";
}

function getCoverageTone(status: CoverageStatus) {
  if (status === "unassigned") return "warning" as const;
  if (status === "partial") return "accent" as const;
  return "pine" as const;
}

function getPriorityExplanation(sector: SectorCoverageItem) {
  if (!sector.primaryOwnerId) {
    return "Le secteur n'a pas encore de responsable principal.";
  }

  if (sector.urgentReportCount > 0) {
    return "Des urgences terrain demandent une couverture plus serrée.";
  }

  if (sector.reportCount > 0) {
    return "Le volume de retours demande un suivi actif du secteur.";
  }

  return "La couverture est en place et les signaux restent limités.";
}

function getNextAction(sector: SectorCoverageItem) {
  if (!sector.primaryOwnerId) {
    return "Affecter un responsable principal aujourd'hui.";
  }

  if (sector.urgentReportCount > 0) {
    return "Ouvrir les retours terrain et vérifier le plan d'action.";
  }

  if (sector.reportCount > 0) {
    return "Coordonner le responsable et prioriser les signaux remontés.";
  }

  return "Maintenir la couverture et suivre les prochains signaux.";
}

function matchesFilter(sector: SectorCoverageItem, filter: SectorFilter) {
  const status = getCoverageStatus(sector);

  switch (filter) {
    case "unassigned":
      return status === "unassigned";
    case "urgent":
      return sector.urgentReportCount > 0;
    case "covered":
      return status === "covered";
    case "watch":
      return status === "partial";
    default:
      return true;
  }
}

function compareSectors(left: SectorCoverageItem, right: SectorCoverageItem) {
  const priorityDiff = right.priorityScore - left.priorityScore;
  if (priorityDiff !== 0) return priorityDiff;

  const urgentDiff = right.urgentReportCount - left.urgentReportCount;
  if (urgentDiff !== 0) return urgentDiff;

  return left.priorityRank - right.priorityRank;
}

function PrioritySectorCard({
  sector,
  canManageTeam,
  onAssign,
}: {
  sector: SectorCoverageItem;
  canManageTeam: boolean;
  onAssign: (sector: SectorCoverageItem) => void;
}) {
  const status = getCoverageStatus(sector);

  return (
    <article className="rounded-[1.5rem] border border-line bg-panel p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={getCoverageTone(status)}>{getCoverageLabel(status)}</Badge>
          </div>

          <h2 className="section-title mt-4 text-[1.35rem] font-semibold leading-tight text-ink sm:text-[1.55rem]">
            {sector.label}
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted">
            {sector.pollingStationCode ? `Zone ${sector.pollingStationCode}` : "Secteur non rattaché"}
            {sector.neighborhood ? ` · ${sector.neighborhood}` : ""}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="neutral">{sector.reportCount} retours terrain</Badge>
            {sector.urgentReportCount > 0 ? (
              <Badge tone="warning">{sector.urgentReportCount} urgent(s)</Badge>
            ) : null}
            {sector.turnoutPct !== null ? (
              <Badge tone="accent">{sector.turnoutPct.toFixed(1)} % participation</Badge>
            ) : null}
          </div>

          <div className="mt-4 space-y-2 text-sm leading-6 text-muted">
            <p>
              <span className="font-medium text-ink">Couverture</span>
              {` · ${getPriorityExplanation(sector)}`}
            </p>
            <p>
              <span className="font-medium text-ink">Action suivante</span>
              {` · ${getNextAction(sector)}`}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {canManageTeam ? (
            <Button type="button" onClick={() => onAssign(sector)}>
              Assigner
            </Button>
          ) : null}
          <Link
            href="/field-reports"
            className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-elevated"
          >
            Voir les retours
          </Link>
          <Link
            href="/polling-stations"
            className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-elevated"
          >
            Ouvrir la carte
          </Link>
        </div>
      </div>
    </article>
  );
}

function SectorRow({
  sector,
  canManageTeam,
  onAssign,
}: {
  sector: SectorCoverageItem;
  canManageTeam: boolean;
  onAssign: (sector: SectorCoverageItem) => void;
}) {
  const status = getCoverageStatus(sector);
  const signals =
    sector.urgentReportCount > 0
      ? `${sector.urgentReportCount} urgent(s)`
      : sector.reportCount > 0
        ? `${sector.reportCount} retours`
        : "Peu de signaux";

  return (
    <article className="rounded-[1.25rem] border border-line bg-elevated p-4">
      <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_auto_auto_auto] xl:items-center">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink sm:text-base">{sector.label}</p>
          <p className="mt-1 text-sm leading-6 text-muted">
            {sector.pollingStationCode ? `Zone ${sector.pollingStationCode}` : "Secteur non rattaché"}
            {sector.neighborhood ? ` · ${sector.neighborhood}` : ""}
          </p>
        </div>

        <div className="min-w-0 text-sm text-muted">
          {sector.primaryOwnerName ?? "Non assigné"}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={getCoverageTone(status)}>{getCoverageLabel(status)}</Badge>
        </div>

        <div className="text-sm text-muted">{signals}</div>

        <div className="flex justify-start xl:justify-end">
          {canManageTeam ? (
            <Button type="button" variant="secondary" onClick={() => onAssign(sector)}>
              Assigner
            </Button>
          ) : (
            <Link
              href="/field-reports"
              className="text-sm font-medium text-ink underline-offset-4 hover:underline"
            >
              Voir les retours
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function AssignDrawer({
  sector,
  activeUsers,
  onClose,
}: {
  sector: SectorCoverageItem;
  activeUsers: ActiveUserOption[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Fermer l'affectation"
        className="absolute inset-0 bg-ink/30"
        onClick={onClose}
      />

      <aside className="absolute inset-y-0 right-0 w-full max-w-xl overflow-y-auto border-l border-line bg-base shadow-panel">
        <div className="sticky top-0 z-10 border-b border-line bg-base/95 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="section-title text-[1.3rem] font-semibold text-ink">Assigner un responsable</h2>
              <p className="mt-1 text-sm leading-6 text-muted">{sector.label}</p>
            </div>
            <Button type="button" variant="secondary" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>

        <div className="space-y-6 px-4 py-5 sm:px-6">
          <Panel
            title="Lecture du secteur"
            subtitle="Les signaux utiles pour décider où affecter l'équipe."
          >
            <div className="space-y-3 text-sm leading-6 text-muted">
              <p>
                <span className="font-medium text-ink">Couverture</span>
                {` · ${getPriorityExplanation(sector)}`}
              </p>
              <p>
                <span className="font-medium text-ink">Action suivante</span>
                {` · ${getNextAction(sector)}`}
              </p>
            </div>
          </Panel>

          <Panel
            title="Affectation"
            subtitle="Choisir un responsable principal pour couvrir le secteur."
          >
            <form action={assignSectorOwner} className="grid gap-4">
              <input type="hidden" name="sectorId" value={sector.id} />
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink">Responsable principal</span>
                <select
                  className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                  name="userId"
                  defaultValue={sector.primaryOwnerId ?? ""}
                >
                  <option value="">Aucun responsable</option>
                  {activeUsers.map((user) => (
                    <option key={`${sector.id}-${user.id}`} value={user.id}>
                      {user.fullName}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex justify-end">
                <Button type="submit">Enregistrer</Button>
              </div>
            </form>
          </Panel>
        </div>
      </aside>
    </div>
  );
}

export function TeamPage({
  activeUsers,
  canManageTeam,
  data,
  error,
  success,
}: {
  activeUsers: ActiveUserOption[];
  canManageTeam: boolean;
  data: TeamCoverageData;
  error?: string;
  success?: string;
}) {
  const [activeFilter, setActiveFilter] = useState<SectorFilter>("all");
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);

  const coveredCount =
    typeof data.coveredCount === "number"
      ? data.coveredCount
      : data.sectors.filter((sector) => Boolean(sector.primaryOwnerId)).length;
  const uncoveredCount =
    typeof data.uncoveredCount === "number"
      ? data.uncoveredCount
      : data.sectors.filter((sector) => !sector.primaryOwnerId).length;
  const urgentSectorCount =
    typeof data.urgentSectorCount === "number"
      ? data.urgentSectorCount
      : data.sectors.filter((sector) => sector.urgentReportCount > 0).length;

  const sortedSectors = useMemo(() => [...data.sectors].sort(compareSectors), [data.sectors]);
  const prioritySectors = useMemo(() => sortedSectors.slice(0, 5), [sortedSectors]);
  const visibleSectors = useMemo(
    () => sortedSectors.filter((sector) => matchesFilter(sector, activeFilter)),
    [sortedSectors, activeFilter],
  );
  const selectedSector = sortedSectors.find((sector) => sector.id === selectedSectorId) ?? null;

  return (
    <div>
      <PageHeader
        eyebrow="Territoire"
        title="Équipe terrain"
        description="Voir où la couverture manque et où renforcer la présence en priorité."
      />

      {success ? <Notice>{success}</Notice> : null}
      {error ? <Notice tone="error">{error}</Notice> : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Secteurs couverts"
          value={String(coveredCount)}
          tone="pine"
          detail="Ont déjà un responsable principal."
        />
        <StatCard
          label="Sans responsable"
          value={String(uncoveredCount)}
          tone="accent"
          detail="Demandent une affectation prioritaire."
        />
        <StatCard
          label="Secteurs urgents"
          value={String(urgentSectorCount)}
          tone="default"
          detail="Ont au moins un signal terrain urgent."
        />
      </div>

      <div className="mt-6 space-y-6">
        <Panel
          title="Secteurs à traiter maintenant"
          subtitle="Les zones sans responsable ou déjà actives dans les remontées terrain."
        >
          {prioritySectors.length > 0 ? (
            <div className="space-y-4">
              {prioritySectors.map((sector) => (
                <PrioritySectorCard
                  key={sector.id}
                  canManageTeam={canManageTeam}
                  sector={sector}
                  onAssign={(item) => setSelectedSectorId(item.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Aucun secteur à traiter"
              description="La couverture est stable pour le moment. Revenez dès que de nouveaux signaux terrain remontent."
            />
          )}
        </Panel>

        <Panel
          title="Liste des secteurs"
          subtitle="Vue compacte pour arbitrer vite, filtrer puis affecter."
        >
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              { key: "all" as const, label: "Tous" },
              { key: "unassigned" as const, label: "Sans responsable" },
              { key: "urgent" as const, label: "Urgents" },
              { key: "covered" as const, label: "Couverts" },
              { key: "watch" as const, label: "À surveiller" },
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

          {visibleSectors.length > 0 ? (
            <div className="space-y-3">
              {visibleSectors.map((sector) => (
                <SectorRow
                  key={sector.id}
                  canManageTeam={canManageTeam}
                  sector={sector}
                  onAssign={(item) => setSelectedSectorId(item.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Aucun secteur pour ce filtre"
              description="Essayez un autre filtre pour revoir la couverture ou les urgences."
            />
          )}
        </Panel>
      </div>

      {selectedSector ? (
        <AssignDrawer
          activeUsers={activeUsers}
          sector={selectedSector}
          onClose={() => setSelectedSectorId(null)}
        />
      ) : null}
    </div>
  );
}
