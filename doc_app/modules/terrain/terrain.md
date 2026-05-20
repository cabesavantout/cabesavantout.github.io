# 🚶 Module Terrain

## 🧠 Objectif

Le module Terrain est le **système de mémoire et d’action opérationnelle**.

Il permet de :
- capturer ce qui se passe réellement sur le terrain
- structurer les retours (faits, perceptions, signaux faibles)
- organiser et suivre les actions locales

👉 afin de transformer l’activité terrain en **apprentissage + décisions + stratégie**.

---

## ❓ Question clé

👉 Qu’a-t-on vu, fait, appris… et que doit-on faire ensuite ?

---

## 🧩 Rôle dans l’application

- Source principale de réalité
- Complément des données froides (élections, INSEE)
- Base des décisions stratégiques (via Campagne)

Le module Terrain **n’est pas** :
- un simple journal
- un CRM classique

👉 C’est un **système de capitalisation et d’action**.

---

## 🧱 Structure du module

### 1. Vue terrain

#### Objectif
Avoir une vision rapide de l’activité terrain.

#### Contenu
- dernières actions
- zones actives / inactives
- volume d’activité
- tendances récentes

#### Contraintes
- très synthétique

---

### 2. Retours terrain

#### Objectif
Capturer les observations et verbatims.

#### Contenu
- notes terrain
- verbatims citoyens
- problèmes remontés
- ressentis

#### Champs clés
- date
- lieu (zone / rue / bureau)
- type (porte-à-porte, marché, discussion…)
- contenu
- tags (thème, urgence…)

#### Contraintes
- rapide à saisir
- mobile-first

---

### 3. Porte-à-porte

#### Objectif
Suivre les actions ciblées.

#### Contenu
- zones couvertes
- nombre de contacts
- retours principaux
- suivi des passages

---

### 4. Tractage

#### Objectif
Suivre la diffusion terrain.

#### Contenu
- lieux
- dates
- volumes
- réactions

---

### 5. Boîtage

#### Objectif
Suivre la distribution en boîte aux lettres.

#### Contenu
- zones couvertes
- dates
- supports diffusés

---

### 6. Présences locales

#### Objectif
Tracer la présence publique.

#### Contenu
- marchés
- événements
- réunions publiques

---

### 7. Signalements

#### Objectif
Centraliser les problèmes locaux.

#### Contenu
- type de problème
- localisation
- gravité
- suivi

---

### 8. Actions à venir

#### Objectif
Organiser le terrain à court terme.

#### Contenu
- actions planifiées
- zones ciblées
- objectifs

---

### 9. Historique terrain

#### Objectif
Construire une mémoire exploitable.

#### Contenu
- historique consolidé
- évolution des retours

---

## 🔄 Interactions avec les autres modules

| Module | Interaction |
|--------|------------|
| Campagne | alimente décisions et priorités |
| Dashboard | alimente activité récente |
| Territoire | rattache aux zones |
| Mandat | enrichit perception des promesses |
| Réseau | enrichit les contacts |
| Agenda | planifie les actions |

---

## 🧠 UX attendue

### Principes

- ultra rapide
- mobile-first
- orienté saisie

### Règles

- saisie en moins de 10 secondes
- formulaires courts
- accès direct depuis la carte

### Actions clés

- ajouter un retour
- consulter rapidement les derniers retours
- filtrer par zone

---

## ⚙️ Contraintes techniques

- saisie rapide (mobile)
- géolocalisation possible
- stockage structuré (tags, liens)
- synchronisation rapide

---

## 🧠 Modèle de données simplifié

Entité principale : Retour terrain

Champs :
- id
- date
- type
- contenu
- localisation
- tags

Relations :
- zone
- promesse (optionnel)
- contact (optionnel)

---

## 🚫 Pièges à éviter

- formulaires trop longs
- structure trop rigide
- données inutilisables
- absence de lien avec les autres modules

---

## 🚀 Roadmap d’implémentation

### Phase 1
- retours terrain
- vue simple

### Phase 2
- porte-à-porte
- tractage
- actions à venir

### Phase 3
- signalements
- historique

---

## 🏁 Conclusion

Le module Terrain doit devenir :

👉 la mémoire vivante du terrain
👉 la source principale des insights réels
👉 le moteur d’amélioration de la stratégie

C’est le **module qui rend l’application vivante**.