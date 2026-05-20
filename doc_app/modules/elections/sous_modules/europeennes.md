# 🧩 Sous-module Élections — Européennes

## 🧠 Objectif

Le sous-module **Européennes** sert de **sismographe du vote d'humeur et protestataire**.

Il permet de :

- détecter des tendances idéologiques émergentes (vote écologiste, montée des extrêmes) libérées par la proportionnelle à un tour
- capter le climat national le plus récent sans le filtre des personnalités locales

👉 afin d'identifier des **poches électorales à fort potentiel de bascule**.

---

## ❓ Question clé

👉 Quelles sont les nouvelles radicalités ou tendances d'opinion cachées de nos quartiers (vote contestataire, vote écolo, etc.) ?

---

## 🧩 Rôle dans le module Élections

- C'est l'élection de "l'expression libre" par excellence (1 tour, proportionnelle). Elle dévoile les mouvements profonds de la société locale.

Alimente :

- **Campagne** (thèmes de campagne à privilégier : sécurité, écologie, pouvoir d'achat)

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Y a-t-il une explosion d'un vote extrême dans tel ou tel bureau ?
2. Quel est le niveau d'étiage (minimum syndical) des partis traditionnels quand il n'y a pas d'enjeu de pouvoir direct ?
3. Où est concentré le vote écologiste urbain ?

---

## 🧱 Structure recommandée

### 1. Vue Cartographie des Tendances (Heatmaps)

#### Objectif

Visualiser les foyers idéologiques "purs".

#### Contenu

- carte de chaleur du vote protestataire (extrêmes)
- carte de chaleur du vote écologiste
- taux d'abstention (traditionnellement très fort)

---

## 🧠 Données attendues

### Minimales

- résultats par liste (souvent plus d'une vingtaine) par bureau
- traitement et filtrage des listes "mineures" (regroupement en "Autres")

---

## 🔄 Interactions avec les autres modules

| Module        | Interaction                                                                            |
| ------------- | -------------------------------------------------------------------------------------- |
| Territoire    | Identification des zones de colère (lien potentiel avec les Signalements)              |
| Communication | Adaptation de la sémantique de campagne selon la "chauffe" protestataire des quartiers |

---

## 🧠 UX attendue

### Principes

- agréger brutalement la donnée : face à 35 listes, l'outil doit grouper intelligemment pour ne pas noyer l'utilisateur.

### Règles

- un camembert ou des barres horizontales groupant les 5 ou 6 forces principales et regroupant le reste.

---

## ⚙️ Contraintes techniques

- le très grand nombre de listes candidates demande une gestion propre de la base de données (ne pas afficher 30 colonnes vides à 0% dans les tableaux de bureaux).

---

## 🚫 Pièges à éviter

- sur-analyser ce scrutin : l'abstention massive rend les extrapolations sur les municipales très dangereuses en volume de voix.

---

## 🚀 Roadmap d’implémentation

### Phase 1 — MVP

- import des listes, agrégation automatique des "petits candidats".
- Heatmaps sur les grandes tendances idéologiques (écologie, extrême-droite, majorité présidentielle).

---

## 🏁 Conclusion

C'est le **baromètre de l'opinion libre** qui permet d'ajuster les messages de campagne.
