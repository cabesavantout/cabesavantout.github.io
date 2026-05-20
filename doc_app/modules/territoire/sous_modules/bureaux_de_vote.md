# 🧩 Sous-module Territoire — Bureaux de vote

## 🧠 Objectif

Le sous-module **Bureaux de vote** est l'unité de base de l'administration et de l'analyse électorale de la ville.

Il sert à :

- délimiter géographiquement chaque bureau
- attacher les données de l'INSEE et des scrutins passés à un espace physique
- coordonner la tenue des bureaux le jour de l'élection (assesseurs)

---

## ❓ Question clé

👉 Où se situe ce bureau, quelles rues le composent, et qui le tient ?

---

## 🧩 Rôle dans le module Territoire

- C'est le calque administratif et électoral officiel (incontournable).

Alimente :

- **Élections** (c'est le contenant des résultats électoraux).
- **Réseau** (identification des scrutateurs et délégués de liste).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Quel est le périmètre exact du Bureau N°5 ?
2. Avons-nous assez de militants pour tenir les 10 bureaux de la ville le jour J ?

---

## 🧱 Structure recommandée

### 1. Fiche Bureau

- **Cartographie** : Le polygone du bureau tracé sur la carte.
- **Infrastructure** : Nom de la salle (ex: École Maternelle), accessibilité.
- **Organisation Jour J** : Liste des assesseurs assignés.
- **Données Électorales Clés** :
  - Nombre d'inscrits.
  - Taux d'abstention moyen.
  - Dernier résultat (Municipales).
- **Liste des rues rattachées**.

---

## 🧠 Données attendues

- Table `polling_stations` avec coordonnées géographiques (GeoJSON du polygone).
- `name`, `address`, `number_of_voters`.
- Relation `one-to-many` avec la table `streets`.
- Relation `many-to-many` avec la table `team_members` (pour les assesseurs).

---

## 🧠 UX attendue

### 🎨 Recommandations UI & Interactions

- **Vue Dashboard** : La fiche d'un bureau de vote doit être un tableau de bord complet, avec la carte, les rues, les résultats électoraux historiques (graphiques) et la liste des assesseurs.
- **Navigation croisée** : Depuis la fiche, un clic sur une rue doit mener à la fiche de cette rue. Un clic sur un résultat électoral doit mener à l'analyse détaillée de ce scrutin.

---

## ⚙️ Contraintes techniques

- **Import des périmètres** : Les polygones des bureaux de vote sont des données publiques (OpenData). Prévoir un script d'import pour les fichiers Shapefile ou GeoJSON fournis par l'administration.
- **Stabilité des ID** : L'identifiant d'un bureau de vote doit être stable dans le temps, même si son nom ou son périmètre est légèrement modifié par la préfecture, pour ne pas perdre l'historique des résultats.

---

## 🏁 Conclusion

C'est le **quadrillage légal de la démocratie locale**.
