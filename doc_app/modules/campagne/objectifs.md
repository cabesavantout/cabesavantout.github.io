# 🧩 Sous-module Campagne — Objectifs

## 🧠 Objectif

Le sous-module **Objectifs** convertit la stratégie politique en **métriques mathématiques implacables**.

Il sert à :

- calculer la "Cible en voix" (combien de suffrages précis il faut pour faire 50% + 1)
- déduire l'effort physique nécessaire (combien de portes frapper pour obtenir ces voix)
- objectiver l'avancement de la campagne

---

## ❓ Question clé

👉 Combien de voix nous manque-t-il pour gagner, et combien de foyers devons-nous contacter pour les trouver ?

---

## 🧩 Rôle dans le module Campagne

- C'est la calculatrice électorale.

Alimente :

- **Suivi de campagne** (fournit la valeur "100%" des jauges de progression).
- **Territoire (Zones prioritaires)** (répartition de l'objectif par bureau de vote).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Si la participation est de X%, combien de voix nous faut-il pour gagner ?
2. Combien de voix l'adversaire a-t-il de garantie (son socle) ?
3. Quel est notre objectif de porte-à-porte (en nombre de contacts qualifiés) ?

---

## 🧱 Structure recommandée

### 1. La Cible en Voix

- Estimateur : Hypothèse de participation × Nombre d'inscrits = Votants.
- Objectif de victoire : (Votants / 2) + 1.
- Socle actuel estimé vs Cible à atteindre = Le "Delta" (Les voix à aller chercher).

### 2. Le Tunnel de Conversion Terrain

- Cible de contacts directs à réaliser (ex: pour 1000 voix manquantes, viser 5000 contacts terrains en supposant un taux de conversion de 20%).

### 3. Objectifs de couverture (KPIs)

- % de rues de la ville à couvrir en porte-à-porte avant le premier tour.
- Nombre de réunions de quartier à tenir.

---

## 🧠 Données attendues

- Saisie manuelle d'hypothèses (Taux de participation estimé).
- Calculs dérivés depuis les tables `elections` et `insee`.

---

## 🧠 UX attendue

### Principes

- Mode "Simulateur" : l'utilisateur doit pouvoir bouger un curseur de "Participation estimée" et voir l'objectif en voix se mettre à jour en temps réel.
- Focus sur l'écart ("Il nous manque 854 voix").

---

## 🚫 Pièges à éviter

- Fixer des objectifs en pourcentage (les pourcentages ne s'additionnent pas et ne se frappent pas aux portes). **Penser uniquement en Volumes (Voix, Portes, Personnes)**.

---

## 🏁 Conclusion

Le sous-module **Objectifs** est :

👉 la ligne d'arrivée chiffrée
👉 l'outil qui transforme l'espoir politique en plan de charge logistique
