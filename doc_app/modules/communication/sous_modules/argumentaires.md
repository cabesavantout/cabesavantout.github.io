# 🧩 Sous-module Communication — Argumentaires

## 🧠 Objectif

Le sous-module **Argumentaires** produit les **textes de fond** qui défendent la vision de l'équipe.

Il sert à :

- préparer les notes de synthèse pour le candidat avant un débat ou une interview
- consolider les données chiffrées en un texte narratif cohérent
- fournir le corps de texte principal qui servira à rédiger les tracts de fond

---

## ❓ Question clé

👉 Si un journaliste m'interroge pendant 10 minutes sur la fiscalité, quelle est ma trame de fond, chiffrée et sourcée ?

---

## 🧩 Rôle dans le module Communication

- C'est la version "Long format" et très documentée du message. Il sert de base aux `Publications` (tracts) et aux `Messages clés` (punchlines).

---

## 🧱 Structure recommandée

### 1. Éditeur de note stratégique

- **L'Attaque** : Le constat d'échec de la situation actuelle (avec 2 chiffres).
- **La Cause** : L'explication politique du pourquoi ça ne marche pas.
- **Notre Proposition** : La solution que nous portons.
- **Sources** : Liens directs vers les PDF de la `Documentation`.
- **Punchline associée** : Lien vers le `Message clé` qui résume l'angle.

---

## 🧠 UX attendue

### Principes

- Mode "Aide à la rédaction" (Generative AI). L'utilisateur peut demander : "Génère-moi un argumentaire d'attaque basé sur le fichier `CFU 2024` qui montre la hausse de la dette".
- **Orienté "Fiche Réflexe"** : Doit pouvoir être imprimé ou consulté sur mobile en format ultra-synthétique pour une relecture de dernière minute.

### 🎨 Recommandations UI & Interactions

- **Split-Screen** : À gauche, la liste des documents sources (`Documentation`). À droite, l'éditeur de texte. L'utilisateur peut glisser-déposer une source pour l'ajouter à l'argumentaire.
- **Export PDF "Fiche Média"** : Un bouton pour générer une fiche A4 propre, prête à être imprimée pour le candidat avant un débat.

---

## ⚙️ Contraintes techniques

- RAG (Retrieval-Augmented Generation) : L'idéal est que le prompt IA puisse s'alimenter directement des données factuelles de l'app (budgets, promesses échouées) pour ne pas halluciner les chiffres.
- **Versionning** : Un argumentaire est un document stratégique. Un historique simple des modifications est nécessaire pour savoir qui a changé quoi.

---

## 🏁 Conclusion

C'est le **bouclier intellectuel** du candidat.
