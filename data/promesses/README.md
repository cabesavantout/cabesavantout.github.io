# Promesses de campagne

Ce dossier sert de base de travail pour suivre :

- les promesses de la majorite elue
- nos propres engagements de campagne
- les propositions des autres listes

Le but n'est pas seulement de conserver des slogans. Il s'agit de constituer une base exploitable sur 6 ans pour :

- suivre ce qui est tenu ou non
- recroiser avec les budgets annuels
- documenter les ecarts entre annonce et execution
- preparer les futurs axes de campagne

## Structure conseillee

- `la_passion_de_cabestany/`
  Source majorite elue
- `cabestany_avant_tout/`
  Nos engagements
- `un_cap_pour_cabestany/`
  Opposition
- `cabestany_nouvelle_vague/`
  Opposition

## Format normalise

Les fichiers `.json` de promesses normalisees utilisent cette structure :

```json
{
  "list_slug": "cabestany_avant_tout",
  "list_label": "Cabestany Avant Tout",
  "election_year": 2026,
  "source_registry": [
    {
      "kind": "website",
      "label": "Site de campagne",
      "url": "https://cabesavantout.github.io/"
    }
  ],
  "promises": [
    {
      "id": "cat_voirie_refection_voies",
      "theme": "Voirie & Entretien",
      "title": "Refection des voies communales endommagees",
      "description": "Formulation courte ou detaillee de la promesse.",
      "measurable": true,
      "status_tracking": "a_documenter",
      "source_refs": [
        "website:programme"
      ]
    }
  ]
}
```

## Statuts de suivi recommandes

- `a_documenter`
- `annonce`
- `engage`
- `en_cours`
- `livre`
- `retarde`
- `abandonne`
- `repris_partiellement`

## Regle de travail

- conserver les images et documents bruts comme preuves source
- creer ensuite une version normalisee, exploitable en base
- ne pas melanger promesse, projet, budget et angle politique dans le meme champ

