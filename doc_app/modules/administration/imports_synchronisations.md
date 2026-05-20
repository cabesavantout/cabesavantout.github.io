# 🧩 Sous-module Administration — Imports / synchronisations

## 🧠 Objectif

Le sous-module **Imports / synchronisations** gère les **injections massives de données** dans l'application.

Il sert à :

- uploader les fichiers officiels (ex: export INSEE normalisé de 1896 lignes)
- mapper les colonnes d'un fichier CSV vers la base de données PostgreSQL
- vérifier l'historique des imports pour savoir de quand date la fraîcheur d'un module

---

## ❓ Question clé

👉 Quand a-t-on mis à jour la base des électeurs ou les données de population pour la dernière fois ?

---

## 🧩 Rôle dans le module Administration

- C'est l'interface vitale pour alimenter les modules d'analyse froide (`Élections`, `Population`, `Territoire`).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. L'import du dernier fichier des résultats des élections européennes a-t-il généré des erreurs ?

---

## 🧱 Structure recommandée

### 1. Historique des Jobs (Tâches)

- Nom du fichier importé (ex: `cabestany-normalized.csv`).
- Date et Heure de l'import.
- Statut : `Succès` / `Échec partiel` / `Erreur critique`.
- Lignes traitées : "1896 ajoutées, 0 ignorées".

### 2. Outil d'Import Manuel

- Zone de Drag & Drop pour un fichier CSV/Excel.
- Sélecteur de destination (ex: "Mettre à jour la table des Bureaux de vote").

---

## 🧠 UX attendue

### 🎨 Recommandations UI & Interactions

- **Mapping visuel (Wizard)** : Étape intermédiaire où l'utilisateur fait correspondre les colonnes de son CSV avec les champs de la BDD (ex: "Colonne 'Mail' du fichier => Champ 'email' de la base").
- **Barre de progression en temps réel** : Afficher un pourcentage de complétion. Un écran figé pendant 30 secondes provoque des rafraîchissements compulsifs (F5) très dangereux.
- **Rapport d'erreurs téléchargeable** : Si 5 lignes échouent sur 1000, proposer un bouton "Télécharger le CSV des lignes en erreur" pour correction.

---

## ⚙️ Contraintes techniques

- Les imports doivent s'exécuter de manière asynchrone (Background Jobs) pour ne pas bloquer le navigateur de l'utilisateur si le fichier fait 50 000 lignes.
- Il faut prévoir une mécanique de "Rollback" (annulation) si un import écrase par erreur les mauvaises données.
- **WebSockets / Server-Sent Events (SSE)** : Pour mettre à jour la barre de progression UI pendant que le Background Job tourne sur le serveur.
- **Sanitization** : Nettoyer drastiquement la donnée entrante (trim des espaces, formatage des numéros de téléphone, uppercase sur les noms de famille) avant insertion.

---

## 🏁 Conclusion

Le sous-module **Imports / synchronisations** est :

👉 le quai de déchargement des matières premières
