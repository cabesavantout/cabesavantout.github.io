import { assignSectorOwner } from "@/app/(app)/team/actions";
import { Badge, PageHeader, Panel } from "@/components/ui";
import type { ActiveUserOption, TeamCoverageData } from "@/lib/postgres";

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
  return (
    <div>
      <PageHeader
        eyebrow="Équipe"
        title="Couverture terrain"
        description="Voir qui couvre quoi et quels secteurs demandent une attention rapide."
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

      <div className="mb-6">
        <Panel
          title="Priorités de couverture"
          subtitle="Secteurs à traiter d'abord."
        >
          <div className="grid gap-4 xl:grid-cols-2">
            {data.priorityLeaders.map((sector) => (
              <article
                key={`priority-${sector.id}`}
                className="rounded-3xl border border-line/80 bg-white/80 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-medium">{sector.label}</p>
                    <p className="mt-1 text-sm text-ink/65">
                      {sector.pollingStationCode
                        ? `Bureau ${sector.pollingStationCode}`
                        : "Secteur non rattaché"}
                      {sector.topCandidateLabel
                        ? ` · Tête ${sector.topCandidateLabel}${sector.topCandidateShare !== null ? ` (${sector.topCandidateShare.toFixed(2)} %)` : ""}`
                        : ""}
                    </p>
                  </div>
                  <Badge tone="warning">Score {sector.priorityScore}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge tone={sector.primaryOwnerId ? "pine" : "warning"}>
                    {sector.primaryOwnerId ? "Responsable affecté" : "Sans responsable"}
                  </Badge>
                  <Badge tone="neutral">{sector.reportCount} retours</Badge>
                  {sector.urgentReportCount > 0 ? (
                    <Badge tone="warning">{sector.urgentReportCount} urgents</Badge>
                  ) : null}
                  {sector.turnoutPct !== null ? (
                    <Badge tone="accent">{sector.turnoutPct.toFixed(2)} % participation</Badge>
                  ) : null}
                </div>
                <p className="mt-4 text-sm text-ink/70">
                  {sector.primaryOwnerId
                    ? "Secteur couvert, mais à suivre selon les signaux remontés."
                    : "Secteur à couvrir rapidement : il reste sans responsable principal."}
                </p>
              </article>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mb-6 grid gap-6 xl:grid-cols-3">
        <Panel
          title="À affecter cette semaine"
          subtitle="Secteurs sans responsable."
        >
          <div className="space-y-3">
            {data.actionBuckets.assignThisWeek.length === 0 ? (
              <p className="text-sm text-ink/65">Aucun secteur sans responsable à ce stade.</p>
            ) : data.actionBuckets.assignThisWeek.map((sector) => (
              <div
                key={`assign-${sector.id}`}
                className="rounded-2xl border border-line/70 bg-white/80 p-4"
              >
                <p className="font-medium">{sector.label}</p>
                <p className="mt-1 text-sm text-ink/65">
                  Score {sector.priorityScore} · {sector.reportCount} retours
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="À revoir politiquement"
          subtitle="Urgences ou faiblesse locale."
        >
          <div className="space-y-3">
            {data.actionBuckets.reviewPolitically.length === 0 ? (
              <p className="text-sm text-ink/65">Aucune alerte politique forte détectée.</p>
            ) : data.actionBuckets.reviewPolitically.map((sector) => (
              <div
                key={`review-${sector.id}`}
                className="rounded-2xl border border-line/70 bg-white/80 p-4"
              >
                <p className="font-medium">{sector.label}</p>
                <p className="mt-1 text-sm text-ink/65">
                  {sector.urgentReportCount} urgents
                  {sector.topCandidateShare !== null
                    ? ` · Tête locale ${sector.topCandidateShare.toFixed(2)} %`
                    : ""}
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="À transformer en action terrain"
          subtitle="Secteurs déjà couverts avec matière exploitable."
        >
          <div className="space-y-3">
            {data.actionBuckets.activateField.length === 0 ? (
              <p className="text-sm text-ink/65">Aucun secteur couvert avec signal activable pour le moment.</p>
            ) : data.actionBuckets.activateField.map((sector) => (
              <div
                key={`activate-${sector.id}`}
                className="rounded-2xl border border-line/70 bg-white/80 p-4"
              >
                <p className="font-medium">{sector.label}</p>
                <p className="mt-1 text-sm text-ink/65">
                  {sector.primaryOwnerName ?? "Responsable non renseigné"} · {sector.reportCount} retours · {sector.citizenCount} fiches
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel
        title="Secteurs"
        subtitle="Un secteur par bureau de vote pour le MVP."
      >
        <div className="space-y-4">
          {data.sectors.map((sector) => (
            <article
              key={sector.id}
              className="rounded-3xl border border-line/80 bg-sand/70 p-5"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="font-medium">{sector.label}</p>
                  <p className="mt-1 text-sm text-ink/65">
                    {sector.pollingStationCode
                      ? `Bureau ${sector.pollingStationCode}`
                      : "Secteur non rattaché"}
                    {sector.neighborhood ? ` · ${sector.neighborhood}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={sector.primaryOwnerId ? "pine" : "warning"}>
                    {sector.primaryOwnerId ? "Couvert" : "Sans responsable"}
                  </Badge>
                  <Badge tone="warning">Score {sector.priorityScore}</Badge>
                  <Badge tone="accent">{sector.citizenCount} fiches</Badge>
                  <Badge tone="neutral">{sector.reportCount} retours</Badge>
                  {sector.urgentReportCount > 0 ? (
                    <Badge tone="warning">{sector.urgentReportCount} urgents</Badge>
                  ) : null}
                </div>
              </div>

              <p className="mt-3 text-sm text-ink/70">
                Responsable actuel : {sector.primaryOwnerName ?? "non attribué"}
              </p>
              <p className="mt-2 text-sm text-ink/65">
                {sector.turnoutPct !== null
                  ? `Participation ${sector.turnoutPct.toFixed(2)} %`
                  : "Participation non disponible"}
                {sector.topCandidateLabel
                  ? ` · Tête ${sector.topCandidateLabel}${sector.topCandidateShare !== null ? ` (${sector.topCandidateShare.toFixed(2)} %)` : ""}`
                  : ""}
              </p>

              {canManageTeam ? (
                <form action={assignSectorOwner} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <input type="hidden" name="sectorId" value={sector.id} />
                  <select
                    className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
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
                  <button
                    className="rounded-2xl border border-line bg-white px-4 py-3 text-sm font-medium text-ink transition hover:bg-sand"
                    type="submit"
                  >
                    Enregistrer
                  </button>
                </form>
              ) : null}
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}
