# ⚙️ Module Administration

## 🧠 Objectif

Le module Administration est le **socle technique, structurel et de gouvernance** de l’application.

Il permet de :
- piloter les sources de données
- gérer les imports et synchronisations
- maintenir les référentiels communs
- garantir la qualité, la cohérence et la stabilité du système

👉 afin que l’application reste **fiable, maintenable et évolutive**.

---

## ❓ Question clé

👉 Comment l’application est-elle alimentée, structurée et maintenue dans le temps ?

---

## 🧩 Rôle dans l’application

- Référentiel technique transverse
- Point de contrôle de la qualité des données
- Support de maintenance et d’évolution
- Base de préparation à une future ouverture multi-utilisateur

Le module Administration **n’est pas** :
- une simple page de paramètres
- un module secondaire négligeable

👉 Il **garantit la solidité de toute l’application**.

---

## 🧱 Structure du module

### 1. Vue admin

#### Objectif
Donner une vue rapide de l’état technique de l’application.

#### Contenu
- état des sources
- derniers imports
- alertes qualité
- données manquantes ou en erreur
- modules ou référentiels à vérifier

#### Contraintes
- synthétique
- orientée contrôle

---

### 2. Sources de données

#### Objectif
Centraliser les origines de toutes les données exploitées.

#### Contenu
- nom de la source
- type (site, CSV, API, document, saisie manuelle)
- fréquence de mise à jour
- fiabilité
- statut (active, à surveiller, inactive)
- module(s) impacté(s)

#### Exemples
- INSEE
- résultats électoraux
- actes municipaux
- saisies terrain
- imports manuels

---

### 3. Imports / synchronisations

#### Objectif
Piloter les chargements de données.

#### Contenu
- historique des imports
- date et heure
- source
- volume importé
- statut (ok, partiel, erreur)
- logs simplifiés

#### Actions
- relancer un import
- marquer un import comme vérifié
- identifier une anomalie

---

### 4. Tags / taxonomies

#### Objectif
Maintenir les catégories transverses de l’application.

#### Contenu
- thèmes
- types de documents
- types de retours terrain
- niveaux de priorité
- statuts métier
- catégories de contacts

#### Contraintes
- centralisé
- réutilisable dans tous les modules
- éviter les doublons

---

### 5. Référentiels

#### Objectif
Maintenir les listes structurantes utilisées partout.

#### Contenu
- référentiel des zones
- référentiel des types d’élection
- référentiel des thématiques
- statuts de promesses
- types d’événements
- types d’actions terrain

#### Différence avec taxonomies
- taxonomies = étiquettes souples
- référentiels = structures métier plus stables

---

### 6. Paramètres

#### Objectif
Gérer les réglages généraux de l’application.

#### Contenu
- préférences d’affichage
- règles de priorisation simples
- seuils d’alertes
- paramètres de carte
- paramètres de recherche

#### Contraintes
- peu nombreux
- utiles
- compréhensibles

---

### 7. Utilisateurs

#### Objectif
Préparer une éventuelle ouverture future.

#### Contenu
- utilisateurs
- rôles
- droits d’accès
- permissions par module

#### Statut recommandé
- non prioritaire pour maintenant
- à cadrer, pas forcément à implémenter tout de suite

---

### 8. Journal technique

#### Objectif
Tracer les événements techniques utiles.

#### Contenu
- erreurs d’import
- anomalies de synchronisation
- actions d’administration
- incidents simples

#### Contraintes
- lisible
- pas trop verbeux

---

### 9. Qualité des données

#### Objectif
Identifier les problèmes de données avant qu’ils contaminent les modules métier.

#### Contenu
- doublons
- valeurs manquantes
- incohérences
- rattachements absents
- données orphelines

#### Actions
- signaler
- corriger
- marquer comme à revoir

---

## 🔄 Interactions avec les autres modules

| Module | Interaction |
|--------|------------|
| Dashboard | peut remonter certaines alertes système |
| Mandat | dépend des référentiels et statuts |
| Territoire | dépend des référentiels géographiques |
| Élections | dépend des imports et identifiants cohérents |
| Population | dépend des sources et séries temporelles |
| Terrain | dépend des tags et types d’actions |
| Réseau | dépend des catégories de contacts |
| Agenda | dépend des types d’événements |
| Documentation | dépend des sources, tags et indexation |
| Communication | dépend des thèmes, statuts et canaux |

---

## 🧠 UX attendue

### Principes

- très claire
- très fonctionnelle
- sans décoration inutile
- pensée contrôle et maintenance

### Règles

- faire apparaître rapidement ce qui dysfonctionne
- rendre les actions de correction simples
- distinguer clairement ce qui est critique, mineur, informatif

### Actions clés

- voir une erreur d’import
- vérifier une source
- corriger une taxonomie
- repérer une incohérence de données

---

## ⚙️ Contraintes techniques

- historisation minimale des imports
- gestion d’identifiants stables
- support de validations simples
- possibilité de journaliser les erreurs
- capacité de relancer certains traitements

---

## 🧠 Modèle de données simplifié

Entités principales :
- Source
- Import
- Taxonomie
- Référentiel
- Paramètre
- Incident / Alerte qualité

Champs clés :
- type
- statut
- date
- module lié
- gravité

Relations :
- source ↔ import
- taxonomie ↔ modules
- alerte qualité ↔ entité impactée

---

## 🚫 Pièges à éviter

- cacher l’état réel des données
- multiplier les paramètres inutiles
- créer un back-office complexe avant besoin réel
- mélanger maintenance technique et logique métier
- sous-estimer la qualité des données

---

## 🚀 Roadmap d’implémentation

### Phase 1
- sources de données
- imports / synchronisations
- qualité des données (version simple)

### Phase 2
- tags / taxonomies
- référentiels
- paramètres

### Phase 3
- journal technique
- utilisateurs / rôles (si besoin futur)

---

## 🏁 Conclusion

Le module Administration doit devenir :

👉 le centre de contrôle technique
👉 le garant de la cohérence globale
👉 le filet de sécurité de toute l’application

C’est le **socle invisible mais indispensable** de la webapp.

