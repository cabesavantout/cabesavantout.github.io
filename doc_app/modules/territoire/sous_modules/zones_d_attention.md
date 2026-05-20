# 🧩 Sous-module Territoire — Zones d'attention

## 🧠 Objectif

Le sous-module **Zones d'attention** est un calque dynamique qui met en surbrillance les secteurs nécessitant une intervention prioritaire.

Il sert à :

- visualiser instantanément les quartiers en "chauffe" (trop de signalements) ou "froids" (oubliés par le terrain)
- cibler les secteurs avec un fort potentiel électoral (croisement de l'abstention et du vote favorable)

---

## ❓ Question clé

👉 Quels sont les 3 quartiers sur lesquels nous devons nous concentrer cette semaine ?

---

## 🧩 Rôle dans le module Territoire

- C'est la traduction spatiale du module **Campagne (Priorités)**.

Alimente :

- **Dashboard** (remonte les 3 zones les plus critiques).
- **Terrain (Actions à venir)** (suggère de créer des actions dans ces zones).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Pourquoi ce quartier est-il affiché en rouge sur la carte ? (Parce que l'historique terrain indique qu'on n'y est pas allé depuis 6 mois).

---

## 🧠 Logique de scoring

Une zone (quartier ou bureau) obtient un score de priorité élevé si elle cumule plusieurs facteurs. Le calcul peut être une somme pondérée :

`Score = (Poids_A * Potentiel_Électoral) + (Poids_B * Jours_Sans_Visite) + (Poids_C * Nb_Signalements_Négatifs)`

- **Potentiel Électoral** : Nombre d'abstentionnistes ou d'indécis estimés.
- **Jours Sans Visite** : Calculé depuis l'Historique Terrain.
- **Signalements Négatifs** : Nombre de retours terrain avec une humeur "Hostile".

---

## 🧱 Structure recommandée

### 1. Couches de Heatmap (Cartographie)

- **Calque Électoral** : Fort potentiel de conquête.
- **Calque Couverture** : Zones blanches non tractées.
- **Calque Mécontentement** : Forte concentration de signalements.

---

## 🧠 Données attendues

- Vues SQL agrégeant les scores (scoring) des différentes tables (`field_reports`, `elections`, `field_actions`) groupées par zones.

---

## 🧠 UX attendue

### Principes

- Totalement visuel. L'utilisateur active un bouton "Voir les priorités Terrain" et la carte se colore automatiquement.
- **Explicable** : Le système ne doit pas être une boîte noire. L'utilisateur doit comprendre pourquoi une zone est prioritaire.

### 🎨 Recommandations UI & Interactions

- Au clic sur une zone colorée, une infobulle (pop-up) doit s'afficher et détailler le score : "Zone Prioritaire car : Potentiel électoral élevé (7/10), Couverture faible (9/10)".

---

## ⚙️ Contraintes techniques

- **Performance** : Le calcul des scores pour toutes les zones peut être lourd. Il doit être exécuté par une tâche de fond (cron job) et stocké dans une vue matérialisée (`MATERIALIZED VIEW`) pour un affichage instantané.

---

## 🏁 Conclusion

C'est le **radar stratégique spatial**.
