export type ExternalSource = {
  id: string;
  label: string;
  url: string;
  scope: string[];
  notes: string;
};

export const externalSources: ExternalSource[] = [
  {
    id: "insee-cabestany",
    label: "INSEE - Cabestany",
    url: "https://www.insee.fr/fr/statistiques/2011101?geo=COM-66028",
    scope: ["insee", "dashboard", "analysis"],
    notes:
      "Source de référence pour la population, le logement, la répartition par âge et la structure socio-professionnelle.",
  },
  {
    id: "banatic-cabestany",
    label: "BANATIC - Cabestany",
    url: "https://www.banatic.interieur.gouv.fr/commune/66028-cabestany",
    scope: ["analysis", "administration", "institutional"],
    notes:
      "Source de référence pour l'intercommunalité, les rattachements institutionnels et les compétences.",
  },
  {
    id: "mairie-actes-cabestany",
    label: "Mairie de Cabestany - Actes municipaux",
    url: "https://ville-cabestany.fr/actes-municipaux/",
    scope: ["budget", "mandate", "documents", "administration"],
    notes:
      "Source documentaire municipale pour les actes, délibérations, pièces budgétaires et documents du conseil.",
  },
  {
    id: "mairie-prochain-conseil-cabestany",
    label: "Mairie de Cabestany - Prochain conseil municipal",
    url: "https://ville-cabestany.fr/prochain-conseil-municipal/",
    scope: ["meetings", "agenda", "documents", "administration"],
    notes:
      "Source officielle pour les prochaines dates, horaires et lieux des conseils municipaux publies par la mairie.",
  },
];

export function getExternalSource(id: string) {
  return externalSources.find((source) => source.id === id);
}
