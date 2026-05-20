# 🧩 Sous-module Terrain — Actions

## 🧠 Objectif

Le sous-module **Actions** permet de planifier, suivre et piloter les **actions terrain à venir et en cours**.

Il sert à :
- transformer les insights (retours, signalements) en actions concrètes
- organiser les interventions par zone et par objectif
- suivre l’avancement et l’efficacité

👉 afin de passer du constat à **l’exécution structurée**.

---

## ❓ Question clé

👉 Quelles actions devons-nous mener, où, quand et avec quel objectif ?

---

## 🧩 Rôle dans le module Terrain

- Pont entre **analyse (retours, signalements)** et **exécution**
- Outil de planification opérationnelle
- Support de priorisation

Alimente :
- **Agenda** (planification)
- **Dashboard** (à faire aujourd’hui)
- **Campagne** (exécution des priorités)

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Quelles actions sont prévues ?
2. Sur quelles zones ?
3. Avec quels objectifs ?
4. Qui est impliqué ?
5. Quelles actions sont en retard ou non réalisées ?

---

## 🧱 Structure recommandée

### 1. Vue liste

#### Objectif
Lister toutes les actions.

#### Contenu
- titre
- type (porte-à-porte, tractage, réunion…)
- zone
- date prévue
- statut (à faire, en cours, terminé, annulé)
- priorité

#### Actions
- ouvrir fiche
- filtrer
- changer statut

---

### 2. Vue fiche action

#### Objectif
Détailler et piloter une action.

#### Blocs

##### A. En-tête
- titre
- type
- statut
- priorité

##### B. Planification
- date
- durée
- zone

##### C. Objectifs
- objectif principal
- indicateurs (ex : nombre de contacts)

##### D. Participants
- personnes impliquées

##### E. Liens
- retours terrain
- signalements
- zone (Territoire)

##### F. Résultats (post-action)
- nombre de contacts
- observations
- liens vers retours terrain

##### G. Suivi
- prochaine étape
- actions complémentaires

---

### 3. Vue priorités

#### Objectif
Identifier les actions importantes.

#### Contenu
- actions urgentes
- actions en retard
- actions critiques

---

## 🧠 Données attendues

### Minimales
- titre
- type
- date
- zone
- statut

### Enrichies
- objectifs
- participants
- résultats
- liens (retours, signalements)

---

## 🧠 Types d’actions

- Porte-à-porte
- Tractage
- Boîtage
- Réunion locale
- Présence terrain
- Action spécifique (à définir)

---

## 🧠 Statuts

- À faire
- Planifiée
- En cours
- Terminée
- Annulée

---

## 🔄 Interactions

| Module | Interaction |
|--------|------------|
| Retours terrain | origine des actions |
| Signalements | déclencheur |
| Territoire | zone |
| Agenda | planification |
| Dashboard | suivi |

---

## 🧠 UX attendue

### Principes

- simple
- rapide
- orientée action

### Règles

- création rapide
- statut visible
- priorité claire

### Actions clés

- créer une action
- modifier statut
- voir les priorités

---

## ⚙️ Contraintes techniques

- gestion des statuts
- liens multiples

---

## 🚫 Pièges à éviter

- transformer en outil complexe de gestion de projet
- trop de champs inutiles

---

## 📏 Critères de réussite

- créer une action en quelques secondes
- suivre facilement l’avancement

---

## 🚀 Roadmap

### Phase 1
- liste + création simple

### Phase 2
- priorités + filtres

### Phase 3
- résultats + analyse

---

## 🏁 Conclusion

Le sous-module Actions doit devenir :

👉 le moteur d’exécution
👉 le lien entre stratégie et terrain

C’est le **module qui transforme les insights en actions concrètes**.