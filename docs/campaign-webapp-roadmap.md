# Webapp de campagne municipale

## Contexte

Le dépôt actuel héberge le site public de campagne. La webapp interne doit rester séparée au démarrage pour limiter le risque, protéger les données sensibles et conserver un déploiement simple du site vitrine sur GitHub Pages.

Recommandation initiale:

- conserver le site public actuel
- ajouter un lien `Espace equipe` vers une webapp privée
- héberger la webapp sur Vercel
- héberger la base PostgreSQL et les fonctions backend sur Supabase

Cette approche permet de livrer vite, sans migration lourde du site existant.

## Objectifs produit

La webapp doit devenir l'outil central de campagne pour:

- centraliser les données électorales, financières et terrain
- organiser l'équipe et les responsabilités
- suivre les actions, réunions et événements
- accélérer l'analyse et la production via IA
- remplacer progressivement Google Drive et Notion

## Utilisateurs cibles

- direction de campagne
- candidat et cercle stratégique
- responsables quartier / bureau
- équipe terrain
- équipe communication

## Principes produit

- privé par défaut
- mobile d'abord pour les usages terrain
- historique et traçabilité sur chaque donnée sensible
- IA assistive, jamais opaque
- saisie simple, lecture synthétique

## Architecture recommandée

## Découpage

- `site public`: dépôt actuel, vitrine et contenus publics
- `webapp interne`: application privée séparée
- `base de donnees`: PostgreSQL
- `stockage`: pièces jointes, exports, comptes rendus
- `services IA`: résumés, analyses, génération de contenu

## Stack

### Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- composants UI cohérents avec l'identité existante

### Backend

- option recommandée: Supabase + server actions / route handlers Next.js
- alternative si logique métier plus lourde: NestJS séparé

### Base de données

- PostgreSQL

### Auth

- Supabase Auth avec rôles applicatifs internes

### IA

- API OpenAI
- journalisation des prompts métier importants
- templates de prompts versionnés

### Hébergement

- Vercel pour la webapp
- Supabase pour PostgreSQL, auth, storage

## Pourquoi cette architecture

- plus simple à opérer qu'un backend Node dédié dès le MVP
- plus rapide pour sortir login, base, stockage et permissions
- suffisamment robuste pour les modules Data, CRM, Réunions et Communication
- possibilité de sortir ensuite un service backend dédié si la logique devient plus complexe

## Modules fonctionnels

## 1. Data

Objectif: fournir une vue stratégique exploitable.

Sous-modules:

- résultats électoraux par élection, bureau, tendance
- données INSEE et contexte local
- finances de la ville
- analyses IA et synthèses automatiques

Indicateurs clés:

- évolution par bureau de vote
- comparaison ville / quartiers / bureaux
- points d'attention budgétaires
- opportunités politiques détectées

## 2. Équipe

Objectif: savoir qui fait quoi et avec quelle disponibilité.

Sous-modules:

- membres
- rôles
- disponibilités
- affectations
- permissions

Indicateurs clés:

- taux de couverture des événements
- charge par responsable
- besoins en renfort

## 3. Agenda & Événements

Objectif: centraliser l'agenda politique et local.

Sous-modules:

- événements saisis manuellement
- événements importés
- présence équipe
- priorisation par score

Indicateurs clés:

- événements à forte visibilité
- conflits d'agenda
- couverture équipe insuffisante

## 4. Terrain

Objectif: transformer les retours habitants en signaux stratégiques.

Sous-modules:

- formulaires de retours
- CRM citoyens
- segmentation
- suivi des demandes et points sensibles

Indicateurs clés:

- sujets récurrents
- quartiers les plus remontants
- niveau de soutien estimé
- demandes non traitées

## 5. Réunions

Objectif: structurer la prise de décision et l'exécution.

Sous-modules:

- ordre du jour
- notes
- décisions
- actions assignées

Indicateurs clés:

- actions ouvertes par réunion
- retards d'exécution
- décisions sans propriétaire

## 6. Communication

Objectif: produire plus vite des contenus cohérents.

Sous-modules:

- génération de posts
- génération d'argumentaires
- génération de discours / tracts
- calendrier éditorial

Indicateurs clés:

- cadence de publication
- répartition par thème
- contenus générés puis validés

## Feuille de route détaillée

## Phase 1. Fondations

Durée cible: 2 semaines

Objectif: disposer d'un MVP utilisé réellement par l'équipe.

Livrables:

- authentification interne
- gestion des membres
- gestion simple des tâches
- gestion simple des réunions
- tableau de bord d'accueil

Écrans:

- login
- dashboard
- liste membres / fiche membre
- liste tâches / détail tâche
- liste réunions / notes

Critères de sortie:

- un membre peut se connecter
- un responsable peut créer et assigner une tâche
- une réunion peut être créée avec notes et actions
- les droits basiques fonctionnent

## Phase 2. Data & Analyse

Durée cible: semaines 2 à 6

Objectif: créer le premier noyau stratégique.

Livrables:

- import CSV des résultats électoraux
- visualisation par bureau
- saisie annuelle finances
- graphiques simples
- première brique d'analyse IA

Écrans:

- import résultats
- carte / tableau bureaux
- finances annuelles
- centre d'analyse

Critères de sortie:

- import d'un CSV sans intervention technique
- lecture consolidée par bureau
- génération d'insights IA relus par humain

## Phase 3. Terrain & CRM

Durée cible: semaines 6 à 10

Objectif: faire remonter le terrain dans la stratégie.

Livrables:

