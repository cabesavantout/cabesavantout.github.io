# 🧩 Sous-module Campagne — Suivi de campagne

## 🧠 Objectif

Le sous-module **Suivi de campagne** est le tableau de bord (Dashboard) des **directeurs de campagne**.

Il sert à :

- monitorer en temps réel l'exécution des "Objectifs" fixés
- agréger les remontées quantitatives du terrain (portes ouvertes, refus, sympathisants)
- identifier instantanément si la campagne prend du retard sur sa feuille de route logistique

---

## ❓ Question clé

👉 Sommes-nous dans les temps sur nos objectifs de terrain et la dynamique est-elle bonne ?

---

## 🧩 Rôle dans le module Campagne

- C'est l'outil d'évaluation de la performance interne.

Alimente :

- **Dashboard principal** (remonte les KPIs d'alerte).
- **Terrain** (si retard constaté, déclenchement d'actions coup de poing).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Avons-nous atteint notre objectif de 5000 contacts physiques ce mois-ci ?
2. Quel est notre taux de transformation (sur 100 portes frappées, combien sont positives) ?
3. Combien de "Contacts Prometteurs" la base a-t-elle captés cette semaine ?

---

## 🧱 Structure recommandée

### 1. Jauges d'Objectifs (Thermomètres)

- Progression de la couverture territoriale (% des secteurs traités).
- Progression des contacts réalisés vs Objectif visé.

### 2. Métriques de Qualité

- Taux d'ouverture (Portes-à-porte).
- Taux de soutien (Positifs / Total).

### 3. Dynamique d'équipe

- Nombre de militants actifs sur les 7 derniers jours.
- Tops contributeurs (optionnel, pour la gamification interne).

---

## 🧠 Données attendues

- Données consolidées (COUNT, AVG) générées par les saisies du module `Terrain` et croisées avec les cibles du module `Objectifs`.

---

## 🧠 UX attendue

### Principes

- Pure DataViz. Des jauges, des pourcentages, des courbes d'évolution.
- Vert = On est bons / Rouge = On est en retard.

---

## ⚙️ Contraintes techniques

- Les calculs de ratios (taux d'ouverture) doivent être protégés contre les divisons par zéro et mis à jour quotidiennement ou en temps réel.

---

## 🏁 Conclusion

C'est le **compteur de vitesse et la jauge d'essence** du véhicule de campagne.
