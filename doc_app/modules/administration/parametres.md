# 🧩 Sous-module Administration — Paramètres

## 🧠 Objectif

Le sous-module **Paramètres** regroupe les **réglages globaux** de l'instance de l'application.

Il sert à :

- nommer la campagne (ex: "Cabestany Avant Tout")
- définir la date de l'élection (pour les comptes à rebours de l'Agenda)
- personnaliser les couleurs (si l'outil évolue en marque blanche)

---

## ❓ Question clé

👉 Quelles sont les variables globales qui s'appliquent à l'ensemble du système ?

---

## 🧩 Rôle dans le module Administration

- C'est l'écran "Général" classique de toute application SaaS.

---

## 🧱 Structure recommandée

### 1. Informations Générales

- Nom de l'organisation politique / Liste.
- Nom du candidat tête de liste.
- Date de l'élection (cible).

### 2. Personnalisation (UI)

- Logo (utilisé ensuite sur les exports PDF des communiqués).
- Couleurs primaires.

---

## 🧠 Données attendues

- Table unique `tenant_settings` ou `app_settings` (une seule ligne dans la BDD).

---

## 🧠 UX attendue

### 🎨 Recommandations UI & Interactions

- **Aperçu en direct (Live Preview)** : Si l'utilisateur modifie la "Couleur primaire", afficher un composant d'exemple pour voir le rendu avant de sauvegarder.

---

## ⚙️ Contraintes techniques

- **Mise en cache globale** : Les paramètres globaux (nom de campagne, logo) sont souvent appelés sur _toutes_ les pages de l'application (dans le Header). Il faut absolument les mettre en cache mémoire (ex: Redis ou Singleton contextuel) pour éviter une requête SQL inutile à chaque chargement de page.

---

## 🏁 Conclusion

Le sous-module **Paramètres** est :

👉 la personnalisation de la coquille applicative
