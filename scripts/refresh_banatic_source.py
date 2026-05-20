#!/usr/bin/env python3

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FETCH_SCRIPT = ROOT / "scripts/fetch_reference_page.py"
SOURCE_URL = "https://www.banatic.interieur.gouv.fr/commune/66028-cabestany"
HTML_OUTPUT = ROOT / "data/banatic/cabestany-banatic.html"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Rafraichit la source BANATIC de Cabestany."
    )
    parser.add_argument("--url", default=SOURCE_URL, help="URL source a telecharger")
    parser.add_argument("--output", default=str(HTML_OUTPUT), help="Fichier HTML de sortie")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    python_bin = shutil.which("python3") or sys.executable
    if not python_bin:
        print("python3 not found.", file=sys.stderr)
        return 1

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
    return completed.returncode


if __name__ == "__main__":
    raise SystemExit(main())
