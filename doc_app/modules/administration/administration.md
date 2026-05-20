# ⚙️ Module Administration

## 🧠 Objectif

Le module Administration est la **salle des machines** de l'application.

Il permet de :

- contrôler qui a accès à quoi (sécurité et rôles)
- garantir l'intégrité et la mise à jour des données (imports, référentiels)
- paramétrer le fonctionnement global de la plateforme
- auditer les actions sensibles (RGPD, exports)

👉 afin de garantir que l'application reste un **outil de confiance, fiable et sécurisé**.

---

## ❓ Question clé

👉 Comment l’application fonctionne-t-elle, est-elle à jour, et les données sont-elles en sécurité ?

---

### 🥇 Priorité Produit

- **Essentiel** : Sécuriser les accès et fiabiliser la donnée entrante. Zéro compromis sur le RGPD.
- **Secondaire** : L'esthétique de ce module. C'est un back-office utilitaire, on privilégie l'efficacité à la beauté.

---

## 🧩 Rôle dans l’application

- C'est le module de support technique absolu.
- Il n'est utilisé que par l'équipe Data et la direction (rôles `superadmin` et `admin`).

Le module Administration **n’est pas** :

- un espace consultable par les militants
- un outil d'analyse politique

👉 Il **nourrit techniquement tous les autres modules**.

---

## 🧱 Structure conceptuelle du module

Conformément au guide de simplification UI, ce module sera principalement accessible via le menu **"Paramètres"**.

### 1. Vue admin

- L'état de santé de la plateforme (erreurs, espace de stockage, nombre d'utilisateurs actifs).

### 2. Paramètres

- Les réglages globaux (Nom de la campagne, dates clés, identité visuelle).

### 3. Utilisateurs

- La gestion des accès (croisement entre Rôle Technique et Fonction Organisationnelle).

### 4. Sources de données

- Les configurations d'API ou de connexions externes (ex: Data.gouv, OpenData locale).

### 5. Imports / synchronisations

- L'historique des imports massifs (fichiers INSEE, listes électorales).

### 6. Référentiels

- Les tables de base immuables (Bureaux de vote, Typologie des promesses).

### 7. Tags / taxonomies

- La centralisation des mots-clés pour éviter les doublons (ex: fusionner `#Écologie` et `#Ecologie`).

### 8. Journal technique

- L'historique de sécurité (Audit logs : qui a supprimé ce contact ? qui a exporté la base ?).

### 9. Qualité des données

- Le scanner d'anomalies (détection des doublons dans le CRM, fiches incomplètes).

---

## 🔄 Interactions avec les autres modules

| Module                 | Interaction                                                               |
| ---------------------- | ------------------------------------------------------------------------- |
| Tous les modules       | Dépendent des `Utilisateurs` pour les droits d'accès (`authz-model`).     |
| Population & Élections | Dépendent des `Imports / synchronisations` pour exister.                  |
| Réseau                 | Dépend de la `Qualité des données` pour fusionner les contacts en double. |

---

## 🧠 UX attendue

### Principes

- **Sécurité d'abord** : Les actions destructives (suppression de base, modification de rôle) doivent toujours nécessiter une double validation.
- **Minimalisme** : Caché au fond de l'arborescence (Menu Paramètres). Doit avoir une allure d'outil "Back-office" utilitaire.

### 🎨 Recommandations UI & Interactions

- **Mode "Danger"** : Toute action irréversible (Suppression en masse, Révocation d'accès) doit utiliser des boutons rouges et exiger de taper le nom de l'entité pour confirmer (pattern GitHub/AWS).
- **Feedback explicite** : Les messages de succès ou d'erreur doivent être très techniques et précis ("Import échoué à la ligne 402 : Email invalide").

---

## ⚙️ Contraintes techniques

- Respect absolu des normes RGPD (traçabilité des accès aux données personnelles).
- Modèle de permissions strict (RBAC / ABAC) défini dans `authz-model.md`.
- **Rate Limiting** : Protéger les routes d'administration contre les abus (brute-force sur les exports ou les imports).

---

## 🚀 Roadmap d’implémentation

### Phase 1 — MVP (Sécurité et Accès)

- Sous-modules : Utilisateurs, Paramètres.

---

## 🏁 Conclusion

C'est le **gardien du temple**. Sans une administration saine, les données perdent leur valeur.
