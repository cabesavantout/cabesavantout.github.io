# Donnees de campagne

Ce dossier centralise les fichiers sources bruts utilises par la webapp interne.

## Structure

- `elections/`: resultats electoraux en CSV
- `insee/`: extractions et normalisation INSEE
- `bureaux-vote/`: bureaux, adresses, contours et couches enrichies
- `budget/`: documents budget, OCR, sections et montants
- `organisation/`: organigramme municipal structure

## Suivi

Etat global:

- [DATA_INVENTORY.md](/Users/virginie/dev/perso/cabesavanttout/data/DATA_INVENTORY.md)

Etat projet global:

- [current-status.md](/Users/virginie/dev/perso/cabesavanttout/docs/current-status.md)

## Convention recommandee

- conserver les fichiers bruts recupérés tels quels quand c'est possible
- ajouter ensuite des versions nettoyees si necessaire dans un sous-dossier distinct plus tard
- nommer les fichiers de facon stable pour faciliter les imports automatiques

Format conseille:

`<annee>-<type-election>-<tour>-<source>.csv`

Exemples:

- `2014-municipales-tour-1-ministere-interieur.csv`
- `2022-presidentielles-tour-2-ministere-interieur.csv`
- `2024-legislatives-tour-1-prefecture.csv`

## Perimetre actuel

Vous avez indique disposer de resultats depuis 2010 pour:

- municipales
- cantonales
- departementales
- regionales
- legislatives
- presidentielles
