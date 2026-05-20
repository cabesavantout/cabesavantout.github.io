# 🧩 Sous-module Communication — Publications

## 🧠 Objectif

Le sous-module **Publications** gère les **formats longs et structurés destinés au grand public**.

Il sert à :

- rédiger et valider les articles du blog ou du site web de campagne
- préparer les éditoriaux des newsletters
- écrire le contenu brut des tracts qui seront envoyés à l'imprimerie

---

## ❓ Question clé

👉 Où est le texte validé du prochain tract "Spécial Bilan", et qui l'a relu ?

---

## 🧩 Rôle dans le module Communication

- C'est le gestionnaire de contenu (CMS Headless simplifié) de la campagne.

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Le texte de la newsletter de ce mois-ci est-il prêt à être envoyé ?
2. Quelle est la dernière version du manifeste de campagne ?

---

## 🧱 Structure recommandée

### 1. Fiche Publication

- Type (Tract, Article, Newsletter).
- Titre de travail.
- Éditeur de texte riche (WYSIWYG ou Markdown).
- Assignation (Auteur, Réviseur).
- **Métadonnées** : Cible (ex: "Jeunes", "Quartier Nord"), Thème associé.

---

## 🧠 Données attendues

- Entité `Content` avec `type = 'publication_longue'`.
- Champs : `title`, `body_content` (Markdown/JSON), `status` (Brouillon, En relecture, Validé), `author_id`, `reviewer_id`.

---

## 🧠 UX attendue

### Principes

- Expérience d'édition similaire à Medium ou Notion.
- **Zéro distraction** : Mode Focus (Plein écran) indispensable pour la rédaction longue.
- Outils de versioning basiques pour voir ce que le relecteur a modifié.

### 🎨 Recommandations UI & Interactions

- **Autosave visuel** : Un indicateur clair "Enregistré à 14h03" pour rassurer l'auteur (éviter la phobie de la perte de texte).
- **Barre d'outils flottante** : Formatage rapide du texte (Gras, Titres, Puces) à la sélection du texte plutôt qu'une barre fixe lourde.

---

## ⚙️ Contraintes techniques

- **Stockage du texte** : Privilégier un stockage structuré (JSON issu d'un éditeur Block comme TipTap) plutôt que du HTML brut, pour permettre des exports propres vers InDesign (pour les tracts) ou vers le CMS du site web.
- **Gestion des médias** : Drag & drop d'images directement dans l'éditeur avec upload automatique vers le module `Documentation > Bibliothèque`.

---

## 🏁 Conclusion

C'est la **planche à dessin des textes fondateurs**.
