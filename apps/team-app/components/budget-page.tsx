"use client";

import { EmptyState, PageHeader, Panel, StatCard } from "@/components/ui";
import type { BudgetPageData } from "@/lib/postgres";

function formatDocumentType(value: string) {
  return value.replaceAll("_", " ");
}

function getInsightImpact(title: string) {
  if (title.toLowerCase().includes("2026")) {
    return "Impact: fixe le récit politique à préparer pour la prochaine séquence budgétaire.";
  }

  if (title.toLowerCase().includes("2024")) {
    return "Impact: permet de confronter l'exécution réelle aux promesses et au discours municipal.";
  }

  return "Impact: sert à objectiver les engagements votés et les marges de contestation.";
}

function getRowStatus(row: BudgetPageData["comparisonRows"][number]) {
  const current = row.values.find((value) => value.yearLabel === "2025" || value.yearLabel === "2026");
  const label = `${row.label} ${current?.value ?? ""} ${row.values.map((value) => value.note).join(" ")}`.toLowerCase();

  if (label.includes("à consolider") || label.includes("à relire") || label.includes("reprise")) {
    return { label: "À surveiller", tone: "warning" as const };
  }

  if (label.includes("≈") || label.includes("dette")) {
    return { label: "Point sensible", tone: "warning" as const };
  }

  if (label.includes("plus gros poste") || label.includes("visible")) {
    return { label: "Structurant", tone: "accent" as const };
  }

  return { label: "Stable", tone: "pine" as const };
}

function prioritizeRows(data: BudgetPageData) {
  const rows = data.comparisonRows.map((row) => ({
    ...row,
    status: getRowStatus(row),
  }));

  return rows
    .sort((left, right) => {
      const weight = { "À surveiller": 0, "Point sensible": 1, Structurant: 2, Stable: 3 };
      return weight[left.status.label as keyof typeof weight] - weight[right.status.label as keyof typeof weight];
    })
    .slice(0, 5);
}

function prioritizeDocuments(data: BudgetPageData) {
  return [...data.documents]
    .sort((left, right) => {
      const leftPriority = left.documentType === "rapport_orientation_budgetaire" ? 0 : left.documentType === "budget_primitif" ? 1 : 2;
      const rightPriority = right.documentType === "rapport_orientation_budgetaire" ? 0 : right.documentType === "budget_primitif" ? 1 : 2;
      if (leftPriority !== rightPriority) return leftPriority - rightPriority;
      return Number(right.yearLabel) - Number(left.yearLabel);
    })
    .slice(0, 5);
}

function getDocumentReason(document: BudgetPageData["documents"][number]) {
  if (document.documentType === "rapport_orientation_budgetaire") {
    return "À ouvrir pour lire les arbitrages annoncés et les priorités affichées.";
  }

  if (document.documentType === "budget_primitif") {
    return "À ouvrir pour vérifier les crédits votés et les projets mis en avant.";
  }

  if (document.documentType === "cfu_principal") {
    return "À ouvrir pour confronter le discours municipal à l'exécution réelle.";
  }

  return "À ouvrir pour vérifier le niveau de preuve budgétaire.";
}

