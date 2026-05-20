# 🧩 Sous-module Élections — Législatives

## 🧠 Objectif

Le sous-module **Législatives** permet de lire l’**ancrage politique intermédiaire** du territoire.

Il sert à :

- mesurer la capacité de mobilisation des appareils politiques locaux (partis)
- observer la mécanique de front républicain ou de report de voix sur le territoire précis de la circonscription
- identifier le poids des candidats ayant un mandat local

👉 afin d'évaluer le **poids des structures partisanes et des alliances**.

---

## ❓ Question clé

👉 Quelle est la capacité des partis politiques à mobiliser sur notre ville hors du contexte strict du conseil municipal ?

---

## 🧩 Rôle dans le module Élections

- C'est l'indicateur de la "discipline partisane" et de l'implantation des appareils.

Alimente :

- **Campagne** (alliances possibles, poids réel des partenaires potentiels)
- **Réseau** (identification des bastions des partis pour aller chercher des militants)

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Quel parti arrive à structurer un vote sans l'incarnation présidentielle forte ?
2. Comment se sont comportés les électeurs lors de triangulaires ou duels locaux ?
3. Le député sortant (s'il s'implique dans les municipales) dispose-t-il d'un socle de voix fort dans tel ou tel bureau ?

---

## 🧱 Structure recommandée

### 1. Vue Résultats de Circonscription (Zoom Local)

#### Objectif

Évaluer les rapports de force de terrain.

#### Contenu

- résultats T1 / T2 des candidats sur la seule commune
- matrice des reports de voix entre T1 et T2

---

### 2. Vue Analyse des Alliances

#### Objectif

Tirer des enseignements pour la stratégie municipale.

#### Contenu

- comparaison des scores des candidats soutenus par le maire vs oppositions
- visualisation des blocs au 1er tour

---

## 🧠 Données attendues

### Minimales

- candidats, nuances, résultats T1/T2 par bureau de la commune
- rattachement à la circonscription

---

## 🔄 Interactions avec les autres modules

| Module      | Interaction                                             |
| ----------- | ------------------------------------------------------- |
| Réseau      | Croisement avec l'implantation des réseaux de militants |
| Municipales | Évaluation du différentiel d'ancrage local              |

---

## 🧠 UX attendue

### Principes

- centré sur les dynamiques de T2 (les reports et plafonds de verre).

### Règles

- proposer une vue superposant les candidats législatifs aux "familles" présentes au conseil municipal.

---

## ⚙️ Contraintes techniques

- la circonscription déborde souvent de la commune : l'interface doit toujours préciser qu'on analyse "les résultats de la circonscription _sur le périmètre de la ville_".

---

## 🚀 Roadmap d’implémentation

### Phase 1 — MVP

- vue des résultats par candidat et bureau avec focus sur les étiquettes politiques (nuances).
- analyse des reports de voix T1 -> T2.

---

## 🏁 Conclusion

C'est le module de **test des alliances politiques et de la force des appareils**.
