# 🧩 Sous-module Communication — Veille

## 🧠 Objectif

Le sous-module **Veille** est l'outil d'**écoute de l'écosystème numérique local**.

Il sert à :

- centraliser les liens vers ce qui se dit sur la commune ou sur le candidat sur le web (groupes Facebook locaux, presse en ligne)
- repérer les signaux faibles (polémiques qui montent sur les réseaux sociaux)
- mesurer empiriquement l'engagement (les likes/partages de nos propres publications majeures)

---

## ❓ Question clé

👉 Que se dit-il sur nous (ou sur nos adversaires) en ligne aujourd'hui ?

---

## 🧩 Rôle dans le module Communication

- C'est la boucle de retour (feedback loop). On publie (output), puis on écoute la réaction (input).

Alimente :

- **Campagne (Risques & Vigilance)** (Une polémique détectée ici bascule dans le tableau des risques).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Le groupe Facebook "Les habitants de Cabestany" parle-t-il de notre dernier communiqué ?
2. Quel post de l'adversaire a fait le plus réagir cette semaine ?

---

## 🧱 Structure recommandée

### 1. Tableau de bord d'écoute

- Liste de "Mentions" capturées, affichées sous forme de cartes avec un aperçu.
- Chaque mention est qualifiée avec :
  - **Source** : Média (Groupe FB, Presse en ligne...).
  - **Tonalité** : Négative, Neutre, Positive.
  - **Importance** : Faible, Moyenne, Critique.
  - **Action requise** : À ignorer, À surveiller, Réponse nécessaire.

---

## 🧠 Données attendues

- Entité `Mention` : `id`, `url`, `source_name`, `title`, `snapshot_image_url`, `tone`, `importance`, `required_action`.
- Lien optionnel vers une entité `Risque` (module Campagne).

---

## 🧠 UX attendue

### Principes

- Souvent très manuel dans un MVP (copier-coller une URL qui génère un aperçu).
- **Transformation en action** : Une mention "Critique" doit pouvoir être transformée en "Tâche" ou en "Risque" en un clic.

### 🎨 Recommandations UI & Interactions

- **Bookmarklet / Extension Navigateur (V2)** : Pour une capture ultra-rapide, un petit bouton dans le navigateur permet de "capturer" la page en cours et de l'envoyer dans la veille sans quitter la page.
- **Génération d'aperçu** : Quand l'utilisateur colle une URL, le système doit générer automatiquement un aperçu (titre, image) pour contextualiser le lien.

---

## 🚫 Pièges à éviter

- Vouloir brancher des API d'écoute sociale automatiques hors de prix ou complexes (API Facebook restreintes). La veille manuelle ciblée est souvent suffisante pour une commune.

---

## ⚙️ Contraintes techniques

- **Génération de snapshots** : La création d'aperçus ou de captures d'écran côté serveur (via Puppeteer ou une API tierce) peut être coûteuse. Une simple récupération des métadonnées OpenGraph de l'URL est un bon début.

---

## 🏁 Conclusion

C'est le **stéthoscope numérique de l'équipe**.
