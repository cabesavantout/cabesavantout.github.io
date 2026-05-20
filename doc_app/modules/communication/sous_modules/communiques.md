# 🧩 Sous-module Communication — Communiqués

## 🧠 Objectif

Le sous-module **Communiqués** encadre la **prise de parole institutionnelle et officielle** de la campagne vers l'extérieur (presse, instances).

Il sert à :

- rédiger les Communiqués de Presse (CP) officiels
- garantir la validation par la direction (un CP engage juridiquement et politiquement la liste)
- conserver l'historique des positions officielles

---

## ❓ Question clé

👉 Quelle est notre position officielle et envoyée à la presse sur la polémique de la semaine ?

---

## 🧩 Rôle dans le module Communication

- C'est le format le plus rigide et le plus formel.

---

## 🧱 Structure recommandée

### 1. Fiche Communiqué

- Titre (Objet de l'envoi).
- Date d'embargo (s'il y en a une).
- Corps du texte (format classique : Date, Titre, Chapeau, Corps, Contact presse).
- Statut : `En rédaction`, `Validé`, `Diffusé`.

---

## 🧠 Données attendues

- Entité `Content` avec `type = 'communique_presse'`.
- Champs : `embargo_date`, `pdf_export_url`, `validation_status`.

---

## 🧠 UX attendue

### Principes

- Mode "Papier à en-tête".
- **Validation stricte** : Ce format engage la liste, le workflow doit forcer l'approbation d'un utilisateur ayant le rôle `direction`.

### 🎨 Recommandations UI & Interactions

- **Aperçu Live (Split-screen)** : À gauche l'éditeur, à droite la prévisualisation exacte du rendu PDF final avec l'en-tête de campagne et le logo.
- **Bouton d'Export PDF** : Génère le fichier prêt à l'envoi d'un seul clic.

---

## ⚙️ Contraintes techniques

- **Génération PDF** : Utiliser une librairie robuste (ex: Puppeteer/Playwright côté serveur ou React-pdf côté client) pour garantir un rendu professionnel et immuable. Éviter que l'export dépende des paramètres d'impression du navigateur de l'utilisateur.

---

## 🚫 Pièges à éviter

- Oublier d'inclure les coordonnées du contact presse en bas du document généré.

---

## 🏁 Conclusion

C'est l'**outil de diplomatie médiatique**.
