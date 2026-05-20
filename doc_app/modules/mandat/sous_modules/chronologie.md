# 🧩 Sous-module Mandat — Chronologie

## 🧠 Objectif

Le sous-module **Chronologie** permet de reconstituer et visualiser l’**enchaînement des événements du mandat dans le temps**.

Il sert à :

- suivre la succession des promesses, décisions et réalisations
- identifier les retards, accélérations et ruptures
- comprendre la dynamique globale du mandat

👉 afin de donner une lecture **temporelle et narrative** du mandat.

---

## ❓ Question clé

👉 Comment le mandat a-t-il évolué dans le temps, et quels sont les moments clés ?

---

## 🧩 Rôle dans le module Mandat

- Met en perspective **Promesses, Décisions et Réalisations**
- Permet une lecture chronologique globale
- Sert de base à la narration politique (Communication)

Alimente :

- **Campagne** (analyse des dynamiques)
- **Dashboard** (événements récents / pics d’activité)
- **Communication** (storytelling)

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Quels sont les événements clés du mandat ?
2. Dans quel ordre les choses se sont-elles déroulées ?
3. Y a-t-il des périodes d’inactivité ou d’accélération ?
4. Quelles séquences politiques émergent ?

---

## 🧱 Structure recommandée

### 1. Vue chronologique globale

#### Objectif

Afficher une timeline du mandat.

#### Contenu

- événements ordonnés par date
- regroupement possible par mois / année
- codes visuels par type (promesse, décision, réalisation)

#### Actions

- naviguer dans le temps
- filtrer
- zoomer sur une période

---

### 2. Vue par période

#### Objectif

Analyser une période précise.

#### Contenu

- événements d’une période (ex : trimestre)
- résumé de la période

---

### 3. Vue par type d’événement

#### Objectif

Isoler un type.

#### Contenu

- uniquement promesses
- uniquement décisions
- uniquement réalisations

---

### 4. Vue séquences

#### Objectif

Identifier des blocs cohérents.

#### Contenu

- séquences politiques (ex : projet, polémique…)
- regroupement d’événements liés

---

## 🧠 Données attendues

### Minimales

- date
- type
- titre
- lien vers entité

### Enrichies

- description
- thématique
- zone
- importance

---

## 🧠 Types d’événements

- Promesse
- Décision
- Réalisation
- Événement politique

---

## 🔄 Interactions

| Module        | Interaction                  |
| ------------- | ---------------------------- |
| Promesses     | positionnement dans le temps |
| Décisions     | enchaînement                 |
| Réalisations  | suivi                        |
| Communication | narration                    |
| Dashboard     | activité récente             |

---

## 🧠 UX attendue

- visuelle et fluide
- facile à parcourir
- filtres simples

### Actions clés

- naviguer
- filtrer
- ouvrir un élément

### 🎨 Recommandations UI & Interactions

- **Infinite Scroll / Timeline** : Ligne verticale centrale continue. Les éléments s'affichent de part et d'autre selon leur nature (ex: Promesses à gauche, Réalisations à droite).
- **Sticky Headers** : Lors du défilement, le "Mois" et "l'Année" restent collés en haut de l'écran pour toujours savoir où l'on se trouve.
- **Mini-Map temporelle** : Une petite frise sur le côté droit de l'écran permettant de sauter rapidement de 2020 à 2024 d'un seul clic.

---

## ⚙️ Contraintes techniques

- **Requête Multi-tables (UNION ALL)** : Pour afficher des Promesses, Décisions et Réalisations sur la même ligne temporelle, créer une Vue SQL dédiée (`timeline_events`) qui normalise les colonnes (`entity_id`, `entity_type`, `title`, `event_date`, `status`).
- **Lazy Loading** : Ne jamais charger tout le mandat d'un coup (risque de freeze de la page web). Charger par blocs de 6 mois au défilement.
- **Événements dérivés** : La timeline doit s'auto-alimenter. Si la date de la `Décision X` est modifiée dans sa fiche, la timeline se met à jour sans action supplémentaire.

---

## 🚫 Pièges à éviter

- timeline trop dense
- manque de hiérarchie
- événements sans valeur

---

## 📏 Critères de réussite

- comprendre rapidement la dynamique du mandat
- identifier les moments clés
- voir les enchaînements

---

## 🚀 Roadmap

### Phase 1

- timeline simple

### Phase 2

- filtres
- regroupements

### Phase 3

- séquences

---

## 🏁 Conclusion

Le sous-module Chronologie doit devenir :

👉 la lecture temporelle du mandat
👉 le support du storytelling

C’est la **vision dynamique du mandat**.
