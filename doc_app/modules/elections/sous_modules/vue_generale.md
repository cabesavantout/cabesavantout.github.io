# 🧩 Sous-module Élections — Vue générale

## 🧠 Objectif

Le sous-module **Vue générale** sert de tableau de bord de la santé démocratique et politique de la commune.

Il permet de :

- croiser tous les scrutins pour dégager une tendance macroscopique
- avoir une photographie rapide du rapport de force global actuel
- visualiser l'évolution de la participation toutes élections confondues

👉 afin de donner un **point d'entrée clair et immédiat** avant de plonger dans le détail d'un scrutin spécifique.

---

## ❓ Question clé

👉 Comment la ville vote-t-elle globalement, toutes élections confondues, au cours des dernières années ?

---

### 🥇 Priorité Produit

- **Essentiel** : Dégager instantanément le rapport de force gauche/droite/centre/extrêmes de la ville.
- **Secondaire** : Les résultats exhaustifs des "petits" candidats (à regrouper dans "Autres").

---

## 🧩 Rôle dans le module Élections

- C'est la page d'accueil du module.
- C'est l'outil de "mise en contexte" pour toute l'équipe de campagne.

Alimente :

- **Dashboard** (chiffres clés électoraux)
- **Campagne** (cadrage du climat politique local)

---

## 🎯 Finalité métier

Permettre de répondre à :

1. La commune est-elle ancrée à droite, à gauche, au centre, ou très volatile ?
2. Quelle est la tendance de l'abstention sur le temps long ?
3. Quel a été le dernier scrutin organisé et quel en a été le résultat majeur ?

---

## 🧱 Structure recommandée

### 1. Vue Synthèse Macro

#### Objectif

Donner les 3 indicateurs les plus importants de la ville.

#### Contenu

- dernière élection : vainqueur local et taux de participation
- socle électoral estimé du maire actuel (plus bas score récent)
- bureau de vote le plus participatif et le plus abstentionniste en moyenne

---

### 2. Vue Chronologie des Scrutins

#### Objectif

Mettre en perspective les cycles électoraux.

#### Contenu

- frise chronologique des 10 dernières années
- pour chaque point (élection) : couleur politique arrivée en tête localement

---

## 🧠 Données attendues

### Minimales (Agrégées)

- liste des scrutins en base
- participation globale moyenne
- résultats agrégés par grandes familles politiques

---

## 🔄 Interactions avec les autres modules

| Module     | Interaction                                                   |
| ---------- | ------------------------------------------------------------- |
| Dashboard  | Fournit le bloc "Contexte Électoral"                          |
| Territoire | Donne une coloration politique globale à la carte de la ville |

---

## 🧠 UX attendue

### Principes

- 100% data-visualisation (aucun grand tableau de données ici)
- pédagogique (expliquer la tendance en une phrase)

### Règles

- utiliser des graphiques en aires (pour l'évolution des blocs)
- permettre de cliquer sur une élection pour basculer directement vers son sous-module dédié (ex: cliquer sur 2020 ouvre `Municipales`)

### 🎨 Recommandations UI & Interactions

- **Jauge d'ancrage** : Un indicateur visuel (type jauge de batterie) montrant si la ville penche à gauche, à droite ou au centre selon une moyenne pondérée des 3 derniers scrutins.
- **Mini-cartes (Sparkmaps)** : À côté du nom du bureau le plus abstentionniste, afficher une micro-carte du territoire avec ce bureau en surbrillance rouge.

---

## ⚙️ Contraintes techniques

- nécessite une normalisation des étiquettes politiques (Nuances) pour pouvoir additionner les scores de scrutins de natures très différentes.

---

## 🚀 Roadmap d’implémentation

### Phase 1 — MVP

- liste chronologique des scrutins et taux de participation de chacun.
- graphiques macroscopiques des blocs.

---

## 🏁 Conclusion

C'est le **résumé pour décideur** du climat politique local.
