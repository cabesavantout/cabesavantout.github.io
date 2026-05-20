# 🧩 Sous-module Population — Vue d'ensemble

## 🧠 Objectif

Le sous-module **Vue d'ensemble** agit comme le "portrait-robot" sociologique de la commune.

Il sert à :

- donner en un clin d'œil l'identité sociale de la ville
- afficher les 5 à 6 métriques les plus déterminantes pour la stratégie
- fournir le point d'entrée vers les analyses détaillées

---

## ❓ Question clé

👉 Si je devais décrire la sociologie de la ville à un journaliste en 30 secondes, que dirais-je ?

---

## 🧩 Rôle dans le module Population

- C'est le tableau de bord (Dashboard) exclusif de l'INSEE.
- Il fait la synthèse des 8 autres sous-modules.

---

## 🎯 Finalité métier

Permettre de répondre instantanément à :

1. Combien d'habitants officiels ?
2. La ville est-elle globalement jeune ou âgée ?
3. Est-ce une ville de propriétaires ou de locataires ?
4. Quel est le taux de chômage / précarité ?

---

## 🧱 Structure recommandée

### 1. La Carte d'Identité

- Population totale
- Taux de pauvreté / Médiane du revenu
- % de retraités
- % de propriétaires

### 2. Le Fait Majeur (Insight)

- Une phrase générée automatiquement qui met en avant la plus grande spécificité de la ville par rapport à la norme (ex: "Cabestany se distingue par une part de familles monoparentales très inférieure à la moyenne").

---

## 🧠 Données attendues

- `population_totale`
- `revenu_median`
- `part_proprietaires`
- `part_retraites`

---

## 🧠 UX attendue

### Principes

- Grandes cartes de chiffres (KPI).
- Lecture comparative immédiate (une flèche rouge/verte pour comparer à la moyenne nationale ou départementale).

---

## ⚙️ Contraintes techniques

- Les indicateurs affichés ici doivent être les plus "robustes" et stables dans le temps.

---

## 🏁 Conclusion

Le sous-module **Vue d'ensemble** est :

👉 la photographie d'identité de la ville
👉 le socle de base pour tout nouvel arrivant dans l'équipe de campagne
