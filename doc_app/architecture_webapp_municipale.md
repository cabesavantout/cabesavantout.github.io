# 🧠 Architecture Fonctionnelle — Webapp Stratégique Municipale

## 🎯 Objectif

Construire une application web permettant de piloter une stratégie municipale sur plusieurs années.

L’application doit être :
- un outil de décision
- un outil de mémoire
- un outil d’action
- un outil d’analyse

Elle est conçue initialement pour un usage personnel, avec une possibilité d’évolution future vers un produit plus large.

---

# 🧱 Structure Globale

L’application est organisée en **12 modules principaux**.

## 🔴 CORE (cœur stratégique)

- Dashboard
- Campagne
- Mandat
- Territoire
- Élections
- Population
- Terrain

## 🟡 SUPPORT (opérationnel)

- Réseau
- Agenda
- Documentation

## ⚫ EXTENSION (secondaire)

- Communication
- Administration

---

# 📦 Liste des Modules

## 1. Dashboard

### Rôle
Piloter l’ensemble de l’application.

### Question clé
👉 Qu’est-ce qui mérite mon attention maintenant ?

### Sous-modules
- Vue d’ensemble
- Urgences
- Priorités du moment
- Activité récente
- Alertes
- Suivi rapide
- À faire aujourd’hui

---

## 2. Campagne

### Rôle
Piloter la stratégie électorale.

### Question clé
👉 Comment je gagne l’élection ?

### Sous-modules
- Stratégie
- Objectifs
- Zones prioritaires
- Cibles
- Messages clés
- Plan d’actions
- Suivi de campagne
- Risques / vigilance

---

## 3. Mandat

### Rôle
Suivre le mandat et les engagements.

### Question clé
👉 Où en est la commune sur les promesses et décisions ?

### Sous-modules
- Vue mandat
- Promesses
- Réalisations
- Décisions
- Sujets / thématiques
- Budget
- Chronologie
- Évaluation

---

## 4. Territoire

### Rôle
Comprendre et organiser l’espace.

### Question clé
👉 Où agir concrètement ?

### Sous-modules
- Vue cartographique
- Bureaux de vote
- Quartiers
- Secteurs
- Rues
- Lieux utiles
- Découpage terrain
- Zones d’attention

---

## 5. Élections

### Rôle
Analyser les comportements électoraux.

### Question clé
👉 Comment vote la commune ?

### Sous-modules
- Vue générale
- Municipales
- Présidentielles
- Législatives
- Européennes
- Autres scrutins
- Résultats par bureau
- Participation / abstention
- Évolutions

---

## 6. Population

### Rôle
Comprendre la structure socio-démographique.

### Question clé
👉 Qui vit ici ?

### Sous-modules
- Vue d’ensemble
- Démographie
- Âges
- Ménages
- Logement
- CSP
- Mobilité
- Évolutions
- Indicateurs clés

---

## 7. Terrain

### Rôle
Suivre l’activité réelle.

### Question clé
👉 Qu’a-t-on fait et que doit-on faire ?

### Sous-modules
- Vue terrain
- Retours terrain
- Porte-à-porte
- Tractage
- Boîtage
- Présences locales
- Signalements
- Actions à venir
- Historique terrain

---

## 8. Réseau

### Rôle
Structurer les relations humaines.

### Question clé
👉 Qui sont les personnes clés ?

### Sous-modules
- Vue réseau
- Contacts
- Citoyens suivis
- Relais locaux
- Associations
- Commerçants
- Équipe
- Interactions
- Cartographie relationnelle

---

## 9. Agenda

### Rôle
Organiser le temps.

### Question clé
👉 Qu’est-ce qui se passe et quand ?

### Sous-modules
- Calendrier global
- Réunions
- Événements
- Conseils municipaux
- Échéances
- Actions planifiées
- Temps forts
- Historique

---

## 10. Documentation

### Rôle
Centraliser la mémoire documentaire.

### Question clé
👉 Quelles preuves et sources ai-je ?

### Sous-modules
- Bibliothèque
- Documents municipaux
- Délibérations
- Comptes rendus
- Presse
- Sources externes
- Archives
- Dossiers thématiques
- Pièces liées

---

## 11. Communication

### Rôle
Préparer la parole publique.

### Question clé
👉 Que dire, à qui, et comment ?

### Sous-modules
- Vue communication
- Messages
- Argumentaires
- Publications
- Réseaux sociaux
- Communiqués
- Presse
- Calendrier éditorial
- Veille

---

## 12. Administration

### Rôle
Maintenir le système.

### Question clé
👉 Comment l’application fonctionne ?

### Sous-modules
- Vue admin
- Sources de données
- Imports / synchronisations
- Tags / taxonomies
- Référentiels
- Paramètres
- Utilisateurs
- Journal technique
- Qualité des données

---

# 🧠 Règles Produit Fondamentales

## 1. 1 module = 1 question
Chaque module doit répondre à une question claire.

## 2. Pas de duplication
Un module ne doit pas refaire ce qu’un autre fait déjà.

## 3. Orientation action
Chaque écran doit permettre une action.

## 4. Vision long terme
La structure doit être stable même si l’implémentation est progressive.

## 5. Priorisation
Tous les modules ne doivent pas être développés en même temps.

---

# 🚀 Étape suivante

Créer :

1. Un fichier `.md` par module
2. Puis un fichier `.md` par sous-module

Chaque fichier devra contenir :
- objectif
- rôle
- données nécessaires
- interactions
- contraintes
- UX attendue
- évolutions possibles

---

# 🏁 Conclusion

Cette architecture constitue la base d’un **OS de campagne municipale**.

Elle doit rester :
- claire
- modulaire
- évolutive
- orientée décision et action

