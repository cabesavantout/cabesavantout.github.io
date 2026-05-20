# 🧩 Sous-module Terrain — Signalements

## 🧠 Objectif

Le sous-module **Signalements** permet de recenser, qualifier et suivre les **problèmes concrets du territoire** remontés par les habitants ou observés sur le terrain.

Il sert à :

- centraliser les incidents locaux (voirie, propreté, sécurité, nuisances…)
- prioriser les problèmes par gravité et récurrence
- suivre leur évolution (résolu / en cours / ignoré)
- relier chaque signalement à une zone, un sujet et éventuellement une promesse

👉 afin de transformer les problèmes locaux en **leviers d’action et d’argumentation**.

---

## ❓ Question clé

👉 Quels sont les problèmes concrets du quotidien, où se situent-ils, et que fait-on dessus ?

---

### 🥇 Priorité Produit

- **Essentiel** : La capture de la preuve (photo) et sa géolocalisation automatique.
- **Secondaire** : Le suivi administratif de la résolution (qui se fait plus tard, sur desktop).

---

## 🧩 Rôle dans le module Terrain

- Source structurée des **problèmes locaux**
- Complément des **Retours terrain** (qui sont plus libres)
- Base d’actions concrètes et de priorisation

Alimente :

- **Campagne** (angles d’attaque / propositions)
- **Mandat** (écart promesses ↔ réalité)
- **Dashboard** (alertes critiques)
- **Communication** (cas concrets, exemples)
- **Territoire** (cartographie des problèmes)

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Quels problèmes reviennent le plus souvent ?
2. Où sont les zones les plus problématiques ?
3. Quels signalements sont critiques ?
4. Les problèmes sont-ils traités dans le temps ?
5. Quels sujets doivent devenir prioritaires politiquement ?

---

## 🧱 Structure recommandée

### 1. Vue liste

#### Objectif

Afficher l’ensemble des signalements avec priorisation.

#### Colonnes

- date
- type (voirie, propreté, sécurité…)
- zone / rue
- résumé
- gravité
- statut (nouveau / en cours / résolu / ignoré)
- récurrence (si applicable)

#### Actions

- ouvrir fiche
- filtrer (type, zone, statut, gravité)
- rechercher
- changer statut

---

### 2. Vue fiche signalement

#### Objectif

Décrire, qualifier et suivre un problème.

#### Blocs

##### A. En-tête

- date
- type
- localisation précise (zone, rue)
- gravité
- statut

##### B. Description

- description factuelle
- photos (avec récupération automatique des coordonnées GPS pour lier à une rue)
- verbatim associé (optionnel)

##### C. Contexte

- origine (habitant, observation, événement)
- fréquence / récurrence
- période (ponctuel / régulier)

##### D. Qualification

- thème (sécurité, cadre de vie…)
- impact (faible → critique)
- visibilité (discret → très visible)

##### E. Liens

- sujet (Mandat)
- promesse (si liée)
- retours terrain associés
- zone (Territoire)

##### F. Suivi

- statut
- actions réalisées
- prochaines actions
- date de dernière mise à jour

##### G. Historique

- changements de statut
- ajouts d’informations

---

### 3. Vue cartographique

#### Objectif

Visualiser les signalements sur la carte.

#### Contenu

- points géolocalisés
- clusters par zone
- codes couleur par gravité / statut

#### Actions

- cliquer pour ouvrir fiche
- filtrer par type / gravité

---

### 4. Vue synthèse

#### Objectif

Identifier les tendances et priorités.

#### Contenu

- top types de problèmes
- top zones problématiques
- évolution dans le temps
- signalements critiques ouverts

---

## 🧠 Données attendues

### Minimales

- id
- date
- type
- description
- localisation (zone / rue)
- statut

### Enrichies

- gravité
- récurrence
- photos
- tags / thèmes
- liens (promesse, sujet, retours)
- historique

### 🧱 Règles de structuration

- **Compression d'images** : Les photos doivent être redimensionnées/compressées côté client avant upload pour économiser la data mobile.
- **Extraction EXIF** : Récupération des coordonnées GPS directement depuis les métadonnées de la photo si la géolocalisation navigateur échoue.

---

## 🧠 Typologie recommandée

### Types de signalements

- Voirie (trous, dégradation)
- Propreté (déchets, dépôts)
- Sécurité (éclairage, incivilités)
- Cadre de vie (bruit, nuisances)
- Équipements (écoles, espaces publics)
- Autres

### Statuts

- Nouveau
- En cours
- Résolu
- Ignoré / non traité

### Gravité

- Faible
- Moyenne
- Élevée
- Critique

---

## 🔄 Interactions

| Module          | Interaction                  |
| --------------- | ---------------------------- |
| Retours terrain | source des signalements      |
| Territoire      | géolocalisation              |
| Mandat          | lien avec promesses / sujets |
| Campagne        | priorisation politique       |
| Dashboard       | alertes critiques            |
| Communication   | cas concrets                 |

---

## 🧠 UX attendue

### Principes

- saisie rapide
- visualisation claire
- priorisation évidente

### Règles

- formulaire court (mobile)
- possibilité d’ajouter photo en 1 clic (couplage Photo/GPS pour diviser le temps de saisie par deux)
- statuts simples et visibles
- carte accessible rapidement

### Actions clés

- créer un signalement en < 15s
- changer le statut
- lier à un sujet / promesse
- filtrer par zone / gravité

### 🎨 Recommandations UI & Interactions

- **Bouton flottant (FAB)** : Un gros bouton "Appareil photo" toujours visible en bas de l'écran. Le clic ouvre l'appareil photo natif. Une fois la photo prise, l'application crée un brouillon de signalement avec la géolocalisation pré-remplie.
- **Map Clustering** : Sur la carte, regrouper les points proches (ex: une bulle "12") pour ne pas faire planter le navigateur avec 500 pins affichés en même temps.
- **Code couleur d'urgence** : Rouge = Danger immédiat (trou voirie), Jaune = Nuisance (dépôt sauvage), Gris = Résolu.

---

## ⚙️ Contraintes techniques

- **Géolocalisation automatique** : lat/lng via métadonnées EXIF des photos + rattachement à la rue/zone via une requête spatiale (PostGIS `ST_Contains`).
- stockage médias (photos)
- indexation pour recherche et filtres
- gestion d’historique simple

---

## 🚫 Pièges à éviter

- formulaire trop complexe → décourage la saisie
- trop de catégories → perte de lisibilité
- absence de suivi → perte de valeur
- données non liées au reste du système

---

## 📏 Critères de réussite

- ajouter un signalement très rapidement
- voir immédiatement les plus critiques
- identifier les zones problématiques
- suivre l’évolution d’un problème dans le temps

---

## 🚀 Roadmap

### Phase 1 — MVP

- création signalement
- liste avec filtres basiques
- statuts simples

### Phase 2 — Structuration

- gravité + types
- liens avec territoire et retours
- vue carte

### Phase 3 — Pilotage

- synthèse / tendances
- récurrence
- alertes automatiques (ex : X signalements similaires)

---

## 🏁 Conclusion

Le sous-module **Signalements** doit devenir :

👉 le radar des problèmes locaux
👉 le levier de priorisation terrain
👉 une base d’arguments concrets

C’est un **outil politique extrêmement puissant** s’il est bien utilisé.
