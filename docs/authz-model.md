# Modele d'authentification et d'autorisations

## Objectif

Definir un systeme simple a lancer maintenant, mais suffisamment propre pour ne pas bloquer la suite.

Le point cle :

- ne pas multiplier les roles techniques pour coller a chaque fonction politique
- separer clairement :
  - le **role global**
  - la **fonction organisationnelle**
  - les **permissions applicatives**

## Principes retenus

### 1. Un petit nombre de roles globaux

Le role global sert a donner un niveau de confiance general dans l'application.

Il ne doit pas essayer de representer toute l'organisation de campagne.

### 2. Des permissions fines par module

Les permissions servent a dire ce qu'un utilisateur peut faire concretement :

- voir
- creer
- modifier
- administrer

### 3. Une fonction organisationnelle separee

La fonction organisationnelle sert a afficher et piloter l'organisation humaine :

- directeur de campagne
- directrice communication
- responsable terrain
- militant
- referent quartier

Cette fonction n'est pas forcement un role technique.

## Roles globaux recommandes

### `superadmin`

Usage :

- vous
- eventuellement une ou deux personnes de confiance maximum

Acces :

- total
- gestion des utilisateurs
- gestion des roles et permissions
- parametres sensibles
- imports et administration de la donnee
- acces complet aux finances, donnees electorales, budget, CRM, exports

### `admin`

Usage :

- administration operationnelle de l'outil
- support interne

Acces :

- gestion des utilisateurs courants
- activation / desactivation des comptes
- gestion des contenus et parametres non critiques
- lecture tres large

Limite :

- pas forcement tous les parametres les plus sensibles
- pas de modification des regles globales si vous voulez garder cela au `superadmin`

### `direction`

Usage :

- directeur de campagne
- directeurs de pole
- cercle strategique restreint

Acces :

- lecture large
- pilotage
- validation
- creation / modification sur les modules metier utiles

### `coordinateur`

Usage :

- responsables terrain
- responsables de secteur
- referents operationnels

Acces :

- gestion d'une partie du terrain, des evenements ou des actions
- creation et suivi
- acces plus limite aux donnees sensibles

### `militant`

Usage :

- adherents / militants / benevoles

Acces :

- agenda et evenements
- reponse aux sondages
- remontees terrain
- consultation de documents autorises

Pas d'acces :

- finances detaillees
- donnees electorales sensibles
- CRM complet
- gestion des utilisateurs

### `lecture`

Usage :

- consultation seule
- personnes a informer sans droit d'action

## Fonctions organisationnelles recommandees

Exemples :

- `Candidat`
- `Directeur de campagne`
- `Directeur communication`
- `Directeur terrain`
- `Directeur data`
- `Responsable quartier`
- `Referent bureau`
- `Militant`
- `Invite`

Ces fonctions doivent etre stockees a part du role global.

Elles servent pour :

- affichage interne
- organigramme
- filtres
- affectations
- annuaires

## Permissions applicatives recommandees

Format recommande :

- `module.action`

Exemples :

- `users.read`
- `users.manage`
- `roles.manage`
- `team.read`
- `team.manage`
- `tasks.read`
- `tasks.manage`
- `meetings.read`
- `meetings.manage`
- `events.read`
- `events.manage`
- `surveys.answer`
- `surveys.manage`
- `field_reports.create`
- `field_reports.read`
- `field_reports.manage`
- `citizens.read`
- `citizens.manage`
- `elections.read`
- `elections.import`
- `insee.read`
- `budget.read`
- `budget.manage`
- `budget.analyze`
- `communication.create`
- `communication.validate`
- `communication.publish`
- `settings.manage`
- `imports.manage`

## Matrice d'acces recommandee

### `superadmin`

- toutes les permissions

### `admin`

- `users.read`
- `users.manage`
- `team.read`
- `team.manage`
- `tasks.read`
- `tasks.manage`
- `meetings.read`
- `meetings.manage`
- `events.read`
- `events.manage`
- `field_reports.read`
- `field_reports.manage`
- `citizens.read`
- `citizens.manage`
- `elections.read`
- `insee.read`
- `budget.read`
- `communication.create`
- `communication.validate`
- `imports.manage`

### `direction`

- `team.read`
- `tasks.read`
- `tasks.manage`
- `meetings.read`
- `meetings.manage`
- `events.read`
- `events.manage`
- `field_reports.read`
- `field_reports.manage`
- `citizens.read`
- `citizens.manage`
- `elections.read`
- `insee.read`
- `budget.read`
- `budget.analyze`
- `communication.create`
- `communication.validate`

