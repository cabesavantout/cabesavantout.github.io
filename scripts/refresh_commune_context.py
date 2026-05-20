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
REFRESH_INSEE_SCRIPT = ROOT / "scripts/refresh_insee_source.py"
REFRESH_BANATIC_SCRIPT = ROOT / "scripts/refresh_banatic_source.py"
REFRESH_MAIRIE_DOCUMENTS_SCRIPT = ROOT / "scripts/refresh_mairie_documents_source.py"
REFRESH_MAIRIE_COUNCIL_SCRIPT = ROOT / "scripts/refresh_mairie_council_source.py"


def run_command(command: list[str]) -> int:
    completed = subprocess.run(command, check=False)
    return completed.returncode


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Rafraichit les sources communales externes (INSEE et BANATIC)."
    )
    parser.add_argument("--skip-insee", action="store_true", help="ignore le refresh INSEE")
    parser.add_argument("--skip-banatic", action="store_true", help="ignore le refresh BANATIC")
    parser.add_argument("--skip-mairie", action="store_true", help="ignore le refresh de la source actes municipaux")
    parser.add_argument("--skip-council", action="store_true", help="ignore le refresh du prochain conseil municipal")
    parser.add_argument("--import-db", action="store_true", help="importe aussi INSEE en base")
    parser.add_argument("--reset", action="store_true", help="avec --import-db, reinitialise le scope INSEE")
    parser.add_argument("--dsn", default=resolve_env_var("DATABASE_URL", ""), help="DSN PostgreSQL ou $DATABASE_URL")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    python_bin = shutil.which("python3") or sys.executable
    if not python_bin:
      print("python3 not found.", file=sys.stderr)
      return 1

    if not args.skip_insee:
        command = [python_bin, str(REFRESH_INSEE_SCRIPT)]
        if args.import_db:
            command.append("--import-db")
        if args.reset:
            command.append("--reset")
        if args.dsn:
            command.extend(["--dsn", args.dsn])
        code = run_command(command)
        if code != 0:
            return code

    if not args.skip_banatic:
        code = run_command([python_bin, str(REFRESH_BANATIC_SCRIPT)])
        if code != 0:
            return code

    if not args.skip_mairie:
        code = run_command([python_bin, str(REFRESH_MAIRIE_DOCUMENTS_SCRIPT)])
        if code != 0:
            return code

    if not args.skip_council:
        code = run_command([python_bin, str(REFRESH_MAIRIE_COUNCIL_SCRIPT)])
        if code != 0:
            return code

    print("Commune context refresh completed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
