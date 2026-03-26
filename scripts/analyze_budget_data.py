#!/usr/bin/env python3

from __future__ import annotations

import csv
import re
from pathlib import Path


ROOT = Path("data/budget")
INDEX_CSV = ROOT / "budget-documents-index.csv"
AMOUNT_LINES_CSV = ROOT / "budget-amount-lines.csv"
POLITICAL_MD = ROOT / "budget-political-synthesis.md"
SQL_SCHEMA = ROOT / "budget-import-schema.sql"
OCR_TEXT_PATH = ROOT / "extracted" / "budget-principal-2025-ocr.txt"

SECTION_RE = re.compile(r"^(?:(?:[IVX]+)\.|(?:[A-Z])\.|(?:\d+[\.\)])\s+).+")
PAGE_RE = re.compile(r"^=== PAGE (\d+) ===$")
MONEY_RE = re.compile(r"\b\d{1,3}(?:[ \u00a0]\d{3})+(?:,\d+)?\b|\b\d+,\d+\b")
TOPIC_KEYWORDS = {
    "dette": "Dette",
    "fiscal": "Fiscalité",
    "dotation": "Dotations",
    "ressources humaines": "Ressources humaines",
    "invest": "Investissements",
    "emprunt": "Emprunts",
    "subvention": "Subventions",
    "épargne": "Épargne",
    "epargne": "Épargne",
}


def normalize(line: str) -> str:
    return re.sub(r"\s+", " ", line.replace("\xa0", " ")).strip()


def parse_numeric(value: str) -> str:
    return value.replace(" ", "").replace(",", ".")


def detect_section(line: str) -> bool:
    line = normalize(line)
    return bool(SECTION_RE.match(line)) or line in {
        "Sommaire",
        "Table des matières",
        "Le Compte Financier Unique",
    }


def collect_amount_lines(text_path: Path, slug: str, document_type: str, year: str):
    page = ""
    section = ""
    rows = []
    for raw_line in text_path.read_text(encoding="utf-8").splitlines():
        line = normalize(raw_line)
        if not line:
            continue
        page_match = PAGE_RE.match(line)
        if page_match:
            page = page_match.group(1)
            continue
        if detect_section(line):
            section = line
        values = MONEY_RE.findall(line)
        if not values:
            continue
        # filter noisy lines made only of page number or years when isolated
        if len(values) == 1 and line == values[0]:
            continue
        for value in values:
            rows.append(
                {
                    "slug": slug,
                    "document_type": document_type,
                    "year": year,
                    "page": page,
                    "section_title": section,
                    "line_text": line,
                    "value_raw": value,
                    "value_numeric": parse_numeric(value),
                }
            )
    return rows


def build_political_markdown(index_rows, amount_rows) -> str:
    amount_by_slug = {}
    for row in amount_rows:
        amount_by_slug.setdefault(row["slug"], []).append(row)

    lines = ["# Synthèse politique budget Cabestany", ""]

    for row in index_rows:
        slug = row["slug"]
        title = slug.replace("-", " ")
        doc_amounts = amount_by_slug.get(slug, [])
        keyword_hits = []
        seen = set()
        for amount_row in doc_amounts:
            lower = amount_row["line_text"].lower()
            for key, label in TOPIC_KEYWORDS.items():
                if key in lower and label not in seen:
                    seen.add(label)
                    keyword_hits.append(label)
        lines.append(f"## {title}")
        lines.append("")
        lines.append(f"- Type: {row['document_type']}")
        lines.append(f"- Année: {row['year']}")
        lines.append(f"- Pages: {row['pages']}")
        lines.append(f"- Texte exploitable: {row['has_extractable_text']}")
        lines.append(f"- OCR requis: {row['ocr_needed']}")
        lines.append(f"- Lignes à montant repérées: {len(doc_amounts)}")
        if keyword_hits:
            lines.append(f"- Thèmes saillants détectés: {', '.join(keyword_hits[:8])}")
        sample = []
        seen_lines = set()
        for amount_row in doc_amounts:
            key = amount_row["line_text"]
            if key not in seen_lines:
                seen_lines.add(key)
                sample.append(f"{amount_row['line_text']} [{amount_row['value_raw']}]")
            if len(sample) >= 5:
                break
        if sample:
            lines.append("- Exemples de lignes utiles:")
            for item in sample:
                lines.append(f"  - {item}")
        lines.append("")

    lines.append("## Lecture politique initiale")
    lines.append("")
    lines.append("- Le ROB 2026 est le meilleur document pour comprendre le récit politique, les arbitrages affichés et les thèmes à travailler.")
    lines.append("- Le CFU principal 2024 est la base la plus solide pour vérifier l’exécution réelle et comparer le discours municipal aux comptes.")
    lines.append("- Les budgets annexes Germanor et Hauts du Moulinas permettent d’isoler des opérations spécifiques susceptibles de porter un angle local.")
    lines.append("- Le Budget 2025 était un scan; l’OCR le rend désormais exploitable, mais une relecture ciblée reste nécessaire sur les tableaux complexes.")
    return "\n".join(lines) + "\n"


def build_sql_schema() -> str:
    return """-- Tables d'import budget pour PostgreSQL

create table if not exists budget_documents (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  document_type text not null,
  year_label text not null,
  source_pdf text not null,
  extracted_text_file text,
  pages integer,
  has_extractable_text boolean not null default false,
  ocr_needed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists budget_sections (
  id uuid primary key default gen_random_uuid(),
  document_slug text not null references budget_documents(slug) on delete cascade,
  section_order integer not null,
  section_title text not null,
  created_at timestamptz not null default now()
);

create table if not exists budget_amount_lines (
  id uuid primary key default gen_random_uuid(),
  document_slug text not null references budget_documents(slug) on delete cascade,
  document_type text not null,
  year_label text not null,
  page text,
  section_title text,
  line_text text not null,
  value_raw text not null,
  value_numeric numeric(18,2),
  created_at timestamptz not null default now()
);

create index if not exists budget_amount_lines_slug_idx on budget_amount_lines(document_slug);
create index if not exists budget_amount_lines_section_idx on budget_amount_lines(section_title);
"""


def main() -> int:
    with INDEX_CSV.open(encoding="utf-8", newline="") as handle:
        index_rows = list(csv.DictReader(handle))

    for row in index_rows:
        if row["slug"] == "budget-principal-2025" and OCR_TEXT_PATH.exists():
            row["extracted_text_file"] = str(OCR_TEXT_PATH)
            row["has_extractable_text"] = "true"
            row["ocr_needed"] = "true"

    amount_rows = []
    for row in index_rows:
        text_path = Path(row["extracted_text_file"])
        amount_rows.extend(
            collect_amount_lines(
                text_path,
                slug=row["slug"],
                document_type=row["document_type"],
                year=row["year"],
            )
        )

    with AMOUNT_LINES_CSV.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "slug",
                "document_type",
                "year",
                "page",
                "section_title",
                "line_text",
                "value_raw",
                "value_numeric",
            ],
        )
        writer.writeheader()
        writer.writerows(amount_rows)

    POLITICAL_MD.write_text(
        build_political_markdown(index_rows, amount_rows),
        encoding="utf-8",
    )
    SQL_SCHEMA.write_text(build_sql_schema(), encoding="utf-8")

    print(f"Wrote {AMOUNT_LINES_CSV}")
    print(f"Wrote {POLITICAL_MD}")
    print(f"Wrote {SQL_SCHEMA}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
