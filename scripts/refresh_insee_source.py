#!/usr/bin/env python3

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path

from env_utils import resolve_env_var


ROOT = Path(__file__).resolve().parents[1]
FETCH_SCRIPT = ROOT / "scripts/fetch_reference_page.py"
EXTRACT_SCRIPT = ROOT / "scripts/extract_insee_tables.py"
NORMALIZE_SCRIPT = ROOT / "scripts/normalize_insee_tables.py"
IMPORT_SCRIPT = ROOT / "scripts/import_insee_data.py"

SOURCE_URL = "https://www.insee.fr/fr/statistiques/2011101?geo=COM-66028"
HTML_OUTPUT = ROOT / "data/insee/cabestany-insee-dossier-complet.html"
TABLES_OUTPUT_DIR = ROOT / "data/insee/cabestany"
MANIFEST_PATH = TABLES_OUTPUT_DIR / "manifest.json"
NORMALIZED_CSV = ROOT / "data/insee/cabestany-normalized.csv"


def run_command(command: list[str]) -> int:
    completed = subprocess.run(command, check=False)
    return completed.returncode


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Rafraichit la source INSEE de Cabestany puis regenere les fichiers derives."
    )
    parser.add_argument("--skip-fetch", action="store_true", help="n'effectue pas le telechargement HTML")
    parser.add_argument("--skip-extract", action="store_true", help="n'extrait pas les tables CSV")
    parser.add_argument("--skip-normalize", action="store_true", help="ne regenere pas le CSV normalise")
    parser.add_argument("--import-db", action="store_true", help="importe ensuite le CSV normalise en base")
    parser.add_argument("--reset", action="store_true", help="avec --import-db, supprime d'abord les lignes existantes")
    parser.add_argument("--dsn", default=resolve_env_var("DATABASE_URL", ""), help="DSN PostgreSQL ou $DATABASE_URL")
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    python_bin = shutil.which("python3") or sys.executable
    if not python_bin:
        print("python3 not found.", file=sys.stderr)
        return 1

    if not args.skip_fetch:
        code = run_command(
            [
                python_bin,
                str(FETCH_SCRIPT),
                "--url",
                SOURCE_URL,
                "--output",
                str(HTML_OUTPUT),
            ]
        )
        if code != 0:
            return code

    if not args.skip_extract:
        code = run_command(
            [
                python_bin,
                str(EXTRACT_SCRIPT),
                str(HTML_OUTPUT),
                str(TABLES_OUTPUT_DIR),
            ]
        )
        if code != 0:
            return code

    if not args.skip_normalize:
        code = run_command(
            [
                python_bin,
                str(NORMALIZE_SCRIPT),
                str(MANIFEST_PATH),
                str(TABLES_OUTPUT_DIR),
                str(NORMALIZED_CSV),
            ]
        )
        if code != 0:
            return code

    if args.import_db:
        command = [python_bin, str(IMPORT_SCRIPT)]
        if args.dsn:
            command.extend(["--dsn", args.dsn])
        if args.reset:
            command.append("--reset")
        code = run_command(command)
        if code != 0:
            return code

    print("INSEE refresh completed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
