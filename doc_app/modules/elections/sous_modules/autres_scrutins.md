# 🧩 Sous-module Élections — Autres scrutins

## 🧠 Objectif

Le sous-module **Autres scrutins** (Départementales, Régionales, Référendums) sert à **compléter la photographie locale** par des élections de proximité ou d'enjeu spécifique.

Il permet de :

- valider l'influence de "barons locaux" (conseillers départementaux ou régionaux de la commune)
- tester les mécaniques d'alliances locales typiques des exécutifs territoriaux

👉 afin de comprendre **le réseau d'influence des élus locaux au-delà de la seule mairie**.

---

## ❓ Question clé

👉 Comment la commune vote-t-elle pour les autres échelons locaux, et les élus actuels y ont-ils du poids ?

---

## 🧩 Rôle dans le module Élections

- Module de consolidation et d'audit du "pouvoir de proximité".

Alimente :

- **Réseau** (cartographie des influences départementales/régionales sur la ville)
- **Campagne** (détecter si le maire est plus fort ou plus faible que le conseiller départemental de son propre camp)

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Le binôme cantonal soutenu par le maire a-t-il performé sur la commune ?
2. Quelle est l'importance du vote "sanction" sur des scrutins à forte abstention territoriale ?

---

## 🧱 Structure recommandée

### 1. Vue Synthèse Territoriale

#### Objectif

Voir rapidement qui tient les autres manettes.

#### Contenu

- résultats Départementales (T1 / T2) sur la commune
- résultats Régionales (T1 / T2) sur la commune
- filtres par canton (si la ville est coupée en plusieurs cantons)

---

## 🧠 Données attendues

### Minimales

- binômes (départementales) ou listes (régionales)
- périmètres spécifiques (numéro du canton)
- voix, pourcentages, abstention

---

## 🔄 Interactions avec les autres modules

| Module             | Interaction                                                                          |
| ------------------ | ------------------------------------------------------------------------------------ |
| Territoire         | Gestion de la limite des cantons qui coupe parfois la géographie de la ville en deux |
| Mandat (Décisions) | Lien contextuel avec les subventions départementales/régionales reçues               |

---

## 🧠 UX attendue

### Principes

- interface de type "archive" (consultation plus occasionnelle que les municipales).

### Règles

- toujours bien distinguer le périmètre (la ville entière vs le canton entier, car les candidats communiquent souvent sur le chiffre du canton qui arrange le vainqueur). L'outil ne doit montrer que les voix de la ville.

---

## ⚙️ Contraintes techniques

- spécificité des Départementales : le binôme. Le nommage des candidats est double, il faut un formatage propre dans l'UI.
- gestion du découpage cantonal intra-communal (bureaux de vote affectés au Canton 1 et bureaux affectés au Canton 2).

---

## 🚀 Roadmap d’implémentation

### Phase 1 — MVP

- import et affichage des départementales et régionales comme de simples scrutins supplémentaires dans le selecteur principal.

---

## 🏁 Conclusion

C'est le module de lecture de **la sphère d'influence locale hors-mairie**.
