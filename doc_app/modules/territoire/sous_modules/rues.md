# 🧩 Sous-module Territoire — Rues

## 🧠 Objectif

Le sous-module **Rues** permet de structurer le territoire à une **échelle ultra fine et opérationnelle**.

Il sert à :

- relier chaque rue à un bureau de vote
- préparer les actions terrain (porte-à-porte, tractage)
- analyser les dynamiques locales très précises
- suivre la couverture terrain

👉 afin de passer d’une logique "zone large" à une logique **hyper ciblée**.

---

## ❓ Question clé

👉 Que se passe-t-il rue par rue, et comment agir précisément ?

---

## 🧩 Rôle dans le module Territoire

- Niveau le plus fin du territoire
- Lien direct entre **Bureaux de vote** et **Terrain**
- Base de préparation opérationnelle

Alimente :

- **Terrain** (porte-à-porte, tractage)
- **Bureaux de vote** (rattachement)
- **Campagne** (micro-ciblage)
- **Dashboard** (couverture)

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Quelles rues composent un bureau de vote ?
2. Quelles rues ont été couvertes ?
3. Où faut-il intervenir en priorité ?
4. Quelles rues concentrent des problèmes ou retours ?

---

## 🧱 Structure recommandée

### 1. Vue liste

#### Objectif

Lister toutes les rues.

#### Contenu

- nom de la rue
- bureau de vote associé
- secteur
- couverture terrain (oui/non/partiel)
- taux de pénétration (ratio de contacts)
- nombre de retours

#### Actions

- ouvrir fiche
- filtrer (bureau, couverture)
- rechercher

---

### 2. Vue fiche rue

#### Objectif

Analyser une rue.

#### Blocs

##### A. En-tête

- nom
- bureau de vote
- secteur

##### B. Couverture terrain

- porte-à-porte réalisé
- tractage réalisé
- présence
- taux de pénétration (ratio : contacts Réseau / nombre d'habitants de la rue, pour évaluer l'influence réelle par foyer)

##### C. Retours terrain

- liste des retours
- synthèse

##### D. Signalements

- problèmes identifiés

##### E. Analyse

- niveau d’attention
- potentiel stratégique

##### F. Suivi

- actions à mener

---

### 3. Vue cartographique

#### Objectif

Visualiser les rues.

#### Contenu

- carte
- rues colorées (couverture / priorité)

---

## 🧠 Données attendues

### Minimales

- nom rue
- bureau_de_vote_id
- geometrie (GeoJSON LineString ou MultiLineString)

### Enrichies

- `coverage_status` (calculé depuis `Historique terrain`)
- `reports_count` (calculé depuis `Retours terrain`)
- `issues_count` (calculé depuis `Signalements`)

### 🧱 Règles de structuration

- **Source de vérité** : La géométrie des rues et leur rattachement aux bureaux de vote doit provenir d'un import de données officielles (ex: BAN/FANTOIR en France) pour garantir la cohérence.
- **Immuabilité** : Une rue est une entité de référence. On ne la supprime pas, on la fusionne ou on la désactive si le plan de la ville change.

---

## 🧠 Indicateurs clés

- couverture terrain
- nombre de retours
- nombre de signalements
- taux de pénétration
- priorité

---

## 🔄 Interactions

| Module          | Interaction  |
| --------------- | ------------ |
| Bureaux de vote | rattachement |
| Terrain         | actions      |
| Signalements    | problèmes    |
| Campagne        | ciblage      |

---

## 🧠 UX attendue

- simple
- opérationnelle
- orientée action
- adaptée au contexte terrain (bouton "Autour de moi" pour voir la rue actuelle)

### 🎨 Recommandations UI & Interactions

- **Interactions Carte** :
  - Au survol (`hover`) d'une rue sur la carte, afficher son nom et ses KPIs de base dans une infobulle (tooltip).
  - Au clic, ouvrir un panneau latéral avec la "Fiche rue" détaillée.
- **Légende dynamique** : La légende de la carte doit être claire et permettre de comprendre le code couleur (ex: Vert = Couvert, Rouge = Prioritaire).

---

## ⚙️ Contraintes techniques

- **Base de données spatiale** : Nécessite une base de données supportant les requêtes géographiques (ex: PostGIS pour PostgreSQL) pour pouvoir, par exemple, retrouver toutes les rues dans un polygone.
- **Performance d'affichage** : Pour la vue cartographique, les géométries des rues doivent être simplifiées (ex: `ST_Simplify`) à des niveaux de zoom élevés pour ne pas surcharger le navigateur.
- **Calcul d'indicateurs** : Les KPIs par rue (`couverture`, `nombre de retours`) doivent être calculés via des tâches de fond (cron jobs) ou des vues matérialisées pour ne pas ralentir l'affichage.

---

## 🚫 Pièges à éviter

- données incomplètes
- manque de mise à jour

---

## 📏 Critères de réussite

- préparer facilement une action terrain
- visualiser la couverture

---

## 🚀 Roadmap

### Phase 1

- liste rues

### Phase 2

- fiche + liens terrain

### Phase 3

- carte

---

## 🏁 Conclusion

Le sous-module Rues doit devenir :

👉 l’outil de micro-ciblage terrain
👉 la base des actions précises

C’est le **niveau opérationnel ultime du territoire**.
