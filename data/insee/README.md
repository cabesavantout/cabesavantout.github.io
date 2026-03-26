# Donnees INSEE

Ce dossier contient les sources et extractions locales issues des pages INSEE.

## Cabestany

- source HTML: `cabestany-insee-dossier-complet.html`
- tables extraites: `cabestany/`
- table normalisee: `cabestany-normalized.csv`
- schema SQL d'import: `insee-import-schema.sql`

Les CSV extraits sont nommes:

`<code-table>__<titre-normalise>.csv`

Exemples:

- `pop_t0__pop-t0-population-par-grandes-tranches-d-ages.csv`
- `reu__reu-nombre-d-electeurs-inscrits-sur-liste-principale-par-election.csv`

## Normalisation

Le script `scripts/normalize_insee_tables.py` produit un format long unique avec:

- `table_code`
- `theme`
- `row_label`
- `column_label`
- `year`
- `value_raw`
- `value_numeric`
- `value_kind`

## Import PostgreSQL

Le script d'import est:

- `scripts/import_insee_data.py`

Commandes utiles:

```bash
python3 scripts/import_insee_data.py --dry-run
python3 scripts/import_insee_data.py --reset
```
