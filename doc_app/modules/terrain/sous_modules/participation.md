# 🧩 Sous-module Élections — Participation & Abstention

## 🧠 Objectif

Le sous-module **Participation & Abstention** isole l'analyse du **comportement civique** indépendamment des choix partisans.

Il sert à :

- identifier les zones qui se mobilisent et celles qui se désengagent
- quantifier le potentiel électoral inexploité (la réserve de voix dormante)
- différencier l'abstention structurelle (chronique) de l'abstention conjoncturelle (liée au scrutin)
- cibler les actions de porte-à-porte dédiées à l'inscription sur les listes ou à la procuration

👉 afin de savoir **où aller réveiller les électeurs** pour renverser un rapport de force bloqué.

---

## ❓ Question clé

👉 Combien d'électeurs ne votent pas, où habitent-ils, et peuvent-ils faire basculer l'élection ?

---

### 🥇 Priorité Produit

- **Essentiel** : Convertir les abstentionnistes en volume brut pour prioriser le porte-à-porte.
- **Secondaire** : Les théories sur la sociologie de l'abstention.

---

## 🧩 Rôle dans le module Élections

- C'est le module de la "matière noire" électorale.
- Il croise les données de tous les types de scrutins (Municipales, Nationales) pour dégager des tendances purement civiques.

Alimente :

- **Campagne** (stratégie de "Get Out The Vote" / Mobilisation)
- **Territoire / Zones Prioritaires** (ciblage des bureaux à forte réserve abstentionniste)
- **Terrain** (opérations ciblées "Procurations")

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Quel est le volume de la réserve abstentionniste (en nombre d'électeurs) ?
2. Quels bureaux de vote voient leur participation s'effondrer au fil des années ?
3. Y a-t-il une différence marquée de participation entre l'élection présidentielle et l'élection municipale dans le même quartier ?
4. Où la mobilisation a-t-elle été anormalement forte chez l'adversaire ?

---

## 🧱 Structure recommandée

### 1. Vue Globale (La courbe du civisme)

#### Objectif

Visualiser la tendance lourde de la commune.

#### Contenu

- graphique historique de la participation sur les 10 dernières années (tous scrutins)
- mise en évidence du différentiel "Locales" vs "Nationales"
- part structurelle des Blancs et Nuls

---

### 2. Vue Cartographie de l'Abstention

#### Objectif

Localiser géographiquement la réserve de voix.

#### Contenu

- carte colorée par taux d'abstention
- filtre pour afficher le volume brut (nombre de non-votants) au lieu du %
- identification des "poches d'abstention" (bureaux où l'abstention est supérieure à la moyenne communale)

#### Actions

- sélectionner un bureau pour l'envoyer vers les "Zones prioritaires" (module Territoire)

---

### 3. Vue Analyse Croisée

#### Objectif

Comprendre à qui profite l'abstention.

#### Contenu

- matrice de corrélation (très simple) : "Quand la participation baisse dans ce bureau, quelle liste en souffre le plus ?"
- comparaison de la participation Tour 1 vs Tour 2

---

## 🧠 Données attendues

### Minimales (Issues de Data.gouv)

- inscrits
- votants
- abstentions (calculée)
- blancs, nuls
- par scrutin, par année, par bureau

### Enrichies

- évolution de l'abstention entre Scrutin N et Scrutin N-1
- delta entre abstention du bureau et moyenne de la commune

---

## 🔄 Interactions avec les autres modules

| Module               | Interaction                                                                |
| -------------------- | -------------------------------------------------------------------------- |
| Territoire (Bureaux) | Ajoute la métrique "Potentiel de mobilisation"                             |
| Campagne (Actions)   | Permet de déclencher une campagne d'inscription électorale                 |
| Population           | Corrélation possible avec la sociologie INSEE (âge, revenus vs abstention) |

---

## 🧠 UX attendue

### Principes

- focus absolu sur les volumes réels (le nombre d'humains derrière le pourcentage)
- lecture en contraste (comparer systématiquement un bureau à la norme de la ville)

### Règles

- inverser la lecture classique : on ne parle pas de "55% de participation" mais de "450 abstentionnistes à convaincre".
- mettre en évidence les votes Blancs et Nuls comme une forme "d'abstention active".

### Actions clés

- identifier en 3 secondes le bureau avec la plus forte chute de participation depuis 6 ans.

### 🎨 Recommandations UI & Interactions

- **Carte à Bulles (Bubble Map)** : Au lieu d'une carte choroplèthe (coloriée), utiliser des cercles dont la taille est proportionnelle au _nombre total_ d'abstentionnistes. Cela évite de donner trop d'importance visuelle à un bureau très grand géographiquement mais peu peuplé.
- **Bouton d'Action** : Sur la fiche du bureau le plus abstentionniste, ajouter un CTA "Créer une action de terrain : Inscription listes électorales".

---

## ⚙️ Contraintes techniques

- la base des inscrits fluctue dans le temps (refonte des listes électorales), le calcul d'évolution brute doit intégrer cette marge d'erreur.
- nécessité d'agréger proprement les types d'élections pour tracer une courbe historique qui a du sens (ne pas comparer le volume brut des Européennes avec des Présidentielles sans contexte).

---

## 🚫 Pièges à éviter

- traiter la participation uniquement en pourcentages : 50% d'abstention dans un bureau de 400 inscrits ≠ 50% dans un bureau de 1200 inscrits.
- penser que toute l'abstention est mobilisable (une part relève de la non-mise à jour des listes / déménagements).

---

## 📏 Critères de réussite

- l'équipe de campagne peut définir un objectif de "chasse à la procuration" chiffré par quartier.
- on comprend clairement si l'adversaire gagne grâce à son socle ou grâce à la démobilisation globale.

---

## 🚀 Roadmap d’implémentation

### Phase 1 — MVP

- carte et tableau des taux de participation et d'abstention du dernier scrutin municipal.

### Phase 2 — Historique et Volumes

- courbes d'évolution temporelle et bascule de l'affichage en "voix/personnes manquantes".

### Phase 3 — Corrélation

- croisement avec l'évolution des scores : impact de la participation sur le résultat des listes.

---

## 🏁 Conclusion

Le sous-module **Participation & Abstention** doit devenir :

👉 le gisement de voix de la campagne
👉 le thermomètre du fatalisme local

C'est **la clé pour renverser une élection qui semble figée**.
