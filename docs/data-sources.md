# Sources de référence

Ce document centralise les sources externes à surveiller et à maintenir pour les pages de contexte communal.

## Commune de référence

- Commune : `Cabestany`
- Code commune : `66028`

## Sources officielles

### INSEE

- URL : `https://www.insee.fr/fr/statistiques/2011101?geo=COM-66028`
- Usage :
  - population
  - logement
  - répartition par âge
  - répartition socio-professionnelle
  - grands indicateurs démographiques
- Pages concernées :
  - `INSEE`
  - `Dashboard` si certains repères synthétiques sont réutilisés
  - analyses territoriales ou de contexte
- Vigilance :
  - vérifier régulièrement l'évolution des tableaux publiés
  - ne pas mélanger une valeur brute et une part en `%`
  - privilégier les indicateurs lisibles et stables
- Refresh local :
  - `python3 scripts/refresh_insee_source.py`
  - `python3 scripts/refresh_insee_source.py --import-db --reset`

### BANATIC

- URL : `https://www.banatic.interieur.gouv.fr/commune/66028-cabestany`
- Usage :
  - intercommunalité
  - rattachements institutionnels
  - compétences et lecture administrative
- Pages concernées :
  - `Analyse`
  - `Administration`
  - futures pages de contexte institutionnel
- Vigilance :
  - vérifier les rattachements et compétences lors des mises à jour
  - utiliser cette source pour la structure institutionnelle, pas pour les données socio-démographiques
- Refresh local :
  - `python3 scripts/refresh_banatic_source.py`

### Mairie de Cabestany - Actes municipaux

- URL : `https://ville-cabestany.fr/actes-municipaux/`
- Usage :
  - actes municipaux
  - budget communal
  - deliberations, comptes rendus, documents administratifs
  - source documentaire potentielle pour `Budget`, `Mandat` et `Documents`
- Pages concernées :
  - `Budget`
  - `Mandat`
  - futures pages `Documents` ou `Administration`
- Vigilance :
  - la structure WordPress peut evoluer
  - la page peut servir de porte d'entree plus que de liste exhaustive des PDF
  - distinguer les pages de navigation, les fichiers uploades et les PDF
- Refresh local :
  - `python3 scripts/refresh_mairie_documents_source.py`

### Mairie de Cabestany - Prochain conseil municipal

- URL : `https://ville-cabestany.fr/prochain-conseil-municipal/`
- Usage :
  - agenda des prochains conseils municipaux
  - suivi des convocations et du calendrier institutionnel
  - alimentation de la page `Réunions` quand une séance officielle est publiée
- Pages concernées :
  - `Réunions`
  - `Documents`
  - futures vues de calendrier ou d'agenda politique
- Vigilance :
  - la page peut changer de formulation ou ne contenir qu'un bloc de texte
  - vérifier la date exacte, l'heure et le lieu à chaque refresh
  - ne pas déduire un ordre du jour s'il n'est pas explicitement publié
- Refresh local :
  - `python3 scripts/refresh_mairie_council_source.py`

## Règle de maintenance

Avant d'ajouter ou de modifier un indicateur :

1. vérifier la source officielle
2. vérifier que l'indicateur aide réellement à comprendre la commune
3. vérifier que son format affiché est correct
4. éviter d'exposer une donnée brute sans contexte si une part ou un total est plus lisible

## Orchestration

Commande unique pour rafraîchir les sources externes de contexte communal :

```bash
python3 scripts/refresh_commune_context.py
```
