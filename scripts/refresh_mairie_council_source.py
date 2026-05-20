#!/usr/bin/env python3

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FETCH_SCRIPT = ROOT / "scripts/fetch_reference_page.py"
EXTRACT_SCRIPT = ROOT / "scripts/extract_next_council_meetings.py"
SOURCE_URL = "https://ville-cabestany.fr/prochain-conseil-municipal/"
HTML_OUTPUT = ROOT / "data/mairie-documents/prochain-conseil-municipal.html"
MEETINGS_CSV = ROOT / "data/mairie-documents/prochain-conseil-municipal-meetings.csv"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Rafraichit la page du prochain conseil municipal et regenere les dates detectees."
    )
    parser.add_argument("--url", default=SOURCE_URL, help="URL source a telecharger")
    parser.add_argument("--output", default=str(HTML_OUTPUT), help="Fichier HTML de sortie")
    parser.add_argument("--meetings-output", default=str(MEETINGS_CSV), help="CSV de sortie pour les dates")
    parser.add_argument("--skip-fetch", action="store_true", help="n'effectue pas le telechargement HTML")
    parser.add_argument("--skip-extract", action="store_true", help="ne regenere pas le CSV des dates")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    python_bin = shutil.which("python3") or sys.executable
    if not python_bin:
        print("python3 not found.", file=sys.stderr)
        return 1

    if not args.skip_fetch:
        completed = subprocess.run(
            [
                python_bin,
                str(FETCH_SCRIPT),
                "--url",
                args.url,
                "--output",
                args.output,
            ],
            check=False,
        )
        if completed.returncode != 0:
            return completed.returncode

    if not args.skip_extract:
        completed = subprocess.run(
            [
                python_bin,
                str(EXTRACT_SCRIPT),
                args.output,
                args.meetings_output,
                "--source-url",
                args.url,
            ],
            check=False,
        )
        if completed.returncode != 0:
            return completed.returncode

    print("Mairie council refresh completed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
