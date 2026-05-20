# Documents mairie

Ce dossier contient les snapshots locaux et l'index de liens issus de la page officielle des actes municipaux de Cabestany.

## Fichiers

- source HTML : `actes-municipaux.html`
- index des liens : `actes-municipaux-links.csv`
- source HTML conseil : `prochain-conseil-municipal.html`
- index des prochaines seances : `prochain-conseil-municipal-meetings.csv`

## Colonnes utiles de l'index

- `kind` : `page`, `upload` ou `pdf`
- `category` : `budget`, `deliberation`, `proces_verbal`, `convocation`, `arrete`, etc.
- `confidence` : niveau de confiance de la classification
- `year` : année détectée si présente
- `tags` : mots-clés de classement

## Usage

- budget communal
- actes du conseil municipal
- deliberations, comptes rendus, pieces administratives
- agenda des prochains conseils municipaux
- alimentation future des pages `Budget`, `Mandat` et `Documents`

## Commande de refresh

```bash
python3 scripts/refresh_mairie_documents_source.py
python3 scripts/refresh_mairie_council_source.py
```
