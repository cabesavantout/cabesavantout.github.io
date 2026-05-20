"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Badge, EmptyState, FilterChip, PageHeader, Panel, StatCard } from "@/components/ui";
import type { MandateTrackingData } from "@/lib/postgres";

type CommitmentStatus = MandateTrackingData["commitments"][number]["status"];
type PromiseFilter = "all" | "fragile" | "a_documenter" | "en_cours";

const statusLabel: Record<CommitmentStatus, string> = {
  annonce: "Annoncé",
  engage: "Engagé",
  en_cours: "En cours",
  fragile: "À risque",
  a_documenter: "À documenter",
};

const statusTone: Record<CommitmentStatus, "neutral" | "accent" | "pine" | "warning"> = {
  annonce: "neutral",
  engage: "accent",
  en_cours: "pine",
  fragile: "warning",
  a_documenter: "neutral",
};

const evidenceTone = {
  missing: "warning",
  partial: "neutral",
  complete: "pine",
} as const;

const evidenceLabel = {
  missing: "Preuve à compléter",
  partial: "Preuve partielle",
  complete: "Preuve disponible",
} as const;

function getPriorityRank(status: CommitmentStatus) {
  switch (status) {
    case "fragile":
      return 1;
    case "a_documenter":
      return 2;
    case "en_cours":
      return 3;
    default:
      return 4;
  }
}

function getRiskLevel(status: CommitmentStatus) {
  switch (status) {
    case "fragile":
      return { label: "Risque élevé", tone: "warning" as const };
    case "a_documenter":
      return { label: "Risque moyen", tone: "neutral" as const };
    case "en_cours":
      return { label: "Risque modéré", tone: "pine" as const };
    default:
      return null;
  }
}

function getEvidenceStatus(evidence: string) {
  const normalized = evidence.toLowerCase();

  if (normalized.includes("croisement") || normalized.includes("+") || normalized.includes("synthèse")) {
    return "complete" as const;
  }

  if (normalized.includes("rob") || normalized.includes("analyse")) {
    return "partial" as const;
  }

  return "missing" as const;
}

function getNextStep(commitment: MandateTrackingData["commitments"][number]) {
  if (commitment.status === "fragile") {
    return commitment.timeline;
  }

  if (commitment.status === "a_documenter") {
    return `Documenter la promesse : ${commitment.evidence}`;
  }

  if (commitment.status === "en_cours") {
    return commitment.timeline;
  }

  if (commitment.status === "engage") {
    return `Confirmer l'avancement réel : ${commitment.timeline}`;
  }

  return "Préciser le niveau d'engagement et la prochaine étape.";
}

function getCommitmentHref(commitment: MandateTrackingData["commitments"][number], documents: MandateTrackingData["sourceDocuments"]) {
  const matchingDocument = documents.find((document) =>
    commitment.evidence.toLowerCase().includes(document.label.toLowerCase()),
  );

  return matchingDocument?.href ?? "/budget";
}

function PromiseRow({
  commitment,
  documents,
}: {
  commitment: MandateTrackingData["commitments"][number];
  documents: MandateTrackingData["sourceDocuments"];
}) {
  const risk = getRiskLevel(commitment.status);
  const evidenceStatus = getEvidenceStatus(commitment.evidence);
  const href = getCommitmentHref(commitment, documents);

  return (
    <article className="rounded-[1.25rem] border border-line bg-elevated p-4">
      <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1.4fr)_auto_auto_minmax(0,1fr)_auto] lg:items-start">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink sm:text-base">{commitment.title}</p>
          <p className="mt-1 text-sm text-muted">{commitment.category}</p>
        </div>

        <Badge tone={statusTone[commitment.status]}>{statusLabel[commitment.status]}</Badge>

        {risk ? <Badge tone={risk.tone}>{risk.label}</Badge> : <span className="hidden lg:block" />}

        <div className="min-w-0">
          <p className="text-sm font-medium text-ink">Prochaine étape</p>
          <p className="mt-1 text-sm leading-6 text-muted">{getNextStep(commitment)}</p>
        </div>

        <div className="flex flex-col gap-2 lg:items-end">
          <Badge tone={evidenceTone[evidenceStatus]}>{evidenceLabel[evidenceStatus]}</Badge>
          <Link
            href={href}
            className="inline-flex min-h-[2.5rem] items-center justify-center gap-2 rounded-2xl bg-ink px-3.5 text-sm font-medium text-white transition hover:bg-ink/92"
          >
            Ouvrir
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