- formulaire interne de retours
- fiche habitant
- niveau de soutien
- tags et segmentation
- synthèse IA des tendances terrain

Critères de sortie:

- chaque retour terrain est historisé
- les habitants peuvent être reliés à un quartier et des thèmes
- l'équipe voit les priorités récurrentes

## Phase 4. Automatisation & Événements

Durée cible: semaines 10 à 14

Objectif: structurer la présence locale.

Livrables:

- agenda événements
- ajout manuel
- import automatique si source fiable
- score d'importance
- affectation équipe

Critères de sortie:

- les événements critiques remontent automatiquement
- l'équipe sait où être présente

## Phase 5. Communication

Durée cible: semaines 14 à 18

Objectif: accélérer la production politique.

Livrables:

- génération de posts
- génération de discours
- base d'argumentaires
- calendrier éditorial

Critères de sortie:

- contenu généré à partir des données du projet
- validation humaine avant publication
- historique des versions

## Priorités produit réelles

Si les ressources sont limitées, l'ordre de priorité doit être:

1. Auth, équipe, tâches, réunions
2. Retours terrain
3. Import électoral
4. CRM citoyens
5. Finances
6. Communication IA
7. Événements automatiques

Le module Terrain doit remonter en priorité si l'équipe fait déjà beaucoup de porte-à-porte ou de présence locale.

## Workflows IA clés

## Analyse électorale

Entrées:

- résultats par bureau
- participation
- historique comparatif

Sorties:

- zones prioritaires
- bureaux à reconquérir
- profils électoraux probables
- messages de campagne à tester

## Analyse finances

Entrées:

- budgets primitifs
- comptes administratifs
- dépenses par poste

Sorties:

- anomalies apparentes
- évolutions notables
- angles politiques exploitables

## Analyse terrain

Entrées:

- retours habitants
- tags thématiques
- quartier
- niveau de soutien

Sorties:

- problèmes majeurs
- fréquence par sujet
- signaux faibles
- priorités opérationnelles

## Génération de contenu

Entrées:

- sujet
- cible
- tonalité
- faits sourcés

Sorties:

- post réseaux sociaux
- tract court
- discours
- fiche argumentaire

## Garde-fous IA

- aucune donnée sensible envoyée sans politique claire
- validation humaine obligatoire avant diffusion externe
- prompts et sorties historisés
- sources affichées pour les analyses quand c'est possible

## Modèle de permissions recommandé

Rôles applicatifs:

- `admin`: gestion complète
- `direction`: lecture globale, décisions, IA stratégique
- `coordinateur`: gestion équipe, terrain, événements
- `terrain`: saisie et lecture limitée
- `communication`: contenus et calendrier éditorial
- `lecture`: consultation seule

Règles:

- les données citoyens ne sont visibles qu'aux rôles autorisés
- les exports sensibles sont tracés
- les suppressions logiques sont préférables aux suppressions physiques

## Modèle de données

Le schéma initial recommandé est fourni dans [campaign-core-schema.sql](/Users/virginie/dev/perso/cabesavanttout/docs/campaign-core-schema.sql).

Objets métier centraux:

- utilisateurs et rôles
- membres d'équipe et disponibilités
- tâches et commentaires
- réunions, notes, décisions, actions
- citoyens, interactions, niveau de soutien
- retours terrain et thèmes
- élections, bureaux, résultats
- budgets, lignes budgétaires, analyses
- événements, priorités, affectations
- contenus générés et validés

## Backlog MVP détaillé

## Epic A. Auth & accès

- connexion par email magique ou mot de passe
- gestion des rôles
- page profil

## Epic B. Équipe

- créer / modifier / désactiver un membre
- affecter un rôle
- saisir disponibilités

## Epic C. Tâches

- créer une tâche
- assigner une tâche
- suivre statut, échéance, priorité
- commenter

## Epic D. Réunions

- créer une réunion
- saisir notes
- extraire actions
- affecter responsables

## Epic E. Dashboard

- tâches en retard
- prochaines réunions
- événements à venir
- dernières remontées terrain

## Décisions techniques structurantes

- séparer strictement site public et outil interne
- privilégier Supabase au démarrage pour accélérer
- stocker les données métier dans PostgreSQL, pas dans Notion
- centraliser les imports CSV avec mapping réutilisable
- préparer le multi-quartier / multi-bureau dès le schéma

## Risques principaux

- complexité excessive trop tôt
- mauvaise qualité de données importées
- permissions mal définies sur les données citoyens
- dépendance trop forte à l'IA sans validation humaine
- dispersion produit entre site public et outil interne

## Mesures de réduction des risques

- livrer un MVP serré
- imposer des formats d'import
- définir les rôles avant l'ouverture de l'outil
- auditer les usages IA
- garder un backlog court par phase

## Plan de mise en oeuvre recommandé dans ce contexte

### Option A. Recommandée

- garder ce dépôt pour le site public
- créer un nouveau dépôt `cabestany-avant-tout-app`
- connecter le site public vers la webapp privée

### Option B. Monorepo plus tard

- transformer en monorepo avec `apps/site` et `apps/app`
- mutualiser composants, marque et design tokens

L'option A est meilleure tant que le besoin principal est de livrer vite et de réduire le risque.

## Prochaine étape concrète

Pour lancer la construction, l'ordre recommandé est:

1. créer la webapp interne Next.js séparée
2. brancher Supabase Auth + PostgreSQL
3. implémenter `users`, `team_members`, `tasks`, `meetings`
4. livrer un dashboard interne simple
5. ajouter ensuite `citizens` et `field_reports`
