# 🧩 Sous-module Population — Démographie

## 🧠 Objectif

Le sous-module **Démographie** décompose la **mécanique de croissance ou de déclin** de la ville.

Il sert à :

- comprendre si la ville gagne ou perd des habitants
- identifier la cause de cette évolution : les gens font-ils plus de bébés (solde naturel) ou de nouveaux habitants emménagent-ils (solde migratoire) ?

---

## ❓ Question clé

👉 Pourquoi notre population évolue-t-elle de cette façon, et est-ce dû aux naissances ou aux arrivées de l'extérieur ?

---

## 🧩 Rôle dans le module Population

- C'est l'explication du chiffre principal de la population.

Alimente :

- **Mandat / Promesses** (une ville qui attire de l'extérieur doit construire des équipements ; une ville qui perd des habitants doit chercher à revitaliser son attractivité).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. La ville est-elle attractive (solde migratoire positif) ?
2. Faut-il prévoir de fermer des classes ou d'en ouvrir (solde naturel) ?

---

## 🧱 Structure recommandée

### 1. Graphique des Moteurs de Croissance

- Courbe de la population totale sur 20 ans
- Bar chart superposé : contribution du Solde Naturel vs Solde Migratoire

### 2. Flux d'emménagement

- Part de la population vivant dans la commune depuis moins de 5 ans.

---

## 🧠 Données attendues

- `taux_variation_annuel_pop`
- `contribution_solde_naturel`
- `contribution_solde_apparent_entrees_sorties`

---

## 🧠 UX attendue

### Principes

- Pédagogique (expliquer la différence entre les deux soldes).
- Visuel (utiliser un graphique type "Waterfall" ou aires empilées).

---

## 🚫 Pièges à éviter

- Ne regarder que le chiffre final. Une ville dont la population stagne à 10 000 habitants peut cacher le départ de 1000 jeunes actifs compensé par l'arrivée de 1000 retraités, ce qui change toute la politique locale.

---

## 🏁 Conclusion

Le sous-module **Démographie** est :

👉 le moniteur de la vitalité locale
👉 l'indicateur d'attractivité territoriale
