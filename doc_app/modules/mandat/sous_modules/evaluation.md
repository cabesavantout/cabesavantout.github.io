# 🧩 Sous-module Mandat — Évaluation

## 🧠 Objectif

Le sous-module **Évaluation** agrège les données d'avancement pour produire une **note globale de performance** du mandat.

Il sert à :

- calculer le pourcentage de promesses tenues
- identifier objectivement les secteurs en échec
- créer un "scoring" du maire sortant

---

## ❓ Question clé

👉 Quel est le taux de réussite global du mandat ?

---

### 🥇 Priorité Produit

- **Essentiel** : Avoir un chiffre global défendable, visuel et exportable pour la communication externe.
- **Secondaire** : Les métriques de micro-performance trop granulaires et illisibles pour le grand public.

---

## 🧩 Rôle dans le module Mandat

- C'est l'écran de synthèse quantitative du module Mandat.

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Le maire sortant a-t-il tenu plus de 50% de ses engagements ?
2. Dans quel domaine (ex: Urbanisme vs Social) a-t-il le plus échoué ?

---

## 🧱 Structure recommandée

### 1. Scorecard du Mandat

- Jauge de réalisation globale (%).
- Répartition par statut (ex: 40 Réalisées, 20 En retard, 15 Abandonnées).
- Graphique Radar : Taux de réussite par thématique.

---

## 🧠 Données attendues

- Requêtes d'agrégation pures sur la table `promises` (COUNT, GROUP BY status).

---

## 🧠 UX attendue

### Principes

- C'est la vue idéale pour générer un "Tract de bilan" en un clic. L'interface doit être visuelle et exportable (graphiques clairs).

### 🎨 Recommandations UI & Interactions

- **Radar Chart (Spider Chart)** : Afficher l'équilibre du mandat pour repérer visuellement les "trous" (ex: fort sur l'Urbanisme, mais très faible sur l'Écologie et le Social).
- **Mode Présentation** : Possibilité de masquer les menus de navigation pour projeter cette vue sur grand écran lors d'une réunion stratégique.
- **Export PDF natif** : Génération d'un rapport de synthèse (A4) propre et prêt à imprimer.

---

## ⚙️ Contraintes techniques

- **Performance d'agrégation** : Les requêtes GROUP BY sur l'ensemble du mandat peuvent devenir lourdes. Utiliser des vues matérialisées (`MATERIALIZED VIEW` PostgreSQL) rafraîchies quotidiennement ou mettre en cache le résultat.
- **Génération PDF** : Utiliser un service headless (Puppeteer ou Playwright) côté backend pour s'assurer que les graphiques SVG/Canvas rendent parfaitement à l'impression, peu importe le navigateur de l'utilisateur.

---

## 🏁 Conclusion

C'est le **bulletin de notes politique**.