### `coordinateur`

- `team.read`
- `tasks.read`
- `tasks.manage`
- `meetings.read`
- `meetings.manage`
- `events.read`
- `events.manage`
- `field_reports.create`
- `field_reports.read`
- `citizens.read`
- `citizens.manage`

### `militant`

- `events.read`
- `surveys.answer`
- `field_reports.create`
- `tasks.read`

Remarque :

- `tasks.read` peut etre limite plus tard a "ses propres taches"

### `lecture`

- `events.read`
- `tasks.read`
- `meetings.read`

## Cas concrets

### Vous

- role global : `superadmin`
- fonction organisationnelle : `Candidat` ou `Direction generale`

### Directeur de campagne

- role global : `direction`
- fonction organisationnelle : `Directeur de campagne`

### Directeur communication

- role global : `direction`
- fonction organisationnelle : `Directeur communication`

### Directeur terrain

- role global : `direction` ou `coordinateur` selon son autonomie reelle
- fonction organisationnelle : `Directeur terrain`

### Militant simple

- role global : `militant`
- fonction organisationnelle : `Militant`

## Ce qu'il ne faut pas faire

### 1. Un role technique par personne

Mauvais exemples :

- `directeur_campagne`
- `directeur_communication`
- `referent_evenements`
- `militant_sondages`

Cela rigidifie trop vite le systeme.

### 2. Melanger role et fonction

`direction` est un role technique exploitable.

`Directeur communication` est une fonction organisationnelle.

Ce ne sont pas la meme chose.

### 3. Ouvrir trop tot les donnees sensibles

Les blocs les plus sensibles doivent etre restreints des le debut :

- budget
- finances
- donnees electorales detaillees
- CRM citoyens
- exports complets

## Impact sur la base de donnees

Le schema actuel a deja :

- `users.role`

Il manque pour bien faire :

### 1. ajouter `superadmin` et `militant` au role global

Le type `app_role` actuel est trop etroit.

Etat actuel :

- `admin`
- `direction`
- `coordinateur`
- `terrain`
- `communication`
- `lecture`

Proposition cible :

- `superadmin`
- `admin`
- `direction`
- `coordinateur`
- `militant`
- `lecture`

Remarque :

- `terrain` et `communication` sortent mieux comme fonctions organisationnelles que comme roles techniques

### 2. ajouter une table de fonctions organisationnelles

Exemple :

```sql
create table org_functions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null
);
```

Puis sur `users` ou `team_members` :

```sql
org_function_id uuid references org_functions(id)
```

### 3. ajouter des tables de permissions

Exemple :

```sql
create table permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null
);

create table role_permissions (
  role app_role not null,
  permission_id uuid not null references permissions(id) on delete cascade,
  primary key (role, permission_id)
);

create table user_permissions (
  user_id uuid not null references users(id) on delete cascade,
  permission_id uuid not null references permissions(id) on delete cascade,
  primary key (user_id, permission_id)
);
```

Pourquoi `user_permissions` :

- pour gerer des exceptions simples sans inventer un nouveau role

## Ordre d'implementation recommande

### Etape 1

Faire simple et robuste :

- `superadmin`
- `admin`
- `direction`
- `coordinateur`
- `militant`
- `lecture`

Sans permissions fines dans l'UI au debut, mais avec une matrice codifiee proprement.

### Etape 2

Ajouter les permissions applicatives par module.

### Etape 3

Ajouter les fonctions organisationnelles.

### Etape 4

Ajouter les restrictions fines :

- "seulement ses evenements"
- "seulement ses comptes rendus"
- "seulement son secteur"

## Decision recommandee maintenant

Pour avancer sans sur-ingenierie :

1. vous = `superadmin`
2. on remplace le role global actuel par la cible simplifiee
3. on reserve `Directeur de campagne`, `Directeur communication`, `Directeur terrain` au niveau fonction organisationnelle
4. on ajoute ensuite une vraie matrice de permissions

## Prochaine etape technique

Avant de coder l'ecran d'administration des utilisateurs, il faut faire :

1. migration du type `app_role`
2. ajout des fonctions organisationnelles
3. ajout de la table `permissions`
4. ajout d'un premier helper applicatif `hasPermission()`

Ensuite seulement :

5. page `Utilisateurs`
6. creation / activation / desactivation de comptes
7. attribution des roles et fonctions
