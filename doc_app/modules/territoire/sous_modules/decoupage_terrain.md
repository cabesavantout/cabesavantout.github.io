# 🧩 Sous-module Territoire — Découpage terrain

## 🧠 Objectif

Le sous-module **Découpage terrain** permet de créer et gérer des **zones d'action éphémères ou tactiques** (tournées de porte-à-porte, circuits de tractage) qui ne correspondent pas forcément au découpage administratif.

Il sert à :

- regrouper des rues ou des blocs d'adresses pour une action précise
- assigner une zone de taille "humaine" à une équipe de militants
- générer des feuilles de route exploitables sur le terrain
- s'affranchir des frontières rigides des bureaux de vote quand l'action l'exige

👉 afin de rendre l'exécution de la campagne **fluide, mesurable et adaptée aux équipes**.

---

## ❓ Question clé

👉 Comment diviser le territoire en "morceaux" d'action réalisables en 2 heures par un bénévole ?

---

## 🧩 Rôle dans le module Territoire

- C'est la **couche tactique** superposée à la géographie administrative (Bureaux/Secteurs).
- C'est le point de départ de l'exécution pour le module Terrain.

Alimente :

- **Terrain** (définition du périmètre d'une Action / Porte-à-porte)
- **Équipe / Réseau** (affectation des bénévoles à une zone de mission)
- **Dashboard** (suivi de la couverture des tournées)

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Quels sont les circuits de porte-à-porte prédéfinis ?
2. Combien de boîtes aux lettres / portes contient ce circuit ?
3. Quelle équipe est affectée à ce bout de carte aujourd'hui ?
4. Ce circuit a-t-il été traité entièrement, partiellement ou pas du tout ?

---

## 🧱 Structure recommandée

### 1. Vue liste des circuits

#### Objectif

Gérer la bibliothèque des zones d'action.

#### Contenu

- nom du circuit (ex: "Tournée PàP - Centre Ancien 1")
- type (boîtage, porte-à-porte, marché)
- taille estimée (nombre de portes/BAL)
- secteur de rattachement
- dernier passage

#### Actions

- dessiner un nouveau circuit
- lier à une action terrain

---

### 2. Vue fiche circuit (Feuille de route)

#### Objectif

Donner aux militants tout ce dont ils ont besoin pour agir.

#### Blocs

##### A. En-tête

- nom
- type
- temps estimé

##### B. Parcours

- liste des rues / numéros (ex: Rue Aragon, du n°1 au 45)
- carte isolée de la zone

##### C. Instructions

- points de vigilance (chiens, interphones bloqués)
- contacts prioritaires à aller voir (lien Réseau)

##### D. Historique & Suivi

- état de couverture actuel
- équipes affectées précédemment

---

## 🧠 Données attendues

### Minimales

- id
- nom
- type_action
- geometrie (polygone ou liste de segments de rues)

### Enrichies

- estimation_contacts (calculée via l'INSEE ou base citoyenne)
- instructions_terrain
- temps_moyen_estime

---

## 🔄 Interactions avec les autres modules

| Module             | Interaction                                                |
| ------------------ | ---------------------------------------------------------- |
| Terrain (Actions)  | Le circuit devient le périmètre de l'action                |
| Rues               | Un circuit est une addition de Rues ou bouts de Rues       |
| Réseau             | Affectation des militants au circuit                       |
| Zones Prioritaires | Création de circuits spécifiquement dans les zones chaudes |

---

## 🧠 UX attendue

### Principes

- visuel (l'outil de création doit être cartographique)
- exportable (doit pouvoir être lu sur un mobile sous la pluie)
- modulaire

### Règles

- outil de sélection multiple sur la carte (cliquer sur 3 rues pour créer un circuit)
- affichage immédiat du nombre d'habitants estimé dans la sélection
- **Export "Feuille de Route"** : Génération d'une vue mobile ultra-simplifiée ou d'un PDF imprimable pour le bénévole, contenant la carte de la zone, la liste des rues, et les instructions.

### Actions clés

- créer un circuit en dessinant sur la carte
- attribuer le circuit à un bénévole
- marquer le circuit comme "Terminé"

---

## ⚙️ Contraintes techniques

- manipulation spatiale (GeoJSON, agglomération de lignes de rues)
- calcul en temps réel de la volumétrie (croisement de la géométrie avec la table des électeurs/population)
- **Optimisation mobile** : La "Feuille de Route" doit être accessible en mode hors-ligne (PWA) pour le bénévole sur le terrain.

---

## 🚫 Pièges à éviter

- faire des circuits trop grands (décourage les bénévoles)
- rendre l'outil de dessin cartographique trop complexe (type SIG ingénieur)
- déconnecter le circuit de l'action réelle (un circuit n'est utile que s'il est joué)

---

## 📏 Critères de réussite

- un responsable de campagne peut générer 10 feuilles de route en 5 minutes
- un bénévole comprend exactement où il doit aller et s'arrêter
- aucun chevauchement involontaire entre deux équipes sur le terrain

---

## 🚀 Roadmap d’implémentation

### Phase 1 — MVP

- création manuelle : sélection de rues dans une liste pour faire un "groupe"

### Phase 2 — Visuel

- sélection cartographique (cliquer sur les tronçons de rue)
- calcul automatique des portes

### Phase 3 — Intelligent

- génération automatique de circuits équitables selon le temps disponible des bénévoles

---

## 🏁 Conclusion

Le sous-module **Découpage terrain** doit devenir :

👉 l'outil de production des feuilles de route
👉 le garant de l'efficacité du temps bénévole

C'est le **pont logistique entre la carte et la chaussure**.
