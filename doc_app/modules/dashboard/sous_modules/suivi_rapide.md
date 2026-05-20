# 🧩 Sous-module Dashboard — Suivi rapide (Favoris)

## 🧠 Objectif

Le sous-module **Suivi rapide** permet à l'utilisateur de **garder un accès direct aux dossiers qu'il suit personnellement**.

Il sert à :

- gagner du temps de navigation
- se concentrer sur les quelques fiches (promesses, quartiers, contacts) qui font le quotidien de cet utilisateur spécifique

---

## ❓ Question clé

👉 Comment accéder en 1 clic aux 3 éléments sur lesquels je travaille en ce moment ?

---

## 🧩 Rôle dans le module Dashboard

- C'est l'espace "Espace de travail" ou "Favoris" (Pinned items) de l'utilisateur.

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Où est la fiche de l'école Prévert que je consulte tous les jours en ce moment ?
2. Où est le dossier du contact presse que je dois relancer ?

---

## 🧱 Structure recommandée

### 1. Les Épingles (Bookmarks)

- Un composant "Accès rapides" en haut ou sur le côté.
- Liste de liens directs vers des Fiches Promesse, Fiches Quartier, ou Fiches Citoyen.

---

## 🧠 Données attendues

- Une table ou un champ `is_pinned_by_user_id` associant un objet (n'importe lequel) à l'utilisateur connecté.

---

## 🧠 UX attendue

### Principes

- L'utilisateur doit pouvoir cliquer sur une icône (ex: étoile ou punaise) sur n'importe quelle fiche de l'app pour qu'elle apparaisse instantanément ici.
- Rendu sous forme de mini-cartes très compactes (icône + titre court).

---

## 🏁 Conclusion

C'est le **raccourci clavier de l'interface**, garantissant une navigation sans friction.
