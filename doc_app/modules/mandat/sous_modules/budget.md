# 🧩 Sous-module Mandat — Budget

## 🧠 Objectif

Le sous-module **Budget** assure le suivi financier macroscopique et l'évaluation du coût des promesses.

Il sert à :

- prouver qu'une réalisation a bien été financée (la trace de l'argent ne ment pas)
- surveiller la trajectoire d'endettement et d'autofinancement
- attaquer la gestion adverse sur des chiffres irréfutables (Comptes Administratifs)

---

## ❓ Question clé

👉 Combien a coûté cette réalisation, et les finances de la ville sont-elles saines ?

---

## 🧩 Rôle dans le module Mandat

- C'est la **preuve par les chiffres**.

Alimente :

- **Campagne** (Argumentaire sur la dette ou les impôts).
- **Documentation** (S'appuie sur les documents financiers type ROB, BP, CA).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Le budget alloué à l'école Prévert a-t-il explosé par rapport à l'enveloppe initiale ?
2. Quelle est l'évolution de l'encours de la dette depuis le début du mandat ?

---

## 🧱 Structure recommandée

### 1. Indicateurs Globaux (Mairie)

- Dépenses de fonctionnement vs Investissement.
- Capacité d'autofinancement (CAF).

### 2. Dépenses par Projet (Micro)

- Ligne budgétaire rattachée à une Promesse.

---

## 🧠 Données attendues

- Indicateurs financiers annuels (souvent extraits de l'OpenData ou des documents PDF du CFU).

---

## 🧠 UX attendue

### Principes

- Traduire la comptabilité publique (M14/M57) en graphiques simples compréhensibles par un citoyen.

### 🎨 Recommandations UI & Interactions

- **Diagramme de Sankey (Flux)** : Le meilleur moyen visuel de montrer "d'où vient l'argent" (Impôts, Dotations) et "où il va" (Personnel, Investissements, Dette).
- **Graphique en Cascade (Waterfall)** : Très efficace pour expliquer simplement la formation de la dette (Dette initiale + Nouveaux emprunts - Remboursements = Dette finale).
- **Traduction des Jargons** : Ajouter des info-bulles (Tooltips) sur les termes barbares (ex: Survoler "CAF brute" affiche "L'épargne de la commune avant de rembourser ses emprunts").

---

## ⚙️ Contraintes techniques

- **Modèle de données agnostique** : La comptabilité publique change (passage M14 à M57). La table `budget_lines` doit être suffisamment générique pour absorber ces réformes sans casser la vue historique de l'application.
- **Intégration Open Data** : Prévoir un script d'import (ETL) capable de lire les fichiers CSV normés fournis par la DGFiP ou l'OpenData locale. Personne ne fera la saisie manuelle des milliers de lignes du Compte Administratif.

---

## 🏁 Conclusion

C'est le **juge de paix de l'action publique**.
