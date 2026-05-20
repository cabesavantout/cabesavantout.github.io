# 🧩 Sous-module Territoire — Lieux utiles

## 🧠 Objectif

Le sous-module **Lieux utiles** référence les Points d'Intérêt (POI) stratégiques de la commune.

Il sert à :

- cartographier les générateurs de flux (marchés, sorties d'écoles, gares, places publiques)
- identifier les bâtiments municipaux (mairie annexe, gymnases, CCAS)
- préparer le placement des équipes pour le tractage "statique"

---

## ❓ Question clé

👉 Où sont les endroits où la population se croise naturellement ?

---

## 🧩 Rôle dans le module Territoire

- C'est la couche "Infrastructures" de la carte.

Alimente :

- **Terrain (Tractage / Présences)** : On associe toujours une action de présence à un Lieu Utile (ex: "Tractage au Marché du dimanche").

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Quels sont les 5 points de passage majeurs de la ville pour notre grand tractage de samedi ?
2. Ce gymnase appartient-il à la ville ou à l'agglomération ?

---

## 🧱 Structure recommandée

### 1. Fiche Lieu

- Nom, Catégorie (Scolaire, Transport, Commerce, Sport).
- Géolocalisation (Point Latitude/Longitude).
- Jours et heures d'affluence (ex: Marché le mardi matin).

---

## 🧠 Données attendues

- Entité `PointOfInterest` :
  - `name` (string)
  - `category` (enum: Scolaire, Transport, Commerce, Sport, Institutionnel, Culte)
  - `address` (string)
  - `geometry` (GeoJSON Point)
  - `affluence_details` (text, ex: "Mardi et Samedi matin, 8h-13h")
  - `strategic_importance` (integer, 1 à 5)

---

## 🧠 UX attendue

### 🎨 Recommandations UI & Interactions

- **Carte avec icônes filtrables** : La vue principale est une carte affichant les POI avec des icônes différentes par catégorie. Des boutons permettent de filtrer (ex: "Afficher seulement les écoles").
- **Clustering** : Si les points sont trop proches, les regrouper en un cercle chiffré pour garder la carte lisible.
- **Formulaire d'ajout rapide** : Permettre d'ajouter un lieu en saisissant simplement son nom et son adresse. La géolocalisation doit être automatique.

---

## ⚙️ Contraintes techniques

- **Géocodage** : La conversion d'une adresse postale en coordonnées GPS (latitude/longitude) nécessite l'appel à une API externe (ex: Nominatim pour une solution open-source, ou des services payants comme Google Maps Geocoding API, Mapbox, etc.).

---

## 🏁 Conclusion

C'est la **carte des flux humains de la ville**.
