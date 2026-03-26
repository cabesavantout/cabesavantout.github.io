#!/usr/bin/env python3

from __future__ import annotations

import csv
import json
import re
import sys
from pathlib import Path


YEAR_RE = re.compile(r"(19|20)\d{2}")


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", value.replace("\xa0", " ")).strip()


def parse_number(value: str):
    raw = clean_text(value)
    if not raw:
      return "", "", ""

    normalized = raw.replace(" ", "").replace(",", ".")
    if normalized in {"", "-", "s", "ns"}:
      return raw, "", ""

    if re.fullmatch(r"-?\d+", normalized):
      return raw, normalized, "integer"

    if re.fullmatch(r"-?\d+\.\d+", normalized):
      return raw, normalized, "decimal"

    return raw, "", ""


def detect_year(label: str) -> str:
    match = YEAR_RE.search(label)
    return match.group(0) if match else ""


def detect_unit(label: str, title: str) -> str:
    if "%" in label or "(en %)" in label.lower() or "taux" in title.lower():
      return "percent"
    return "count_or_text"


def main() -> int:
    if len(sys.argv) != 4:
        print(
            "Usage: normalize_insee_tables.py <manifest.json> <csv_dir> <output_csv>"
        )
        return 1

    manifest_path = Path(sys.argv[1])
    csv_dir = Path(sys.argv[2])
    output_csv = Path(sys.argv[3])
    output_csv.parent.mkdir(parents=True, exist_ok=True)

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    rows_out = []

    for table in manifest["tables"]:
        csv_path = csv_dir / table["file"]
        with csv_path.open(encoding="utf-8", newline="") as csv_file:
            reader = list(csv.reader(csv_file))

        if not reader:
            continue

        header = [clean_text(cell) for cell in reader[0]]
        data_rows = reader[1:]
        code = table["code"]
        title = table["title"]
        theme = code.split("_", 1)[0]

        first_header = header[0] if header else ""
        first_header_is_dimension = bool(
            first_header and not detect_year(first_header) and "%" not in first_header
        )

        for row_index, row in enumerate(data_rows, start=1):
            padded_row = row + [""] * (len(header) - len(row))
            row_label = clean_text(padded_row[0]) if first_header_is_dimension else ""

            for col_index, column_label in enumerate(header):
                if first_header_is_dimension and col_index == 0:
                    continue

                value = clean_text(padded_row[col_index]) if col_index < len(padded_row) else ""
                if value == "":
                    continue

                value_raw, value_numeric, value_kind = parse_number(value)
                period_label = clean_text(column_label)
                year = detect_year(period_label)

                rows_out.append(
                    {
                        "commune_code": "66028",
                        "commune_name": "Cabestany",
                        "table_code": code,
                        "theme": theme,
                        "table_title": title,
                        "row_index": str(row_index),
                        "row_label": row_label,
                        "dimension_label": clean_text(first_header) if first_header_is_dimension else "",
                        "column_index": str(col_index),
                        "column_label": period_label,
                        "year": year,
                        "unit": detect_unit(period_label, title),
                        "value_raw": value_raw,
                        "value_numeric": value_numeric,
                        "value_kind": value_kind or "text",
                    }
                )

    fieldnames = [
        "commune_code",
        "commune_name",
        "table_code",
        "theme",
        "table_title",
        "row_index",
        "row_label",
        "dimension_label",
        "column_index",
        "column_label",
        "year",
        "unit",
        "value_raw",
        "value_numeric",
        "value_kind",
    ]

    with output_csv.open("w", encoding="utf-8", newline="") as output_file:
        writer = csv.DictWriter(output_file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows_out)

    print(f"Wrote {len(rows_out)} rows to {output_csv}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
