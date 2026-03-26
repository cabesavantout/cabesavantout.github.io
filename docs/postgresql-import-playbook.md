# PostgreSQL Import Playbook

Référence d'exploitation pour charger les données de campagne dans PostgreSQL.

## Choix retenu

- base principale: PostgreSQL
- mode recommandé:
  - PostgreSQL local pour le travail de préparation
  - Supabase possible ensuite comme hébergement PostgreSQL managé

## Ordre d'initialisation recommandé

1. schéma applicatif de base
2. tables d'import électorales
3. tables d'import budget
4. tables INSEE
5. tables bureaux de vote et géographie
6. tables organisation municipale

## 1. Schéma applicatif

Fichier:

- [campaign-core-schema.sql](/Users/virginie/dev/perso/cabesavanttout/docs/campaign-core-schema.sql)

Commande:

```bash
psql "$DATABASE_URL" -f docs/campaign-core-schema.sql
```

## 2. Élections

Fichiers:

- [cabestany-election-turnout-by-bv.csv](/Users/virginie/dev/perso/cabesavanttout/data/elections/normalized/cabestany-election-turnout-by-bv.csv)
- [cabestany-election-results-commune.csv](/Users/virginie/dev/perso/cabesavanttout/data/elections/normalized/cabestany-election-results-commune.csv)
- [election-import-schema.sql](/Users/virginie/dev/perso/cabesavanttout/data/elections/normalized/election-import-schema.sql)
- [import_election_data.py](/Users/virginie/dev/perso/cabesavanttout/scripts/import_election_data.py)

Contrôle:

```bash
python3 scripts/import_election_data.py --dry-run
```

Import:

```bash
python3 scripts/import_election_data.py --reset
```

## 3. Budget

Fichier:

- [budget-import-schema.sql](/Users/virginie/dev/perso/cabesavanttout/data/budget/budget-import-schema.sql)

Commande de création:

```bash
psql "$DATABASE_URL" -f data/budget/budget-import-schema.sql
```

Sources prêtes:

- [budget-documents-index.csv](/Users/virginie/dev/perso/cabesavanttout/data/budget/budget-documents-index.csv)
- [budget-sections.csv](/Users/virginie/dev/perso/cabesavanttout/data/budget/budget-sections.csv)
- [budget-amount-lines.csv](/Users/virginie/dev/perso/cabesavanttout/data/budget/budget-amount-lines.csv)

## 4. INSEE

Source normalisée:

- [cabestany-normalized.csv](/Users/virginie/dev/perso/cabesavanttout/data/insee/cabestany-normalized.csv)

Statut:

- prêt côté données
- schéma d'import PostgreSQL encore à créer

## 5. Bureaux de vote

Sources prêtes:

- [cabestany-bureaux-vote-2026.csv](/Users/virginie/dev/perso/cabesavanttout/data/bureaux-vote/cabestany-bureaux-vote-2026.csv)
- [cabestany-bureaux-vote-contours.geojson](/Users/virginie/dev/perso/cabesavanttout/data/bureaux-vote/cabestany-bureaux-vote-contours.geojson)
- [cabestany-emplacements-affichage-2026.csv](/Users/virginie/dev/perso/cabesavanttout/data/bureaux-vote/cabestany-emplacements-affichage-2026.csv)

Statut:

- prêt côté fichiers
- schéma d'import enrichi encore à formaliser

## 6. Organisation municipale

Sources prêtes:

- [cabestany-organisation-positions.csv](/Users/virginie/dev/perso/cabesavanttout/data/organisation/cabestany-organisation-positions.csv)
- [cabestany-organisation-reporting.csv](/Users/virginie/dev/perso/cabesavanttout/data/organisation/cabestany-organisation-reporting.csv)

Statut:

- prêt après relecture humaine des libellés

## Variables d'environnement

Exemple:

```bash
export DATABASE_URL='postgresql://user:password@localhost:5432/cabestany_campaign'
```

## Priorités immédiates

1. charger les élections dans PostgreSQL
2. créer le schéma d'import INSEE
3. formaliser le schéma d'import des bureaux de vote enrichis
4. brancher ensuite la webapp sur ces tables
