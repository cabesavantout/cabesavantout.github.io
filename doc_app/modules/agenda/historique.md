# 🧩 Sous-module Agenda — Historique (Passé)

## 🧠 Objectif

Le sous-module **Historique** est la fonction "rétroviseur" de l'agenda. Il s'assure qu'une fois un événement passé, la donnée qu'il a générée est conservée et classée.

Il sert à :

- auditer l'activité passée de l'équipe (combien de réunions ont eu lieu le mois dernier)
- vérifier qu'aucune réunion n'est restée sans compte-rendu (clôture des événements)
- retrouver une information datée

---

## ❓ Question clé

👉 Où étions-nous ce mois-ci et qu'est-ce que cela a produit ?

---

## 🧩 Rôle dans le module Agenda

- C'est le gestionnaire d'état (`past` vs `future`).

Alimente :

- **Dashboard (Activité récente)**.

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Avons-nous bien clôturé la réunion de quartier de mardi en envoyant le résumé aux présents ?
2. Quelle a été la densité de notre présence au mois de novembre ?

---

## 🧱 Structure recommandée

### 1. La bascule Temporelle

- Un bouton "Afficher le passé" sur le calendrier ou une liste des "Événements à clôturer".
- Tout événement dont la date est passée devrait déclencher une invite : "Cet événement est passé. Souhaitez-vous rédiger un compte-rendu ou l'archiver ?".

---

## 🧠 Données attendues

- Filtre SQL `WHERE end_date < NOW()`.

---

## 🧠 UX attendue

### Principes

- Ne pas polluer la vue "À venir". Par défaut, un agenda de campagne regarde vers l'avant. Le passé doit être relégué derrière un filtre explicite.

---

## 🏁 Conclusion

C'est la **boîte d'archives temporelle** de l'équipe.
