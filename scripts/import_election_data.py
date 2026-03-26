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
TURNOUT_CSV = ROOT / "data/elections/normalized/cabestany-election-turnout-by-bv.csv"
COMMUNE_RESULTS_CSV = ROOT / "data/elections/normalized/cabestany-election-results-commune.csv"
IMPORT_SCHEMA_SQL = ROOT / "data/elections/normalized/election-import-schema.sql"


def count_rows(path: Path) -> int:
    with path.open(encoding="utf-8", newline="") as handle:
        return max(sum(1 for _ in csv.reader(handle)) - 1, 0)


def build_import_sql(reset_tables: bool) -> str:
    turnout_path = TURNOUT_CSV.resolve().as_posix()
    commune_path = COMMUNE_RESULTS_CSV.resolve().as_posix()

    statements = [
        "\\set ON_ERROR_STOP on",
        f"\\i {IMPORT_SCHEMA_SQL.resolve().as_posix()}",
    ]

    if reset_tables:
        statements.extend(
            [
                "truncate table import_campaign.election_turnout_by_bv restart identity;",
                "truncate table import_campaign.election_results_commune restart identity;",
            ]
        )

    statements.extend(
        [
            "\\copy import_campaign.election_turnout_by_bv ("
            "source_file, source_format, election_id, election_year, election_type, round_number, "
            "department_code, department_name, canton_code, canton_name, circonscription_code, "
            "circonscription_name, commune_code, commune_name, polling_station_code, "
            "polling_station_ref, inscrits, abstentions, votants, blancs, nuls, exprimes, "
            "abstentions_pct_inscrits, votants_pct_inscrits, blancs_pct_inscrits, "
            "blancs_pct_votants, nuls_pct_inscrits, nuls_pct_votants, exprimes_pct_inscrits, "
            "exprimes_pct_votants"
            f") from '{turnout_path}' csv header;",
            "\\copy import_campaign.election_results_commune ("
            "source_file, source_format, election_type, election_year, round_number, date_scrutin, "
            "commune_code, commune_name, status, inscrits, abstentions, votants, blancs, nuls, "
            "exprimes, abstentions_pct_inscrits, votants_pct_inscrits, blancs_pct_inscrits, "
            "blancs_pct_votants, nuls_pct_inscrits, nuls_pct_votants, exprimes_pct_inscrits, "
            "exprimes_pct_votants, liste, conduite_par, nuance, voix, voix_pct_inscrits, "
            "voix_pct_exprimes, sieges_conseil_municipal, sieges_conseil_communautaire, source_url"
            f") from '{commune_path}' csv header;",
            "select 'election_turnout_by_bv' as table_name, count(*) as row_count from import_campaign.election_turnout_by_bv;",
            "select 'election_results_commune' as table_name, count(*) as row_count from import_campaign.election_results_commune;",
        ]
    )

    return "\n".join(statements) + "\n"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Importe les CSV électoraux normalisés de Cabestany dans PostgreSQL via psql."
    )
    parser.add_argument(
        "--dsn",
        default=os.environ.get("DATABASE_URL", ""),
        help="chaîne de connexion PostgreSQL. Par défaut: $DATABASE_URL",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="n'importe rien, affiche seulement les fichiers et volumes détectés",
    )
    parser.add_argument(
        "--reset",
        action="store_true",
        help="vide les tables d'import avant chargement",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    missing = [path for path in (TURNOUT_CSV, COMMUNE_RESULTS_CSV, IMPORT_SCHEMA_SQL) if not path.exists()]
    if missing:
        for path in missing:
            print(f"Missing required file: {path}", file=sys.stderr)
        return 1

    turnout_count = count_rows(TURNOUT_CSV)
    commune_count = count_rows(COMMUNE_RESULTS_CSV)

    print(f"Turnout rows: {turnout_count}")
    print(f"Commune result rows: {commune_count}")
    print(f"Schema file: {IMPORT_SCHEMA_SQL}")
    print(f"Turnout CSV: {TURNOUT_CSV}")
    print(f"Commune CSV: {COMMUNE_RESULTS_CSV}")

    if args.dry_run:
        return 0

    if not args.dsn:
        print("Missing PostgreSQL DSN. Use --dsn or set DATABASE_URL.", file=sys.stderr)
        return 1

    psql_path = shutil.which("psql")
    if not psql_path:
        print("psql not found in PATH.", file=sys.stderr)
        return 1

    sql = build_import_sql(reset_tables=args.reset)
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".sql", delete=False) as handle:
        handle.write(sql)
        sql_path = Path(handle.name)

    try:
        cmd = [psql_path, args.dsn, "-f", str(sql_path)]
        completed = subprocess.run(cmd, check=False)
        return completed.returncode
    finally:
        sql_path.unlink(missing_ok=True)


if __name__ == "__main__":
    raise SystemExit(main())
