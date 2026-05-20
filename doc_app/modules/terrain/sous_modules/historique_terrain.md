# 🧩 Sous-module Terrain — Historique terrain

## 🧠 Objectif

Le sous-module **Historique terrain** centralise la chronologie exhaustive de **toutes les interactions physiques** ayant eu lieu sur une zone ou avec la population.

Il sert à :

- garantir la mémoire des actions menées
- éviter la sur-sollicitation des mêmes zones (et l'agacement des habitants)
- repérer les "trous dans la raquette" (zones délaissées depuis trop longtemps)
- auditer la réalité de l'effort de campagne

👉 afin de s'assurer d'une **occupation rationnelle, équilibrée et respectueuse** du territoire.

---

## ❓ Question clé

👉 Qu'a-t-on déjà fait ici, quand, et ne risque-t-on pas d'y retourner trop tôt ?

---

## 🧩 Rôle dans le module Terrain

- C'est la "boîte noire" du module Terrain.
- Il consolide automatiquement les données générées par Porte-à-porte, Tractage et Présence.

Alimente :

- **Campagne** (suivi de la couverture globale)
- **Territoire** (indicateur de "fraîcheur" d'une rue ou d'un secteur)
- **Dashboard** (alerte sur les zones "froides")

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Depuis quand n'avons-nous pas tracté dans le secteur Nord ?
2. L'équipe a-t-elle déjà fait du porte-à-porte dans cette rue ce trimestre ?
3. Quelle est la chronologie exacte de nos passages sur le marché central ?
4. Notre présence physique est-elle en augmentation ou en baisse ?

---

## 🧱 Structure recommandée

### 1. Vue Timeline (Flux d'activité)

#### Objectif

Visualiser l'activité terrain au jour le jour.

#### Contenu

- date / heure
- type d'action (PàP, Boîtage, Marché)
- zone concernée
- responsable / équipe
- résultat synthétique (ex: "45 portes, 3 retours")

#### Actions

- filtrer par période
- filtrer par type d'action
- filtrer par zone

---

### 2. Vue Matrice de couverture

#### Objectif

Identifier rapidement les zones trop ou pas assez sollicitées.

#### Contenu

- tableau croisé : Secteurs/Rues vs Temps (Mois/Semaines)
- code couleur de "chauffe" (vert = récent, gris = vide, rouge = trop sollicité)
- indicateur "Jours depuis la dernière action"

---

## 🧠 Données attendues

_Ce module ne requiert pas de saisie directe, il agrège les données._

### Minimales (Agrégées)

- date_action
- type_action
- zone_id
- statut

### Indicateurs calculés

- `days_since_last_visit` (par rue/secteur)
- `visit_frequency` (par mois)
- `saturation_score` (combine la fréquence et le type d'action : un PàP est plus "saturant" qu'un boîtage)

---

## 🔄 Interactions avec les autres modules

| Module                     | Interaction                                             |
| -------------------------- | ------------------------------------------------------- |
| Porte-à-porte, Tractage    | Fournisseurs de la donnée brute                         |
| Territoire (Rues/Secteurs) | Reçoit la métrique de "fraîcheur" pour colorer la carte |
| Campagne                   | Valide l'exécution du plan de charge                    |

---

## 🧠 UX attendue

### Principes

- pure consultation / analyse
- visuel (codes couleurs pour le temps écoulé)
- infaillible (on ne peut pas modifier l'historique sans modifier l'action source)

### Règles

- un coup d'œil doit suffire pour voir si une zone est saturée
- proposer un tri natif "du plus ancien passage au plus récent" pour identifier les priorités

### Actions clés

- identifier la prochaine zone à traiter en se basant sur l'ancienneté du dernier passage

---

## ⚙️ Contraintes techniques

- **Requêtes d'agrégation performantes** (`GROUP BY zone`, `MAX(date)`).
- **Pré-calcul nocturne** : La matrice de couverture est un candidat idéal pour une tâche de fond (cron job) qui la calcule chaque nuit et la stocke dans une table de synthèse pour un affichage instantané.
- historisation immuable
- mise à jour en temps réel dès la clôture d'une action terrain

---

## 🚫 Pièges à éviter

- transformer cet historique en log technique incompréhensible
- oublier de prendre en compte les actions "Annulées" dans le calcul de couverture
- traiter toutes les actions avec le même poids (un boîtage ne sature pas la zone autant qu'un porte-à-porte intensif)

---

## 📏 Critères de réussite

- zéro plainte d'habitants disant "vous êtes déjà passés la semaine dernière"
- la carte du territoire ne comporte aucune "zone blanche" non traitée pendant plus de 6 mois

---

## 🚀 Roadmap d’implémentation

### Phase 1 — MVP

- liste chronologique simple des actions terminées

### Phase 2 — Indicateur de fraîcheur

- calcul du nombre de jours depuis le dernier passage affiché dans les fiches Territoire

### Phase 3 — Matrice et Alertes

- tableau de bord de couverture et alerte anti-sur-sollicitation

---

## 🏁 Conclusion

Le sous-module **Historique terrain** doit devenir :

👉 la mémoire infaillible de la campagne physique
👉 le régulateur de la pression exercée sur la population

C'est le **garde-fou contre l'aveuglement tactique**.
