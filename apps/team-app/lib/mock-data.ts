export const dashboardStats = [
  { label: "Taches ouvertes", value: "18" },
  { label: "Actions en retard", value: "5" },
  { label: "Reunions cette semaine", value: "3" },
  { label: "Retours terrain recents", value: "24" },
];

export const lateTasks = [
  {
    title: "Boucler la liste des responsables de bureau",
    owner: "Claire",
    dueDate: "24 mars",
    status: "Retard",
  },
  {
    title: "Valider le tract securite",
    owner: "Eric",
    dueDate: "25 mars",
    status: "Retard",
  },
  {
    title: "Recenser les volontaires pour le marche",
    owner: "Maya",
    dueDate: "26 mars",
    status: "Tendu",
  },
];

export const hotTopics = [
  {
    label: "Stationnement centre-ville",
    count: "9 signaux",
    summary: "Sujet recurrent sur les rotations de courte duree et les places proches des commerces.",
  },
  {
    label: "Proprete des espaces publics",
    count: "7 signaux",
    summary: "Hausse des retours sur certains points de collecte et zones pietonnes.",
  },
  {
    label: "Securite aux abords des ecoles",
    count: "5 signaux",
    summary: "Demande de presence visible et d'amenagements horaires sur deux secteurs.",
  },
];

export const upcomingEvents = [
  {
    title: "Marche de plein vent",
    date: "Samedi 28 mars · 8h30",
    location: "Place du marche",
    priority: "Priorite haute",
    coverage: "2 personnes confirmees",
  },
  {
    title: "Reunion quartier Centre",
    date: "Lundi 30 mars · 19h00",
    location: "Salle municipale",
    priority: "Priorite moyenne",
    coverage: "1 personne confirmee",
  },
  {
    title: "Porte-a-porte Colomines",
    date: "Mercredi 1 avril · 17h30",
    location: "Secteur Colomines",
    priority: "Priorite haute",
    coverage: "3 personnes confirmees",
  },
];

export const tasks = [
  {
    title: "Construire le fichier contacts assesseurs",
    description: "Consolider la base et identifier les manques par bureau.",
    owner: "Claire",
    priority: "Critique",
    status: "En cours",
    dueDate: "24 mars",
  },
  {
    title: "Preparer l'ordre du jour reunion communication",
    description: "Inclure planning editorial et arbitrages visuels.",
    owner: "Maya",
    priority: "Haute",
    status: "En cours",
    dueDate: "25 mars",
  },
  {
    title: "Verifier la reservation de salle",
    description: "Confirmer disponibilite et capacite pour la reunion publique.",
    owner: "Julien",
    priority: "Moyenne",
    status: "Termine",
    dueDate: "23 mars",
  },
];

export const meetings = [
  {
    title: "Point direction hebdomadaire",
    date: "Mardi 24 mars · 18h30",
    location: "Local campagne",
    agenda: [
      "Etat des priorites terrain",
      "Arbitrage sur le tract securite",
      "Repartition des presences evenements",
    ],
    actions: [
      {
        title: "Finaliser argumentaire securite",
        owner: "Eric",
        dueDate: "25 mars",
        done: false,
      },
      {
        title: "Valider couverture du marche",
        owner: "Claire",
        dueDate: "24 mars",
        done: true,
      },
    ],
  },
  {
    title: "Reunion terrain quartier ouest",
    date: "Jeudi 26 mars · 19h00",
    location: "Chez un soutien",
    agenda: [
      "Retours habitants sur circulation",
      "Nouveaux benevoles",
      "Preparation du porte-a-porte",
    ],
    actions: [
      {
        title: "Creer fiche quartier ouest",
        owner: "Maya",
        dueDate: "27 mars",
        done: false,
      },
    ],
  },
];

export const fieldReports = [
  {
    person: "Mme D.",
    neighborhood: "Centre",
    topic: "Stationnement",
    support: "A qualifier",
    summary:
      "Trouve le centre plus difficile d'acces pour les courses rapides. Souhaite une solution concrete et visible.",
    author: "Claire",
    date: "22 mars",
  },
  {
    person: "M. R.",
    neighborhood: "Colomines",
    topic: "Proprete",
    support: "Favorable",
    summary:
      "Approuve le positionnement de terrain mais insiste sur un engagement clair concernant les points noirs de proprete.",
    author: "Julien",
    date: "22 mars",
  },
  {
    person: "Mme S.",
    neighborhood: "Quartier Ouest",
    topic: "Securite ecoles",
    support: "A qualifier",
    summary:
      "Demande une presence municipale plus visible aux heures d'entree et de sortie. Sujet juge prioritaire pour plusieurs parents.",
    author: "Maya",
    date: "23 mars",
  },
];
