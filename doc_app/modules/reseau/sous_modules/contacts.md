# 🧩 Sous-module Réseau — Contacts (Génériques)

## 🧠 Objectif

Le sous-module **Contacts** gère le répertoire "institutionnel" et externe de la campagne.

Il sert à :

- stocker les coordonnées des journalistes, prestataires (imprimeurs, salles), élus extérieurs
- séparer ces relations professionnelles du fichier des "Citoyens / Électeurs"
- garantir que la perte du téléphone du directeur de campagne ne signifie pas la perte du réseau de la campagne

---

## ❓ Question clé

👉 Comment joindre notre imprimeur, le correspondant du journal local ou le maire de la ville voisine ?

---

## 🧩 Rôle dans le module Réseau

- C'est l'annuaire utilitaire. Il n'a pas d'enjeu de qualification électorale directe.

Alimente :

- **Communication** (constitution des listes de diffusion presse).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Qui est notre contact régulier au sein de _L'Indépendant_ ?
2. Quels sont les prestataires logistiques validés par la campagne ?

---

## 🧱 Structure recommandée

### 1. Liste des Contacts

- Colonnes : Nom, Structure (Entreprise/Média), Rôle, Téléphone, Email.
- Filtres : Par catégorie (Presse, Fournisseur, Institutionnel).

---

## 🧠 Données attendues

- `first_name`, `last_name`, `organization`, `phone`, `email`, `category`.

---

## 🧠 UX attendue

### Principes

- Mode "Répertoire" classique.
- Un clic sur le numéro de téléphone depuis un mobile doit déclencher l'appel.

---

## 🏁 Conclusion

C'est la **mémoire professionnelle et utilitaire de l'équipe**.
