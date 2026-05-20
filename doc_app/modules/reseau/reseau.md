# 🤝 Module Réseau

## 🧠 Objectif

Le module Réseau est le **CRM (Customer Relationship Management) humain et politique** de l'application.

Il permet de :

- centraliser tous les contacts de la campagne (citoyens, assos, commerçants, équipe)
- qualifier le niveau de soutien de chaque individu (hostile, neutre, sympathisant, engagé)
- cartographier les sphères d'influence locales (qui dirige quoi, qui connaît qui)
- tracer l'historique des échanges pour personnaliser la relation

👉 afin de passer d'une campagne de "masse" à une **campagne de relations ciblées**.

---

## ❓ Question clé

👉 Qui sont les acteurs clés de la ville, quel est leur poids électoral, et quelle relation entretenons-nous avec eux ?

---

## 🧩 Rôle dans l’application

- C'est la base de données qualifiée des personnes physiques et morales.
- Il transforme l'anonymat du "Terrain" (une porte frappée) en relation suivie (un citoyen convaincu).

Le module Réseau **n’est pas** :

- un simple carnet d'adresses statique (type répertoire de téléphone)
- un outil déconnecté des actions de campagne

👉 Il **mesure le capital humain et relationnel du candidat**.

---

## 🧱 Structure du module

### 1. Vue réseau

- La synthèse de notre force de frappe humaine (nombre de contacts qualifiés, évolution des soutiens).

### 2. Contacts

- Le répertoire générique (presse, institutionnels, fournisseurs).

### 3. Citoyens suivis

- Le cœur électoral : les habitants rencontrés, leurs préoccupations et leur intention de vote estimée.

### 4. Relais locaux

- Les "nœuds" du réseau : présidents d'amicales, leaders d'opinion de quartier.

### 5. Associations

- Les personnes morales structurant la vie locale (très subventionnées, donc électoralement stratégiques).

### 6. Commerçants

- Les acteurs économiques, souvent prescripteurs d'opinion sur la vitalité du centre-ville.

### 7. Équipe

- La gestion des militants, de leurs disponibilités et de leurs affectations sectorielles.

### 8. Interactions

- Le journal de bord de chaque contact (RDV, appel, tractage).

### 9. Cartographie relationnelle

- La vue des influences (ex: "Contact X est président de l'Asso Y et proche du Commerçant Z").

---

## 🔄 Interactions avec les autres modules

| Module             | Interaction                                                                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Terrain            | Un "Retour terrain" anonyme peut se transformer en "Citoyen suivi" s'il laisse ses coordonnées.                                     |
| Campagne (Cibles)  | Les segments de campagne s'appuient sur les tags des citoyens (ex: "Envoyer un e-mail à tous les _Commerçants_ du _Centre-ville_"). |
| Agenda             | Lien entre un Événement et les Contacts invités / présents.                                                                         |
| Mandat (Décisions) | Lien entre l'attribution d'une subvention et l'Association concernée.                                                               |

---

## 🧠 UX attendue

### Principes

- **Sécurité absolue** : Ce module contient des données personnelles (RGPD). Les exports doivent être tracés et l'accès restreint.
- **Centralité de la fiche** : La "Fiche Contact" doit être le hub ultime (on y voit ses infos, ses assos, ses retours terrain liés, ses tâches).
- **Qualification rapide** : Un curseur "Niveau de soutien" visuel (froid / tiède / chaud) sur chaque liste.

---

## ⚙️ Contraintes techniques

- Respect strict du RGPD (droit à l'oubli, minimisation de la donnée, consentement pour l'envoi d'e-mails).
- Indexation performante pour permettre une recherche ultra-rapide (taper un nom dans la barre de recherche globale doit faire remonter le contact instantanément).

---

## 🚀 Roadmap d’implémentation

### Phase 1 — Le Carnet

- Fiche contact unique, gestion de l'équipe, et liste des citoyens.

### Phase 2 — Les Personnes Morales

- Fiches Associations et Commerçants, avec liaison vers les contacts (Dirigeants).

### Phase 3 — L'Intelligence Relationnelle

- Historique des interactions et cartographie de l'influence.

---

## 🏁 Conclusion

Le module Réseau doit devenir :

👉 le carnet de bal de la campagne
👉 la jauge de la dynamique militante
