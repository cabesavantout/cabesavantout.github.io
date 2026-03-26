# État actuel

## Base locale

- PostgreSQL local utilisé : `cabestany_campaign_app`
- authentification locale PostgreSQL active
- modèle rôles / permissions actif
- migrations locales appliquées pour :
  - auth locale
  - rôles / permissions
  - retours terrain enrichis
  - lien `retour terrain -> tâche`
  - secteurs de couverture

## Données importées

- `import_campaign.election_turnout_by_bv` : `260` lignes
- `import_campaign.election_results_commune` : `7` lignes
- `import_campaign.election_results_bv` : `20` lignes
- `import_campaign.insee_indicators` : `1896` lignes
- `import_campaign.polling_stations_cabestany` : `9` lignes

## Webapp branchée sur la base

Pages disponibles et réellement connectées :

- `/dashboard`
- `/search`
- `/polling-stations`
- `/electoral-analysis`
- `/insee`
- `/team`
- `/tasks`
- `/meetings`
- `/field-reports`
- `/field-analysis`
- `/citizens`
- `/users`

## Ce qui est déjà utile au quotidien

- créer et gérer des comptes
- affecter des rôles et permissions
- saisir des retours terrain
- créer des fiches citoyens
- transformer un retour terrain en tâche
- suivre réunions, notes et actions
- affecter un responsable par secteur
- visualiser bureaux, données électorales et signaux terrain
- rechercher vite dans `citoyens + retours + tâches`

## Ce qui reste encore MVP

- pas d'historique détaillé des modifications
- pas encore de suppression / archivage métier sur tous les modules
- budget préparé côté données mais pas encore branché dans l'interface
- événements pas encore développés
- CRM encore simple, sans timeline complète multi-interactions
- correspondance `rues/adresses -> bureau` toujours manquante

## Données électorales manquantes

Municipales 2026 tour 1, résultats par bureau encore incomplets sur :

- `0001`
- `0002`
- `0005`
- `0007`

## Vérification récente

- `npm run build` passe sur `apps/team-app`
- il reste seulement les warnings ESLint déjà connus :
  - plugin Next.js non détecté dans ESLint
  - warning Fast Refresh sur `app/layout.tsx`

## Documents utiles

- [app-usage.md](/Users/virginie/dev/perso/cabesavanttout/docs/app-usage.md)
- [authz-model.md](/Users/virginie/dev/perso/cabesavanttout/docs/authz-model.md)
- [campaign-webapp-roadmap.md](/Users/virginie/dev/perso/cabesavanttout/docs/campaign-webapp-roadmap.md)
- [DATA_INVENTORY.md](/Users/virginie/dev/perso/cabesavanttout/data/DATA_INVENTORY.md)
