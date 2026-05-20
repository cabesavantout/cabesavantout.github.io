# 🧩 Sous-module Agenda — Calendrier global

## 🧠 Objectif

Le sous-module **Calendrier global** est l'interface principale permettant d'embrasser d'un seul coup d'œil l'ensemble de l'activité temporelle de la campagne.

Il sert à :

- visualiser la charge de travail hebdomadaire ou mensuelle de l'équipe
- repérer les "trous" de présence sur le terrain
- éviter les conflits de dates (ex: planifier un tractage au même moment qu'une réunion importante)

---

## ❓ Question clé

👉 Quelle est notre couverture événementielle cette semaine et avons-nous des conflits ?

---

## 🧩 Rôle dans le module Agenda

- C'est l'interface unifiée. Il requiert tous les autres sous-modules (Réunions, Événements, Échéances) pour les afficher sur une grille temporelle.

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Y a-t-il quelqu'un de l'équipe prévu au marché dimanche prochain ?
2. Quand a lieu la prochaine réunion de pilotage ?

---

## 🧱 Structure recommandée

### 1. Composant Calendrier

- Vues : Mois / Semaine / Planning (Liste chronologique).
- Code couleur strict (ex: Rouge = Échéance légale, Bleu = Réunion interne, Vert = Terrain, Jaune = Conseil Municipal).

### 2. Filtres rapides

- Checkboxes pour afficher/masquer certains types d'événements.
- Filtre "Mes événements" (uniquement ceux où l'utilisateur connecté est assigné/invité).

---

## 🧠 Données attendues

- Agrégation de la table `events` (ou des tables temporelles spécifiques) avec `start_date` et `end_date`.

---

## 🧠 UX attendue

### Principes

- Mode "Agenda Apple/Google" familier.
- Le clic sur un bloc ouvre une modale rapide (Aperçu) avec un bouton "Voir la fiche détaillée" pour ne pas casser la navigation.

---

## 🏁 Conclusion

C'est la **grille de lecture temporelle** de la campagne.
