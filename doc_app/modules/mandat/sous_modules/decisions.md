# 🧩 Sous-module Mandat — Décisions

## 🧠 Objectif

Le sous-module **Décisions** permet de recenser et analyser les **actes politiques formels** qui structurent le mandat.

Il sert à :

- tracer les arbitrages (votes, délibérations, annonces)
- comprendre les mécanismes de mise en œuvre
- relier décisions → promesses → réalisations

👉 afin d’expliquer **pourquoi** une action avance, bloque ou dévie.

---

## ❓ Question clé

👉 Quelles décisions ont été prises, par qui, quand, et avec quelles conséquences ?

---

### 🥇 Priorité Produit

- **Essentiel** : Le lien irréfutable entre la décision dans l'app et le document officiel (PDF) de la mairie.
- **Secondaire** : L'analyse d'impact complexe ou le calcul budgétaire détaillé dès le premier jour.

---

## 🧩 Rôle dans le module Mandat

- Chaînon central entre **Promesses** et **Réalisations**
- Source officielle et vérifiable (via Documentation)
- Base d’explication des trajectoires politiques

Alimente :

- **Campagne** (angles d’analyse)
- **Dashboard** (alertes sur décisions sensibles)
- **Communication** (éléments de langage)

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Quelles décisions structurent le mandat ?
2. Quelles promesses sont réellement engagées par des actes ?
3. Quelles décisions expliquent un blocage ou une dérive ?
4. Quelles décisions sont sensibles politiquement ?

---

## 🧱 Structure recommandée

### 1. Vue liste

#### Objectif

Vue synthétique des décisions.

#### Colonnes

- titre
- type (délibération, arrêté, annonce, vote…)
- date
- thématique
- statut (prise, en cours, abandonnée)
- lien promesse (optionnel)
- niveau de sensibilité

#### Actions

- ouvrir fiche
- filtrer (type, thème, période)
- rechercher

---

### 2. Vue fiche décision

#### Objectif

Lecture complète et exploitable.

#### Blocs

##### A. En-tête

- titre
- type
- date
- statut
- niveau de sensibilité

##### B. Description

- résumé clair
- contexte (politique / local)

##### C. Détails

- organe décisionnel (conseil, maire, etc.)
- résultat (adopté, rejeté, reporté)
- modalités (vote, arrêté…)

##### D. Liens

- promesse(s) associée(s)
- réalisation(s) associée(s)
- documents (délibération, CR, etc.)

##### E. Analyse

- impact attendu
- risques
- controverses potentielles

##### F. Périmètre

- zone
- public concerné

##### G. Suivi

- effets observés
- prochaines étapes

---

## 🧠 Données attendues

### Minimales

- id
- titre
- type
- date
- description
- statut

### Enrichies

- organe
- résultat
- documents liés
- liens promesses / réalisations
- zone
- niveau de sensibilité
- notes

---

## 🧠 Statuts recommandés

### Statut de décision

- En préparation
- Prise
- Reportée
- Rejetée (à documenter)
- Abandonnée (à documenter)

### Sensibilité politique

- Faible
- Modérée
- Élevée
- Critique

---

## 🔄 Interactions

| Module        | Interaction         |
| ------------- | ------------------- |
| Promesses     | engagement réel     |
| Réalisations  | déclenchement       |
| Documentation | preuve officielle   |
| Territoire    | périmètre           |
| Dashboard     | alertes             |
| Communication | éléments de langage |

---

## 🧠 UX attendue

- lisible et factuelle
- distinction claire entre fait et analyse
- accès direct aux documents

### Actions clés

- créer une décision
- lier à une promesse
- ajouter un document
- qualifier la sensibilité

### 🎨 Recommandations UI & Interactions

- **Split-Screen Document** : Lors de la consultation d'une décision, afficher à gauche le PDF officiel (Délibération) et à droite la fiche d'analyse pour éviter les allers-retours.
- **Badges de Sensibilité** : Utiliser un code couleur strict pour le risque politique (🔴 Critique, 🟠 Élevé, 🟡 Modéré, 🟢 Faible).
- **Timeline Visuelle** : Sur la fiche, un mini-composant chronologique montrant "Promesse (2020) -> Décision (2022) -> Réalisation (2024)".

---

## ⚙️ Contraintes techniques

- **Gestion des relations polymorphes** : Une décision doit pouvoir se lier à `N` promesses et `N` documents. Prévoir une table de jointure propre.
- **Visionneuse PDF intégrée** : Intégrer une librairie légère (ex: `react-pdf`) côté client pour ne pas forcer le téléchargement des preuves.
- **Garde-fous** : Forcer la saisie d'un `official_document_id` si le statut passe à "Prise". Une décision sans preuve n'est qu'une rumeur.

---

## 🚫 Pièges à éviter

- confondre décision et annonce politique
- manquer de source (preuve)
- multiplier les types sans cohérence

---

## 📏 Critères de réussite

- retrouver rapidement une décision
- comprendre son impact
- voir ses liens avec promesses et réalisations

---

## 🚀 Roadmap

### Phase 1

- liste
- fiche simple

### Phase 2

- liens promesses / documents
- filtres

### Phase 3

- analyse et sensibilité

---

## 🏁 Conclusion

Le sous-module Décisions doit devenir :

👉 la trace officielle du mandat
👉 l’explication des évolutions

C’est le **mécanisme clé entre intention et résultat**.
