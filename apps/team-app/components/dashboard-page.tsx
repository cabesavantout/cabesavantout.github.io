import Link from "next/link";
import { ArrowRight, MapPinned } from "lucide-react";
import { EmptyState, PageHeader, Panel, StatCard } from "@/components/ui";
import type { DashboardData } from "@/lib/postgres";

type DecisionCardItem = {
  title: string;
  impact: string;
  nextStep: string;
  href: string;
  tone: "default" | "accent" | "pine";
  meta?: string;
};

function isPositiveCount(value: string | number) {
  return Number(value) > 0;
}

function findPriorityHighlight(data: DashboardData, label: string) {
  return data.priorityHighlights.find((item) => item.label === label);
}

function findTeamHighlight(data: DashboardData, label: string) {
  return data.teamHighlights.find((item) => item.label === label);
}

function buildDecisionCards(data: DashboardData): DecisionCardItem[] {
  const urgentReports = findPriorityHighlight(data, "Urgences terrain");
  const criticalTasks = findPriorityHighlight(data, "Tâches critiques");
  const nextMeeting = data.upcomingMeetings[0];
  const municipalCouncil = data.municipalCouncilPublication;
  const topSector = data.sectorAlerts[0];

  const decisions: DecisionCardItem[] = [];

  if (urgentReports && isPositiveCount(urgentReports.value)) {
    decisions.push({
      title: `${urgentReports.value} urgence${Number(urgentReports.value) > 1 ? "s" : ""} terrain ouverte${Number(urgentReports.value) > 1 ? "s" : ""}`,
      impact: urgentReports.summary,
      nextStep: "Qualifier les retours et déclencher une action terrain.",
      href: "/field-reports",
      tone: urgentReports.tone ?? "accent",
      meta: "Page concernée : Retours terrain",
    });
  }

  if (criticalTasks && isPositiveCount(criticalTasks.value)) {
    decisions.push({
      title: `${criticalTasks.value} tâche${Number(criticalTasks.value) > 1 ? "s" : ""} critique${Number(criticalTasks.value) > 1 ? "s" : ""} à relancer`,
      impact: criticalTasks.summary,
      nextStep: "Réaffecter, débloquer ou clôturer ce qui bloque l'exécution.",
      href: "/tasks",
      tone: criticalTasks.tone ?? "default",
      meta: "Page concernée : Tâches",
    });
  }

  if (nextMeeting) {
    decisions.push({
      title: nextMeeting.title,
      impact: `Réunion utile ${nextMeeting.startsAtLabel}${nextMeeting.location ? ` · ${nextMeeting.location}` : ""}.`,
      nextStep: "Préparer l'ordre du jour et les points à arbitrer.",
      href: "/meetings",
      tone: "default",
      meta: "Page concernée : Réunions",
    });
  }

  if (decisions.length < 3 && municipalCouncil) {
    decisions.push({
      title: municipalCouncil.isUpcoming
        ? "Conseil municipal publié"
        : "Dernier conseil municipal publié",
      impact: `${municipalCouncil.title} · ${municipalCouncil.startsAtLabel}${municipalCouncil.location ? ` · ${municipalCouncil.location}` : ""}.`,
      nextStep: municipalCouncil.isUpcoming
        ? "Vérifier la convocation, l'ordre du jour et les pièces associées."
        : "Relire la séance publiée et rattacher les documents ou décisions utiles.",
      href: "/meetings",
      tone: "pine",
      meta: "Page concernée : Réunions",
    });
  }

  if (decisions.length < 3 && topSector) {
    decisions.push({
      title: topSector.sectorLabel,
      impact:
        topSector.ownerName === null
          ? `Aucun responsable principal. ${topSector.urgentCount} urgence(s) et ${topSector.reportCount} retour(s) pèsent déjà sur ce secteur.`
          : `${topSector.urgentCount} urgence(s) et ${topSector.reportCount} retour(s) à suivre avec ${topSector.ownerName}.`,
      nextStep: "Vérifier la couverture terrain et décider s'il faut renforcer ce secteur.",
      href: "/team",
      tone: topSector.urgentCount > 0 || topSector.ownerName === null ? "accent" : "pine",
      meta: "Page concernée : Équipe",
    });
  }

  return decisions.slice(0, 3);
}

function buildSignalItems(data: DashboardData) {
  const urgentReports = findPriorityHighlight(data, "Urgences terrain");
  const criticalTasks = findPriorityHighlight(data, "Tâches critiques");
  const nextMeeting = data.upcomingMeetings[0];
  const municipalCouncil = data.municipalCouncilPublication;
  const items: SignalItem[] = [];

  if (urgentReports) {
    items.push({
      label: urgentReports.label,
      value: urgentReports.value,
      detail: urgentReports.summary,
      tone: urgentReports.tone ?? "accent",
    });
  }

  if (criticalTasks) {
    items.push({
      label: criticalTasks.label,
      value: criticalTasks.value,
      detail: criticalTasks.summary,
      tone: criticalTasks.tone ?? "default",
    });
  }

  if (nextMeeting) {
    items.push({
      label: "Prochaine réunion utile",
      value: nextMeeting.startsAtLabel,
      detail: `${nextMeeting.title}${nextMeeting.location ? ` · ${nextMeeting.location}` : ""}`,
      tone: "pine",
    });
  }

  if (items.length < 3 && municipalCouncil) {
    items.push({
      label: municipalCouncil.isUpcoming ? "Conseil municipal publié" : "Dernier conseil publié",
      value: municipalCouncil.startsAtLabel,
      detail: `${municipalCouncil.title}${municipalCouncil.location ? ` · ${municipalCouncil.location}` : ""}`,
      tone: "pine",
    });
  }

  return items.slice(0, 3);
}

