# 🧩 Sous-module Administration — Référentiels

## 🧠 Objectif

Le sous-module **Référentiels** gère les données dites **"de structure"** qui sont presque immuables et servent de fondation à l'application.

Il sert à :

- lister les bureaux de vote administratifs
- lister les cantons, les quartiers historiques
- définir la géographie de base avant qu'on n'y ajoute de la donnée "chaude" (élections, terrain)

---

## ❓ Question clé

👉 Quelle est l'ossature géographique et administrative officielle de la commune ?

---

## 🧩 Rôle dans le module Administration

- Contrairement aux tags (qui évoluent), les référentiels sont le socle dur (un bureau de vote ne disparaît pas tous les matins).

Alimente :

- **Territoire** : C'est ici qu'on définit l'existence d'un bureau, avant de l'afficher sur la carte du module Territoire.

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Si la Préfecture décide de fusionner les bureaux de vote 4 et 5, où modifie-t-on la structure mère ?

---

## 🧱 Structure recommandée

### 1. Tables de référence

- Liste des Bureaux de vote (Nom, Code, Adresse physique).
- Liste des Secteurs (Nom).

---

## 🧠 UX attendue

### Principes

- Interface de type "Grille de données" (Data Grid).
- Il est très rare d'y toucher, l'interface doit privilégier la prévention d'erreurs (alerter si la suppression d'un bureau va rendre orphelins des milliers de résultats électoraux).

---

## ⚙️ Contraintes techniques

- Utilisation stricte des contraintes de clés étrangères (`FOREIGN KEY RESTRICT` ou `CASCADE`) dans PostgreSQL pour garantir l'intégrité référentielle.

---

## 🏁 Conclusion

C'est le **plan cadastral logique de l'application**.
