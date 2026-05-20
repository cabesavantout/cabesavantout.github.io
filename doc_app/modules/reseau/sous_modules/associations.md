# 🧩 Sous-module Réseau — Associations

## 🧠 Objectif

Le sous-module **Associations** cartographie le **tissu associatif local**, qui est un moteur majeur de la vie de la commune (et des dépenses budgétaires).

Il sert à :

- recenser les associations, leurs dirigeants et leur objet
- comprendre le poids de chaque structure (adhérents, subventions reçues)
- préparer les réunions thématiques ciblées (ex: réunir tous les clubs sportifs)

---

## ❓ Question clé

👉 Quelles sont les associations qui font bouger la ville, et comment la mairie interagit-elle avec elles ?

---

## 🧩 Rôle dans le module Réseau

- C'est le gestionnaire des personnes morales "non-lucratives".

Alimente :

- **Mandat (Décisions / Budget)** (le croisement entre une asso et la subvention votée en Conseil Municipal).
- **Événements (Agenda)** (la fête du club X, l'AG de l'asso Y).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Combien de subventions le Club de Tennis a-t-il reçu l'an dernier ?
2. Qui sont le président et le trésorier actuels ?
3. Cette association est-elle réputée proche ou hostile à la majorité sortante ?

---

## 🧱 Structure recommandée

### 1. Fiche Association

#### Blocs

- **Identité** : Nom, Objet, Thème (Sport, Culture, Social), Nombre d'adhérents estimé.
- **Gouvernance** : Liens croisés vers des "Contacts" ou "Citoyens" (Président, Secrétaire).
- **Historique Financier** : Historique des subventions reçues ou locaux prêtés par la ville.
- **Analyse Politique** : Qualité des relations avec l'équipe.

---

## 🧠 Données attendues

- Table `associations` liée via des tables de jointure (many-to-many) aux tables `citizens` ou `contacts` (avec un champ "rôle dans l'asso").

---

## 🔄 Interactions avec les autres modules

| Module | Interaction                                                                                     |
| ------ | ----------------------------------------------------------------------------------------------- |
| Budget | Si l'asso reçoit des fonds, elle justifie une partie des charges de fonctionnement de la ville. |

---

## 🧠 UX attendue

### Principes

- Mise en évidence du "Poids" de l'association (une asso de 400 membres n'a pas le même impact politique qu'une de 10 membres).

---

## 🏁 Conclusion

Le sous-module **Associations** est :
👉 le scanner de la vie locale
👉 l'outil pour préparer le volet "Sport et Culture" du programme