function getSectorSummary(reportCount: number, urgentCount: number) {
  if (urgentCount > 0) {
    return `${urgentCount} urgence(s) ouverte(s) et ${reportCount} retour(s) dans ce secteur.`;
  }

  if (reportCount > 0) {
    return `${reportCount} retour(s) à suivre dans ce secteur.`;
  }

  return "Aucun retour ouvert, mais le secteur reste exposé dans le modèle actuel.";
}

function getSectorPriorityExplanation() {
  return "Le score monte quand un secteur n'a pas de responsable, cumule des urgences ou concentre plusieurs retours.";
}

function DecisionCard({ item }: { item: DecisionCardItem }) {
  const toneClass =
    item.tone === "accent"
      ? "border-accent/20 bg-accent/[0.06]"
      : item.tone === "pine"
        ? "border-pine/20 bg-pine/[0.06]"
        : "border-line bg-elevated";

  return (
    <Link
      href={item.href}
      className={`group flex h-full flex-col rounded-[1.4rem] border p-5 transition hover:bg-sand ${toneClass}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-base font-semibold text-ink">{item.title}</p>
        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5" aria-hidden />
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{item.impact}</p>
      <p className="mt-4 text-sm font-medium text-ink">Action suivante : {item.nextStep}</p>
      {item.meta ? <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted">{item.meta}</p> : null}
    </Link>
  );
}

function PrioritySectorCard({
  sector,
  coverageSummary,
}: {
  sector: DashboardData["sectorAlerts"][number];
  coverageSummary?: string;
}) {
  return (
    <article className="rounded-[1.4rem] border border-line bg-elevated p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <MapPinned className="h-4 w-4 text-muted" aria-hidden />
            <p className="text-base font-semibold text-ink">{sector.sectorLabel}</p>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">{getSectorSummary(sector.reportCount, sector.urgentCount)}</p>
        </div>
        <div className="rounded-2xl border border-line bg-panel px-3 py-2 text-right">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted">Score</p>
          <p className="mt-1 text-xl font-semibold text-ink">{sector.priorityScore}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-sm font-medium text-ink">
            Responsable : {sector.ownerName ?? "Aucun responsable principal"}
          </p>
          <p className="mt-1 text-sm text-muted">{getSectorPriorityExplanation()}</p>
          {coverageSummary ? <p className="mt-1 text-sm text-muted">{coverageSummary}</p> : null}
        </div>
        <Link
          href="/team"
          className="inline-flex min-h-[2.75rem] items-center justify-center rounded-2xl bg-ink px-4 text-sm font-medium text-white transition hover:bg-ink/92"
        >
          Ouvrir l'équipe
        </Link>
      </div>
    </article>
  );
}

export function DashboardPage({
  data,
}: {
  data: DashboardData;
}) {
  const decisions = buildDecisionCards(data);
  const signals = buildSignalItems(data);
  const topSector = data.sectorAlerts[0];
  const activeOwners = findTeamHighlight(data, "Responsables de secteur");

  return (
    <div>
      <PageHeader
        eyebrow="Dashboard"
        title="Dashboard"
        description="Les signaux qui demandent une décision aujourd’hui."
      />

      {signals.length > 0 ? (
        <section className="grid gap-3 sm:grid-cols-3">
          {signals.map((item) => (
            <StatCard key={item.label} label={item.label} value={item.value} tone={item.tone} detail={item.detail} />
          ))}
        </section>
      ) : (
        <div className="mt-2">
          <EmptyState
            title="Aucun signal consolidé"
            description="Le dashboard n'affiche ici que des repères réellement disponibles dans les modules métier."
          />
        </div>
      )}

      <div className="mt-6">
        <Panel
          title="Ce qu'il faut faire maintenant"
          subtitle="Trois arbitrages maximum pour savoir quoi faire maintenant."
        >
          {decisions.length > 0 ? (
            <div className="grid gap-4 xl:grid-cols-3">
              {decisions.map((item) => (
                <DecisionCard key={`${item.href}-${item.title}`} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Aucune décision urgente"
              description="Aucun signal prioritaire ne remonte aujourd'hui. Vous pouvez vérifier les promesses et la couverture terrain."
            />
          )}

          <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.25rem] border border-line bg-elevated p-4">
              <p className="text-sm font-semibold text-ink">Actions secondaires</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Si aucun arbitrage ne bloque, poursuivez avec les engagements ou la carte.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/mandate"
                  className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-sand"
                >
                  Voir les promesses
                </Link>
                <Link
                  href="/polling-stations"
                  className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-sand"
                >
                  Ouvrir la carte
                </Link>
              </div>
            </div>

            {topSector ? (
              <PrioritySectorCard
                sector={topSector}
                coverageSummary={
                  activeOwners
                    ? `${activeOwners.value} responsable(s) principal(aux) sont actuellement désignés dans l'équipe.`
                    : undefined
                }
              />
            ) : (
              <EmptyState
                title="Aucun secteur prioritaire"
                description="Aucun secteur ne remonte comme exposé aujourd'hui. Vous pouvez ouvrir la carte ou l'équipe pour une vérification rapide."
              />
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
