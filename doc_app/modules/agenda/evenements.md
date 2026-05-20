# 🧩 Sous-module Agenda — Événements

## 🧠 Objectif

Le sous-module **Événements** recense la **vie publique et institutionnelle du territoire**.

Il sert à :

- cartographier "ce qu'il y a à faire ce week-end" sur la commune (loto du club du 3ème âge, fête de l'école, foire agricole)
- positionner le candidat ou les représentants de l'équipe sur ces événements
- garantir que la campagne est ancrée dans la vraie vie locale, pas seulement dans un bureau

---

## ❓ Question clé

👉 Où la population sera-t-elle rassemblée ce week-end, et serons-nous présents ?

---

## 🧩 Rôle dans le module Agenda

- C'est l'aspect "Relations Publiques" de l'agenda.

Alimente :

- **Terrain (Présence)** (Le compte-rendu informel des poignées de main réalisées à l'événement).
- **Réseau (Associations)** (Montrer du soutien en allant aux événements des assos ciblées).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. C'est l'AG de l'Amicale de Pétanque samedi, qui y représente l'équipe ?
2. La mairie inaugure la nouvelle voirie, devons-nous y envoyer quelqu'un pour observer ?

---

## 🧱 Structure recommandée

### Fiche Événement public

- Nom de l'événement.
- Organisateur (Lien vers la fiche `Association` ou Mairie).
- Date, heure, lieu (Lien vers `Territoire / Lieux utiles`).
- **Délégation** : Membres de l'équipe assignés pour s'y rendre.
- Indice d'importance stratégique (ex: Événement de plus de 500 personnes = Majeur).

---

## 🧠 Données attendues

- Table `events` avec `event_type = 'public'`.
- Lier à un objet métier optionnel (ex: `association_id`).

---

## 🧠 UX attendue

- Un système d'ajout rapide depuis le mobile : un militant voit une affiche dans la rue, il la prend en photo et crée l'événement en 10 secondes.

---

## 🏁 Conclusion

C'est le **radar de la sociabilité locale**.
