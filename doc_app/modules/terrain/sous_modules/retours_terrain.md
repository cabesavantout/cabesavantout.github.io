# 🧩 Sous-module Terrain — Retours terrain

## 🧠 Objectif

Le sous-module **Retours terrain** est le cœur du module Terrain.

Il permet de :

- capturer les observations réelles
- enregistrer les verbatims citoyens
- structurer les signaux faibles
- transformer les échanges en données exploitables

👉 afin d’alimenter en continu la stratégie avec du **réel terrain**.

---

## ❓ Question clé

👉 Qu’est-ce que les gens disent réellement sur le terrain ?

---

### 🥇 Priorité Produit

- **Essentiel** : Capter l'humeur générale et le mot-clé principal (ex: "Colère / Stationnement").
- **Secondaire** : Le verbatim exact mot pour mot.

## 🧩 Rôle dans le module Terrain

- Source principale d’information qualitative
- Complément des données froides (Élections / Population)
- Base d’ajustement stratégique

Alimente directement :

- **Campagne** (messages, priorités)
- **Mandat** (perception des promesses)
- **Dashboard** (activité récente)
- **Communication** (angles concrets)

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Quels sujets remontent du terrain ?
2. Quels problèmes sont perçus par les habitants ?
3. Quels signaux faibles apparaissent ?
4. Quelles zones remontent le plus d’informations ?
5. Quels sujets sont récurrents ?

---

## 🧱 Structure recommandée

### 1. Vue liste

#### Objectif

Afficher tous les retours terrain.

#### Contenu

Chaque retour :

- date
- type (porte-à-porte, marché, discussion…)
- zone / rue
- résumé court
- tags (thème)
- humeur (positif / neutre / hostile)
- niveau d’importance

#### Actions

- ouvrir
- filtrer
- rechercher

---

### 2. Vue fiche retour

#### Objectif

Capturer une information complète.

#### Blocs

##### A. En-tête

- date
- type d’interaction
- localisation

##### B. Contenu

- description
- verbatim éventuel

##### C. Qualification

- thème
- humeur ressentie (positif / neutre / hostile)
- importance
- urgence

##### D. Contexte

- personne (optionnel)
- situation

##### E. Liens

- promesse
- sujet
- zone

##### F. Suivi

- action à faire
- statut

---

### 3. Vue synthèse

#### Objectif

Identifier les tendances.

#### Contenu

- sujets les plus fréquents
- zones actives
- volume de retours

---

## 🧠 Données attendues

### Minimales

- date
- type
- contenu
- humeur (positif, neutre, hostile)
- localisation

### Enrichies

- tags
- importance
- lien promesse
- notes

### 🧱 Règles de structuration

- **Sélecteur d'humeur strict** : Utiliser un entier (-1, 0, 1) en base pour faciliter le calcul des moyennes d'humeur par quartier.
- **Soft Delete** : Ne jamais supprimer physiquement un retour (`DELETE`), le marquer comme `is_deleted = true` pour préserver l'historique d'activité du bénévole.

---

## 🧠 Types de retours

- observation
- plainte
- suggestion
- ressenti
- information locale

---

## 🔄 Interactions

| Module        | Interaction        |
| ------------- | ------------------ |
| Campagne      | alimente stratégie |
| Mandat        | perception         |
| Territoire    | localisation       |
| Réseau        | contacts           |
| Communication | contenu            |

---

## 🧠 UX attendue

### Principes

- ultra rapide
- mobile-first
- sans friction

### Règles

- saisie en moins de 10 secondes
- formulaire court
- accès direct

### Actions clés

- ajouter un retour
- consulter rapidement
- filtrer par zone ou thème

### 🎨 Recommandations UI & Interactions

- **Voice-to-Text** : Intégrer un bouton "Micro" qui utilise l'API de reconnaissance vocale du système d'exploitation (natif iOS/Android) pour dicter le résumé pendant qu'on marche vers la prochaine maison.
- **Sélecteurs rapides (Pills)** : Au lieu d'un menu déroulant (dropdown) qui nécessite 2 clics, afficher directement les 5 thèmes principaux sous forme de boutons cliquables.
- **Géolocalisation optionnelle** : Le bouton "Autour de moi" pré-remplit la rue et le quartier, mais l'utilisateur doit pouvoir le corriger manuellement.

---

## ⚙️ Contraintes techniques

- saisie rapide (mobile)
- géolocalisation possible
- stockage simple

---

## 🚫 Pièges à éviter

- formulaire trop long
- données inutilisables
- manque de structuration

---

## 📏 Critères de réussite

- ajouter un retour en quelques secondes
- retrouver facilement un sujet
- voir les tendances

---

## 🚀 Roadmap

### Phase 1

- saisie simple
- liste

### Phase 2

- tags
- filtres

### Phase 3

- synthèse

---

## 🏁 Conclusion

Le sous-module Retours terrain doit devenir :

👉 la mémoire vivante du terrain
👉 la source principale des insights réels

C’est probablement **le module le plus important après Promesses**.
