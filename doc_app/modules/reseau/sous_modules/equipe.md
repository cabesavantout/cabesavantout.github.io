# 🧩 Sous-module Réseau — Équipe (Membres & Militants)

## 🧠 Objectif

Le sous-module **Équipe** gère les **ressources humaines internes** de la campagne.

Il sert à :

- organiser la force de frappe militante (qui fait quoi, qui est disponible quand)
- assigner les responsables de secteurs territoriaux
- suivre le niveau d'engagement (les "inactifs" à relancer, les "hyper-actifs" à valoriser)

---

## ❓ Question clé

👉 Combien de bras avons-nous pour tracter ce week-end et qui est le responsable de cette action ?

---

## 🧩 Rôle dans le module Réseau

- C'est la gestion des utilisateurs et des acteurs internes. (Distinct de _Administration > Utilisateurs_ qui gère les droits logiciels).

Alimente :

- **Terrain (Tâches / Actions)** (affectation des responsables).
- **Territoire (Secteurs)** (attribution d'un quartier à un référent).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Qui est le référent de l'équipe pour le secteur Nord ?
2. Quels sont les bénévoles disponibles pour faire du boîtage le samedi matin ?
3. Sommes-nous en manque d'effectifs pour couvrir la campagne ?

---

## 🧱 Structure recommandée

### 1. Vue Trombinoscope (Liste)

- Nom, rôle dans la campagne (ex: Directeur de campagne, Référent quartier, Militant), secteurs assignés.

### 2. Fiche Membre

- **Informations internes** : Dispos, compétences particulières (ex: "Sait faire du graphisme", "A une camionnette").
- **Affectations** : Les tâches qui lui sont assignées et les secteurs dont il a la charge.
- **Activité récente** : Nombre d'actions réalisées ce mois-ci.

---

## 🧠 Données attendues

- Table `team_members` liée aux rôles organisationnels définis dans `authz-model.md` (fonction organisationnelle : Directeur, Coordinateur, etc.).

---

## 🧠 UX attendue

### Principes

- Mode "Management de projet". On doit pouvoir voir d'un coup d'œil si quelqu'un est surchargé de tâches ou au contraire sous-utilisé.
- **Gamification et Fidélisation** : Affichage de classements amicaux (ex: Top 3 des militants du mois en nombre d'actions) et déblocage de "Badges" symboliques pour éviter l'essoufflement.

---

## 🚫 Pièges à éviter

- Ne pas faire la différence entre "Rôle logiciel" (ce qu'il peut cliquer) et "Fonction de campagne" (ce qu'il fait en vrai). La fonction de campagne se gère ici.

---

## 🏁 Conclusion

Le sous-module **Équipe** est :

👉 l'organigramme de la victoire
👉 le gestionnaire d'énergie de la campagne
