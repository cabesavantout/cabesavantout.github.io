# Audit fonctionnel de l'app

Date de référence : `2026-03-25`

## État global

Le produit est au stade `MVP utilisable`, pas au stade `outil stabilisé`.

Points solides :
- auth locale PostgreSQL fonctionnelle
- rôles et permissions en place
- base locale branchée
- modules principaux accessibles
- build applicatif OK

Points encore fragiles :
- base active pas toujours parfaitement alignée avec toutes les hypothèses du code
- plusieurs requêtes ont dû être rendues tolérantes à des colonnes manquantes
- l'UI est nettement meilleure, mais reste inégale selon les pages
- certains modules sont utiles mais encore trop "MVP"

## Checklist page par page

### `/dashboard`

Statut : `OK, à polir`

Déjà bon :
- utile pour un point rapide
- recentré sur le pilotage
- plus simple qu'avant

À surveiller :
- continuer à retirer les éléments redondants
- garder uniquement des indicateurs actionnables

### `/search`

Statut : `OK`

Déjà bon :
- utile immédiatement
- peu de friction
- bon point d'entrée transverse

À améliorer :
- éventuellement résultats plus compacts
- liens directs vers les fiches concernées plus tard

### `/polling-stations`

Statut : `OK, à simplifier encore`

Déjà bon :
- carte branchée
- fiches bureau lisibles
- résultats validés visibles

À améliorer :
- encore un peu dense
- peut être resserré pour être plus lisible sur mobile

### `/electoral-analysis`

Statut : `OK, à fiabiliser`

Déjà bon :
- lecture utile des bureaux validés
- croisement terrain + électoral présent

À surveiller :
- dépend encore fortement de la qualité et complétude des données 2026 par bureau
- garder la page simple, sans la transformer en usine analytique

### `/insee`

Statut : `OK, à resserrer`

Déjà bon :
- données présentes
- lecture simple

À améliorer :
- page encore un peu "bloc de synthèse"
- peut être plus compacte et plus orientée usage campagne

### `/tasks`

Statut : `Utile`

Déjà bon :
- création
- assignation
- suivi de statut
- lien avec retours terrain

À améliorer :
- édition plus complète
- filtre / tri plus tard
- commentaires et historique un jour

### `/meetings`

Statut : `Utile`

Déjà bon :
- création
- notes
- actions liées

À améliorer :
- plus de compacité visuelle
- meilleure lecture mobile sur les réunions longues

### `/field-reports`

Statut : `Important, encore sensible`

Déjà bon :
- vrai module de remontée terrain
- qualification utile
- lien vers citoyen / tâche

À surveiller :
- requêtes récemment durcies à cause des écarts de schéma
- page à tester en usage réel

Priorité :
- haute

### `/field-analysis`

Statut : `Utile, fragile récemment`

Déjà bon :
- lecture des thèmes
- urgences
- bureaux qui remontent

À surveiller :
- requêtes récemment corrigées pour colonnes manquantes
- à retester en priorité

Priorité :
- haute

### `/citizens`

Statut : `Très utile`

Déjà bon :
- bonne base CRM simple
- timeline retours / tâches
- rattachement bureau de vote

À améliorer :
- encore un peu dense quand une fiche a beaucoup d'éléments
- probable besoin futur de recherche/tri encore plus nets

### `/contacts`

Statut : `Simple et cohérent`

Déjà bon :
- carnet utile
- logique simple
- création / modification / suppression

À améliorer :
- éventuellement lier certains contacts au CRM citoyens plus tard

### `/team`

Statut : `Utile mais dépendant du schéma`

Déjà bon :
- couverture par secteur
- priorisation visible

À surveiller :
- dépend fortement des tables `sectors` et `sector_assignments`
- bon candidat à retest complet

Priorité :
- haute

### `/users`

Statut : `Fonctionnel, encore chargé`

Déjà bon :
- création compte
- rôle
- fonction orga
- permissions
- suppression

À améliorer :
- page dense
- encore trop d'informations à l'écran d'un coup
- mérite un vrai passage UX supplémentaire

Priorité :
- moyenne à haute

## Priorités de test

À retester d'abord :
- `/field-reports`
- `/field-analysis`
- `/team`
- `/electoral-analysis`
- `/tasks`
- `/search`

À retester ensuite :
- `/citizens`
- `/contacts`
- `/users`
- `/polling-stations`
- `/insee`

## Priorités produit

### Priorité 1

- stabiliser les pages qui dépendent le plus des données terrain
- vérifier que la base active et le code sont bien réalignés

### Priorité 2

- finir la simplification visuelle
- homogénéiser la respiration et la compacité page par page

### Priorité 3

- brancher le budget dans l'interface

## Recommandation nette

Ne pas ajouter un nouveau gros module tout de suite.

Le meilleur ordre maintenant :
1. test fonctionnel page par page
2. correction des derniers écarts de schéma / requêtes
3. dernière passe UI de simplification
4. budget
