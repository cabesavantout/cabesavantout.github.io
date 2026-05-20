# Cabestany Avant Tout - Team App

Webapp interne Next.js pour l'equipe de campagne.

## Portée actuelle

- structure App Router
- layout interne
- page `login` compatible `mode local` et `Supabase`
- pages métier branchées sur PostgreSQL local
- middleware de protection des routes internes

## Preconditions

### 1. PostgreSQL local

La webapp lit les donnees reelles via:

- `DATABASE_URL`

### 2. Auth

Mode recommande pendant la construction:

- `AUTH_MODE=local`
- `AUTH_SECRET=...`

Mode futur:

- `AUTH_MODE=supabase`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Demarrage local

```bash
cd apps/team-app
cp .env.example .env.local
npm install
npm run dev
```

Puis ouvrir:

- `http://localhost:3000`

## Tests

Tests unitaires:

```bash
cd apps/team-app
npm test
```

Tests E2E:

```bash
cd apps/team-app
npx playwright test
```

Vérification rapide avant push :

```bash
cd /Users/virginie/dev/perso/cabesavanttout
npm run check
```

Vérification complète avec E2E :

```bash
cd /Users/virginie/dev/perso/cabesavanttout
npm run check:full
```

Correction automatique de ce qu'ESLint peut réparer :

```bash
cd /Users/virginie/dev/perso/cabesavanttout
npm run fix
```

## CI

Le pipeline GitHub Actions est defini dans :

- [.github/workflows/ci.yml](/Users/virginie/dev/perso/cabesavanttout/.github/workflows/ci.yml)

Pour le job E2E, la base PostgreSQL de test est reconstruite via :

- [bootstrap_team_app_ci.sh](/Users/virginie/dev/perso/cabesavanttout/scripts/bootstrap_team_app_ci.sh)

Ce bootstrap applique le schema de campagne, les migrations locales utiles, puis recharge les donnees minimales necessaires aux pages et aux scenarios Playwright.

## Import budget

Pour charger les documents budget, les sections et les lignes chiffrées dans la base active :

```bash
cd /Users/virginie/dev/perso/cabesavanttout
set -a
source apps/team-app/.env.local
set +a
python3 scripts/import_budget_data.py --dsn "$DATABASE_URL" --reset
```

La page correspondante est ensuite disponible sur :

- `/budget`

## Exemple de `.env.local`

```bash
AUTH_MODE=local
AUTH_SECRET=remplacer-par-un-secret-local-stable
DATABASE_URL=postgresql://virginie:VOTRE_MOT_DE_PASSE@localhost:5432/cabestany_campaign_app
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

En `AUTH_MODE=local`, les variables Supabase peuvent rester vides pendant la phase de construction.

## Initialiser l'auth locale PostgreSQL

1. Ajouter les colonnes de mot de passe :

```bash
psql "$DATABASE_URL" -f ../../docs/postgresql-local-auth.sql
```

2. Migrer le modele de roles et permissions :

```bash
cd ../..
psql "$DATABASE_URL" -f docs/postgresql-authz-migration.sql
cd apps/team-app
```

3. Creer un premier compte local :

```bash
node scripts/create_local_auth_user.mjs \
  --email equipe@cabestanyavanttout.fr \
  --password CHANGE_ME \
  --name "Equipe Cabestany Avant Tout" \
  --role superadmin
```

## Pages disponibles

- `/dashboard`
- `/search`
- `/polling-stations`
- `/electoral-analysis`
- `/insee`
- `/budget`
- `/team`
- `/tasks`
- `/meetings`
- `/field-reports`
- `/field-analysis`
- `/citizens`
- `/users`

Mode d'emploi détaillé :

- [app-usage.md](/Users/virginie/dev/perso/cabesavanttout/docs/app-usage.md)

## Données actuellement lues

La webapp lit aujourd'hui des données réelles pour :

- `dashboard`
- `search`
- `polling-stations`
- `electoral-analysis`
- `insee`
- `budget`
- `tasks`
- `meetings`
- `field-reports`
- `field-analysis`
- `citizens`
- `contacts`
- `team`
- `users`

## Sources projet utiles

- [README racine](/Users/virginie/dev/perso/cabesavanttout/README.md)
- [playbook PostgreSQL](/Users/virginie/dev/perso/cabesavanttout/docs/postgresql-import-playbook.md)
- [etat actuel](/Users/virginie/dev/perso/cabesavanttout/docs/current-status.md)
