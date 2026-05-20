# 🧩 Sous-module Dashboard — Urgences

## 🧠 Objectif

Le sous-module **Urgences** isole impitoyablement tout ce qui requiert une **action corrective ou décisionnelle immédiate**.

Il sert à :

- empêcher qu'un problème critique (promesse bloquée, crise terrain) ne s'éternise
- forcer l'équipe dirigeante à arbitrer les points de friction

---

## ❓ Question clé

👉 Qu'est-ce qui est "en feu" ou en train de dérailler aujourd'hui ?

---

### 🥇 Priorité Produit

- **Essentiel** : Raccourcir le délai entre la détection du problème et sa résolution.
- **Secondaire** : L'historique des urgences résolues (inutile sur le dashboard).

---

## 🧩 Rôle dans le module Dashboard

- C'est le bloc d'action principal de l'équipe de direction.
- Se vide si le travail est bien fait (Zero Inbox concept).

Alimente :

- **Décisions (Mandat)** ou **Actions (Terrain)** (un clic sur une urgence amène directement à l'écran de résolution).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Y a-t-il une promesse de campagne dont le statut est passé en "Critique" ?
2. Un signalement terrain "Très grave" est-il non traité depuis plus de 48h ?

---

## 🧱 Structure recommandée

### 1. Liste des urgences (Empty State par défaut)

- Liste textuelle courte (titre du problème, âge du problème).
- Bouton d'action directe (ex: "Arbitrer", "Assigner").
- Si tout va bien : "Aucune urgence ouverte. La situation est maîtrisée." avec une illustration rassurante.

---

## 🧠 Données attendues

- Requête SQL stricte : filtrer les entités où `risk_level = 'Critique'` ou `status = 'En retard'`.

---

## 🧠 UX attendue

### Principes

- Code couleur d'alerte (Rouge / Orange).
- Doit procurer une satisfaction quand la liste est vide.

---

## 🏁 Conclusion

C'est l'**extincteur de la webapp**.
