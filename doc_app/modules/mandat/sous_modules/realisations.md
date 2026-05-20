# 🧩 Sous-module Mandat — Réalisations

## 🧠 Objectif

Le sous-module **Réalisations** permet de recenser, qualifier et prouver **ce qui a été effectivement fait** pendant le mandat.

Il sert à :

- objectiver les actions concrètes
- distinguer le réel du déclaratif
- relier les réalisations aux promesses, décisions et documents

👉 afin de mesurer **l’impact réel du mandat**.

---

## ❓ Question clé

👉 Qu’est-ce qui a réellement été fait, et avec quel niveau de preuve et d’impact ?

---

### 🥇 Priorité Produit

- **Essentiel** : Documenter visuellement et factuellement l'action (photos, presse).
- **Secondaire** : Le rattachement exhaustif aux lignes budgétaires exactes.

---

## 🧩 Rôle dans le module Mandat

Le sous-module Réalisations est :

- le pendant factuel des **Promesses**
- la base de validation ou contradiction des engagements
- un outil de preuve et d’analyse

Il alimente directement :

- **Campagne** (angles positifs / critiques)
- **Communication** (valorisation ou remise en question)
- **Dashboard** (suivi et alertes)

---

## 🎯 Finalité métier

Ce sous-module doit permettre de répondre à :

1. Quelles actions concrètes ont été réalisées ?
2. À quelles promesses sont-elles liées (ou non) ?
3. Sont-elles complètes, partielles ou marginales ?
4. Peut-on les prouver ?
5. Quel est leur impact réel ?

---

## 🧱 Structure recommandée

### 1. Vue liste

#### Objectif

Offrir une vue synthétique des réalisations.

#### Contenu

Chaque ligne :

- titre
- thématique
- statut (complète / partielle / limitée)
- niveau d’impact
- lien promesse (optionnel)
- date
- niveau de preuve

#### Actions

- ouvrir fiche
- filtrer
- rechercher

---

### 2. Vue fiche réalisation

#### Objectif

Décrire et qualifier une action réalisée.

#### Blocs

##### A. En-tête

- titre
- statut de réalisation
- niveau d’impact
- date

##### B. Description

- description factuelle
- contexte

##### C. Lien promesse

- promesse associée (ou non)
- correspondance (totale / partielle / hors promesse)

##### D. Preuves

- documents
- décisions
- photos / articles

##### E. Analyse

- impact réel
- perception possible
- limites

##### F. Périmètre

- zone
- public concerné

---

## 🧠 Données attendues

### Minimales

- titre
- description
- date
- statut
- lien promesse (optionnel)

### Enrichies

- preuves
- impact
- zone
- notes

---

## 🧠 Statuts recommandés

### Réalisation

- Complète
- Partielle
- Limitée
- Symbolique

### Preuve

- Forte
- Moyenne
- Faible
- Absente
- Contestable

### Impact

- Élevé
- Moyen
- Faible

---

## 🔄 Interactions

| Module        | Interaction                 |
| ------------- | --------------------------- |
| Promesses     | validation ou contradiction |
| Documentation | preuves                     |
| Territoire    | zone                        |
| Terrain       | perception                  |
| Communication | valorisation                |

---

## 🧠 UX attendue

- lecture claire
- distinction fait / interprétation
- accès rapide aux preuves

### 🎨 Recommandations UI & Interactions

- **Galerie Avant/Après** : Pour les réalisations physiques (ex: voirie, parc), proposer un composant visuel "Slider Avant/Après" très parlant politiquement.
- **Carte intégrée** : Si la réalisation est localisée, afficher une mini-carte interactive (Mapbox/Leaflet) sur la fiche.
- **Générateur de "Carte de visite"** : Un bouton pour exporter la réalisation en un format carré (type post Instagram) prêt à être partagé sur les réseaux.

---

## ⚙️ Contraintes techniques

- **Optimisation des médias** : Les photos Avant/Après doivent être compressées automatiquement côté client avant l'upload (ex: format WebP) pour ne pas exploser les coûts de stockage.
- **Calcul de complétion en cascade** : Si une Promesse a 3 réalisations associées, définir une règle métier pour suggérer la bascule de la Promesse en "Réalisée".

---

## 🚫 Pièges

- confondre réalisation et annonce
- surévaluer les impacts
- absence de preuve

---

## 📏 Critères de réussite

- distinguer facilement ce qui est réellement fait
- voir les preuves rapidement
- comprendre l’impact

---

## 🚀 Roadmap

### Phase 1

- liste
- fiche simple

### Phase 2

- lien promesses
- preuves

### Phase 3

- analyse impact

---

## 🏁 Conclusion

Le sous-module Réalisations doit devenir :

👉 la base factuelle du mandat
👉 le miroir des promesses

C’est le **socle de crédibilité ou de critique**.
