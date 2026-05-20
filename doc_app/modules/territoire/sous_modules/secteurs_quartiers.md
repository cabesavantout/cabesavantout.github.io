# 🧩 Sous-module Territoire — Secteurs & Quartiers

## 🧠 Objectif

Le sous-module **Secteurs & Quartiers** est le découpage de la ville selon sa réalité sociologique et militante, au-delà des frontières administratives.

Il sert à :

- organiser la ville en grandes zones de responsabilité militante
- nommer les quartiers tels que les habitants les appellent réellement (ex: "La Germanor")
- agréger les problèmes et retours terrain par zone de vie

---

## ❓ Question clé

👉 Comment la ville est-elle vécue par les habitants et comment s'y organise-t-on ?

---

## 🧩 Rôle dans le module Territoire

- C'est la couche macroscopique. Un Secteur regroupe souvent plusieurs Quartiers ou Bureaux.

Alimente :

- **Réseau (Équipe)** : Affectation d'un "Référent de Secteur".

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Qui est notre responsable d'équipe sur le Quartier Sud ?
2. Quelle est la liste des signalements ouverts dans ce quartier spécifique ?

---

## 🧱 Structure recommandée

### 1. Fiche Secteur / Quartier

- **Cartographie** : Délimitation de la zone.
- **Responsabilité** : Le ou les référents de l'équipe affectés.
- **Synthèse locale** : Agrégation des Retours Terrain, Signalements et Contacts (Citoyens) domiciliés dans cette zone.

---

## 🧠 Données attendues

- Entité `Sector` : `id`, `name`, `geometry` (GeoJSON Polygon), `referent_id` (lien vers `team_members`).

---

## 🧠 UX attendue

### Principes

- C'est l'écran privilégié des "Référents de quartier". Ils doivent y voir en un clic tout ce qui concerne leur zone d'action.

### 🎨 Recommandations UI & Interactions

- **Outil de dessin de zone** : Interface cartographique simple permettant à un admin de dessiner ou d'ajuster les polygones des quartiers à la main.
- **Dashboard de Secteur** : La fiche d'un secteur doit se présenter comme un mini-dashboard avec :
  - Les KPIs clés (Nb de sympathisants, Humeur moyenne des retours, Nb de signalements ouverts).
  - Une carte de la zone avec les points chauds.
  - Le flux d'activité récent dans le secteur.

---

## ⚙️ Contraintes techniques

- **Création des polygones** : L'interface de dessin doit s'appuyer sur une librairie cartographique robuste (ex: Leaflet.js, Mapbox GL JS). Les polygones sont stockés en format GeoJSON.
- **Agrégation spatiale** : Pour calculer les KPIs d'un secteur, il faut exécuter des requêtes spatiales qui comptent les points (signalements, citoyens) contenus dans le polygone du secteur (`ST_Contains` ou `ST_Within` en PostGIS).

---

## 🏁 Conclusion

C'est le **maillage sociologique et militant du territoire**.
