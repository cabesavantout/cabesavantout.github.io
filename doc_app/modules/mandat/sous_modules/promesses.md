# 🧩 Sous-module Mandat — Promesses

## 🧠 Objectif

Le sous-module **Promesses** est le cœur du module Mandat.

Il permet de :

- recenser les engagements formulés
- suivre leur état d’avancement
- évaluer leur crédibilité politique
- rattacher chaque promesse à des preuves, des décisions, des zones et des actions

👉 afin de disposer d’une lecture claire de ce qui a été annoncé, fait, partiellement fait, retardé, fragilisé ou non vérifiable.

---

## ❓ Question clé

👉 Quelles promesses ont été faites, où en sont-elles réellement, et lesquelles sont politiquement sensibles ?

---

### 🥇 Priorité Produit

- **Essentiel** : Identifier instantanément les promesses à risque (financier, politique ou calendaire) pour éviter les attaques adverses.
- **Secondaire** : L'historique exhaustif des modifications du texte de la promesse.

## 🧩 Rôle dans le module Mandat

Le sous-module Promesses est :

- le point d’entrée principal du suivi du mandat
- la base du discours politique
- un outil de qualification, pas un simple tableau

Il alimente directement :

- **Campagne** pour les angles politiques
- **Dashboard** pour les alertes et priorités
- **Communication** pour les messages
- **Documentation** pour les preuves
- **Territoire** si une promesse concerne une zone précise

---

## 🎯 Finalité métier

Ce sous-module doit permettre de répondre à 5 questions :

1. Quelles sont les promesses du mandat ?
2. Où en est chacune d’elles ?
3. Qu’est-ce qui prouve qu’elle avance, bloque ou dérive ?
4. Quelles promesses sont politiquement fragiles ?
5. Quelles actions faut-il lancer pour compléter l’analyse ?

---

## 🧱 Structure recommandée du sous-module

### 1. Vue liste

#### Objectif

Offrir une vue synthétique de toutes les promesses.

#### Contenu attendu

Chaque ligne de promesse doit afficher au minimum :

- titre
- thématique
- statut d’avancement
- statut politique
- niveau de risque
- dernière mise à jour
- prochaine action
- zone concernée si applicable

#### Règles

- liste lisible
- tri simple
- filtres efficaces
- pas de surcharge de badges

#### Actions disponibles

- ouvrir la fiche promesse
- filtrer
- rechercher
- changer un statut si nécessaire
- rattacher une preuve ou une note

---

### 2. Vue fiche promesse

#### Objectif

Donner une lecture complète, structurée et exploitable d’une promesse.

#### Blocs recommandés

##### A. En-tête

- titre
- thématique
- statut d’avancement
- statut politique
- niveau de risque
- date de dernière mise à jour

##### B. Description

- formulation de la promesse
- reformulation interne si besoin
- source d’origine
- date / contexte de formulation

##### C. État réel

- ce qui a été fait
- ce qui n’a pas été fait
- ce qui reste flou
- ce qui est bloqué

##### D. Preuves

- documents associés
- décisions liées
- articles / sources externes
- éléments terrain utiles

##### E. Périmètre

- zone concernée
- public concerné
- sujet / sous-sujet lié

##### F. Analyse politique

- crédibilité perçue
- sensibilité du sujet
- angle d’attaque possible
- angle de défense possible

##### G. Suivi

- prochaine action
- informations manquantes
- vérifications à faire
- historique synthétique

---

### 3. Vue filtres / segmentation

#### Objectif

Permettre une lecture ciblée.

#### Filtres recommandés

- par thématique
- par statut d’avancement
- par statut politique
- par niveau de risque
- par zone
- par période
- par source
- par présence ou absence de preuves

#### Segments utiles

- promesses réalisées
- promesses fragiles
- promesses sans preuve
- promesses liées à un quartier
- promesses à vérifier
- promesses sensibles politiquement

---

### 4. Vue priorisation

#### Objectif

Faire émerger les promesses à traiter en priorité.

#### Logique de remontée possible

Une promesse doit remonter si elle cumule plusieurs critères :

- sujet politiquement sensible
- absence de preuve
- fort écart entre annonce et réalité
- blocage prolongé
- lien avec une zone importante
- remontées terrain négatives

#### Sortie attendue

- top promesses à surveiller
- top promesses à documenter
- top promesses à exploiter politiquement

---

## 🧠 Données attendues

### Données minimales

- identifiant
- titre
- description
- source
- date
- thématique
- statut d’avancement
- statut politique
- niveau de risque
- zone liée (optionnel)
- dernière mise à jour
- prochaine action

### Données enrichies

- documents liés
- décisions liées
- budget lié
- retours terrain liés
- notes internes
- historique des changements
- score de confiance / vérifiabilité

### 🧱 Règles de structuration

- **États finis** : Les statuts d'avancement ne sont pas du texte libre.
- **Preuve obligatoire** : Une promesse ne peut pas passer en "Réalisée" s'il n'y a pas au moins 1 document lié (garantie de la preuve).

---

## 🧠 Statuts recommandés

### 1. Statut d’avancement

Ce statut décrit l’état factuel.

Valeurs recommandées :

