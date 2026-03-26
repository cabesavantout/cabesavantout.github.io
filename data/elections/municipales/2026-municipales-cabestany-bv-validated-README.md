# Municipales 2026 - Cabestany - bureaux validés

Sous-ensemble validé des résultats du 1er tour par bureau de vote.

## Fichiers

- `2026-municipales-cabestany-bv-validated-long.csv`
- `2026-municipales-cabestany-bv-validated-summary.csv`
- `2026-municipales-cabestany-bv-partial-raw.csv`

## Couverture

- bureaux validés:
  - `0003`
  - `0004`
  - `0006`
  - `0008`
  - `0009`
- bureaux encore manquants:
  - `0001`
  - `0002`
  - `0005`
  - `0007`

## Import PostgreSQL

Le schéma d'atterrissage est dans:

- [election-import-schema.sql](/Users/virginie/dev/perso/cabesavanttout/data/elections/normalized/election-import-schema.sql)

Le script d'import dédié est:

- [import_municipales_2026_bv_validated.py](/Users/virginie/dev/perso/cabesavanttout/scripts/import_municipales_2026_bv_validated.py)

Commandes utiles:

```bash
python3 scripts/import_municipales_2026_bv_validated.py --dry-run
python3 scripts/import_municipales_2026_bv_validated.py --reset
```