export function BudgetPage({ data }: { data: BudgetPageData }) {
  const strategicInsights = data.strategicReadings.slice(0, 3);
  const importantRows = prioritizeRows(data);
  const priorityDocuments = prioritizeDocuments(data);
  const municipalDocuments = data.municipalDocuments.slice(0, 4);

  return (
    <div>
      <PageHeader
        eyebrow="Budget"
        title="Budget"
        description="Voir tout de suite quelles pieces rouvrir et quels repères budgetaires changent vraiment la lecture politique."
      />

      <section className="grid gap-3 sm:grid-cols-3">
        {data.stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} tone={stat.tone ?? "default"} />
        ))}
      </section>

      <div className="mt-6">
        <Panel
          title="Pieces budgetaires a rouvrir"
          subtitle="Les documents qui donnent le plus de matiere pour argumenter ou contester."
        >
          {priorityDocuments.length > 0 ? (
            <div className="grid gap-3 lg:grid-cols-2">
              {priorityDocuments.map((document) => (
                <article key={document.slug} className="rounded-[1.25rem] border border-line bg-elevated p-4">
                  <p className="text-sm font-semibold text-ink">
                    {document.yearLabel} · {formatDocumentType(document.documentType)}
                  </p>
                  <p className="mt-1 text-sm text-muted">{getDocumentReason(document)}</p>
                  <p className="mt-2 text-sm text-muted">{document.slug}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      className="inline-flex items-center rounded-2xl border border-line bg-panel px-4 py-2.5 text-sm font-medium text-ink hover:bg-sand"
                      href={`/api/documents?path=${encodeURIComponent(document.sourcePdf)}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Ouvrir
                    </a>
                    <a
                      className="inline-flex items-center rounded-2xl border border-line bg-panel px-4 py-2.5 text-sm font-medium text-ink hover:bg-sand"
                      href={`/api/documents?path=${encodeURIComponent(document.sourcePdf)}`}
                      rel="noreferrer"
                      target="_blank"
                      download
                    >
                      Télécharger
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Aucun document prioritaire"
              description="Aucun document budgétaire prioritaire n'est disponible pour le moment."
            />
          )}
        </Panel>
      </div>

      <div className="mt-6">
        <Panel
          title="Ce qu'il faut retenir"
          subtitle="Les lectures qui changent réellement l'argumentaire politique."
        >
        {strategicInsights.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {strategicInsights.map((item) => (
              <article key={item.title} className="rounded-[1.25rem] border border-line bg-elevated p-5">
                <p className="text-sm font-medium text-muted">{item.title}</p>
                <p className="mt-3 text-sm leading-6 text-ink">{item.summary}</p>
                <p className="mt-3 text-sm leading-6 text-muted">{getInsightImpact(item.title)}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucune lecture stratégique"
            description="Les documents budgétaires ne permettent pas encore de formuler un cadrage utile."
          />
        )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel
          title="Comparaison 2024 / 2025 / 2026"
          subtitle="Seulement les lignes utiles pour comprendre les écarts et les points sensibles."
        >
          {importantRows.length > 0 ? (
            <div className="space-y-4">
              {importantRows.map((row) => (
                <article key={row.label} className="rounded-[1.25rem] border border-line bg-elevated p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-ink">{row.label}</p>
                      <p className="mt-1 text-sm text-muted">{row.status.label}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full border border-line bg-panel px-3 py-1 text-xs font-medium text-ink">
                      {row.status.label}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {row.values.map((item) => (
                      <div key={`${row.label}-${item.yearLabel}`} className="rounded-2xl border border-line bg-panel px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-muted">{item.yearLabel}</p>
                        <p className="mt-2 text-base font-semibold text-ink">{item.value}</p>
                        <p className="mt-1 text-sm text-muted">{item.sourceLabel}</p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-muted">
                    {row.values[row.values.length - 1]?.note ?? row.values[0]?.note}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Aucune comparaison utile"
              description="Aucune ligne budgétaire prioritaire n'est disponible pour le moment."
            />
          )}
        </Panel>

        <Panel
          title="Sources mairie détectées"
          subtitle="Liens repérés automatiquement sur les actes municipaux pour compléter la lecture budgétaire."
        >
          {municipalDocuments.length > 0 ? (
            <div className="space-y-3">
              {municipalDocuments.map((document) => (
                <article key={document.href} className="rounded-[1.25rem] border border-line bg-elevated p-4">
                  <p className="text-sm font-semibold text-ink">{document.label}</p>
                  <p className="mt-1 text-sm text-muted">{document.note}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      className="inline-flex items-center rounded-2xl border border-line bg-panel px-4 py-2.5 text-sm font-medium text-ink hover:bg-sand"
                      href={document.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Ouvrir la source mairie
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Aucune source mairie détectée"
              description="Le refresh des actes municipaux ajoutera ici les pièces budgétaires repérées sur le site de la mairie."
            />
          )}
        </Panel>
      </div>
    </div>
  );
}
