#!/usr/bin/env python3

from __future__ import annotations

import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_CSV = ROOT / "data/bureaux-vote/cabestany-bureaux-vote-2026.csv"
CONTOURS_CSV = ROOT / "data/bureaux-vote/cabestany-bureaux-vote-contours.csv"
OUTPUT = ROOT / "data/bureaux-vote/cabestany-polling-stations-import.csv"


def main() -> int:
    geometry_by_code: dict[str, dict[str, str]] = {}
    with CONTOURS_CSV.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            geometry_by_code[row["numero_bureau_vote"]] = row

    rows_out: list[dict[str, str]] = []
    with SOURCE_CSV.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            bureau_code = row["bureau_code"]
            contour = geometry_by_code.get(bureau_code, {})
            rows_out.append(
                {
                    "commune_name": row["commune"],
                    "commune_code": "66028",
                    "polling_station_code": bureau_code,
                    "polling_station_number": row["bureau_numero"],
                    "polling_station_ref": f"66028_{bureau_code}",
                    "place_name": row["lieu"],
                    "address": row["adresse"],
                    "is_centralizer": row["bureau_centralisateur"],
                    "source_pdf": row["source_pdf"],
                    "geometry_type": contour.get("geometry_type", ""),
                }
            )

    with OUTPUT.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "commune_name",
                "commune_code",
                "polling_station_code",
                "polling_station_number",
                "polling_station_ref",
                "place_name",
                "address",
                "is_centralizer",
                "source_pdf",
                "geometry_type",
            ],
        )
        writer.writeheader()
        writer.writerows(rows_out)

    print(f"Wrote {OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
