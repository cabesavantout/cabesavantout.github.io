# 👥 Module Population

## 🧠 Objectif

Le module Population est le **référentiel socio-démographique** de la commune.

Il permet de :
- comprendre qui vit dans la commune
- suivre les grandes caractéristiques sociales et résidentielles
- relier les données démographiques aux territoires et aux comportements électoraux

👉 afin d’éclairer **les priorités politiques, les messages et les zones d’action**.

---

## ❓ Question clé

👉 Qui vit ici, dans quelles conditions, et quelles réalités locales faut-il comprendre ?

---

## 🧩 Rôle dans l’application

- Source principale de lecture socio-démographique
- Complément des modules Élections et Territoire
- Base d’aide à la segmentation politique et territoriale

Le module Population **n’est pas** :
- un simple entrepôt de tableaux INSEE
- un module statistique trop technique

👉 Il **traduit les données en lecture utile pour l’action**.

---

## 🧱 Structure du module

### 1. Vue d’ensemble

#### Objectif
Donner une photographie rapide de la commune.

#### Contenu
- population totale
- évolution récente
- grands équilibres (âge, logement, ménages)
- principaux indicateurs clés

#### Contraintes
- lecture rapide
- très synthétique

---

### 2. Démographie

#### Objectif
Comprendre l’évolution de la population.

#### Contenu
- nombre d’habitants
- évolution dans le temps
- répartition générale
- croissance / stagnation / baisse

---

### 3. Âges

#### Objectif
Lire la structure par tranches d’âge.

#### Contenu
- jeunes
- actifs
- familles
- seniors
- vieillissement éventuel

#### Utilité
- segmentation politique
- messages ciblés
- lecture des besoins locaux

---

### 4. Ménages

#### Objectif
Comprendre la structure des foyers.

#### Contenu
- taille des ménages
- personnes seules
- couples
- familles avec enfants
- familles monoparentales

---

### 5. Logement

#### Objectif
Analyser la structure résidentielle.

#### Contenu
- propriétaires / locataires
- types de logements
- résidences principales / secondaires
- évolution du parc si disponible

#### Utilité
- lecture de stabilité résidentielle
- compréhension du cadre de vie

---

### 6. Catégories socio-professionnelles

#### Objectif
Comprendre la structure sociale.

#### Contenu
- retraités
- cadres
- employés
- ouvriers
- professions intermédiaires
- inactifs

#### Contraintes
- rester lisible
- éviter les tableaux bruts trop lourds

---

### 7. Mobilité

#### Objectif
Comprendre les dynamiques de déplacement et de résidence.

#### Contenu
- mobilité résidentielle
- déplacements domicile-travail si disponible
- ancrage local / renouvellement

---

### 8. Évolutions

#### Objectif
Suivre les transformations dans le temps.

#### Contenu
- évolution population
- évolution logement
- évolution structure des ménages
- évolution des âges

---

### 9. Indicateurs clés

#### Objectif
Offrir une lecture ultra resserrée pour un usage stratégique.

#### Contenu
- 5 à 10 indicateurs essentiels
- interprétation courte
- lien éventuel avec territoire / élection

---

## 🔄 Interactions avec les autres modules

| Module | Interaction |
|--------|------------|
| Campagne | aide à définir cibles et messages |
| Dashboard | remonte indicateurs utiles |
| Territoire | rattache les profils aux zones |
| Élections | permet lecture croisée vote / socio-démo |
| Mandat | éclaire les besoins politiques |
| Terrain | confronte données froides et réalités perçues |

---

## 🧠 UX attendue

### Principes

- très lisible
- peu de bruit
- interprétation avant technicité

### Règles

- éviter les gros tableaux INSEE bruts
- privilégier vues synthétiques
- mettre en avant les enseignements concrets

### Exemple d’interprétation utile

- "Commune marquée par une forte proportion de propriétaires"
- "Vieillissement progressif sur la dernière décennie"
- "Poids important des ménages de petite taille"

---

## ⚙️ Contraintes techniques

- ingestion et normalisation des données INSEE
- historisation possible
- rattachement aux niveaux géographiques utiles
- capacité à afficher des séries temporelles simples

---

## 🧠 Modèle de données simplifié

Entités principales :
- Indicateur
- Série temporelle
- Zone géographique

Champs clés :
- source
- année
- valeur
- unité
- niveau géographique

Relations :
- indicateur ↔ territoire
- indicateur ↔ période

---

## 🚫 Pièges à éviter

- recopier l’INSEE sans valeur ajoutée
- rendre le module trop statistique
- multiplier les indicateurs sans hiérarchie
- isoler Population des autres modules

---

## 🚀 Roadmap d’implémentation

### Phase 1
- vue d’ensemble
- démographie
- logement

### Phase 2
- âges
- ménages
- CSP

### Phase 3
- mobilité
- évolutions
- indicateurs clés

---

## 🏁 Conclusion

Le module Population doit devenir :

👉 la lecture humaine et sociale de la commune
👉 le complément indispensable de l’analyse électorale
👉 un appui concret pour la stratégie et les messages

C’est le **socle socio-démographique de l’application**.