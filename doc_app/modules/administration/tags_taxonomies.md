# 🧩 Sous-module Administration — Tags / taxonomies

## 🧠 Objectif

Le sous-module **Tags / taxonomies** est le garant de la **propreté sémantique** de l'application.

Il sert à :

- définir les listes de thématiques autorisées (ex: "Sécurité", "Urbanisme")
- empêcher la création de tags sauvages qui polluent les filtres (ex: "sécurité", "Sécurite", "Secu")
- gérer les fusions de tags (merging) si une dérive s'est produite

---

## ❓ Question clé

👉 Comment s'assurer que toute l'équipe utilise les mêmes mots-clés pour classer l'information ?

---

## 🧩 Rôle dans le module Administration

- C'est le dictionnaire de contrôle (Master Data Management simplifié).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Pouvons-nous renommer la catégorie "Travaux" en "Urbanisme" partout dans l'application en un seul clic ?

---

## 🧱 Structure recommandée

### 1. Liste des référentiels dynamiques

- Gestion des Tags Citoyens (CRM).
- Gestion des Thématiques de promesses.
- Gestion des Catégories de documents.

### Actions

- Ajouter, Éditer, Supprimer.
- "Fusionner avec..." (permet de transférer toutes les entités liées au Tag A vers le Tag B avant de supprimer le Tag A).

---

## 🚫 Pièges à éviter

- Laisser la création de tags entièrement libre aux utilisateurs `militant`. Cela finit toujours par une base inexploitable. Les tags doivent être créés par l'administration ou la direction, et sélectionnés (dropdown) par les militants.

---

## 🏁 Conclusion

Le sous-module **Tags / taxonomies** est :

👉 le correcteur orthographique structurel de la base
