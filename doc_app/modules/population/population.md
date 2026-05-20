# 👥 Module Population

## 🧠 Objectif

Le module Population est le **référentiel sociologique** de la commune.

Il permet de :

- comprendre la structure sociale, économique et démographique des habitants
- s'affranchir des idées reçues et des fantasmes locaux grâce à la donnée froide (INSEE)
- adapter le programme politique à la réalité des besoins (logement, vieillissement, transport)

👉 afin de savoir **pour qui l'on construit la politique de demain**.

---

## ❓ Question clé

👉 Qui vit réellement à Cabestany, comment vivent-ils, et comment cette population se transforme-t-elle ?

---

## 🧩 Rôle dans l’application

- Source exclusive de la donnée socio-démographique de référence (INSEE).
- Outil de contextualisation pour les autres modules.

Le module Population **n’est pas** :

- un annuaire de contacts (ça, c'est le module _Réseau_)
- une copie illisible des tableurs complexes de l'INSEE

👉 Il **traduit la donnée statistique en insights politiques**.

---

## 🧱 Structure du module

### 1. Vue d’ensemble

- Le portrait-robot de la ville en 5 chiffres.

### 2. Démographie

- La dynamique de croissance (solde naturel vs solde migratoire).

### 3. Âges

- La pyramide des âges et la dépendance (jeunesse vs seniors).

### 4. Ménages

- La structure familiale (personnes seules, familles monoparentales).

### 5. Logement

- Le statut d'occupation (propriétaires, locataires, vacance, HLM).

### 6. CSP (Catégories Socio-Professionnelles)

- La structure sociale (ouvriers, cadres, chômeurs, retraités).

### 7. Mobilité

- Les déplacements domicile-travail (dépendance à la voiture).

### 8. Évolutions

- La trajectoire sociologique sur 10 ans (gentrification vs paupérisation).

### 9. Indicateurs clés

- Le dictionnaire des métriques réutilisables dans toute l'application.

---

## 🔄 Interactions avec les autres modules

| Module     | Interaction                                                                          |
| ---------- | ------------------------------------------------------------------------------------ |
| Élections  | Explication sociologique de l'abstention ou du vote extrême                          |
| Campagne   | Ciblage thématique (ex: forte hausse des seniors = promesses sur la santé/CCAS)      |
| Territoire | Éclairage socio-démographique des quartiers (si la granularité INSEE IRIS est dispo) |
| Mandat     | Vérification de la pertinence d'un investissement public par rapport au public cible |

---

## 🧠 UX attendue

### Principes

- **Zéro saisie manuelle** : le module vit uniquement par l'import de données officielles.
- **Narration des chiffres** : un graphique doit toujours être accompagné d'une phrase d'interprétation ("Cabestany vieillit plus vite que la moyenne départementale").
- **Comparaison** : une donnée INSEE n'a de valeur que si elle est comparée (à la strate, au département ou au passé).

---

## ⚙️ Contraintes techniques

- structuration du fichier `cabestany-normalized.csv` (1896 lignes) en une table `insee_indicators` facilement requêtable.
- gestion des millésimes (les données INSEE ont toujours 2 à 3 ans de décalage avec l'année en cours).

---

## 🚀 Roadmap d’implémentation

### Phase 1 — Le Socle (MVP)

- Import des données 2020/2021 dans la base.
- Sous-modules : Vue d'ensemble, Logement, CSP.

### Phase 2 — Dynamiques

- Sous-modules : Évolutions, Âges, Démographie.

### Phase 3 — Croisement

- Injection des métriques INSEE clés directement dans le module Territoire (par bureau de vote si le découpage IRIS le permet).

---

## 🏁 Conclusion

Le module Population doit devenir :

👉 le destructeur d'idées reçues
👉 la boussole de la pertinence du programme politique
