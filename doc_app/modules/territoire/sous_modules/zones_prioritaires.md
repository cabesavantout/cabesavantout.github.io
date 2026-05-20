# 🧩 Sous-module Territoire — Zones prioritaires / Zones d’attention

## 🧠 Objectif

Le sous-module **Zones prioritaires** permet d’identifier, suivre et piloter les **zones à fort enjeu** du territoire.

Il sert à :
- synthétiser les signaux (élections, terrain, population, signalements)
- classer les zones selon leur importance stratégique
- orienter les actions (terrain, communication, mobilisation)

👉 afin de concentrer l’effort là où il a **le plus d’impact**.

---

## ❓ Question clé

👉 Où faut-il concentrer nos efforts maintenant pour maximiser l’impact ?

---

## 🧩 Rôle dans le module Territoire

- Couche de **priorisation transversale**
- Synthèse des autres sous-modules (Bureaux, Rues, Secteurs, Lieux)
- Outil de décision opérationnelle

Alimente :
- **Campagne** (priorités stratégiques)
- **Terrain** (plan d’actions)
- **Dashboard** (à faire / alertes)
- **Communication** (ciblage localisé)

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Quelles zones sont prioritaires ?
2. Pourquoi le sont-elles (données, terrain, risques) ?
3. Quelles actions mener immédiatement ?
4. Comment évoluent les priorités dans le temps ?

---

## 🧱 Structure recommandée

### 1. Vue liste des zones

#### Objectif
Afficher les zones priorisées.

#### Contenu
- nom de la zone (secteur / bureau / agrégat)
- niveau de priorité (faible → critique)
- type (à conquérir / à défendre / à surveiller)
- raisons principales (badges courts)
- dernière mise à jour

#### Actions
- ouvrir fiche
- filtrer (priorité, type, secteur)
- trier par urgence

---

### 2. Vue fiche zone

#### Objectif
Comprendre rapidement une zone et agir.

#### Blocs

##### A. En-tête
- nom de la zone
- type de zone (secteur / bureau / custom)
- niveau de priorité
- type (conquête / défense / surveillance)

##### B. Pourquoi prioritaire
- résumé des signaux (3–5 points max)
  - résultats électoraux
  - participation
  - retours terrain
  - signalements

##### C. Données clés
- tendance électorale
- évolution récente
- volume de retours / signalements
- couverture terrain

##### D. Terrain
- actions récentes
- actions prévues
- trous de couverture

##### E. Population
- éléments INSEE utiles (ex : profils dominants)

##### F. Messages / angles
- angles recommandés
- sujets sensibles

##### G. Plan d’action
- actions à mener (liste courte)
- échéances
- responsables (si applicable)

##### H. Suivi
- statut (en suivi / traité / à réévaluer)
- historique des changements

---

### 3. Vue cartographique

#### Objectif
Voir les priorités sur la carte.

#### Contenu
- zones colorées par priorité
- filtres (type, priorité)
- accès rapide aux fiches

---

### 4. Vue dynamique / évolution

#### Objectif
Suivre les changements dans le temps.

#### Contenu
- évolution de la priorité
- événements déclencheurs (pics de signalements, résultats, actions)

---

## 🧠 Modèle de priorisation (simple)

Score indicatif basé sur :
- 🔴 Écart électoral / potentiel
- 🟠 Faible participation
- 🟡 Volume de signalements
- 🟢 Couverture terrain insuffisante

👉 priorité = combinaison pondérée (simple au début)

---

## 🧠 Données attendues

### Minimales
- id zone
- type (secteur / bureau / custom)
- priorité
- type stratégique

### Enrichies
- raisons (tags)
- métriques (scores, volumes)
- liens (bureaux, rues, actions)
- historique

---

## 🧠 Typologie recommandée

### Types de zones
- Bureau de vote
- Secteur / quartier
- Zone personnalisée (agrégat de rues / points)

### Types stratégiques
- À conquérir
- À défendre
- À surveiller

### Niveaux de priorité
- Faible
- Moyen
- Élevé
- Critique

---

## 🔄 Interactions

| Module | Interaction |
|--------|------------|
| Bureaux de vote | base électorale |
| Rues | couverture fine |
| Secteurs | regroupement |
| Lieux utiles | points d’action |
| Terrain | actions / retours |
| Campagne | priorités |
| Dashboard | alertes |
| Communication | ciblage |

---

## 🧠 UX attendue

### Principes
- très synthétique
- orientée décision
- actionnable en 10 secondes

### Règles
- afficher d’abord : priorité + pourquoi + actions
- limiter le texte
- privilégier listes courtes et indicateurs

### Actions clés
- créer une zone prioritaire
- modifier la priorité
- lancer une action associée
- filtrer par urgence

---

## ⚙️ Contraintes techniques

- agrégation multi-sources (élections, terrain, population)
- recalcul simple des priorités
- historisation légère
- compatibilité carte

---

## 🚫 Pièges à éviter

- sur-complexifier le scoring
- multiplier les zones sans valeur
- perdre la lisibilité des raisons
- ne pas mettre à jour

---

## 📏 Critères de réussite

- identifier les zones clés en < 5 secondes
- comprendre pourquoi une zone est prioritaire
- savoir immédiatement quoi faire
- voir l’évolution dans le temps

---

## 🚀 Roadmap

### Phase 1 — MVP
- création manuelle des zones
- priorité simple
- fiche synthétique

### Phase 2 — Structuration
- liens avec bureaux / secteurs
- raisons (tags)
- vue carte

### Phase 3 — Pilotage
- scoring simple automatisé
- évolution dans le temps
- suggestions d’actions

---

## 🏁 Conclusion

Le sous-module **Zones prioritaires** doit devenir :

👉 le centre de décision territoriale
👉 la synthèse des données et du terrain
👉 le déclencheur d’actions

C’est le **module qui transforme l’information en priorités concrètes**.

