# 🧭 Module Dashboard

## 🧠 Objectif

Le Dashboard est le **cockpit quotidien** de l’application.

Il transforme l’ensemble des informations (Mandat, Territoire, Élections, Population, Terrain, Réseau, Agenda, Documentation) en :

👉 **priorités claires, décisions immédiates et actions à lancer**.

---

## ❓ Question clé

👉 Qu’est-ce qui mérite mon attention maintenant, et que dois-je faire aujourd’hui ?

---

## 🧩 Rôle dans l’application

- Point d’entrée principal
- Synthèse temps réel
- Déclencheur d’actions
- Détecteur de risques

Le Dashboard **n’est pas** :
- un agrégateur de KPI décoratifs
- une duplication des modules
- une page de reporting lourde

👉 Il **priorise et déclenche**.

---

## 🧱 Structure du module

### 1. Vue d’ensemble

#### Objectif
Donner une lecture immédiate de la situation globale.

#### Contenu
- état global (calme / attention / critique)
- résumé des 3–5 sujets majeurs

#### Contraintes
- très synthétique (1 écran max)

---

### 2. Urgences

#### Objectif
Identifier ce qui nécessite une action rapide.

#### Sources
- Mandat (promesses bloquées)
- Agenda (échéances proches)
- Terrain (signalements critiques)
- Campagne (risques)

#### Contenu
- liste priorisée (max 5)
- niveau de criticité
- délai

#### Actions
- ouvrir l’élément
- créer action
- assigner (si besoin futur)

---

### 3. À faire aujourd’hui

#### Objectif
Transformer la stratégie en tâches concrètes.

#### Contenu
- 3 à 7 actions maximum
- liées à : zones, promesses, événements

#### Contraintes
- pas de backlog long
- actionnable en une journée

---

### 4. Priorités du moment

#### Objectif
Donner le focus sur les prochains jours/semaines.

#### Contenu
- sujets politiques clés
- zones à travailler
- actions structurantes

#### Sources
- Campagne
- Mandat
- Territoire

---

### 5. Promesses à risque

#### Objectif
Suivre les fragilités politiques.

#### Sources
- Mandat

#### Contenu
- promesses fragiles / bloquées
- niveau de risque
- preuve manquante
- prochaine action

---

### 6. Zones à surveiller

#### Objectif
Identifier les zones nécessitant une attention.

#### Sources
- Territoire
- Élections
- Terrain

#### Contenu
- zones faibles
- zones sans activité récente
- zones à potentiel

#### Actions
- ouvrir la zone
- planifier action

---

### 7. Activité récente

#### Objectif
Garder une mémoire rapide de ce qui vient d’être fait.

#### Sources
- Terrain
- Agenda
- Documentation

#### Contenu
- derniers retours terrain
- dernières réunions
- derniers documents ajoutés

---

### 8. Agenda utile

#### Objectif
Anticiper les échéances.

#### Sources
- Agenda

#### Contenu
- prochains événements
- réunions importantes
- échéances politiques

---

### 9. Alertes

#### Objectif
Remonter les signaux faibles.

#### Sources
- tous modules

#### Contenu
- incohérences
- données manquantes
- absence d’activité

---

## 🔄 Interactions avec les autres modules

| Module | Utilisation |
|--------|------------|
| Campagne | priorités et plan d’actions |
| Mandat | promesses et risques |
| Territoire | zones |
| Élections | dynamiques de vote |
| Population | contexte social |
| Terrain | activité réelle |
| Réseau | interactions humaines |
| Agenda | échéances |
| Documentation | preuves |

---

## 🧠 UX attendue

### Principes

- lecture en moins de 10 secondes
- hiérarchie visuelle forte
- blocs indépendants
- accès direct aux actions

### Règles

- max 5–7 blocs visibles
- max 5 items par bloc
- 1 action principale par item

### Structure visuelle recommandée

- colonne principale : urgences + actions
- colonne secondaire : contexte + activité

---

## ⚙️ Contraintes techniques

- agrégation multi-sources
- calcul de priorités simple (pas de logique complexe au début)
- mise à jour rapide
- possibilité de cache

---

## 🧠 Logique de priorisation (simple)

Score possible basé sur :
- urgence temporelle
- impact politique
- absence d’action récente
- volume de signaux terrain

---

## 🚫 Pièges à éviter

- ajouter trop de métriques
- afficher toutes les données
- dupliquer les pages métiers
- rendre le dashboard dépendant d’un seul module

---

## 🚀 Roadmap d’implémentation

### Phase 1
- Vue d’ensemble
- Urgences
- À faire aujourd’hui

### Phase 2
- Zones à surveiller
- Promesses à risque
- Activité récente

### Phase 3
- Agenda utile
- Alertes
- scoring simple

---

## 🏁 Conclusion

Le Dashboard doit devenir :

👉 le premier écran que tu ouvres chaque jour
👉 le dernier écran que tu consultes avant d’agir

C’est le **point de convergence opérationnel** de toute l’application.