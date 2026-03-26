#!/usr/bin/env python3

from __future__ import annotations

import csv
import json
import re
import sys
import unicodedata
from pathlib import Path

from bs4 import BeautifulSoup


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_only = normalized.encode("ascii", "ignore").decode("ascii")
    ascii_only = ascii_only.lower()
    ascii_only = re.sub(r"[^a-z0-9]+", "-", ascii_only).strip("-")
    return ascii_only or "table"


def clean_text(value: str) -> str:
    text = value.replace("\xa0", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_table_rows(table) -> tuple[list[str], list[list[str]]]:
    header_rows = []
    thead = table.find("thead")
    if thead:
      for row in thead.find_all("tr"):
          header_rows.append([clean_text(cell.get_text(" ", strip=True)) for cell in row.find_all(["th", "td"])])

    body_rows = []
    tbody = table.find("tbody")
    if tbody:
      for row in tbody.find_all("tr"):
          body_rows.append([clean_text(cell.get_text(" ", strip=True)) for cell in row.find_all(["th", "td"])])

    if not header_rows and body_rows:
        width = max(len(row) for row in body_rows)
        header_rows = [[f"col_{index + 1}" for index in range(width)]]

    header = header_rows[-1] if header_rows else []
    if len(header_rows) > 1:
        prefix_rows = header_rows[:-1]
        width = max(len(header), *(len(row) for row in prefix_rows))
        padded_header = header + [""] * (width - len(header))
        merged_header = []
        for column_index in range(width):
            parts = []
            for prefix in prefix_rows:
                if column_index < len(prefix) and prefix[column_index]:
                    parts.append(prefix[column_index])
            if column_index < len(padded_header) and padded_header[column_index]:
                parts.append(padded_header[column_index])
            merged_header.append(" | ".join(parts) if parts else f"col_{column_index + 1}")
        header = merged_header

    width = len(header)
    normalized_rows = []
    for row in body_rows:
        normalized_rows.append(row + [""] * (width - len(row)))

    return header, normalized_rows


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: extract_insee_tables.py <input_html> <output_dir>")
        return 1

    input_path = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])
    output_dir.mkdir(parents=True, exist_ok=True)

    soup = BeautifulSoup(input_path.read_text(encoding="utf-8"), "html.parser")
    tables = soup.select("table.tableau-produit")

    manifest = []

    for table in tables:
        table_id = table.get("id", "")
        code = table_id.removeprefix("produit-tableau-") or "unknown"
        caption = clean_text(table.find("caption").get_text(" ", strip=True)) if table.find("caption") else code
        title = caption
        file_name = f"{code.lower()}__{slugify(title)}.csv"
        header, rows = extract_table_rows(table)
        file_path = output_dir / file_name

        with file_path.open("w", encoding="utf-8", newline="") as csv_file:
            writer = csv.writer(csv_file)
            if header:
                writer.writerow(header)
            writer.writerows(rows)

        manifest.append(
            {
                "code": code,
                "title": title,
                "file": file_name,
                "rows": len(rows),
                "columns": len(header),
            }
        )

    manifest_path = output_dir / "manifest.json"
    manifest_path.write_text(
        json.dumps(
            {
                "source_html": str(input_path),
                "tables": manifest,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    print(f"Extracted {len(manifest)} tables into {output_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
