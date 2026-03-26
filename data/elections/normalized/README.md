# Elections normalisées

## Fichiers produits

- `cabestany-election-turnout-by-bv.csv`
- `cabestany-election-results-commune.csv`
- `cabestany-election-results-commune-all.csv`
- `election-import-schema.sql`

## Couverture

- fichiers sources traités: 33
- lignes bureau normalisées: 260
- lignes communales par liste: 7
- bureaux distincts: 9

## Elections couvertes au niveau bureau

- cantonales: 14 lignes
- departementales: 32 lignes
- europeennes: 25 lignes
- legislatives: 68 lignes
- municipales: 25 lignes
- presidentielles: 50 lignes
- regionales: 46 lignes

## Limites actuelles

- les CSV historiques normalisés ici couvrent surtout la participation et les indicateurs bureau par bureau
- les voix par candidat ou liste ne sont pas encore reconstruites depuis ces fichiers
- les municipales 2026 officielles ajoutées ici sont au niveau commune, pas au niveau bureau

## Fusion communale

- `cabestany-election-results-commune-all.csv` fusionne:
  - les archives communales confirmées
  - les municipales 2026 déjà structurées

## Import SQL

- le schéma d'atterrissage PostgreSQL est dans `election-import-schema.sql`
- il crée deux tables d'import:
  - `import_campaign.election_turnout_by_bv`
  - `import_campaign.election_results_commune`
- les commandes `\copy` d'exemple sont incluses dans le fichier SQL
- le script d'import est `scripts/import_election_data.py`

## Commandes utiles

- contrôle simple:
  - `python3 scripts/import_election_data.py --dry-run`
- import avec `DATABASE_URL`:
  - `python3 scripts/import_election_data.py --reset`
- import avec DSN explicite:
  - `python3 scripts/import_election_data.py --dsn 'postgresql://user:pass@host:5432/dbname' --reset`
