# Budget Cabestany

Ce dossier regroupe les documents budgetaires et la veille sur la page municipale:

- page source: `https://ville-cabestany.fr/le-debat-dorientation/`
- inventaire local: `cabestany-budget-documents.csv`
- snapshot des liens de la page: `cabestany-debat-orientation-links.json`
- texte extrait et index: `extracted/`, `budget-documents-index.csv`, `budget-sections.csv`, `budget-key-numbers.csv`

Le script [`check_cabestany_budget_page.py`](/Users/virginie/dev/perso/cabesavanttout/scripts/check_cabestany_budget_page.py)
sert a detecter les ajouts, suppressions ou remplacements de documents sur cette page.

Utilisation:

```bash
python3 scripts/check_cabestany_budget_page.py
```

## Extraction budget

Le script [`extract_budget_docs.py`](/Users/virginie/dev/perso/cabesavanttout/scripts/extract_budget_docs.py)
extrait le texte brut des PDF budget, repere des sections et releve des valeurs numeriques.

```bash
python3 scripts/extract_budget_docs.py
```

Limite actuelle:

- `AF04-BUDGET-2025-32000-PRINCIPAL-SIGNE.pdf` semble essentiellement image et necessite un flux OCR pour aller plus loin.

## OCR et analyse

- OCR dédié: [`ocr_budget_pdf.py`](/Users/virginie/dev/perso/cabesavanttout/scripts/ocr_budget_pdf.py)
- analyse ciblée: [`analyze_budget_data.py`](/Users/virginie/dev/perso/cabesavanttout/scripts/analyze_budget_data.py)

Sorties prévues:

- `budget-amount-lines.csv`
- `budget-political-synthesis.md`
- `budget-import-schema.sql`
