# 🧩 Sous-module Terrain — Actions à venir

## 🧠 Objectif

Le sous-module **Actions à venir** est le backlog (liste de tâches) opérationnel de la campagne physique.

Il sert à :

- lister les tournées de porte-à-porte prévues, les tractages à organiser
- permettre aux bénévoles de s'inscrire ou de prendre en charge une action
- s'assurer que le rythme imposé par la stratégie ne retombe pas

---

## ❓ Question clé

👉 Qu'est-ce qu'il y a à faire sur le terrain cette semaine et qui est volontaire ?

---

## 🧩 Rôle dans le module Terrain

- C'est le gestionnaire de planification. Une "Action à venir" bascule dans l'historique une fois terminée.

Alimente :

- **Agenda** (pour affichage dans le calendrier).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Reste-t-il des secteurs non assignés pour la distribution du tract de ce week-end ?
2. Le bénévole X a-t-il validé qu'il prenait le marché de dimanche ?

---

## 🧱 Structure recommandée

### 1. Liste des Opérations Prévues

- Carte visuelle (Type "Petites Annonces") : "Recherche 2 personnes pour Tractage Gare Mardi à 7h".
- La carte affiche `X / Y participants` pour montrer le besoin.
- Bouton d'engagement : "Je participe".
- Statut : `Planifié`, `Manque d'effectif`, `Complet`.

---

## 🧠 Données attendues

- Entité `field_actions` avec un statut `planned`.
- Champs `volunteers_needed` (entier) et une relation `many-to-many` avec la table `team_members` pour lister les participants.

---

## 🧠 UX attendue

### Principes

- Fortement orienté "Mobilisation des troupes" (Call to action clair pour les bénévoles).
- Doit être la première chose qu'un militant voit quand il ouvre l'application s'il veut aider.

---

## ⚙️ Contraintes techniques

- **Système de notification** :
  - Quand un bénévole clique sur "Je participe", le responsable de l'action doit être notifié.
  - Si une action est en statut "Manque d'effectif" 24h avant son début, une alerte doit être envoyée aux coordinateurs.

---

## 🏁 Conclusion

C'est le **tableau de service des forces militantes**.
