# Data Inventory

Inventaire opérationnel des données actuellement présentes dans le dépôt.

## Légende de statut

- `brut` : source déposée telle quelle
- `extrait` : contenu dérivé d'une source brute
- `normalisé` : structure homogène prête à être croisée
- `importable` : suffisamment structuré pour être envoyé en base
- `à compléter` : utile mais incomplet ou peu fiable

## Vue d'ensemble

| Domaine | Emplacement | Statut | Valeur | Commentaire |
|---|---|---:|---:|---|
| Élections | `data/elections/` | normalisé / importable | très élevée | corpus CSV depuis 2010 normalisé au niveau bureau + import PostgreSQL prêt |
| Municipales 2026 officiel | `data/elections/municipales/2026-municipales-cabestany-commune.*` | importable | moyenne | niveau commune seulement, pas de détail bureau trouvé |
| Bureaux de vote | `data/bureaux-vote/` | importable | très élevée | lieux, emplacements d'affichage, contours géographiques des 9 bureaux |
| GeoJSON national BV | `data/contours-france-entiere-latest-v2.geojson` | brut | très élevée | source nationale volumineuse, sous-ensemble Cabestany déjà extrait |
| INSEE | `data/insee/` | normalisé | très élevée | 87 tableaux extraits + fichier long `cabestany-normalized.csv` |
| Budget | `data/budget/` | normalisé / importable | très élevée | pipeline d'extraction, OCR 2025, lignes à montants, schéma SQL |
| Organisation municipale | `data/organisation/` | importable | utile | organigramme structuré à relire avant import définitif |

## 1. Élections

### Contenu

- `cantonales/`
- `departementales/`
- `europeennes/`
- `legislatives/`
- `municipales/`
- `presidentielles/`
- `regionales/`

### Ce qu'on a

- un corpus CSV couvrant les scrutins depuis 2010
- un rangement cohérent par type d'élection
- un fichier officiel structuré pour les municipales 2026 à Cabestany au niveau commune
- une normalisation bureau par bureau dans `data/elections/normalized/`
- un schéma SQL d'import PostgreSQL
- un script d'import automatisé

### Ce qu'il manque

- reconstruction des voix par candidat ou liste pour les scrutins historiques quand les sources le permettent
- consolidation des résultats par bureau les plus fins possibles
- raccord avec les tables métier de l'application

### Statut

- `normalisé`
- `importable`

### Priorité

- `critique`

### Prochaine action

- charger les fichiers normalisés dans PostgreSQL puis enrichir avec les voix par candidat/liste

## 2. Bureaux de vote

### Contenu

- [cabestany-bureaux-vote-2026.csv](/Users/virginie/dev/perso/cabesavanttout/data/bureaux-vote/cabestany-bureaux-vote-2026.csv)
- [cabestany-emplacements-affichage-2026.csv](/Users/virginie/dev/perso/cabesavanttout/data/bureaux-vote/cabestany-emplacements-affichage-2026.csv)
- [cabestany-bureaux-vote-contours.geojson](/Users/virginie/dev/perso/cabesavanttout/data/bureaux-vote/cabestany-bureaux-vote-contours.geojson)
- [cabestany-bureaux-vote-contours.csv](/Users/virginie/dev/perso/cabesavanttout/data/bureaux-vote/cabestany-bureaux-vote-contours.csv)
- [cabestany-bureaux-vote-2026.sql](/Users/virginie/dev/perso/cabesavanttout/data/bureaux-vote/cabestany-bureaux-vote-2026.sql)

### Ce qu'on a

- les 9 bureaux de Cabestany
- les lieux et adresses
- le bureau centralisateur
- les 9 polygones géographiques
- les emplacements d'affichage de Cabestany

### Ce qu'il manque

- correspondance rues/adresses -> bureau de vote
- import SQL enrichi avec adresse, centralisateur et géométrie

### Statut

- `importable`

### Priorité

- `critique`

### Prochaine action

- fusionner le CSV des lieux avec le GeoJSON pour produire une couche unique prête pour la carte

## 3. INSEE

### Contenu

- [cabestany-insee-dossier-complet.html](/Users/virginie/dev/perso/cabesavanttout/data/insee/cabestany-insee-dossier-complet.html)
- [cabestany-normalized.csv](/Users/virginie/dev/perso/cabesavanttout/data/insee/cabestany-normalized.csv)
- [manifest.json](/Users/virginie/dev/perso/cabesavanttout/data/insee/cabestany/manifest.json)
- 87 CSV par tableau dans `data/insee/cabestany/`