function DocumentRow({
  document,
}: {
  document: MandateTrackingData["sourceDocuments"][number];
}) {
  return (
    <article className="flex flex-col gap-3 rounded-[1.2rem] border border-line bg-elevated p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{document.label}</p>
        <p className="mt-1 text-sm leading-6 text-muted">{document.note}</p>
      </div>
      <Link
        href={document.href}
        className="inline-flex min-h-[2.5rem] shrink-0 items-center justify-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-sand"
      >
        Ouvrir
      </Link>
    </article>
  );
}

export function MandatePage({
  data,
}: {
  data: MandateTrackingData;
}) {
  const [activeFilter, setActiveFilter] = useState<PromiseFilter>("all");

  const sortedCommitments = useMemo(
    () =>
      [...data.commitments].sort((a, b) => {
        const rankDiff = getPriorityRank(a.status) - getPriorityRank(b.status);
        if (rankDiff !== 0) return rankDiff;
        return a.title.localeCompare(b.title, "fr");
      }),
    [data.commitments],
  );

  const visibleCommitments = useMemo(() => {
    const filtered =
      activeFilter === "all"
        ? sortedCommitments
        : sortedCommitments.filter((commitment) => commitment.status === activeFilter);

    return filtered.slice(0, 8);
  }, [activeFilter, sortedCommitments]);

  const sourceDocuments = data.sourceDocuments.slice(0, 4);
  const summary = useMemo(
    () => ({
      atRisk: data.commitments.filter((commitment) => commitment.status === "fragile").length,
      toDocument: data.commitments.filter((commitment) => commitment.status === "a_documenter").length,
      inProgress: data.commitments.filter((commitment) => commitment.status === "en_cours").length,
    }),
    [data.commitments],
  );

  return (
    <div>
      <PageHeader
        eyebrow="Promesses"
        title="Promesses"
        description="Les engagements à surveiller en priorité."
      />

      <section className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="À risque"
          value={String(summary.atRisk)}
          tone="warning"
          detail="Demandent une décision ou une relance."
        />
        <StatCard
          label="À documenter"
          value={String(summary.toDocument)}
          detail="Preuves encore trop faibles pour conclure."
        />
        <StatCard
          label="En cours"
          value={String(summary.inProgress)}
          tone="pine"
          detail="Suivi normal si la prochaine étape reste tenue."
        />
      </section>

      <div className="mt-6">
        <Panel
          title="Suivi des promesses"
          subtitle="Une ligne = une décision possible. Les promesses sont triées par niveau de vigilance."
        >
        <div className="mb-4 flex flex-wrap gap-2">
          {[
            { key: "all" as const, label: "Toutes" },
            { key: "fragile" as const, label: "À risque" },
            { key: "a_documenter" as const, label: "À documenter" },
            { key: "en_cours" as const, label: "En cours" },
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

        {visibleCommitments.length > 0 ? (
          <div className="space-y-3">
            {visibleCommitments.map((commitment) => (
              <PromiseRow key={commitment.id} commitment={commitment} documents={data.sourceDocuments} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucune promesse dans ce filtre"
            description="Changez le filtre ou ajoutez des engagements à suivre pour piloter le mandat."
          />
        )}
        </Panel>
      </div>

      <div className="mt-6">
        <Panel
          title="Actions secondaires"
          subtitle="Les sources à rouvrir pour vérifier une promesse ou documenter un arbitrage."
        >
          {sourceDocuments.length > 0 ? (
            <div className="space-y-3">
              {sourceDocuments.map((document) => (
                <DocumentRow key={document.label} document={document} />
              ))}
              <div className="flex flex-wrap gap-2 pt-2">
                <Link
                  href="/budget"
                  className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-sand"
                >
                  Ouvrir le budget
                </Link>
                <Link
                  href="/documents"
                  className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-sand"
                >
                  Voir tous les documents
                </Link>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Aucun document disponible"
              description="Ajoutez les sources de référence pour relier les promesses aux preuves utiles."
            />
          )}
        </Panel>
      </div>
    </div>
  );
}
