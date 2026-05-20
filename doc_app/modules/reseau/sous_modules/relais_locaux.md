# 🧩 Sous-module Réseau — Relais locaux

## 🧠 Objectif

Le sous-module **Relais locaux** isole les **influenceurs et "faiseurs d'opinion"** des simples citoyens.

Il sert à :

- identifier les personnes capables de diffuser un message à 10, 50 ou 100 personnes
- cartographier les leaders informels (anciens du village, présidents de syndics, figures de quartiers)
- assurer une gestion "VIP" (chouchoutage) de ces profils par la direction de campagne

---

## ❓ Question clé

👉 Qui sont les habitants qui ont de l'influence sur les autres et les avons-nous de notre côté ?

---

## 🧩 Rôle dans le module Réseau

- C'est l'élite du fichier citoyen.

Alimente :

- **Cartographie relationnelle** (ils sont au centre des toiles d'araignée).
- **Territoire (Secteurs)** (un bon secteur doit avoir au moins un relais local identifié).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Si nous avons une rumeur à éteindre dans le quartier de la Germanor, qui pouvons-nous appeler pour faire passer le vrai message ?
2. Monsieur X est-il un leader écouté ou juste quelqu'un qui parle fort ?

---

## 🧱 Structure recommandée

### 1. Liste des Relais

- Basée sur la même structure que les Citoyens, mais avec un focus sur :
  - La sphère d'influence (ex: "Copropriété Moulinas", "Club de pétanque").
  - Le niveau de proximité avec le candidat (Allié / À convaincre / À neutraliser).

### 2. Actions VIP

- Système de rappel prioritaire (alertes Dashboard) si un relais n'a pas été contacté depuis plus d'un mois.

---

## 🧠 Données attendues

- Statut spécifique (flag `is_key_influencer`).
- Champ de description de la nature de l'influence.

---

## 🧠 UX attendue

### Principes

- Cette liste doit être très courte (quelques dizaines de noms max pour une ville de 10 000 hab).
- Elle nécessite un niveau d'habilitation `direction` car les commentaires qui y figurent sont politiquement sensibles.

---

## 🏁 Conclusion

C'est l'outil de la **campagne asymétrique et de l'influence ciblée**.