### Ce qu'on a

- source HTML locale
- extraction table par table
- normalisation longue à 1 896 lignes
- thème, code table, libellés, années et valeurs numériques

### Ce qu'il manque

- schéma SQL d'import dédié INSEE
- filtrage des indicateurs réellement utiles à la campagne
- jointures futures avec géographie plus fine si disponible

### Statut

- `normalisé`

### Priorité

- `élevée`

### Prochaine action

- créer une table `insee_indicators` et un script d'import

## 4. Budget

### Contenu

- PDF bruts à la racine de `data/`
- [cabestany-budget-documents.csv](/Users/virginie/dev/perso/cabesavanttout/data/budget/cabestany-budget-documents.csv)
- [budget-documents-index.csv](/Users/virginie/dev/perso/cabesavanttout/data/budget/budget-documents-index.csv)
- [budget-sections.csv](/Users/virginie/dev/perso/cabesavanttout/data/budget/budget-sections.csv)
- [budget-key-numbers.csv](/Users/virginie/dev/perso/cabesavanttout/data/budget/budget-key-numbers.csv)
- [budget-amount-lines.csv](/Users/virginie/dev/perso/cabesavanttout/data/budget/budget-amount-lines.csv)
- [budget-political-synthesis.md](/Users/virginie/dev/perso/cabesavanttout/data/budget/budget-political-synthesis.md)
- [budget-import-schema.sql](/Users/virginie/dev/perso/cabesavanttout/data/budget/budget-import-schema.sql)
- textes extraits dans `data/budget/extracted/`

### Ce qu'on a

- veille de page municipale
- extraction texte des PDF natifs
- OCR complet du budget principal 2025
- repérage de sections et de lignes à montants
- première synthèse politique automatique
- schéma SQL d'import

### Ce qu'il manque

- nettoyage plus fin des lignes OCR bruitées
- extraction plus fiable des tableaux budgétaires
- mapping explicite fonctionnement / investissement / dette / RH / subventions

### Statut

- `importable` mais `à compléter`

### Priorité

- `très élevée`

### Prochaine action

- filtrer les lignes budgétaires pour ne garder que les libellés et montants propres

## 5. Organisation municipale

### Contenu

- [cabestany-organisation-positions.csv](/Users/virginie/dev/perso/cabesavanttout/data/organisation/cabestany-organisation-positions.csv)
- [cabestany-organisation-reporting.csv](/Users/virginie/dev/perso/cabesavanttout/data/organisation/cabestany-organisation-reporting.csv)
- [cabestany-organisation-summary.json](/Users/virginie/dev/perso/cabesavanttout/data/organisation/cabestany-organisation-summary.json)

### Ce qu'on a

- acteurs clés
- services
- effectifs
- relations hiérarchiques principales

### Ce qu'il manque

- relecture humaine des noms et libellés
- import SQL si on veut l'exploiter dans l'app

### Statut

- `importable`

### Priorité

- `moyenne`

### Prochaine action

- relire et valider les libellés avant tout import

## 6. Sources officielles et lacunes

### Sources officielles partiellement récupérées

- résultats municipaux 2026 au niveau commune
- page budget municipale suivie par snapshot
- page INSEE Cabestany

### Lacunes structurantes

- résultats par bureau de vote non encore consolidés pour tous les scrutins
- absence de correspondance `rue/adresse -> bureau`
- pas encore de manifeste global des colonnes électorales

## Ce qui est prêt à être importé en base maintenant

- élections normalisées
- bureaux de vote Cabestany
- contours des bureaux de vote
- emplacements d'affichage Cabestany
- données INSEE normalisées
- index budget et lignes à montants
- organisation municipale après relecture
- municipales 2026 au niveau commune

## Ce qui doit être traité avant import

- CSV électoraux historiques
- nettoyage OCR fin du budget 2025
- éventuelle fusion des sources budget dans un modèle plus propre

## Priorités de travail recommandées

1. normaliser tous les CSV électoraux
2. produire la couche géographique bureau enrichie
3. créer les imports SQL pour `insee`, `budget`, `bureaux`, `organisation`
4. trouver ou reconstruire `rues/adresses -> bureau`
5. brancher ces données dans la webapp interne
