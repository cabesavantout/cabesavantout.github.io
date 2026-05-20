# 🧩 Sous-module Administration — Vue admin

## 🧠 Objectif

Le sous-module **Vue admin** est le tableau de bord réservé au `superadmin`.

Il sert à :

- vérifier instantanément que l'application "tourne" correctement
- repérer d'éventuelles erreurs de synchronisation ou des goulots d'étranglement

---

## ❓ Question clé

👉 Le système est-il techniquement sain aujourd'hui ?

---

## 🧩 Rôle dans le module Administration

- C'est la page d'accueil de la section Paramètres pour un super-administrateur.

---

## 🧱 Structure recommandée

### 1. Métriques système

- Nombre total d'utilisateurs actifs (connectés dans les 7 derniers jours).
- Espace de stockage utilisé (documents de la Bibliothèque).
- Statut des dernières tâches d'arrière-plan (ex: "Dernier import INSEE réussi il y a 3h").

---

## 🧠 Données attendues

- Agrégations directes sur les tables système (`users`, `storage`, `job_logs`).

---

## 🚫 Pièges à éviter

- Transformer cet écran en un clone d'outils de monitoring complexes comme Datadog ou Sentry. S'il y a une vraie erreur serveur, c'est au niveau de l'hébergeur qu'on la gère. Ici, on gère la "santé applicative".

---

## 🏁 Conclusion

Le sous-module **Vue admin** est :

👉 le check-up médical de l'application
