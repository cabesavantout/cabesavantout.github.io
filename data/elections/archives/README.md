# Archives du ministère

Objectif: suivre ce qui est réellement extractible pour Cabestany depuis les archives officielles du ministère de l'Intérieur.

## Fichiers

- `cabestany-archive-pages.csv`
- `cabestany-archive-results-commune.csv`
- `missing-bv-request.md`

## Ce qu'on sait déjà

- les archives exposent bien des pages communales pour Cabestany sur plusieurs scrutins
- ces pages donnent au minimum:
  - inscrits
  - abstentions
  - votants
  - blancs
  - nuls
  - exprimés
  - voix et pourcentages par candidat ou liste
- à ce stade, on n'a pas trouvé de niveau public bureau de vote sur ce site pour Cabestany
- les résultats par bureau de vote devront probablement être demandés directement à la mairie ou récupérés depuis des PV / tableaux de centralisation

## Corpus structuré déjà produit

- `cabestany-archive-results-commune.csv` reprend au format tabulaire homogène:
  - municipales 2014
  - municipales 2020
  - présidentielles 2022
  - législatives 2022
  - législatives 2024

## Limites actuelles du corpus structuré

- `européennes 2014` est confirmée dans le manifeste, mais pas encore retranscrite dans le CSV structuré
- les municipales 2014 n'exposent pas, dans la transcription actuelle, les champs `blancs` et `nuls`
- les URL `inferred` ne sont pas encore intégrées au corpus structuré final

## Limite technique constatée

- le site répond correctement dans un navigateur
- un téléchargement direct par `curl` renvoie `403`
- conclusion pratique:
  - l'extraction bulk devra passer soit par navigation navigateur, soit par automatisation navigateur
  - un simple scraper HTTP brut ne suffira pas

## Confiance

- `confirmed`: URL vérifiée
- `inferred`: pattern d'URL très probable mais pas encore validé
- `unknown`: scrutin probablement présent mais URL exacte non confirmée

## Conséquence pratique

- les archives du ministère suffisent pour construire un historique communal solide
- elles ne suffisent pas, à ce stade, pour reconstruire l'historique par bureau de vote de Cabestany
- la meilleure piste pour les bureaux reste:
  - mairie de Cabestany
  - préfecture
  - procès-verbaux de bureau
  - tableau de centralisation communal
