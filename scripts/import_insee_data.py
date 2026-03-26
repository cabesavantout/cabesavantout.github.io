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


ROOT = Path(__file__).resolve().parents[1]
INPUT_CSV = ROOT / "data/insee/cabestany-normalized.csv"
SCHEMA_SQL = ROOT / "data/insee/insee-import-schema.sql"


def count_rows(path: Path) -> int:
    with path.open(encoding="utf-8", newline="") as handle:
        return max(sum(1 for _ in csv.reader(handle)) - 1, 0)


def build_sql(reset_scope: bool) -> str:
    input_path = INPUT_CSV.resolve().as_posix()
    statements = [
        "\\set ON_ERROR_STOP on",
        f"\\i {SCHEMA_SQL.resolve().as_posix()}",
    ]

    if reset_scope:
        statements.append(
            "delete from import_campaign.insee_indicators where commune_code = '66028';"
        )

    statements.extend(
        [
            "\\copy import_campaign.insee_indicators ("
            "commune_code, commune_name, table_code, theme, table_title, row_index, row_label, "
            "dimension_label, column_index, column_label, year, unit, value_raw, value_numeric, value_kind"
            f") from '{input_path}' csv header;",
            "select commune_code, count(*) as row_count, count(distinct table_code) as table_count "
            "from import_campaign.insee_indicators where commune_code = '66028' group by commune_code;",
        ]
    )
    return "\n".join(statements) + "\n"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Importe les indicateurs INSEE normalisés de Cabestany dans PostgreSQL."
    )
    parser.add_argument("--dsn", default=os.environ.get("DATABASE_URL", ""), help="DSN PostgreSQL ou $DATABASE_URL")
    parser.add_argument("--dry-run", action="store_true", help="affiche seulement les volumes detectes")
    parser.add_argument("--reset", action="store_true", help="supprime d'abord les lignes INSEE de Cabestany")
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    if not INPUT_CSV.exists():
        print(f"Missing input file: {INPUT_CSV}", file=sys.stderr)
        return 1
    if not SCHEMA_SQL.exists():
        print(f"Missing schema file: {SCHEMA_SQL}", file=sys.stderr)
        return 1

    row_count = count_rows(INPUT_CSV)
    print(f"INSEE rows: {row_count}")
    print(f"Input CSV: {INPUT_CSV}")
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
