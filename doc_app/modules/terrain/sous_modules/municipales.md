# 🧩 Sous-module Élections — Municipales

## 🧠 Objectif

Le sous-module **Municipales** analyse en profondeur le **scrutin de référence** pour le pilotage stratégique local.

Il sert à :

- décortiquer les résultats des élections municipales précédentes
- analyser la ventilation des suffrages par liste et par bureau de vote
- comprendre les rapports de force exacts (majorité / oppositions)
- identifier les réserves de voix d'un tour à l'autre

👉 afin de calibrer les **objectifs de victoire pour la prochaine échéance**.

---

## ❓ Question clé

👉 Quel a été le comportement électoral exact lors des dernières municipales, bureau par bureau, et où se trouvent les voix manquantes pour gagner ?

---

### 🥇 Priorité Produit

- **Essentiel** : L'affichage du "Delta en voix" (combien de voix séparent le candidat 1 du candidat 2 dans chaque bureau).
- **Secondaire** : Les listes qui ont fait moins de 5% (à grouper pour ne pas polluer l'interface).

---

## 🧩 Rôle dans le module Élections

- C'est le cœur absolu du module Élections.
- Les autres scrutins (présidentielles, etc.) servent de contexte, mais les municipales dictent la tactique.

Alimente :

- **Campagne** (fixation de l'objectif de voix à atteindre, matrice de bascule)
- **Territoire / Bureaux** (classement des bureaux en favorables / défavorables)
- **Dashboard** (métriques de l'adversaire principal)

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Quel est le socle électoral incombustible du maire sortant ?
2. Quels bureaux de vote ont été les plus serrés ?
3. Où les listes d'opposition (qui pourraient fusionner) ont-elles performé ?
4. Quel a été l'effet de l'abstention sur les équilibres du scrutin ?

---

## 🧱 Structure recommandée

### 1. Vue Synthèse du scrutin (Année X)

#### Objectif

Rappeler la photographie globale de l'élection.

#### Contenu

- résultats globaux de la commune (camembert/barres)
- participation, blancs et nuls
- répartition des sièges au conseil municipal
- comparaison Tour 1 / Tour 2 (si applicable)

#### Actions

- changer d'année de référence (ex: passer de 2020 à 2014)

---

### 2. Vue Analyse par Bureau

#### Objectif

Descendre au niveau granulaire pour trouver les failles territoriales.

#### Contenu

- tableau croisé : Bureaux (lignes) vs Listes/Candidats (colonnes)
- mise en surbrillance (heatmap) : où la liste X a fait son meilleur/pire score
- écart en voix (et non juste en %) avec le leader

#### Actions

- trier par bureau le plus favorable à l'opposition
- filtrer par secteur géographique
- ouvrir le détail croisé (Territoire) du bureau

---

### 3. Vue Matrice des reports (si 2 tours)

#### Objectif

Comprendre la dynamique d'entre-deux-tours.

#### Contenu

- listes qualifiées vs éliminées
- évolution des suffrages exprimés T1 -> T2
- estimation des reports de voix

---

## 🧠 Données attendues

### Minimales (Issues de Data.gouv / Préfecture)

- identifiant scrutin (année)
- identifiant bureau
- inscrits, votants, blancs, nuls, exprimés
- candidat / liste
- nombre de voix, pourcentage

### Enrichies

- appartenance politique (étiquette de la liste)
- statut (sortant / opposition)
- écart au premier

---

## 🔄 Interactions avec les autres modules

| Module                 | Interaction                                                |
| ---------------------- | ---------------------------------------------------------- |
| Territoire (Bureaux)   | Fournit la donnée électorale brute pour la fiche du Bureau |
| Campagne               | Définit la "cible en voix" mathématique pour gagner        |
| Élections (Évolutions) | Fournit les data pour comparer 2014 vs 2020                |

---

## 🧠 UX attendue

### Principes

- focus sur les écarts en VOIX (les pourcentages masquent l'effort réel sur le terrain)
- très visuel (heatmaps sur les tableaux de données)
- comparatif instantané

### Règles

- toujours afficher le nombre de voix manquantes pour atteindre 50%+1 dans un bureau
- utiliser des couleurs politiques standards ou différenciantes (Majorité vs Opposition A vs Opposition B)

### Actions clés

- isoler en 1 clic les 3 bureaux où la majorité sortante est la plus faible

### 🎨 Recommandations UI & Interactions

- **Sticky Headers & Columns** : Le tableau des bureaux (lignes) et candidats (colonnes) doit avoir une première colonne et une première ligne figées au scroll (freeze panes).
- **Toggle % / Voix** : Un interrupteur (switch) bien visible en haut à droite du tableau pour basculer tout l'affichage des pourcentages vers les volumes de voix réels.
- **Mode "Simulateur de reports"** : Sur la matrice T1 -> T2, proposer des curseurs "Si 50% de la Liste A va vers la Liste B...".

---

## ⚙️ Contraintes techniques

- formatage strict des données de la préfecture (gestion des libellés de listes qui varient parfois d'un tour à l'autre)
- calcul des pourcentages à la volée (sur exprimés vs sur inscrits)
- gestion propre de la cartographie (lien avec le GeoJSON des bureaux)

---

## 🚫 Pièges à éviter

- s'obnubiler sur les pourcentages : 60% dans un bureau avec forte abstention = moins de voix que 45% dans un bureau mobilisé.
- noyer l'utilisateur dans un tableau Excel illisible. Il faut de la dataviz.
- oublier les votes blancs et nuls qui sont un signal politique de rejet local.

---

## 📏 Critères de réussite

- l'utilisateur peut dire instantanément dans quel bureau aller chercher les 100 voix qui font basculer l'élection.
- les rapports de force entre listes d'opposition sont clairs comme de l'eau de roche.

---

## 🚀 Roadmap d’implémentation

### Phase 1 — MVP

- import et affichage propre des résultats T1 et T2 au niveau commune et bureaux.

### Phase 2 — Tableaux tactiques

- tableau heatmap avec tri des bureaux par écart (leader vs second).

### Phase 3 — Analyse de reports

- modélisation des réserves de voix potentielles.

---

## 🏁 Conclusion

Le sous-module **Municipales** doit devenir :

👉 la carte au trésor mathématique de la campagne
👉 le juge de paix des rapports de force locaux

C'est **l'arbitre chiffré de toute la stratégie électorale**.
