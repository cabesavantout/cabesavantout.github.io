"use client";

import { Search } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { useNavigation } from "@/lib/use-navigation";

const pageCopy: Record<
  string,
  {
    description: string;
    action?: { href: string; label: string };
  }
> = {
  "/dashboard": {
    description: "Les signaux qui demandent une décision aujourd'hui.",
    action: { href: "/search", label: "Rechercher" },
  },
  "/mandate": {
    description: "Piloter les engagements et décider ce qui doit avancer maintenant.",
    action: { href: "/tasks", label: "Voir le plan d'action" },
  },
  "/tasks": {
    description: "Piloter l'exécution et relancer ce qui compte vraiment.",
    action: { href: "/meetings", label: "Voir les réunions" },
  },
  "/meetings": {
    description: "Préparer les rendez-vous utiles et suivre les décisions qui en sortent.",
    action: { href: "/tasks", label: "Voir les actions" },
  },
  "/field-analysis": {
    description: "Lire les signaux consolidés pour arbitrer rapidement.",
    action: { href: "/polling-stations", label: "Ouvrir la carte" },
  },
  "/elections": {
    description: "Lire l'évolution électorale de Cabestany et décider où concentrer l'effort.",
    action: { href: "/elections/history", label: "Voir l'historique" },
  },
  "/elections/history": {
    description: "Relire les scrutins dans le temps pour comparer les séquences utiles.",
    action: { href: "/elections", label: "Voir la synthèse" },
  },
  "/insee": {
    description: "Comprendre la commune pour mieux cibler le terrain, les messages et les priorités.",
    action: { href: "/field-reports", label: "Voir les remontées" },
  },
  "/budget": {
    description: "Lire les enjeux budgétaires sans se perdre dans les chiffres.",
    action: { href: "/mandate", label: "Voir les engagements" },
  },
  "/documents": {
    description: "Retrouver les actes utiles pour vérifier un vote, une décision ou un arbitrage.",
    action: { href: "/budget", label: "Voir le budget" },
  },
  "/polling-stations": {
    description: "Lire le territoire et décider où renforcer la présence.",
    action: { href: "/team", label: "Voir l'équipe terrain" },
  },
  "/field-reports": {
    description: "Qualifier les remontées d'information et déclencher l'action utile.",
    action: { href: "/tasks", label: "Voir les tâches" },
  },
  "/team": {
    description: "Répartir la couverture territoriale là où elle manque le plus.",
    action: { href: "/polling-stations", label: "Voir la carte" },
  },
  "/citizens": {
    description: "Suivre les relations citoyennes utiles et savoir qui relancer.",
    action: { href: "/field-reports", label: "Voir les remontées" },
  },
  "/contacts": {
    description: "Activer rapidement les bons relais au bon moment.",
    action: { href: "/search", label: "Rechercher" },
  },
  "/users": {
    description: "Gérer les accès et les rôles de l'équipe.",
    action: { href: "/users", label: "Gerer les acces" },
  },
  "/campaign": {
    description: "Structurer les priorites de campagne et les prochaines sequences a preparer.",
    action: { href: "/editorial-calendar", label: "Voir le calendrier" },
  },
  "/social-media": {
    description: "Preparer les publications et garder une vision claire des canaux actifs.",
    action: { href: "/messaging", label: "Voir les messages" },
  },
  "/press-releases": {
    description: "Retrouver les communiques et preparer les prises de parole officielles.",
    action: { href: "/press", label: "Voir la presse" },
  },
  "/press": {
    description: "Suivre les articles utiles et garder une veille mediatique exploitable.",
    action: { href: "/interviews", label: "Voir les interviews" },
  },
  "/interviews": {
    description: "Preparer les interviews et consolider les points a porter.",
    action: { href: "/messaging", label: "Voir les messages" },
  },
  "/editorial-calendar": {
    description: "Organiser les prises de parole a venir dans une seule vue d'ensemble.",
    action: { href: "/social-media", label: "Voir les reseaux" },
  },
  "/messaging": {
    description: "Conserver une base commune de formulations, d'arguments et de messages.",
    action: { href: "/campaign", label: "Voir la campagne" },
  },
  "/data-sources": {
    description: "Suivre les sources branchees, leur fraicheur et leur couverture.",
    action: { href: "/documents", label: "Voir les documents" },
  },
  "/settings": {
    description: "Rassembler les reglages fonctionnels sans surcharger les pages d'analyse.",
    action: { href: "/dashboard", label: "Retour au dashboard" },
  },
  "/search": {
    description: "Trouver rapidement une fiche, un signal ou une action.",
  },
};

export function AppTopbar({
  permissions = [],
}: {
  permissions?: string[];
}) {
  const { activeGroup, activeItem } = useNavigation(permissions);
  const copy = pageCopy[activeItem?.href ?? "/dashboard"] ?? pageCopy["/dashboard"];

  return (
    <header className="rounded-[1.75rem] border border-line bg-panel px-4 py-4 shadow-panel-sm sm:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          {activeGroup ? (
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted">
              {activeGroup.label}
            </p>
          ) : null}
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            {activeItem?.label ?? "Vue d'ensemble"}
          </h1>
          <p className="mt-1 text-sm text-muted">{copy.description}</p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {copy.action ? <ButtonLink href={copy.action.href}>{copy.action.label}</ButtonLink> : null}
          {!copy.action && activeItem?.href !== "/search" ? (
            <ButtonLink href="/search">
              <Search className="h-4 w-4" aria-hidden />
              Rechercher
            </ButtonLink>
          ) : null}
        </div>
      </div>

    </header>
  );
}
