# 🧩 Sous-module Réseau — Citoyens suivis

## 🧠 Objectif

Le sous-module **Citoyens suivis** est le cœur réacteur du ciblage électoral. C'est le fichier des habitants qualifiés.

Il sert à :

- tracer les opinions et les promesses de vote des habitants rencontrés
- segmenter la population avec des tags thématiques (ex: "Sensible Sécurité", "Parent d'élève")
- organiser des actions de relance ciblées (e-mailing, phoning d'entre-deux-tours)

---

## ❓ Question clé

👉 Qui sont nos électeurs probables, où habitent-ils, et quels sont les sujets qui les feront voter pour nous ?

---

### 🥇 Priorité Produit

- **Essentiel** : Connaître le niveau d'engagement (est-ce un vote acquis ?) et le moyen de contact (téléphone/email).
- **Secondaire** : L'adresse postale complète au numéro près (le bureau de vote ou le quartier suffisent souvent pour le ciblage).

---

## 🧩 Rôle dans le module Réseau

- C'est la traduction individuelle des données macroscopiques (Élections / Population).

Alimente :

- **Campagne (Cibles)** (permet l'envoi de messages hyper-personnalisés).
- **Terrain (Porte-à-porte)** (permet de générer une liste de portes "À visiter" avec un historique).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Monsieur Durand, que l'on a croisé sur le marché, est-il un soutien confirmé ?
2. Quelle est la liste de tous nos sympathisants identifiés dans le quartier Nord à inviter à la prochaine réunion ?
3. Quels sont les citoyens qui ont formulé une demande spécifique qu'il faut rappeler ?

---

## 🧱 Structure recommandée

### 1. Fiche Citoyen 360°

#### Blocs

- **Identité** : Nom, prénom, contact, âge (ou tranche), adresse rattachée à un bureau de vote.
- **Jauge d'engagement** : Hostile / Neutre / Sympathisant / Engagé (Militant).
- **Tags thématiques** : Centres d'intérêts exprimés (Écologie, Stationnement...).
- **Timeline** : Historique complet (vu au PàP le 12/03, a appelé le 15/04, tâche de relance prévue le 20/05).

---

## 🧠 Données attendues

- Liaison forte vers `polling_stations` (bureau de vote) et `sectors` (territoire).
- Historique d'interactions rattaché.

### 🧱 Règles de structuration

- **RGPD & Consentement** : Ajout obligatoire d'un champ boolean `consent_given` (Opt-in) pour les communications par email/SMS.
- **Dédoublonnage** : L'email et/ou le téléphone doivent servir de clés uniques "métier" pour alerter sur les doublons.

---

## 🧠 UX attendue

### Principes

- **Lisibilité de la jauge** : Le niveau de soutien doit sauter aux yeux (ex: code couleur rouge/gris/vert/or).
- **RGPD compliant** : Bouton clair "Désinscrire / Anonymiser" directement accessible pour respecter la loi.

### 🎨 Recommandations UI & Interactions

- **Jauge Thermomètre** : Utiliser des icônes explicites (❄️ Froid, 😐 Neutre, 🔥 Chaud, 🏆 Engagé) au lieu de simples textes.
- **Timeline unifiée** : Sur la fiche citoyen, afficher l'historique sous forme de fil d'actualité vertical (comme un chat) avec la date, l'auteur de la note et l'action.

---

## ⚙️ Contraintes techniques

- La saisie depuis l'application mobile lors du porte-à-porte doit être fluide (pouvoir cocher "Sympathisant" et ajouter un prénom en 5 secondes sur le pas de la porte).
- **Row Level Security (RLS)** : Bloquer stricement l'accès à ces données si l'utilisateur n'a pas le rôle `militant_qualifié` ou supérieur.
- **Audit Trail** : Tout export (CSV/Excel) de cette table doit générer une ligne dans le `Journal technique`.

---

## 🚫 Pièges à éviter

- Transformer cet outil en un fichier exhaustif de la population (c'est illégal et inutile). On ne saisit que les gens avec qui une interaction a eu lieu et qui ont donné un accord (implicite ou explicite) d'échange.

---

## 🏁 Conclusion

Le sous-module **Citoyens suivis** est :
👉 le trésor de guerre de la campagne
👉 la clé pour réussir les opérations de "Get Out The Vote" (mobilisation) au 2ème tour
