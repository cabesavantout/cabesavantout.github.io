# 🧩 Sous-module Administration — Utilisateurs

## 🧠 Objectif

Le sous-module **Utilisateurs** orchestre le **modèle d'autorisations et d'accès** (`authz-model.md`).

Il sert à :

- inviter de nouveaux membres de l'équipe sur la plateforme
- attribuer un niveau de confiance technique (le Rôle)
- attribuer un affichage humain (la Fonction organisationnelle)
- bloquer/désactiver le compte d'un militant qui quitte la campagne

---

## ❓ Question clé

👉 Qui a accès à la plateforme, et a-t-il les bonnes permissions pour voir les données sensibles ?

---

## 🧩 Rôle dans le module Administration

- C'est le module de gestion de la sécurité humaine.

Alimente :

- **Réseau (Équipe)** : L'affichage des militants dans l'annuaire de l'équipe découle de leur création technique ici.

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Comment révoquer instantanément les accès d'un bénévole problématique ?
2. Comment donner à X les droits de modifier le budget sans le nommer "Directeur de campagne" dans l'organigramme ?

---

## 🧱 Structure recommandée

### 1. Liste des comptes

- Nom, Prénom, Email.
- **Rôle global (Technique)** : `superadmin`, `admin`, `direction`, `coordinateur`, `militant`, `lecture`. (Définit les permissions, ce qu'il a le droit de cliquer).
- **Fonction organisationnelle** : ex: "Directeur de la communication", "Référent quartier Nord". (Pour l'affichage et l'annuaire).
- Statut du compte (Actif / Suspendu).

### 2. Gestion des Rôles (Réservé Superadmin)

- Interface pour voir la matrice de permissions (qui a le droit au module `communication.publish`).

---

## 🧠 Données attendues

- Table `users` couplée avec `app_role`.
- Table `org_functions` pour la taxonomie des titres de campagne.

---

## 🧠 UX attendue

### Principes

- Différenciation visuelle très claire entre le **Rôle** (qui est une notion de sécurité informatique) et la **Fonction** (qui est une notion de RH politique).
- Bouton d'urgence (rouge) "Suspendre l'accès" très accessible sur la liste.

### 🎨 Recommandations UI & Interactions

- **Matrice des rôles lisible** : Lors de l'assignation d'un rôle, afficher un résumé visuel (checkmarks) de ce que l'utilisateur pourra faire ou non (ex: [x] Exporter la base, [ ] Gérer le budget).
- **Barre de recherche rapide** : Indispensable pour retrouver un militant dans une liste de 200 personnes.
- **Modale de confirmation** : "Êtes-vous sûr de vouloir suspendre l'accès de Jean Dupont ? Il sera déconnecté immédiatement."

---

## ⚙️ Contraintes techniques

- Synchronisation stricte avec le système d'authentification (Supabase Auth / Row Level Security).
- **Session invalidation** : Si un admin suspend un compte, le token JWT de l'utilisateur doit être révoqué instantanément côté serveur (pas d'attente d'expiration).

---

## 🚫 Pièges à éviter

- Multiplier les rôles techniques (`role_militant_tractage`, `role_militant_reunions`). Il faut garder des macro-rôles globaux et jouer sur des permissions fines.

---

## 🏁 Conclusion

C'est le **videur à l'entrée du QG de campagne**.
