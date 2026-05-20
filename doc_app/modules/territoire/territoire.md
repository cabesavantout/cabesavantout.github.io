# 🗺️ Module Territoire

## 🧠 Objectif

Le module Territoire est la **lecture spatiale et opérationnelle** de la commune.

Il permet de :

- comprendre la structuration géographique
- relier données électorales, sociales et terrain
- organiser les actions (porte-à-porte, tractage, réunions)

👉 afin de savoir **où agir concrètement**.

---

## ❓ Question clé

👉 Sur quels espaces dois-je agir, et que se passe-t-il dans chaque zone ?

---

## 🧩 Rôle dans l’application

- Référentiel géographique
- Support des actions terrain
- Point de croisement des données (élections, population, terrain)

Le module Territoire **n’est pas** :

- une simple carte
- un outil SIG complexe

👉 C’est un outil **décisionnel et opérationnel**.

---

## 🧱 Structure du module

### 1. Vue cartographique

#### Objectif

Offrir une vision globale de la commune.

#### Contenu

- carte interactive
- couches activables
- zones visibles (bureaux, secteurs, quartiers)

#### Contraintes

- rapide
- lisible

---

### 2. Bureaux de vote

#### Objectif

Structurer la lecture électorale locale.

#### Contenu

- liste des bureaux
- rattachement géographique
- rues associées
- données électorales clés

#### Actions

- ouvrir fiche bureau
- voir sur carte

---

### 3. Quartiers

#### Objectif

Lecture politique et sociale par zone.

#### Contenu

- définition des quartiers
- caractéristiques générales
- rattachement aux bureaux

---

### 4. Secteurs

#### Objectif

Organiser le découpage terrain.

#### Contenu

- regroupement de rues
- logique opérationnelle
- zones d’action

#### Contraintes

- flexible
- modifiable

---

### 5. Rues

#### Objectif

Préparer les actions fines (porte-à-porte).

#### Contenu

- liste des rues
- rattachement à secteur / bureau

---

### 6. Lieux utiles

#### Objectif

Identifier les points stratégiques.

#### Contenu

- marchés
- écoles
- commerces
- équipements publics

---

### 7. Découpage terrain

#### Objectif

Créer une organisation personnalisée.

#### Contenu

- zones de tractage
- zones de porte-à-porte
- circuits terrain

---

### 8. Zones d’attention

#### Objectif

Identifier les zones prioritaires.

#### Sources

- Élections
- Terrain
- Campagne

#### Contenu

- zones faibles
- zones à potentiel
- zones sans activité

---

## 🔄 Interactions avec les autres modules

| Module     | Interaction            |
| ---------- | ---------------------- |
| Campagne   | zones prioritaires     |
| Dashboard  | alertes géographiques  |
| Mandat     | sujets liés à une zone |
| Élections  | résultats par bureau   |
| Population | données socio-démo     |
| Terrain    | actions réalisées      |
| Réseau     | contacts locaux        |

---

## 🧠 UX attendue

### Principes

- navigation rapide
- zoom progressif (commune → quartier → rue)
- actions accessibles depuis la carte

### Règles

- éviter surcharge visuelle
- privilégier filtres simples
- afficher infos essentielles uniquement

### Actions clés

- ouvrir fiche zone
- voir données associées
- lancer action terrain

---

## ⚙️ Contraintes techniques

- gestion cartographique (leaflet / mapbox / autre)
- performance (chargement rapide)
- gestion des couches
- géocodage des rues

---

## 🧠 Modèle de données simplifié

Entités principales :

- Bureau de vote
- Quartier
- Secteur
- Rue
- Lieu

Relations :

- rue → secteur → quartier → bureau
- bureau → données électorales

---

## 🚫 Pièges à éviter

- faire un outil trop complexe
- surcharger la carte
- dupliquer les données des autres modules

---

## 🚀 Roadmap d’implémentation

### Phase 1

- carte simple
- bureaux de vote
- secteurs

### Phase 2

- rues
- zones d’attention

### Phase 3

- lieux utiles
- découpage avancé

---

## 🏁 Conclusion

Le module Territoire doit devenir :

👉 le point d’entrée géographique
👉 l’outil de préparation terrain
👉 le lien entre données et action

C’est le **pont entre stratégie et réalité locale**.
