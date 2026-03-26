#!/usr/bin/env python3

from __future__ import annotations

import csv
from pathlib import Path


INDEX_CSV = Path("data/budget/budget-documents-index.csv")
OCR_TEXT = Path("data/budget/extracted/budget-principal-2025-ocr.txt")


def main() -> int:
    rows = list(csv.DictReader(INDEX_CSV.open(encoding="utf-8", newline="")))
    updated = False
    if OCR_TEXT.exists():
        for row in rows:
            if row["slug"] == "budget-principal-2025":
                row["extracted_text_file"] = str(OCR_TEXT)
                row["has_extractable_text"] = "true"
                updated = True

    with INDEX_CSV.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)

    print("updated" if updated else "no-change")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
