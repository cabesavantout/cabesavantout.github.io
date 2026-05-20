# 🧩 Sous-module Élections — Résultats par bureau

## 🧠 Objectif

Le sous-module **Résultats par bureau** est l'outil d'**exploration fine et transversale** de la donnée électorale.

Il sert à :

- isoler un bureau de vote spécifique et afficher toute son histoire électorale
- croiser les performances d'un même bureau à travers différents types de scrutins
- identifier le "comportement type" ou "l'ADN politique" d'un quartier précis

👉 afin d'obtenir un **profil psychologique et politique** d'une unité territoriale.

---

## ❓ Question clé

👉 Quelle est la carte d'identité politique exacte de ce bureau de vote, et comment réagit-il à chaque élection ?

---

### 🥇 Priorité Produit

- **Essentiel** : Dresser le profil "type" du bureau pour adapter le discours de porte-à-porte.
- **Secondaire** : Afficher les résultats d'élections très anciennes (> 10 ans) dont le corps électoral a changé.

---

## 🧩 Rôle dans le module Élections

- C'est l'inverse de la vue "par scrutin" (qui montre toute la ville pour 1 élection). Ici, on montre "toutes les élections pour 1 bureau".
- C'est le pont direct avec le module _Territoire_.

Alimente :

- **Territoire (Fiche Bureau)** (injecte la data électorale dans la gestion spatiale)
- **Terrain** (détermine s'il faut adapter le discours de porte-à-porte dans ce secteur précis)

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Le bureau n°4 est-il structurellement favorable, ou était-ce un accident en 2020 ?
2. Ce bureau vote-t-il différemment aux locales et aux nationales ?
3. Quel est l'historique d'abstention spécifique à cette salle de vote ?

---

## 🧱 Structure recommandée

### 1. Vue Fiche d'Identité Politique du Bureau

#### Objectif

Synthétiser le profil du bureau.

#### Contenu

- bloc dominant (ex: "Ancrage Majorité", "Bascule Extrêmes")
- moyenne de participation comparée à la moyenne de la ville (+ ou - x points)
- meilleur score absolu réalisé par le candidat / maire sur ce bureau

---

### 2. Vue Matrice Multicritères (Tableau historique)

#### Objectif

Visualiser la trajectoire du bureau.

#### Contenu

- lignes = années et élections (Mun 2020, Euro 2019, Pres 2022...)
- colonnes = Gauche / Majorité / Droite / Autres / Abstention
- heatmap cellulaire (les cellules se colorent en rouge/vert selon le score pour repérer des blocs de couleur)

---

## 🧠 Données attendues

### Minimales

- sélection d'un ID de bureau de vote
- requête en base de tous les résultats rattachés à cet ID, triés par date décroissante.

---

## 🔄 Interactions avec les autres modules

| Module                       | Interaction                                                       |
| ---------------------------- | ----------------------------------------------------------------- |
| Territoire (Bureaux de vote) | Est la version purement "data" de la vue cartographique du bureau |
| Évolutions                   | Fournit la granularité pour les modèles de bascule territoriaux   |

---

## 🧠 UX attendue

### Principes

- focus sur le filtre : l'utilisateur doit pouvoir sélectionner "Bureau 1", puis "Bureau 2" de manière très fluide pour voir les graphiques s'adapter en temps réel.

### Règles

- utiliser des graphiques en radar (spider charts) pour comparer le profil du bureau X (ex: fort en vote écolo et abstention) avec le profil moyen de la ville.

### 🎨 Recommandations UI & Interactions

- **Vue "Split-Screen / Comparateur"** : Permettre de sélectionner le Bureau 1 dans la colonne de gauche, et le Bureau 2 dans la colonne de droite pour comparer leurs comportements face à une même élection.
- **Bouton d'Export Fiche** : Permettre d'exporter la fiche du bureau en PDF (A4) pour la donner au responsable du secteur Terrain.

---

## ⚙️ Contraintes techniques

- le numéro du bureau (ex: "Bureau 001") peut parfois changer lors des refontes électorales par arrêté préfectoral. Le système doit gérer la continuité des identifiants (ou prévenir que le périmètre a changé avant 2018 par exemple).

---

## 🚫 Pièges à éviter

- noyer l'utilisateur sous des tableaux infinis. Il faut des graphiques de tendance.

---

## 🚀 Roadmap d’implémentation

### Phase 1 — MVP

- interface simple de "Focus Bureau" dans le dashboard des élections, avec filtres par année.
- injection de ce composant dans la page "Territoire > Bureau de vote".
