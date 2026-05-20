"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Badge, EmptyState, FilterChip, PageHeader, Panel } from "@/components/ui";
import type { SearchResultsData } from "@/lib/postgres";

const supportLevelLabels: Record<string, string> = {
  unknown: "Soutien inconnu",
  opposed: "Opposition",
  skeptical: "Réservé",
  neutral: "Neutre",
  supportive: "Favorable",
  volunteer: "Volontaire",
};

const fieldReportStatusLabels: Record<string, string> = {
  new: "Nouveau",
  qualified: "Qualifié",
  in_progress: "En traitement",
  closed: "Clos",
};

const taskStatusLabels: Record<string, string> = {
  todo: "À faire",
  in_progress: "En cours",
  blocked: "Bloquée",
  done: "Terminée",
  cancelled: "Annulée",
};

const taskPriorityLabels: Record<string, string> = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
  critical: "Critique",
};

const contactKindLabels: Record<string, string> = {
  media: "Presse",
  institution: "Institution",
  partner: "Partenaire",
  volunteer: "Bénévole",
  supporter: "Relais",
  other: "Contact",
};

type SearchFilter = "all" | "citizen" | "field_report" | "task" | "contact";

type SearchResult = {
  id: string;
  type: "citizen" | "field_report" | "task" | "contact";
  title: string;
  subtitle?: string;
  meta?: string;
  status?: string;
  priority?: string;
  href: string;
  score: number;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getMatchScore(query: string, ...candidates: Array<string | null | undefined>) {
  const q = normalize(query);
  let best = 0;

  for (const candidate of candidates) {
    const text = normalize(candidate ?? "");

    if (!text) continue;
    if (text === q) best = Math.max(best, 120);
    else if (text.startsWith(q)) best = Math.max(best, 90);
    else if (text.includes(q)) best = Math.max(best, 60);
  }

  return best;
}

function getUrgencyBonus(type: SearchResult["type"], status?: string, priority?: string) {
  if (type === "field_report") {
    if (priority === "critical") return 45;
    if (priority === "high") return 35;
    if (status === "new") return 18;
    if (status === "in_progress") return 12;
  }

  if (type === "task") {
    if (priority === "critical") return 40;
    if (status === "blocked") return 30;
    if (priority === "high") return 20;
    if (status === "in_progress") return 12;
  }

  return 0;
}

function getTypeLabel(type: SearchResult["type"]) {
  return {
    citizen: "Citoyen",
    field_report: "Terrain",
    task: "Tâche",
    contact: "Contact",
  }[type];
}

function getTypeTone(type: SearchResult["type"]) {
  switch (type) {
    case "citizen":
      return "neutral" as const;
    case "field_report":
      return "accent" as const;
    case "task":
      return "warning" as const;
    case "contact":
      return "pine" as const;
  }
}

function SearchResultRow({ result }: { result: SearchResult }) {
  return (
    <article className="rounded-[1.25rem] border border-line bg-elevated p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={getTypeTone(result.type)}>{getTypeLabel(result.type)}</Badge>
            {result.status ? <Badge tone="neutral">{result.status}</Badge> : null}
            {result.priority ? <Badge tone="warning">{result.priority}</Badge> : null}
          </div>
          <p className="mt-3 text-sm font-semibold text-ink sm:text-base">{result.title}</p>
          {result.subtitle ? <p className="mt-1 text-sm text-muted">{result.subtitle}</p> : null}
          {result.meta ? <p className="mt-2 text-sm leading-6 text-muted">{result.meta}</p> : null}
        </div>

        <Link
          href={result.href}
          className="inline-flex min-h-[2.5rem] shrink-0 items-center justify-center gap-2 rounded-2xl bg-ink px-3.5 text-sm font-medium text-white transition hover:bg-ink/92"
        >
          Ouvrir
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

function SearchResultList({
  title,
  subtitle,
  results,
  href,
}: {
  title: string;
  subtitle: string;
  results: SearchResult[];
  href: string;
}) {
  return (
    <Panel
      title={title}
      subtitle={subtitle}
      actions={
        results.length > 0 ? (
          <Link href={href} className="text-sm font-medium text-ink underline-offset-4 hover:underline">
            Voir tout
          </Link>
        ) : null
      }
    >
      {results.length > 0 ? (
        <div className="space-y-3">
          {results.map((result) => (
            <SearchResultRow key={`${result.type}-${result.id}`} result={result} />
          ))}
        </div>
      ) : (
        <EmptyState title="Aucun résultat" description={`Aucun résultat utile dans ${title.toLowerCase()}.`} />
      )}
    </Panel>
  );
}

export function SearchPage({
  data,
}: {
  data: SearchResultsData;
}) {
  const [activeFilter, setActiveFilter] = useState<SearchFilter>("all");

  const allResults = useMemo<SearchResult[]>(() => {
    const citizens = data.citizens.map((citizen, index) => ({
      id: citizen.id,
      type: "citizen" as const,
      title: citizen.fullName,
      subtitle: supportLevelLabels[citizen.supportLevel] ?? citizen.supportLevel,
      meta: citizen.pollingStationCode ? `Bureau ${citizen.pollingStationCode} · Ouvrir la fiche citoyen.` : "Ouvrir la fiche citoyen.",
      href: "/citizens",
      score:
        getMatchScore(data.query, citizen.fullName, citizen.pollingStationCode) +
        Math.max(0, 12 - index),
    }));

    const fieldReports = data.fieldReports.map((report, index) => ({
      id: report.id,
      type: "field_report" as const,
      title: report.topic ?? "Retour terrain",
      subtitle: report.citizenName ?? (report.pollingStationCode ? `Bureau ${report.pollingStationCode}` : undefined),
      meta: `${report.summary}${report.reportedAtLabel ? ` · ${report.reportedAtLabel}` : ""}`,
      status: fieldReportStatusLabels[report.status] ?? report.status,
      priority: taskPriorityLabels[report.priority] ?? report.priority,
      href: "/field-reports",
      score:
        getMatchScore(data.query, report.topic, report.summary, report.citizenName, report.pollingStationCode) +
        getUrgencyBonus("field_report", report.status, report.priority) +
        Math.max(0, 12 - index),
    }));

    const tasks = data.tasks.map((task, index) => ({
      id: task.id,
      type: "task" as const,
      title: task.title,
      subtitle: task.ownerName ? `Responsable : ${task.ownerName}` : "Aucun responsable affiché",
      meta: task.updatedAtLabel ? `Dernière mise à jour ${task.updatedAtLabel} · Ouvrir la tâche.` : "Ouvrir la tâche.",
      status: taskStatusLabels[task.status] ?? task.status,
      priority: taskPriorityLabels[task.priority] ?? task.priority,
      href: "/tasks",
      score:
        getMatchScore(data.query, task.title, task.ownerName) +
        getUrgencyBonus("task", task.status, task.priority) +
        Math.max(0, 12 - index),
    }));

    const contacts = data.contacts.map((contact, index) => ({
      id: contact.id,
      type: "contact" as const,
      title: contact.fullName,
      subtitle: contact.organization ?? (contact.roleLabel ?? contactKindLabels[contact.contactKind] ?? "Contact"),
      meta: [
        contact.roleLabel,
        contact.phone,
        contact.email,
        contact.updatedAtLabel ? `Mis à jour ${contact.updatedAtLabel}` : null,
      ]
        .filter(Boolean)
        .join(" · "),
      href: "/contacts",
      score:
        getMatchScore(
          data.query,
          contact.fullName,
          contact.organization,
          contact.roleLabel,
          contact.email,
          contact.phone,
        ) + Math.max(0, 12 - index),
    }));

    return [...citizens, ...fieldReports, ...tasks, ...contacts].sort((a, b) => b.score - a.score);
  }, [data]);

  const bestResults = useMemo(() => {
    if (activeFilter === "all") return allResults.slice(0, 8);
    return allResults.filter((result) => result.type === activeFilter).slice(0, 8);
  }, [activeFilter, allResults]);

  const citizenResults = allResults.filter((result) => result.type === "citizen").slice(0, 4);
  const fieldReportResults = allResults.filter((result) => result.type === "field_report").slice(0, 4);
  const taskResults = allResults.filter((result) => result.type === "task").slice(0, 4);
  const contactResults = allResults.filter((result) => result.type === "contact").slice(0, 4);
  const totalResults = allResults.length;

  return (
    <div>
      <PageHeader
        eyebrow="Recherche"
        title="Recherche"
        description="Retrouver une information ou une action en quelques secondes."
      />

      <Panel title="Recherche" subtitle="Un point d'accès rapide vers les citoyens, retours terrain, tâches et contacts utiles.">
        <form className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
              <input
                className="w-full rounded-2xl border border-line bg-elevated py-3 pl-11 pr-4 text-sm outline-none transition focus:border-accent"
                name="q"
                type="search"
                placeholder="Nom, sujet, résumé, téléphone, adresse, tâche..."
                defaultValue={data.query}
                autoFocus
              />
            </label>
            <div className="flex gap-3">
              <button
                className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white transition hover:bg-ink/90"
                type="submit"
              >
                Rechercher
              </button>
              <Link
                className="rounded-2xl border border-line bg-panel px-4 py-3 text-sm font-medium text-ink transition hover:bg-sand"
                href="/search"
              >
                Réinitialiser
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: "all" as const, label: "Tous" },
              { key: "citizen" as const, label: "Citoyens" },
              { key: "field_report" as const, label: "Terrain" },
              { key: "task" as const, label: "Tâches" },
              { key: "contact" as const, label: "Contacts" },
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
        </form>
      </Panel>

      <div className="mt-6 rounded-[1.25rem] border border-line bg-elevated px-4 py-3 text-sm text-muted">
        {data.query
          ? `${totalResults} résultat(s) utile(s) pour “${data.query}”.`
          : "Lancez une recherche pour retrouver rapidement un citoyen, un retour terrain, une tâche ou un contact."}
      </div>

      <div className="mt-6">
        <Panel
          title="Meilleurs résultats"
          subtitle="Les résultats les plus pertinents et les plus actionnables, triés avant le reste."
        >
          {bestResults.length > 0 ? (
            <div className="space-y-3">
              {bestResults.map((result) => (
                <SearchResultRow key={`${result.type}-${result.id}`} result={result} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={data.query ? "Aucun résultat pertinent" : "Aucune recherche lancée"}
              description={
                data.query
                  ? "Essayez un autre mot-clé ou passez par la page métier concernée."
                  : "Entrez un nom, un sujet ou un mot-clé pour accéder rapidement à la bonne ressource."
              }
            />
          )}
        </Panel>
      </div>

      {data.query ? (
        <div className="mt-6 grid gap-6">
          <SearchResultList
            title="Citoyens"
            subtitle="Les fiches les plus proches de votre recherche."
            results={citizenResults}
            href="/citizens"
          />
          <SearchResultList
            title="Retours terrain"
            subtitle="Les signaux terrain qui demandent peut-être une qualification ou une action."
            results={fieldReportResults}
            href="/field-reports"
          />
          <SearchResultList
            title="Tâches"
            subtitle="Les actions ouvertes ou bloquées liées à votre recherche."
            results={taskResults}
            href="/tasks"
          />
          <SearchResultList
            title="Contacts"
            subtitle="Les relais et contacts utiles associés à votre recherche."
            results={contactResults}
            href="/contacts"
          />
        </div>
      ) : null}
    </div>
  );
}
