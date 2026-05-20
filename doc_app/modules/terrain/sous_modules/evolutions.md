# 🧩 Sous-module Élections — Évolutions & Dynamiques

## 🧠 Objectif

Le sous-module **Évolutions** sert à visualiser **la trajectoire électorale dans le temps** d'une force politique ou d'un territoire.

Il permet de :

- tracer les dynamiques (progression / effondrement) des grandes familles politiques
- identifier les bureaux de vote qui "basculent" d'un camp à l'autre
- détecter des tendances lourdes sur plusieurs cycles électoraux (ex: gentrification politique d'un quartier)

👉 afin de sortir de l'analyse "one-shot" et de bâtir une **stratégie sur les tendances de fond**.

---

## ❓ Question clé

👉 Qui a le vent en poupe, qui s'essouffle, et quels quartiers sont en train de changer de camp ?

---

### 🥇 Priorité Produit

- **Essentiel** : Prouver par les chiffres que la majorité sortante est en déclin continu ou que l'opposition progresse.
- **Secondaire** : Tracer les micro-variations de partis qui ne présentent pas de candidats locaux.

---

## 🧩 Rôle dans le module Élections

- C'est la couche analytique temporelle.
- Il fusionne les données des sous-modules (Municipales, Nationales, etc.) pour en tirer un film plutôt qu'une photographie.

Alimente :

- **Campagne** (identification des bastions qui s'effritent à cibler)
- **Territoire (Secteurs/Bureaux)** (marqueurs de tendance de fond : en baisse / en hausse)
- **Communication** (angles d'attaque type "le maire perd du terrain dans son propre quartier")

---

## 🎯 Finalité métier

Permettre de répondre à :

1. La majorité sortante perd-elle des voix d'une élection municipale à l'autre ?
2. Quel bureau a connu le plus grand transfert de voix depuis 10 ans ?
3. La dynamique des oppositions est-elle à la hausse ou stagne-t-elle ?
4. Les résultats des élections nationales (ex: montée d'un parti) infusent-ils localement lors des élections intermédiaires ?

---

## 🧱 Structure recommandée

### 1. Vue Dynamique des Blocs

#### Objectif

Voir l'évolution macroscopique des rapports de force.

#### Contenu

- agrégation politique : Majorité municipale / Bloc Gauche / Bloc Droite / Autres
- graphique d'évolution en courbes sur 3 à 4 élections de même nature
- affichage des deltas (ex: Majorité : - 250 voix par rapport à N-1)

---

### 2. Vue Matrice de Bascule (Bureaux)

#### Objectif

Identifier l'évolution géographique des votes.

#### Contenu

- liste des bureaux de vote avec un indicateur "Delta" (ex: Écart Majorité/Opposition)
- flèches de tendance (↗️, ↘️, ➡️)
- identification des bureaux passés sous un seuil critique (ex: la majorité passe sous les 50% au 1er tour)

#### Actions

- trier par "Pire évolution pour le sortant"
- trier par "Meilleure progression de notre liste"

---

### 3. Vue Focus Bureau

#### Objectif

Plonger dans l'histoire spécifique d'une zone.

#### Contenu

- sélection d'un bureau de vote
- graphique d'évolution isolée de ce bureau

---

## 🧠 Données attendues

### Minimales (Calculées)

- historique de résultats lissé (même typologie d'étiquettes d'une année sur l'autre)
- calcul des écarts (Score N - Score N-1) en absolu (voix) et en relatif (%)

### Enrichies

- classification manuelle ("Blocs politiques") pour pouvoir comparer des listes qui changent de nom mais gardent le même ADN politique.

---

## 🔄 Interactions avec les autres modules

| Module                   | Interaction                                                             |
| ------------------------ | ----------------------------------------------------------------------- |
| Territoire (Bureaux)     | Injecte la flèche de tendance (↗️, ↘️) directement dans la fiche bureau |
| Campagne                 | Alimente l'argumentaire d'usure ("Une majorité à bout de souffle")      |
| Municipales / Nationales | Source primaire des données à comparer                                  |

---

## 🧠 UX attendue

### Principes

- clarté visuelle absolue (vert = ça monte, rouge = ça baisse).
- raisonnement en "Blocs" (il faut faciliter la lecture, car comparer "Liste A 2014" et "Liste B 2020" est dur si on ne les groupe pas politiquement).

### Règles

- privilégier les visualisations par courbes ou par sparklines (petits graphiques de tendance).
- permettre de comparer des choux avec des choux (Municipale 2014 vs 2020) mais offrir la possibilité de comparer des scrutins différents (Municipale 2020 vs Départementale 2021).

### Actions clés

- identifier le bureau de vote qui "décroche" le plus vite pour la majorité.

### 🎨 Recommandations UI & Interactions

- **Diagramme de Sankey (Flux)** : C'est la meilleure visualisation pour montrer l'hypothèse de transfert des voix ("Où sont passés les 500 électeurs de la liste X entre 2014 et 2020 ?").
- **Sparklines (Courbes miniatures)** : Dans le tableau des bureaux, intégrer une mini-courbe d'évolution directement dans la cellule pour voir la tendance sans ouvrir la fiche détaillée.

---

## ⚙️ Contraintes techniques

- problème du redécoupage électoral : si les périmètres des bureaux de vote ont changé entre 2014 et 2020, les évolutions par bureau sont faussées. (Il faut prévoir un warning si le nombre d'inscrits fait un bond inexpliqué).
- nécessité d'un mapping sémantique de la data (associer les noms de listes mouvants à des IDs politiques stables dans le temps).
- **Calculs asynchrones** : La génération des deltas sur toutes les élections peut être lourde, pré-calculer ces valeurs dans une table `election_trends`.

---

## 🚫 Pièges à éviter

- ignorer le changement de périmètre des bureaux (un bureau passe de 800 à 1200 inscrits, les courbes explosent artificiellement).
- surinterpréter l'évolution des pourcentages sans regarder la chute de la participation (un maire peut passer de 50% à 55% tout en perdant 300 voix réelles si l'abstention a bondi).

---

## 📏 Critères de réussite

- l'équipe comprend que la zone X n'est plus un bastion imprenable mais un château de sable.
- la dynamique de "fin de cycle" ou de "relance" est prouvée par les chiffres.

---

## 🚀 Roadmap d’implémentation

### Phase 1 — MVP

- comparaison simple N vs N-1 sur les scrutins municipaux, par liste.

### Phase 2 — Agrégation par Blocs

- création de "tags politiques" pour grouper les listes et tracer des tendances de fond (ex: "Cumul des oppositions de gauche").

### Phase 3 — Détection de bascule

- calcul automatique et alerte sur les bureaux qui inversent leur rapport de force.

---

## 🏁 Conclusion

Le sous-module **Évolutions** doit devenir :

👉 le détecteur de signes de faiblesse
👉 le traceur des dynamiques de fond

C'est **l'outil qui prouve que le changement est mathématiquement en cours**.
