#!/usr/bin/env python3

from __future__ import annotations

import csv
import re
import subprocess
import sys
from pathlib import Path


ROOT = Path("data")
OUTPUT_DIR = ROOT / "budget" / "extracted"
INDEX_CSV = ROOT / "budget" / "budget-documents-index.csv"
SECTIONS_CSV = ROOT / "budget" / "budget-sections.csv"
KEY_NUMBERS_CSV = ROOT / "budget" / "budget-key-numbers.csv"

DOCUMENTS = [
    {
        "slug": "rob-2026",
        "path": ROOT / "20260216_Rapport-dorientations-budgetaires-2026.pdf",
        "type": "rapport_orientation_budgetaire",
        "year": "2026",
        "ocr_needed": "false",
    },
    {
        "slug": "cfu-principal-2024",
        "path": ROOT / "AF01-CFU-2024-BUDGET-PRINCIPAL-CFU_21660028800015_2024_D.pdf",
        "type": "cfu_principal",
        "year": "2024",
        "ocr_needed": "false",
    },
    {
        "slug": "cabesinfo-budget-2024",
        "path": ROOT / "2404_CABESINFO_N135_dossier_Budget.pdf",
        "type": "magazine_budget",
        "year": "2024",
        "ocr_needed": "false",
    },
    {
        "slug": "germanor-2024-2025",
        "path": ROOT / "CFU-2024-BP-2025-germanor.pdf",
        "type": "budget_annexe",
        "year": "2024-2025",
        "ocr_needed": "false",
    },
    {
        "slug": "moulinas-2024-2025",
        "path": ROOT / "CFU-2024-BP-2025-ht-du-moulinas.pdf",
        "type": "budget_annexe",
        "year": "2024-2025",
        "ocr_needed": "false",
    },
    {
        "slug": "budget-principal-2025",
        "path": ROOT / "AF04-BUDGET-2025-32000-PRINCIPAL-SIGNE.pdf",
        "type": "budget_primitif",
        "year": "2025",
        "ocr_needed": "true",
    },
]


SECTION_RE = re.compile(
    r"^(?:(?:[IVX]+)\.|(?:[A-Z])\.|(?:\d+[\.\)])\s+).+|^(?:Sommaire|Table des matières|Budget municipal,.+|Le Compte Financier Unique)$"
)
NUMBER_RE = re.compile(r"\b\d{1,3}(?:[ \u00a0]\d{3})+(?:,\d+)?\b|\b\d+,\d+\b")


def run_pdftotext(pdf_path: Path) -> str:
    result = subprocess.run(
        ["pdftotext", str(pdf_path), "-"],
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout


def count_pages(pdf_path: Path) -> str:
    result = subprocess.run(
        ["pdfinfo", str(pdf_path)],
        check=True,
        capture_output=True,
        text=True,
    )
    for line in result.stdout.splitlines():
        if line.startswith("Pages:"):
            return line.split(":", 1)[1].strip()
    return ""


def normalize_line(line: str) -> str:
    return re.sub(r"\s+", " ", line.replace("\xa0", " ")).strip()


def extract_sections(text: str) -> list[str]:
    sections = []
    seen = set()
    for raw_line in text.splitlines():
        line = normalize_line(raw_line)
        if not line:
            continue
        if SECTION_RE.match(line) and line not in seen:
            seen.add(line)
            sections.append(line)
    return sections


def extract_key_numbers(text: str) -> list[str]:
    found = []
    seen = set()
    for match in NUMBER_RE.finditer(text):
        value = normalize_line(match.group(0))
        if value not in seen:
            seen.add(value)
            found.append(value)
    return found


def main() -> int:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    index_rows = []
    section_rows = []
    key_number_rows = []

    for doc in DOCUMENTS:
        pdf_path = doc["path"]
        pages = count_pages(pdf_path)
        text = run_pdftotext(pdf_path)
        text_path = OUTPUT_DIR / f"{doc['slug']}.txt"
        text_path.write_text(text, encoding="utf-8")

        has_text = "true" if normalize_line(text) else "false"
        sections = extract_sections(text)
        key_numbers = extract_key_numbers(text)

        index_rows.append(
            {
                "slug": doc["slug"],
                "document_type": doc["type"],
                "year": doc["year"],
                "source_pdf": str(pdf_path),
                "extracted_text_file": str(text_path),
                "pages": pages,
                "has_extractable_text": has_text,
                "ocr_needed": doc["ocr_needed"],
                "section_count": str(len(sections)),
                "key_number_count": str(len(key_numbers)),
            }
        )

        for index, section in enumerate(sections, start=1):
            section_rows.append(
                {
                    "slug": doc["slug"],
                    "document_type": doc["type"],
                    "section_order": str(index),
                    "section_title": section,
                }
            )

        for index, number in enumerate(key_numbers, start=1):
            key_number_rows.append(
                {
                    "slug": doc["slug"],
                    "document_type": doc["type"],
                    "number_order": str(index),
                    "value_raw": number,
                }
            )

    with INDEX_CSV.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "slug",
                "document_type",
                "year",
                "source_pdf",
                "extracted_text_file",
                "pages",
                "has_extractable_text",
                "ocr_needed",
                "section_count",
                "key_number_count",
            ],
        )
        writer.writeheader()
        writer.writerows(index_rows)

    with SECTIONS_CSV.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=["slug", "document_type", "section_order", "section_title"],
        )
        writer.writeheader()
        writer.writerows(section_rows)

    with KEY_NUMBERS_CSV.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=["slug", "document_type", "number_order", "value_raw"],
        )
        writer.writeheader()
        writer.writerows(key_number_rows)

    print(f"Wrote {INDEX_CSV}")
    print(f"Wrote {SECTIONS_CSV}")
    print(f"Wrote {KEY_NUMBERS_CSV}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
