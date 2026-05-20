# 🧩 Sous-module Réseau — Vue réseau

## 🧠 Objectif

Le sous-module **Vue réseau** est le tableau de bord macroscopique de la base de données humaine.

Il sert à :

- évaluer la taille et la qualité de la base de contacts
- visualiser la progression du recrutement militant
- alerter sur les segments de population sous-représentés dans nos bases

---

## ❓ Question clé

👉 Combien de personnes avons-nous dans notre giron, et notre réseau grandit-il ?

---

## 🧩 Rôle dans le module Réseau

- Point d'entrée de la section. Il agrège les chiffres de tous les sous-répertoires (Citoyens, Équipe, Assos).

Alimente :

- **Campagne (Objectifs)** (Permet de vérifier si le nombre de contacts qualifiés correspond aux objectifs de la campagne).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Combien de contacts certains (sympathisants engagés) possédons-nous ?
2. Combien de nouveaux contacts le terrain a-t-il ramenés cette semaine ?
3. A-t-on une bonne couverture des présidents d'associations de la ville ?

---

## 🧱 Structure recommandée

### 1. Métriques Clés (KPI)

- Total Contacts Actifs
- % de Citoyens "Favorables" ou "Soutiens"
- Nouveaux contacts (30 derniers jours)
- Taille de l'Équipe active

### 2. Répartition Sociologique / Spatiale

- Graphique de répartition des contacts par Quartier/Secteur (pour identifier où l'on manque de relais).

---

## 🧠 Données attendues

- Données agrégées (COUNT, GROUP BY) des tables `citizens`, `contacts`, `associations`.

---

## 🧠 UX attendue

### Principes

- Visuel et encourageant (la croissance de la courbe des contacts est un élément fort de motivation pour une équipe de campagne).

---

## 🏁 Conclusion

C'est le **thermomètre de la mobilisation humaine**.
