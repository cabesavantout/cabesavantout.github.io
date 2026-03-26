#!/usr/bin/env python3

from __future__ import annotations

import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ARCHIVE_CSV = ROOT / "data/elections/archives/cabestany-archive-results-commune.csv"
RECENT_CSV = ROOT / "data/elections/normalized/cabestany-election-results-commune.csv"
OUTPUT = ROOT / "data/elections/normalized/cabestany-election-results-commune-all.csv"


def read_rows(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        rows = list(reader)
        return reader.fieldnames or [], rows


def main() -> int:
    recent_fields, recent_rows = read_rows(RECENT_CSV)
    archive_fields, archive_rows = read_rows(ARCHIVE_CSV)

    if recent_fields != archive_fields:
        raise SystemExit("Field mismatch between archive and recent commune result CSVs.")

    all_rows = sorted(
        archive_rows + recent_rows,
        key=lambda row: (
            row["election_year"],
            row["election_type"],
            row["round_number"],
            row["date_scrutin"],
            row["liste"],
        ),
    )

    with OUTPUT.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=recent_fields)
        writer.writeheader()
        writer.writerows(all_rows)

    print(f"Wrote {OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
