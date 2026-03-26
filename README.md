# Cabestany Avant Tout

Socle de travail pour la webapp interne de campagne municipale et la base de données associée.

## Ce que contient le depot

- `apps/team-app/`: webapp interne Next.js
- `data/`: sources, extractions et jeux de donnees normalises
- `docs/`: roadmap, schémas, mode opératoire PostgreSQL et documentation d'usage
- `scripts/`: scripts de normalisation, import et génération

## Demarrage rapide

### 1. Base PostgreSQL locale

Le projet utilise actuellement PostgreSQL local.

Variable attendue:

```bash
export DATABASE_URL='postgresql://virginie:VOTRE_MOT_DE_PASSE@localhost:5432/cabestany_campaign_app'
```

Guide:

- [postgresql-import-playbook.md](/Users/virginie/dev/perso/cabesavanttout/docs/postgresql-import-playbook.md)

### 2. Webapp

```bash
cd apps/team-app
cp .env.example .env.local
npm install
npm run dev
```

Acces local:

- `http://localhost:3000`

## Variables importantes

Dans `apps/team-app/.env.local`:

```bash
AUTH_MODE=local
AUTH_SECRET=remplacer-par-un-secret-local-stable
DATABASE_URL=postgresql://virginie:VOTRE_MOT_DE_PASSE@localhost:5432/cabestany_campaign_app
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Point important:

- `DATABASE_URL` sert a lire les vraies donnees PostgreSQL dans l'app
- `AUTH_MODE=local` active une vraie authentification email / mot de passe stockee en base
- `AUTH_SECRET` sert a signer le cookie de session locale
- `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` ne sont requis que si `AUTH_MODE=supabase`

## Auth locale PostgreSQL

Pour activer l'auth locale :

```bash
psql "$DATABASE_URL" -f docs/postgresql-local-auth.sql
psql "$DATABASE_URL" -f docs/postgresql-authz-migration.sql
cd apps/team-app
node scripts/create_local_auth_user.mjs \
  --email equipe@cabestanyavanttout.fr \
  --password CHANGE_ME \
  --name "Equipe Cabestany Avant Tout" \
  --role superadmin
```

## État actuel

- PostgreSQL local alimenté pour :
  - elections
  - resultats communaux
  - resultats municipaux 2026 partiels par bureau
  - INSEE
  - bureaux de vote enrichis
- webapp branchée sur PostgreSQL pour :
  - `dashboard`
  - `search`
  - `polling-stations`
  - `electoral-analysis`
  - `insee`
  - `tasks`
  - `meetings`
  - `field-reports`
  - `field-analysis`
  - `citizens`
  - `team`
  - `users`

Voir le detail ici:

- [current-status.md](/Users/virginie/dev/perso/cabesavanttout/docs/current-status.md)
- [app-usage.md](/Users/virginie/dev/perso/cabesavanttout/docs/app-usage.md)
- [DATA_INVENTORY.md](/Users/virginie/dev/perso/cabesavanttout/data/DATA_INVENTORY.md)
- [authz-model.md](/Users/virginie/dev/perso/cabesavanttout/docs/authz-model.md)
