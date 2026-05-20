# 🧩 Sous-module Administration — Journal technique (Audit logs)

## 🧠 Objectif

Le sous-module **Journal technique** enregistre l'empreinte informatique de **toutes les actions sensibles** effectuées sur l'application.

Il sert à :

- prouver la conformité RGPD (qui a consulté ou exporté la base de données citoyenne ?)
- retracer l'origine d'une erreur humaine (qui a effacé par erreur tout un secteur ?)
- dissuader les comportements malveillants internes (fuite de données)

---

## ❓ Question clé

👉 Qui a fait quoi, quand, et depuis où ?

---

## 🧩 Rôle dans le module Administration

- C'est la boîte noire sécuritaire de l'application.
- Strictement consultatif (lecture seule, même pour les administrateurs).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Je constate que la fiche "Risques politiques" a été vidée de son contenu. Quel utilisateur a effectué cette suppression hier à 14h ?
2. Est-ce qu'un utilisateur a exporté massivement la liste des électeurs qualifiés ?

---

## 🧱 Structure recommandée

### 1. Fil des événements de sécurité

- Horodatage (Timestamp UTC).
- Acteur (Utilisateur + Adresse IP).
- Action (CREATE, UPDATE, DELETE, EXPORT).
- Entité ciblée (ex: Table `citizens`, ID 4589).

---

## 🧠 UX attendue

### 🎨 Recommandations UI & Interactions

- **Grille de données brute (Data Grid)** : Affichage très dense, lecture seule. Filtres par date, par acteur, par type d'action.
- **Visionneuse de payload** : Au clic sur une ligne, afficher le JSON exact des données modifiées (ex: "Ancienne valeur: X, Nouvelle valeur: Y").

---

## ⚙️ Contraintes techniques

- Ces logs peuvent devenir volumineux très rapidement. Il est souvent géré via des triggers PostgreSQL (`audit_logs`) avec une politique de rotation (ex: suppression automatique des logs de plus de 1 an).
- La table des logs doit être en append-only (insert uniquement, `DELETE` et `UPDATE` bloqués même pour les admins via politique RLS restrictive).
- **Partitionnement de table** : Mettre en place un partitionnement PostgreSQL par mois (`PARTITION BY RANGE (created_at)`) pour éviter que la table ne devienne trop lente à requêter quand elle atteindra des millions de lignes.

---

## 🚫 Pièges à éviter

- Logger l'ouverture de chaque page. Cela sature la base de données inutilement. On ne loggue que les mutations de données (Modification, Suppression) et les lectures sensibles (Export CRM, consultation des Risques).

---

## 🏁 Conclusion

C'est l'**assurance juridique et sécurité** de la campagne face au RGPD et aux fuites.
