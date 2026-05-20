# 🧩 Sous-module Administration — Sources de données

## 🧠 Objectif

Le sous-module **Sources de données** recense et configure **d'où provient l'information importée**.

Il sert à :

- configurer les clés API (ex: OpenAI pour la communication, Mapbox pour les cartes)
- définir les URL des bases OpenData cibles (Data.gouv.fr)
- garder une trace de l'origine légale de la donnée

---

## ❓ Question clé

👉 Sur quelles API et sources externes repose notre application, et sont-elles bien connectées ?

---

## 🧩 Rôle dans le module Administration

- C'est le gestionnaire des "tuyaux" entrants et sortants.

---

## 🧱 Structure recommandée

### 1. Liste des Connexions

- Nom de l'intégration (ex: API OpenAI).
- Statut de la connexion (Connecté / Échec).
- Champ sécurisé pour saisir un Token ou une clé secrète.

---

## 🧠 UX attendue

### Principes

- Interface de type "Intégrations / Webhooks".
- Les mots de passe et clés API ne doivent jamais s'afficher en clair (masqués par défaut).

### 🎨 Recommandations UI & Interactions

- **Bouton "Tester la connexion"** : Permet à l'admin de vérifier instantanément si la clé API saisie fonctionne bien.
- **Indicateur de santé** : Pastille de couleur (verte/rouge) indiquant si la dernière tentative de synchronisation avec cette source a réussi.

---

## ⚙️ Contraintes techniques

- **Chiffrement au repos (Encryption at rest)** : Les tokens et clés API doivent être stockés chiffrés en base de données. L'application les déchiffre uniquement lors de l'appel au service tiers.
- **Injection via Variables d'environnement** : Privilégier la configuration des clés critiques via `.env` plutôt qu'en base de données si possible.

---

## 🏁 Conclusion

Le sous-module **Sources de données** est :

👉 la gestion des prises électriques de l'application
