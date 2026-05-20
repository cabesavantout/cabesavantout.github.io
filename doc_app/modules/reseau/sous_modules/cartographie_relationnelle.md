# 🧩 Sous-module Réseau — Cartographie relationnelle

## 🧠 Objectif

Le sous-module **Cartographie relationnelle** modélise les **sphères d'influence et réseaux de connaissances**.

Il sert à :

- visualiser qui influence qui (ex: "Ce commerçant est le frère du président de telle association")
- trouver le bon point d'entrée pour approcher une personne cible (le "chemin le plus court")
- comprendre l'organigramme de pouvoir officieux du territoire

---

## ❓ Question clé

👉 Comment atteindre tel acteur clé et qui, dans notre propre base, a ses entrées chez lui ?

---

## 🧩 Rôle dans le module Réseau

- C'est l'outil analytique avancé du CRM.

Alimente :

- **Campagne (Stratégie)** (cartographie des alliances ou inimitiés invisibles).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Si je veux rencontrer le directeur de telle entreprise, qui, parmi mes soutiens engagés, le connaît personnellement ?
2. Y a-t-il des réseaux de solidarité évidents (ex: un élu sortant d'opposition qui est aussi au bureau d'une grande association) ?

---

## 🧱 Structure recommandée

### 1. Modélisation des liens (Dans la fiche contact)

- Onglet "Relations" sur une fiche Citoyen/Contact.
- **Graphe** : Contact A -> "est famille de" -> Contact B.
- Contact C -> "est collègue de" -> Contact D.

### 2. Vue Graphe visuel (Phase avancée)

- Représentation visuelle des nœuds d'influence (Node/Edge graph) permettant de voir des "grappes" de personnes (clusters).

---

## 🧠 Données attendues

- Table `relationships` (id_personne_A, id_personne_B, type_de_relation).

---

## 🧠 UX attendue

### Principes

- C'est un outil d'état-major. L'UI doit permettre de lier deux personnes très rapidement (ex: "Lier à une autre fiche...").

---

## ⚙️ Contraintes techniques

- Les vues graphes (type Force-directed graph D3.js) peuvent vite devenir illisibles si la base comporte des milliers de contacts. Il faut toujours filtrer autour d'une personne centrale.

---

## 🏁 Conclusion

Le sous-module **Cartographie relationnelle** est :

👉 la carte au trésor politique
👉 l'outil ultime de la diplomatie locale
