# 🧩 Sous-module Agenda — Actions planifiées

## 🧠 Objectif

Le sous-module **Actions planifiées** assure la projection dans le temps des **opérations physiques de la campagne**.

Il sert à :

- réserver des créneaux horaires pour le tractage, le boîtage ou le porte-à-porte
- coordonner les équipes sur le terrain (qui va où et quand)
- afficher ces créneaux dans le calendrier global

---

## ❓ Question clé

👉 Où et quand sont nos prochaines opérations de terrain ?

---

## 🧩 Rôle dans le module Agenda

- C'est la déclinaison temporelle du module **Terrain (Actions)**.
- Dans la base de données, une "Action Terrain" possède une date de planification. L'Agenda se contente d'exposer cette information sous forme de calendrier.

Alimente :

- **Calendrier global** (Filtre "Actions terrain").
- **Réseau (Équipe)** (Permet de voir l'emploi du temps d'un militant).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Y a-t-il une action de boîtage prévue demain matin dans le quartier Sud ?
2. L'agenda terrain est-il trop vide la semaine prochaine ?

---

## 🧱 Structure recommandée

Ce module n'a pas d'interface de création dédiée dans l'Agenda. Il s'appuie sur la création d'Actions dans le module Terrain.

- **Lien direct** : Cliquer sur une "Action planifiée" dans le calendrier renvoie vers `Terrain > Actions > [Fiche de l'action]`.

---

## 🧠 Données attendues

- Requête filtrée depuis la table `field_actions` (où `scheduled_date` n'est pas null).

---

## 🧠 UX attendue

### Principes

- Mode "Drag and Drop" : Idéalement, sur une vue calendrier, on devrait pouvoir déplacer une action du Samedi au Dimanche si la météo est mauvaise, ce qui met à jour la date dans le module Terrain automatiquement.

---

## 🏁 Conclusion

C'est la **fenêtre logistique de l'effort physique**.