- Non démarrée
- En cours
- Partiellement réalisée
- Réalisée
- Bloquée
- Abandonnée
- Non vérifiable

### 2. Statut politique

Ce statut décrit la lecture politique.

Valeurs recommandées :

- Crédible
- Mitigée
- Fragile
- Critique
- Sensible

### 3. Niveau de risque

Ce statut aide à la priorisation.

Valeurs recommandées :

- Faible
- Moyen
- Élevé
- Très élevé

⚠️ Il faut limiter le nombre de statuts visibles en liste. Les détails peuvent rester dans la fiche.

---

## 🔄 Interactions avec les autres modules

| Module        | Interaction                                        |
| ------------- | -------------------------------------------------- |
| Dashboard     | remonte les promesses à risque                     |
| Campagne      | fournit les angles et priorités                    |
| Territoire    | rattache la promesse à une zone                    |
| Terrain       | apporte perception et signaux faibles              |
| Documentation | apporte les preuves                                |
| Communication | transforme une promesse en message ou argumentaire |
| Agenda        | permet de suivre les échéances liées               |

---

## 🧠 UX attendue

### Principes

- lecture rapide
- qualification simple
- profondeur accessible sans surcharge
- distinction nette entre fait et interprétation

### Règles UX

- une liste compacte mais lisible
- une fiche claire avec blocs distincts
- toujours montrer : statut, risque, prochaine action
- éviter les longs pavés de texte non structurés
- afficher les preuves sous forme de liens clairs

### Hiérarchie visuelle recommandée

1. titre et statuts
2. état réel
3. preuves
4. analyse politique
5. prochaines actions

### Actions clés utilisateur

- créer une promesse
- qualifier une promesse
- rattacher un document
- ajouter une note
- changer un statut
- filtrer les promesses sensibles

### 🎨 Recommandations UI & Interactions

- **Vue Kanban optionnelle** : En plus de la table, proposer une vue "Board" avec des colonnes par statut (En cours, Bloqué, Réalisé) pour animer les réunions stratégiques.
- **Indicateur de fraîcheur** : Une pastille temporelle (ex: "Modifié il y a 6 mois") en rouge si la promesse semble oubliée.

---

## ⚙️ Contraintes techniques

### Données

- il faut gérer les relations entre promesses et documents
- il faut rattacher une promesse à une ou plusieurs zones
- il faut prévoir des champs souples pour les notes internes

### Modèle

- le modèle doit supporter l’historisation
- les statuts doivent être contrôlés par référentiel
- les liens avec les autres modules doivent être stables

### Performance

- recherche rapide
- filtres instantanés
- chargement progressif possible si le volume augmente

---

## 🧠 Modèle de données simplifié

### Entité principale

**Promesse**

### Champs principaux

- id
- titre
- description
- source_type
- source_reference
- date_source
- theme_id
- status_progress
- status_political
- risk_level
- zone_id (optionnel)
- next_action
- last_updated_at

### Relations

- promesse → documents
- promesse → décisions
- promesse → budget
- promesse → notes terrain
- promesse → zone
- promesse → historique

---

## ✅ Cas d’usage principaux

### Cas 1 — Suivre l’état d’une promesse

Je veux ouvrir une promesse et voir rapidement si elle est :

- avancée
- bloquée
- documentée
- politiquement fragile

### Cas 2 — Préparer un angle politique

Je veux retrouver toutes les promesses fragiles d’une thématique donnée pour préparer un discours ou un argumentaire.

### Cas 3 — Préparer un travail de vérification

Je veux afficher toutes les promesses sans preuve ou avec statut non vérifiable pour compléter la documentation.

### Cas 4 — Lire le mandat par zone

Je veux voir quelles promesses concernent un quartier ou un secteur précis.

### Cas 5 — Alimenter le dashboard

Je veux que certaines promesses critiques remontent automatiquement dans le dashboard.

---

## 🚫 Pièges à éviter

- transformer la promesse en simple document texte
- mélanger promesse, réalisation et décision dans une même entité
- multiplier les statuts incompréhensibles
- créer un système trop théorique impossible à maintenir
- perdre la différence entre preuve, interprétation et ressenti terrain

---

## 📏 Critères de réussite

Le sous-module est réussi si :

- je retrouve une promesse en quelques secondes
- je comprends immédiatement son état réel
- je vois ce qui manque pour la qualifier correctement
- je peux identifier les promesses politiquement sensibles
- je peux relier une promesse à des preuves et à une zone

---

## 🚀 Roadmap d’implémentation

### Phase 1 — MVP

- liste des promesses
- fiche promesse simple
- statuts d’avancement
- lien avec documents

### Phase 2 — Structuration politique

- statuts politiques
- niveau de risque
- filtres avancés
- prochaine action

### Phase 3 — Enrichissement transverse

- liens avec zones
- liens avec terrain
- historique
- priorisation automatique simple

---

## 🏁 Conclusion

Le sous-module **Promesses** doit devenir :

👉 la colonne vertébrale du module Mandat
👉 le point de vérité sur les engagements
👉 un outil de lecture politique et de priorisation

C’est probablement l’un des sous-modules **les plus importants de toute l’application**.
