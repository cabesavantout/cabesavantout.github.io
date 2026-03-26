import { Badge, PageHeader, Panel } from "@/components/ui";
import type { ElectoralAnalysisData } from "@/lib/postgres";

export function ElectoralAnalysisPage({
  data,
}: {
  data: ElectoralAnalysisData;
}) {
  return (
    <div>
      <PageHeader
        eyebrow="Données"
        title="Analyse électorale"
        description="Lecture simple des municipales 2026 tour 1 sur les bureaux validés."
      />

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel
          title="Score cumulé des candidats"
          subtitle={`${data.communeSummary.validatedBureaus} bureaux validés · ${new Intl.NumberFormat("fr-FR").format(data.communeSummary.totalValidatedVotes)} votes validés`}
        >
          <div className="space-y-4">
            {data.candidateScores.map((candidate) => (
              <div
                key={candidate.candidateLabel}
                className="rounded-2xl border border-line/70 bg-sand/70 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{candidate.candidateLabel}</p>
                    <p className="mt-1 text-sm text-ink/65">
                      {candidate.candidateGroup ?? "Sans nuance renseignée"}
                    </p>
                  </div>
                  <Badge tone="accent">
                    {candidate.votes} voix · {candidate.share.toFixed(2)} %
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Lecture bureau par bureau"
          subtitle="Participation et candidat arrivé en tête."
        >
          <div className="space-y-4">
            {data.bureauBreakdown.map((bureau) => (
              <article
                key={bureau.pollingStationCode}
                className="rounded-3xl border border-line/80 bg-white/80 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-medium">
                      Bureau {bureau.pollingStationCode} · {bureau.placeName}
                    </p>
                    <p className="mt-1 text-sm text-ink/65">
                      {bureau.exprimes} exprimés
                      {bureau.turnoutPct !== null
                        ? ` · ${bureau.turnoutPct.toFixed(2)} % de participation`
                        : ""}
                    </p>
                  </div>
                  {bureau.topCandidateLabel ? (
                    <Badge tone="pine">
                      {bureau.topCandidateVotes} voix · {bureau.topCandidateShare?.toFixed(2)} %
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-3 text-sm text-ink/70">
                  {bureau.topCandidateLabel ?? "Aucune tête détectée"}
                </p>
              </article>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel
          title="Croisement terrain et bureaux"
          subtitle="Repérer les bureaux où signaux terrain et lecture électorale se superposent."
        >
          <div className="space-y-4">
            {data.fieldOverlay.map((bureau) => (
              <article
                key={`overlay-${bureau.pollingStationCode}`}
                className="rounded-3xl border border-line/80 bg-sand/70 p-5"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="font-medium">
                      Bureau {bureau.pollingStationCode} · {bureau.placeName}
                    </p>
                    <p className="mt-1 text-sm text-ink/65">
                      {bureau.turnoutPct !== null
                        ? `${bureau.turnoutPct.toFixed(2)} % de participation`
                        : "Participation non disponible"}
                      {bureau.topCandidateLabel
                        ? ` · Tête ${bureau.topCandidateLabel}${bureau.topCandidateShare !== null ? ` (${bureau.topCandidateShare.toFixed(2)} %)` : ""}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="accent">{bureau.reportCount} retours</Badge>
                    {bureau.urgentCount > 0 ? (
                      <Badge tone="warning">{bureau.urgentCount} urgents</Badge>
                    ) : null}
                    {bureau.opposedOrSkepticalCount > 0 ? (
                      <Badge tone="warning">
                        {bureau.opposedOrSkepticalCount} réservés / opposés
                      </Badge>
                    ) : (
                      <Badge tone="pine">Aucun signal réservé/opposé</Badge>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-sm text-ink/70">
                  {bureau.reportCount === 0
                    ? "Aucun retour terrain rattaché à ce bureau pour le moment."
                    : bureau.urgentCount > 0 || bureau.opposedOrSkepticalCount > 0
                      ? "Bureau à surveiller de près : il combine déjà des remontées terrain qualifiées et des signaux d'irritation."
                      : "Bureau avec activité terrain remontée, sans alerte qualifiée majeure à ce stade."}
                </p>
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
