# 🧩 Sous-module Communication — Vue communication

## 🧠 Objectif

Le sous-module **Vue communication** est la salle de rédaction centralisée (Newsroom).

Il sert à :

- visualiser instantanément l'état d'avancement des contenus en cours de création
- s'assurer que l'équipe maintient un rythme de publication régulier (la cadence)
- arbitrer les urgences éditoriales (ex: "Il nous faut un communiqué de presse pour ce soir")

---

## ❓ Question clé

👉 Que devons-nous publier aujourd'hui, et qui doit valider quoi ?

---

## 🧩 Rôle dans le module Communication

- C'est la **vue de pilotage** du responsable de la communication. Elle ne contient pas de données propres mais agrège tous les `Contenus` pour les afficher par statut.

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Y a-t-il des posts ou tracts en attente de validation par le directeur de campagne ?
2. Quelle est la dernière chose que nous avons publiée ?

---

## 🧱 Structure recommandée

### 1. Le Pipeline de production (Kanban)

- Colonnes : `Brouillon` / `À valider` / `Prêt à publier` / `Publié`.
- Les cartes représentent des publications, des argumentaires ou des posts.

### 2. Le Thermomètre de présence

- Métrique simple : "Nombre de contenus publiés cette semaine" vs "Objectif" (ex: 5 / 7).

---

## 🧠 Données attendues

- Requête sur la table `contents` avec un `GROUP BY status`.

---

## 🧠 UX attendue

- Orientée productivité et relecture. Un clic sur un contenu ouvre un mode "Éditeur / Validation".
- **Interaction principale** : Glisser-déposer (Drag & drop) une carte d'une colonne à l'autre pour changer son statut.
- **Alertes visuelles** : Les cartes dont la `scheduled_date` est dépassée doivent avoir un indicateur rouge.

### 🎨 Recommandations UI & Interactions

- **Cartes de contenu riches** : Chaque carte doit afficher le titre, le type (icône), l'auteur (avatar) et la date de publication prévue.
- **Filtres** : Permettre de filtrer le board par auteur, par type de contenu ou par thématique pour désengorger la vue.
- **Actions rapides sur la carte** : Un menu "..." sur chaque carte pour "Modifier", "Valider" ou "Archiver" rapidement.

---

## 🏁 Conclusion

C'est l'**aiguilleur du trafic éditorial**.
