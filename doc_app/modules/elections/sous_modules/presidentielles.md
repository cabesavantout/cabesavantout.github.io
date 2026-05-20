# 🧩 Sous-module Élections — Présidentielles

## 🧠 Objectif

Le sous-module **Présidentielles** analyse le scrutin avec la plus forte participation pour mesurer les **fondamentaux politiques réels** de la population, hors filtres locaux.

Il sert à :

- évaluer le "vote de conviction" national des habitants
- mesurer la réserve théorique maximale de voix par bloc (puisque c'est le scrutin où les gens se déplacent le plus)
- comparer les rapports de force nationaux avec les résultats municipaux

👉 afin d'identifier les **écarts entre l'étiquette nationale et l'ancrage local**.

---

## ❓ Question clé

👉 Comment nos habitants votent-ils quand il s'agit d'enjeux nationaux et où sont nos électeurs "cachés" qui ne votent pas aux municipales ?

---

## 🧩 Rôle dans le module Élections

- Outil d'évaluation du plafond de verre (ou du socle) idéologique.
- Point de comparaison majeur avec la participation des Municipales.

Alimente :

- **Campagne** (identification de la cible électorale : les électeurs présidentiels de notre camp qui s'abstiennent aux municipales)

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Quels quartiers ont voté pour les extrêmes au premier tour ?
2. Quel est le volume maximum de voix mobilisables pour un camp donné ?
3. Y a-t-il une "prime au maire" (le maire fait mieux aux municipales que son candidat naturel à la présidentielle) ou un "rejet du maire" ?

---

## 🧱 Structure recommandée

### 1. Vue Résultats par Candidat

#### Objectif

Visualiser les grands équilibres idéologiques.

#### Contenu

- résultats T1 et T2 sur la commune
- comparaison avec la moyenne nationale (très important pour savoir si la ville est atypique)

---

### 2. Vue Différentiel Local/National

#### Objectif

Identifier le décrochage entre enjeux locaux et nationaux.

#### Contenu

- delta de voix entre Candidat National X et Liste Locale Y de la même famille
- focus sur les bureaux avec un fort vote de protestation nationale

---

## 🧠 Données attendues

### Minimales

- résultats T1 et T2 par candidat et par bureau
- participation

### Enrichies

- scores nationaux ou départementaux pour mise en perspective (optionnel mais recommandé)

---

## 🔄 Interactions avec les autres modules

| Module     | Interaction                                                              |
| ---------- | ------------------------------------------------------------------------ |
| Territoire | Coloration des quartiers par vote majoritaire au T1 de la Présidentielle |
| Évolutions | Trace la dynamique des blocs nationaux au fil de l'eau                   |

---

## 🧠 UX attendue

### Principes

- focus sur l'analyse politique par "blocs" plus que par personnes.

### Règles

- afficher explicitement les écarts d'abstention par rapport aux élections locales (ex: "Il y a eu 1200 votants de plus à la Présidentielle dans ce bureau").

---

## ⚙️ Contraintes techniques

- comme l'offre politique (les candidats) change à chaque élection, le mapping doit se faire sur les nuances ou blocs pour comparer 2017 et 2022 de manière pertinente.

---

## 🚀 Roadmap d’implémentation

### Phase 1 — MVP

- import et affichage des résultats bruts par candidat et bureau.
- matrice de comparaison avec les résultats municipaux dans le même bureau.

---

## 🏁 Conclusion

Le sous-module **Présidentielles** révèle la **vraie couleur idéologique de la ville**, lorsque les considérations de gestion locale sont écartées.
