# 🎯 Module Campagne

## 🧠 Objectif

Le module Campagne est le **cerveau stratégique** de l’application.

Il permet de :

- définir la feuille de route électorale (comment on gagne)
- fixer les objectifs mathématiques à atteindre (combien de voix)
- clarifier les messages et les publics cibles (à qui on parle et quoi dire)
- piloter l'exécution macroscopique de l'effort militant

👉 afin de s'assurer que **chaque action menée sur le terrain sert un objectif politique précis**.

---

## ❓ Question clé

👉 Comment gagne-t-on l'élection, étape par étape, et sommes-nous sur la bonne trajectoire ?

---

### 🥇 Priorité Produit

- **Essentiel** : Fixer un objectif chiffré unique et le rendre visible. Sans cible, les actions terrain s'éparpillent.
- **Secondaire** : La description théorique des personae.

## 🧩 Rôle dans l’application

- C'est l'outil de direction de campagne.
- Il consomme les données "froides" (Élections, Population, Mandat) pour générer des directives vers les modules "chauds" (Terrain, Communication).

Le module Campagne **n’est pas** :

- un gestionnaire de tâches quotidien (ça, c'est l'Agenda / Actions)
- un annuaire de militants (ça, c'est le Réseau)

👉 Il **donne le sens et le cap**.

---

## 🧱 Structure du module

### 1. Stratégie

- Le positionnement global, le narratif de la campagne et l'analyse SWOT (Forces/Faiblesses).

### 2. Objectifs

- La mathématique électorale : la cible en voix, le nombre de contacts à réaliser, le taux de pénétration visé.

### 3. Cibles

- Les segments de population à convaincre en priorité (sociologie et géographie).

### 4. Messages clés

- L'argumentaire central, les ripostes et les éléments de langage par thème.

### 5. Plan d'actions

- Le phasage macroscopique de la campagne (Notoriété → Persuasion → Mobilisation).

### 6. Suivi de campagne

- Le thermomètre : avançons-nous assez vite par rapport à nos objectifs ?

### 7. Risques / Vigilance

- L'identification des failles de la candidature, la surveillance de l'adversaire et la gestion de crise.

### 8. Budget de campagne (CNCCFP)

- Le suivi financier propre à la campagne électorale (devis, plafond légal, remboursements).

---

## 🔄 Interactions avec les autres modules

| Module        | Interaction                                                                   |
| ------------- | ----------------------------------------------------------------------------- |
| Élections     | Fournit les bases de calcul pour déterminer l'objectif en voix                |
| Territoire    | Reçoit la commande stratégique pour colorer les "Zones Prioritaires"          |
| Terrain       | Exécute la stratégie et remonte les signaux permettant d'ajuster les messages |
| Communication | Transforme les "Messages clés" en productions concrètes (tracts, posts)       |

---

## 🧠 UX attendue

### Principes

- **Haut niveau** : interface de type "Cockpit" ou "Salle de contrôle".
- **Restreint** : c'est un module hautement confidentiel, visible uniquement par la direction de campagne (rôle `direction`).
- **Orienté écarts** : il doit systématiquement comparer le "Prévu" (ex: faire 5000 portes) avec le "Réalisé" (ex: 2300 portes faites).
- **Export de Rapports ("Candidat Mode")** : Bouton "Générer le rapport hebdo" compilant via l'IA les urgences, les chiffres clés et les sujets chauds en un beau PDF prêt à imprimer pour la tête de liste.

### 🎨 Recommandations UI & Interactions

- **Mode "Présentation"** : Interface sobre, sans menus latéraux distrayants, conçue pour être projetée sur un écran TV lors des comités de pilotage.
- **Graphes de vélocité** : Afficher des courbes de type "Burnup chart" pour voir si le rythme des actions rattrape l'objectif final.

---

## ⚙️ Contraintes techniques

- forte nécessité d'agréger des métriques provenant de toute la base de données (somme des retours terrains, agrégation des inscrits par bureau).
- gestion stricte des permissions (les stratégies et risques ne doivent pas fuiter vers les utilisateurs ayant un rôle `militant` ou `lecture`).
- **Vues Matérialisées** : Les calculs d'avancement croisés doivent s'appuyer sur des vues SQL pré-calculées pour garantir un affichage instantané.

---

## 🚀 Roadmap d’implémentation

### Phase 1 — Le Cadrage

- Sous-modules : Objectifs, Messages clés, Stratégie (formats simples, type documents enrichis).

### Phase 2 — Le Pilotage

- Sous-modules : Cibles, Plan d'actions, Suivi de campagne (dashboards avec jauges de progression).

### Phase 3 — L'Anticipation

- Sous-modules : Risques / Vigilance.

---

## 🏁 Conclusion

Le module Campagne doit devenir :

👉 la boussole de toute l'équipe
👉 l'arbitre en cas de désaccord sur les priorités d'action
