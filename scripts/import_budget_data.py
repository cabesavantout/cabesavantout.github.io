#!/usr/bin/env python3

from __future__ import annotations

import argparse
import csv
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from env_utils import resolve_env_var


ROOT = Path(__file__).resolve().parents[1]
SCHEMA_SQL = ROOT / "data/budget/budget-import-schema.sql"
DOCUMENTS_CSV = ROOT / "data/budget/budget-documents-index.csv"
SECTIONS_CSV = ROOT / "data/budget/budget-sections.csv"
AMOUNT_LINES_CSV = ROOT / "data/budget/budget-amount-lines.csv"


def count_rows(path: Path) -> int:
    with path.open(encoding="utf-8", newline="") as handle:
      return max(sum(1 for _ in csv.reader(handle)) - 1, 0)


def build_sql(reset_scope: bool) -> str:
    schema_path = SCHEMA_SQL.resolve().as_posix()
    documents_path = DOCUMENTS_CSV.resolve().as_posix()
    sections_path = SECTIONS_CSV.resolve().as_posix()
    amount_lines_path = AMOUNT_LINES_CSV.resolve().as_posix()

    statements = [
        "\\set ON_ERROR_STOP on",
        f"\\i {schema_path}",
        """
create temp table staging_budget_documents (
  slug text,
  document_type text,
  year text,
  source_pdf text,
  extracted_text_file text,
  pages integer,
  has_extractable_text boolean,
  ocr_needed boolean,
  section_count integer,
  key_number_count integer
);
        """.strip(),
        """
create temp table staging_budget_sections (
  slug text,
  document_type text,
  section_order integer,
  section_title text
);
        """.strip(),
        """
create temp table staging_budget_amount_lines (
  slug text,
  document_type text,
  year text,
  page text,
  section_title text,
  line_text text,
  value_raw text,
  value_numeric text
);
        """.strip(),
        f"\\copy staging_budget_documents from '{documents_path}' csv header;",
        f"\\copy staging_budget_sections from '{sections_path}' csv header;",
        f"\\copy staging_budget_amount_lines from '{amount_lines_path}' csv header;",
    ]

    if reset_scope:
        statements.extend(
            [
                "delete from budget_amount_lines where document_slug in (select slug from staging_budget_documents);",
                "delete from budget_sections where document_slug in (select slug from staging_budget_documents);",
                "delete from budget_documents where slug in (select slug from staging_budget_documents);",
            ]
        )
    else:
        statements.extend(
            [
                "delete from budget_amount_lines where document_slug in (select slug from staging_budget_documents);",
                "delete from budget_sections where document_slug in (select slug from staging_budget_documents);",
            ]
        )

    statements.extend(
        [
            """
insert into budget_documents (
  slug,
  document_type,
  year_label,
  source_pdf,
  extracted_text_file,
  pages,
  has_extractable_text,
  ocr_needed
)
select
  slug,
  document_type,
  year,
  source_pdf,
  nullif(extracted_text_file, ''),
  pages,
  coalesce(has_extractable_text, false),
  coalesce(ocr_needed, false)
from staging_budget_documents
on conflict (slug) do update
set
  document_type = excluded.document_type,
  year_label = excluded.year_label,
  source_pdf = excluded.source_pdf,
  extracted_text_file = excluded.extracted_text_file,
  pages = excluded.pages,
  has_extractable_text = excluded.has_extractable_text,
  ocr_needed = excluded.ocr_needed;
            """.strip(),
            """
insert into budget_sections (
  document_slug,
  section_order,
  section_title
)
select
  slug,
  section_order,
  section_title
from staging_budget_sections;
            """.strip(),
            """
insert into budget_amount_lines (
  document_slug,
  document_type,
  year_label,
  page,
  section_title,
  line_text,
  value_raw,
  value_numeric
)
select
  slug,
  document_type,
  year,
  nullif(page, ''),
  nullif(section_title, ''),
  line_text,
  value_raw,
  case
    when nullif(value_numeric, '') is null then null
    when regexp_replace(value_numeric, '[^0-9]', '', 'g') = '' then null
    when length(regexp_replace(value_numeric, '[^0-9]', '', 'g')) > 16 then null
    else value_numeric::numeric(18,2)
  end
from staging_budget_amount_lines;
            """.strip(),
            """
select
  (select count(*) from budget_documents) as document_count,
  (select count(*) from budget_sections) as section_count,
  (select count(*) from budget_amount_lines) as amount_line_count;
            """.strip(),
        ]
    )

    return "\n".join(statements) + "\n"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Importe les documents budget, sections et lignes chiffrées dans PostgreSQL."
    )
    parser.add_argument("--dsn", default=resolve_env_var("DATABASE_URL", ""), help="DSN PostgreSQL ou $DATABASE_URL")
    parser.add_argument("--dry-run", action="store_true", help="affiche seulement les volumes detectes")
    parser.add_argument("--reset", action="store_true", help="recharge les documents budget suivis")
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    for path in (SCHEMA_SQL, DOCUMENTS_CSV, SECTIONS_CSV, AMOUNT_LINES_CSV):
        if not path.exists():
            print(f"Missing input file: {path}", file=sys.stderr)
            return 1

    print(f"Budget documents: {count_rows(DOCUMENTS_CSV)}")
    print(f"Budget sections: {count_rows(SECTIONS_CSV)}")
    print(f"Budget amount lines: {count_rows(AMOUNT_LINES_CSV)}")
    print(f"Schema SQL: {SCHEMA_SQL}")

    if args.dry_run:
        return 0

    if not args.dsn:
        print("Missing PostgreSQL DSN. Use --dsn or set DATABASE_URL.", file=sys.stderr)
        return 1

    psql_path = shutil.which("psql")
    if not psql_path:
        print("psql not found in PATH.", file=sys.stderr)
        return 1

    sql = build_sql(reset_scope=args.reset)
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".sql", delete=False) as handle:
        handle.write(sql)
        sql_path = Path(handle.name)

    try:
        completed = subprocess.run([psql_path, args.dsn, "-f", str(sql_path)], check=False)
        return completed.returncode
    finally:
        sql_path.unlink(missing_ok=True)


if __name__ == "__main__":
    raise SystemExit(main())
