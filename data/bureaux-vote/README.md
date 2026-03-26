# Bureaux de vote

Ce dossier contient les extractions locales des documents administratifs relatifs aux bureaux de vote.

## Source actuelle

- PDF source: [bureaux_de_votes.pdf](/Users/virginie/dev/perso/cabesavanttout/data/bureaux_de_votes.pdf)
- texte extrait: [bureaux-vote-annexes-2026.txt](/Users/virginie/dev/perso/cabesavanttout/data/bureaux-vote-annexes-2026.txt)

## Cabestany

- extraction structurée: [cabestany-bureaux-vote-2026.csv](/Users/virginie/dev/perso/cabesavanttout/data/bureaux-vote/cabestany-bureaux-vote-2026.csv)
- fichier import PostgreSQL: [cabestany-polling-stations-import.csv](/Users/virginie/dev/perso/cabesavanttout/data/bureaux-vote/cabestany-polling-stations-import.csv)
- emplacements d'affichage: [cabestany-emplacements-affichage-2026.csv](/Users/virginie/dev/perso/cabesavanttout/data/bureaux-vote/cabestany-emplacements-affichage-2026.csv)
- seed SQL de base: [cabestany-bureaux-vote-2026.sql](/Users/virginie/dev/perso/cabesavanttout/data/bureaux-vote/cabestany-bureaux-vote-2026.sql)
- contours géographiques des bureaux: [cabestany-bureaux-vote-contours.geojson](/Users/virginie/dev/perso/cabesavanttout/data/bureaux-vote/cabestany-bureaux-vote-contours.geojson)
- contours enrichis: [cabestany-bureaux-vote-enriched.geojson](/Users/virginie/dev/perso/cabesavanttout/data/bureaux-vote/cabestany-bureaux-vote-enriched.geojson)
- résumé enrichi: [cabestany-bureaux-vote-enriched.csv](/Users/virginie/dev/perso/cabesavanttout/data/bureaux-vote/cabestany-bureaux-vote-enriched.csv)
- résumé attributaire des contours: [cabestany-bureaux-vote-contours.csv](/Users/virginie/dev/perso/cabesavanttout/data/bureaux-vote/cabestany-bureaux-vote-contours.csv)
- schema SQL d'import: [polling-stations-import-schema.sql](/Users/virginie/dev/perso/cabesavanttout/data/bureaux-vote/polling-stations-import-schema.sql)

Colonnes:

- `commune`
- `bureau_code`
- `bureau_numero`
- `lieu`
- `adresse`
- `bureau_centralisateur`
- `source_pdf`

Pour l'instant, le seed SQL alimente seulement `polling_stations(code, name)`.
Si vous voulez stocker aussi l'adresse, le lieu et le statut centralisateur en base,
il faudra enrichir le schéma de `polling_stations`.

Adresses actuellement identifiées pour Cabestany:

- `0001` à `0003`: `Centre culturel`, `avenue du 19 mars 1962`
- `0004` à `0005`: `École Prévert`, `avenue du Roussillon`
- `0006` à `0007`: `École Buffon`, `avenue du Périgord`
- `0008` à `0009`: `École Ludovic Masse`, `chemin du Mas Bonique`

## Import PostgreSQL

Scripts:

- [build_polling_stations_import.py](/Users/virginie/dev/perso/cabesavanttout/scripts/build_polling_stations_import.py)
- [build_enriched_polling_stations_geojson.py](/Users/virginie/dev/perso/cabesavanttout/scripts/build_enriched_polling_stations_geojson.py)
- [import_polling_stations.py](/Users/virginie/dev/perso/cabesavanttout/scripts/import_polling_stations.py)

Commandes utiles:

```bash
python3 scripts/build_polling_stations_import.py
python3 scripts/build_enriched_polling_stations_geojson.py
python3 scripts/import_polling_stations.py --dry-run
python3 scripts/import_polling_stations.py --reset
```

Le GeoJSON national ajouté dans `data/contours-france-entiere-latest-v2.geojson`
contenait en fait les contours des bureaux de vote de toute la France. Le sous-ensemble
Cabestany extrait ici contient 9 features, soit un contour par bureau.
