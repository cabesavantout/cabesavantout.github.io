# 🧩 Sous-module Dashboard — Activité récente

## 🧠 Objectif

Le sous-module **Activité récente** montre que **le projet est vivant** en affichant un flux d'événements.

Il sert à :

- valoriser l'effort collectif (donner de l'énergie à l'équipe)
- surveiller ce qui a été ajouté par d'autres (nouveau document, nouveau contact important)
- identifier de manière informelle de nouveaux sujets

---

## ❓ Question clé

👉 Que s'est-il passé pendant que je n'étais pas connecté ?

---

## 🧩 Rôle dans le module Dashboard

- C'est le flux d'actualité interne (type timeline).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Quels retours terrain ont été saisis cet après-midi ?
2. Une nouvelle réunion vient-elle d'être clôturée ?

---

## 🧱 Structure recommandée

### 1. Le Flux (Feed)

- Liste chronologique des X dernières actions (ex: "Marie a ajouté un retour terrain : Problème école Prévert", "Jean a terminé son action : Tractage marché").
- Liens cliquables vers l'entité concernée.

---

## ⚙️ Contraintes techniques

- **Polymorphisme SQL** : C'est le flux le plus lourd à générer car il tire de partout.
- Privilégier une approche "Event Sourcing" légère : à chaque action majeure dans l'app, insérer une ligne de log courte dans une table dédiée `activity_feed` (id, user_id, action_type, target_id, created_at). Cela évite les requêtes UNION massives et impossibles à indexer.

---

## 🧠 Données attendues

- Flux `activity_feed` (ou UNION) trié par `created_at DESC` (limité à 10 items).

---

## 🧠 UX attendue

### Principes

- Ce bloc est **secondaire** (il ne doit pas prendre le pas sur les Urgences ou les Tâches). Il est souvent placé en colonne latérale droite.

### 🎨 Recommandations UI & Interactions

- **Affichage compact** : Design type "Timeline" très épurée. Texte gris, petites icônes identifiant le type d'activité (📝 pour un document, 📍 pour le terrain).
- **Groupement (Batching)** : Si un utilisateur importe 10 contacts d'un coup, afficher "Jean a importé 10 contacts" plutôt que 10 lignes identiques pour ne pas polluer le flux.

---

## 🏁 Conclusion

C'est le **battement de cœur de l'application**.
