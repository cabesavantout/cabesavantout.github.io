# 🧩 Sous-module Dashboard — Vue d'ensemble

## 🧠 Objectif

Le sous-module **Vue d'ensemble** synthétise la santé globale du projet politique ou de la campagne à travers **2 ou 3 indicateurs vitaux**.

Il sert à :

- donner le pouls immédiat
- rassurer sur l'avancement global
- fournir un contexte avant d'entrer dans les urgences

---

## ❓ Question clé

👉 Sommes-nous globalement dans la bonne direction ?

---

### 🥇 Priorité Produit

- **Essentiel** : Avoir la métrique la plus vitale à l'instant T (souvent le nombre de contacts terrain ou l'objectif en voix).
- **Secondaire** : Les graphiques d'évolution complexes (à réserver aux modules dédiés).

---

## 🧩 Rôle dans le module Dashboard

- C'est le bloc supérieur ("Hero section") du Dashboard.

---

## 🎯 Finalité métier

Permettre de répondre en 1 seconde à :

1. Combien de contacts terrain avons-nous réalisés cette semaine ?
2. Quel est le taux de réalisation de nos objectifs actuels ?

---

## 🧱 Structure recommandée

### 1. Cartes de métriques (KPI Cards)

- 3 cartes alignées maximum.
- Exemples typiques selon la phase :
  - "Couverture Terrain (Semaine)"
  - "Objectif en voix (Atteint à X%)"
  - "Promesses Tenues (Total)"
- **Sparklines** : Un mini-graphique d'évolution (courbe très simple sans axe) en fond de carte pour donner le contexte de la dynamique.

---

## 🧠 Données attendues

- Chiffres agrégés globaux (COUNT simples).

---

## 🧠 UX attendue

### Principes

- Un chiffre énorme, un libellé très court, et (idéalement) une flèche de tendance (ex: "+15% vs semaine dernière").
- **Zéro clic requis** : L'information doit être digérée d'un simple regard. Aucun tableau interactif ici.

---

## ⚙️ Contraintes techniques

- **Mise en cache stricte** : Ces compteurs globaux sollicitent toute la base de données. Ils doivent être pré-calculés (via Redis ou une vue matérialisée rafraîchie périodiquement) pour garantir un temps de chargement du dashboard < 500ms.

---

## 🏁 Conclusion

C'est la **météo quotidienne** de la campagne.
