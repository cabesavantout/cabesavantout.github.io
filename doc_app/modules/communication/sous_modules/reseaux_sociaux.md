# 🧩 Sous-module Communication — Réseaux sociaux

## 🧠 Objectif

Le sous-module **Réseaux sociaux** accélère la **production de contenu court et réactif** pour Facebook, Instagram, X (Twitter), etc.

Il sert à :

- générer rapidement un post pour rebondir sur une actualité
- adapter un même message à différents formats (ex: court pour X, détaillé pour Facebook, bullet-points pour Instagram)
- stocker les visuels (photos terrain) associés au post

---

## ❓ Question clé

👉 Que publie-t-on sur Facebook ce soir pour valoriser notre réunion de quartier d'hier ?

---

## 🧩 Rôle dans le module Communication

- C'est l'outil de production "rapide". Il consomme souvent les actions du module `Terrain` ou `Agenda` pour communiquer dessus.

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Pouvons-nous transformer rapidement cette photo de notre action marché en un post Facebook pertinent ?

---

## 🧱 Structure recommandée

### 1. Générateur de Post (IA)

- **Input** : Sélection d'une Entité (ex: Fiche Réunion "Comité de quartier Nord") ou texte libre.
- **Choix de la tonalité** : Combative, Pédagogique, Remerciement.
- **Choix du format** : Post court (X), Post avec image (Instagram), Post de débat (Facebook).
- **Output** : 3 propositions de posts générées par l'IA.

### 2. Validation

- Validation par la direction de campagne avant copier/coller sur la plateforme sociale.
- Statut : `Brouillon` > `À valider` > `Validé`.

---

## 🧠 Données attendues

- Entité `Content` avec `type = 'post_social'`.
- Champs additionnels :
  - `target_platform` (X, Facebook, Instagram, LinkedIn...)
  - `tone` (Pédagogique, Combatif...)
  - `visual_attachment_id` (lien vers une image stockée dans la Documentation)

---

## 🧠 UX attendue

### Principes

- Fortement gamifié par l'IA. L'outil propose, l'humain dispose.
- Visualisation du rendu (Preview) : à quoi ressemblera le texte avec l'image attachée.
- **Zéro friction** : Le but est de produire un post en moins de 60 secondes.

### 🎨 Recommandations UI & Interactions

- **Compteur de caractères** : Afficher un compteur visuel pour X (Twitter).
- **Sélecteur de tonalité** : Utiliser des "Pills" (boutons) plutôt qu'un dropdown pour aller plus vite.
- **Preview adaptative** : La prévisualisation doit imiter l'interface de la plateforme cible pour juger de l'impact visuel.
- **Banque d'images** : Accès rapide à une sélection de photos validées (issues du module `Terrain` ou `Documentation`).

---

## ⚙️ Contraintes techniques

- **Éditeur de texte simple** : Pas de WYSIWYG complexe. Un simple `textarea` ou un éditeur Markdown léger suffit pour éviter les problèmes de copier-coller (formats HTML non désirés).
- **RAG Contextualisé** : Le prompt IA doit être enrichi avec le contexte de l'entité source (ex: "Voici les notes de la réunion X, rédige un post de remerciement pour les participants").

---

## 🚫 Pièges à éviter

- Vouloir faire une API directe vers les réseaux sociaux dès le départ (trop complexe à maintenir avec les tokens qui expirent). Un modèle "Création ici -> Copier-Coller par le Community Manager" est 10x plus robuste pour un MVP.

---

## 🚀 Roadmap d'implémentation

### Phase 1 (MVP)

- Générateur de texte simple avec choix de tonalité.
- Workflow de validation et bouton "Copier".

### Phase 2

- Ajout de la prévisualisation et du lien vers une banque d'images.

---

## 🏁 Conclusion

C'est le **moteur de réactivité numérique** de la campagne.
