# 🏠 Module Dashboard

## 🧠 Objectif

Le module **Dashboard** est le point d'entrée quotidien de l'application. Il sert de **cockpit de pilotage stratégique et opérationnel**.

Il permet de :

- savoir immédiatement ce qui requiert une attention (urgences, alertes)
- visualiser la dynamique globale (activité récente)
- organiser sa journée (à faire)
- garder un œil sur les sujets chauds (suivi rapide)

👉 afin de **prendre les bonnes décisions sans avoir à chercher l'information**.

---

## ❓ Question clé

👉 Qu’est-ce qui mérite mon attention maintenant ?

---

## 🧩 Rôle dans l’application

- C'est le seul module qui ne possède aucune donnée en propre.
- C'est un **agrégateur intelligent** qui filtre et remonte les signaux des autres modules (Mandat, Terrain, Campagne, etc.).

Le module Dashboard **n’est pas** :

- un outil d'exploration de données profondes
- un espace de saisie
- un ensemble de graphiques complexes et illisibles

👉 Il **simplifie la complexité pour déclencher l'action**.

---

### 🥇 Priorité Produit

- **Essentiel** : Mettre en lumière ce qui nécessite une décision immédiate (Alertes, Urgences).
- **Secondaire** : L'exploration profonde des données (qui doit se faire dans les modules respectifs, pas ici).

---

## 🧱 Structure conceptuelle du module

Bien que l'UI finale soit une page unique et épurée, la logique d'agrégation repose sur 7 flux (sous-modules) :

### 1. Vue d'ensemble

- La photographie macroscopique à l'instant T.

### 2. Urgences

- Les éléments bloquants ou critiques (ex: promesse en danger immédiat).

### 3. Priorités du moment

- Le focus stratégique de la semaine/du mois (dicté par la Campagne).

### 4. Activité récente

- Le flux "live" de ce qui se passe sur le terrain ou dans l'équipe.

### 5. Alertes

- Les signaux faibles détectés par le système (ex: chute de la présence dans un quartier).

### 6. Suivi rapide

- Les éléments mis en favoris par l'utilisateur.

### 7. À faire aujourd'hui

- La liste des tâches personnelles et immédiates.

---

## 🔄 Interactions avec les autres modules

| Module         | Interaction                                       |
| -------------- | ------------------------------------------------- |
| Mandat         | Remonte les "Promesses à risque"                  |
| Terrain        | Remonte les "Signalements urgents" et les retours |
| Agenda/Actions | Affiche les "Tâches à faire aujourd'hui"          |
| Campagne       | Hérite du focus actuel (Plan d'action en cours)   |

---

## 🧠 UX attendue

### Principes (Référence : `ui-simplification-guide.md`)

- **Ultra-simplifié** : lisible en 3 secondes.
- **Zéro bruit** : 3 cartes (cards) maximum pour la vue principale.
- **Personnalisé** : la vue s'adapte au rôle de l'utilisateur (un militant voit ses actions terrain, le candidat voit les risques stratégiques).
- **Recherche Globale (Omnibox)** : Barre de recherche type `Cmd+K` accessible partout, tapant dans toutes les tables simultanément (promesses, budget, rues, citoyens).
- **Gamification** : Éléments de motivation pour les bénévoles (ex: "Vous avez frappé 150 portes ce mois-ci, vous êtes dans le Top 3 !").
- **Export de Rapports ("Candidat Mode")** : Possibilité de générer un mémo PDF récapitulatif hebdo.
- **Notifications (Push / Email)** : Récapitulatifs hebdomadaires et alertes internes pour ramener l'utilisateur sur la plateforme s'il oublie de se connecter.

### 🎨 Recommandations UI & Interactions

- **"Zero Inbox" Policy** : Les sections "Urgences" ou "À faire" doivent afficher un _Empty State_ gratifiant (ex: illustration zen + "Tout est à jour") lorsqu'elles sont vides, pour récompenser l'utilisateur.
- **Hiérarchie visuelle** : Utiliser la couleur avec parcimonie. Le rouge est strictement réservé aux urgences ou échéances légales. Les KPIs normaux restent neutres.
- **Navigation persistante** : La barre de recherche globale (Omnibox) doit être toujours visible (Sticky header).

---

## ⚙️ Contraintes techniques

- **Performance absolue** : le Dashboard doit s'afficher instantanément. Les requêtes d'agrégation (COUNT, filtres sur statuts critiques) doivent être optimisées (vues matérialisées ou index pertinents).
- **Gestion des droits** : le Dashboard ne doit jamais exposer un résumé d'une information à laquelle l'utilisateur n'a pas accès dans le module source.
- **Cache** : Mettre en cache (Redis ou équivalent in-memory) les métriques macroscopiques pour éviter de recalculer les 10 000 portes frappées à chaque chargement de la page d'accueil.

---

## 🏁 Conclusion

Le module Dashboard doit devenir :

👉 le premier écran vu le matin
👉 le filtre anti-surcharge mentale de l'équipe

C'est le **trieur de l'urgence et de l'important**.
