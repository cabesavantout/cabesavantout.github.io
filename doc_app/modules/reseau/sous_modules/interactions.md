# 🧩 Sous-module Réseau — Interactions

## 🧠 Objectif

Le sous-module **Interactions** est le **journal de bord granulaire** des échanges avec la population et les contacts.

Il sert à :

- s'assurer qu'aucun engagement pris à l'oral ("je vous rappelle demain") n'est oublié
- partager l'information au sein de l'équipe (si le militant A appelle, le militant B doit savoir ce qui a été dit)
- mesurer l'intensité de la campagne relationnelle

---

## ❓ Question clé

👉 Qui a parlé avec ce citoyen pour la dernière fois, quand, et qu'est-ce qui a été dit ?

---

## 🧩 Rôle dans le module Réseau

- C'est l'outil de "Log" (journalisation). Il vient s'intégrer sous forme de Timeline à l'intérieur des fiches Contacts, Citoyens, Assos.

Alimente :

- **Dashboard** (une interaction marquée "À relancer" devient une tâche).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Devons-nous rappeler le président du club de foot, ou le directeur de campagne l'a-t-il déjà fait ?
2. Quelle est la synthèse de notre dernière rencontre avec ce commerçant ?

---

## 🧱 Structure recommandée

### 1. Composant Timeline (Fil d'activité)

- Composant affiché sur chaque fiche Citoyen/Asso.
- **Types d'interaction** : Appel téléphonique, Rencontre physique (PàP, Marché), E-mail envoyé, Réunion.
- **Auteur** : Le membre de l'équipe qui a fait l'interaction.
- **Notes** : Le résumé court de l'échange.
- **Action de suite** : Bouton pour générer une Tâche depuis l'interaction.

---

## 🧠 Données attendues

- Entité `interactions` polymorphique (qui peut se lier à un citoyen, un commerce, ou une association).

---

## 🧠 UX attendue

### Principes

- Saisie ultra-rapide ("Quick Log"). Un bouton global "Loguer un appel" doit être accessible sans charger une page lourde.

---

## 🚫 Pièges à éviter

- Rendre la saisie obligatoire et trop longue. Si c'est lourd, les militants arrêteront de consigner leurs appels.

---

## 🏁 Conclusion

C'est la **mémoire conversationnelle et infaillible de l'équipe**.
