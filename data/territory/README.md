# Secteurs de tractage

Ce dossier permet de rattacher des rues a des secteurs de couverture.

## Fichier principal

- `cabestany-sector-streets.csv`

Colonnes:

- `sector_code`
- `polling_station_code`
- `street_name`
- `source`
- `notes`

## Usage

Le fichier est optionnel.

La webapp peut aussi proposer des rues candidates a partir des adresses deja connues
dans les fiches citoyens. Le CSV sert a:

- completer les rues manquantes
- corriger les regroupements
- documenter la source

## Exemple

```csv
sector_code,polling_station_code,street_name,source,notes
bv-0003,0003,rue des Lilas,manuel,secteur nord du bureau 3
```
