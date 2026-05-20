#!/usr/bin/env python3

from __future__ import annotations

import argparse
import csv
import re
import unicodedata
from html.parser import HTMLParser
from pathlib import Path


BLOCK_TAGS = {
    "p",
    "div",
    "section",
    "article",
    "header",
    "footer",
    "main",
    "aside",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "br",
}

MONTHS = {
    "janvier": 1,
    "fevrier": 2,
    "mars": 3,
    "avril": 4,
    "mai": 5,
    "juin": 6,
    "juillet": 7,
    "aout": 8,
    "septembre": 9,
    "octobre": 10,
    "novembre": 11,
    "decembre": 12,
}


class TextBlockCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.lines: list[str] = []
        self.current_parts: list[str] = []

    def flush(self) -> None:
        text = " ".join(part.strip() for part in self.current_parts if part.strip()).strip()
        if text:
            self.lines.append(text)
        self.current_parts = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in BLOCK_TAGS:
            self.flush()

    def handle_endtag(self, tag: str) -> None:
        if tag in BLOCK_TAGS:
            self.flush()

    def handle_data(self, data: str) -> None:
        if data.strip():
            self.current_parts.append(data)


def normalize_text(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_only = normalized.encode("ascii", "ignore").decode("ascii")
    return re.sub(r"\s+", " ", ascii_only).strip().lower()


def extract_relevant_lines(lines: list[str]) -> list[str]:
    start_index = next(
        (
            index
            for index, line in enumerate(lines)
            if "calendrier des prochains conseils municipaux" in normalize_text(line)
        ),
        -1,
    )
    if start_index == -1:
        return [line.strip() for line in lines if line.strip()]

    collected: list[str] = []
    for line in lines[start_index + 1 :]:
        normalized = normalize_text(line)
        if not normalized:
            continue
        if normalized.startswith("mairie de cabestany"):
            break
        collected.append(line.strip())

    return collected


def parse_date_line(line: str) -> str | None:
    normalized = normalize_text(line)
    match = re.search(
        r"(?:^|\s)(?:le\s+)?(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)?\s*(\d{1,2})\s+([a-z]+)\s+(20\d{2})\b",
        normalized,
    )
    if not match:
        return None

    day = int(match.group(1))
    month = MONTHS.get(match.group(2))
    year = int(match.group(3))
    if not month:
        return None

    return f"{year:04d}-{month:02d}-{day:02d}"


def parse_time_label(lines: list[str]) -> str:
    haystack = " ".join(lines)
    normalized = normalize_text(haystack)
    match = re.search(r"\b(\d{1,2})h(?:(\d{2}))?\b", normalized)
    if not match:
        return "18:30"

    hour = int(match.group(1))
    minute = int(match.group(2) or "00")
    return f"{hour:02d}:{minute:02d}"


def parse_title(lines: list[str]) -> str:
    for line in lines:
        normalized = normalize_text(line)
        if "conseil municipal" not in normalized:
            continue
        if "se reunira" not in normalized and "seance" not in normalized:
            continue

        cleaned = line.strip().rstrip(":")
        cleaned = re.sub(r"^la\s+s[ée]ance\s+du\s+", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"\s+se\s+r[ée]unira.*$", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"\s+", " ", cleaned).strip(" .")
        if cleaned:
            return cleaned[:1].upper() + cleaned[1:]

    return "Conseil municipal"


def parse_location(lines: list[str]) -> str:
    for line in lines:
        normalized = normalize_text(line)
        if "hotel de ville" not in normalized and "salle du conseil" not in normalized:
            if "centre culturel" not in normalized:
                continue

        cleaned = re.sub(r"\([^)]*\)", "", line).strip()
        cleaned = re.sub(r"^\s*[aà]\s+\d{1,2}h(?:\d{2})?,?\s*", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"^\s*[aà]\s+", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"^exceptionnellement\s+[aà]\s+", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"\s+", " ", cleaned).strip(" .")
        if cleaned:
            return cleaned[:1].upper() + cleaned[1:]

    return "Salle du conseil, Hôtel de ville"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Extrait les prochaines dates de conseil municipal depuis la page mairie."
    )
    parser.add_argument("html_path", help="Fichier HTML source")
    parser.add_argument("output_csv", help="CSV de sortie")
    parser.add_argument(
        "--source-url",
        default="https://ville-cabestany.fr/prochain-conseil-municipal/",
        help="URL source associee aux dates extraites",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    html_path = Path(args.html_path)
    output_csv = Path(args.output_csv)

    if not html_path.exists():
        raise SystemExit(f"Missing source file: {html_path}")

    collector = TextBlockCollector()
    collector.feed(html_path.read_text(encoding="utf-8", errors="ignore"))
    collector.flush()

    relevant_lines = extract_relevant_lines(collector.lines)
    date_lines = [date_iso for line in relevant_lines if (date_iso := parse_date_line(line))]
    time_label = parse_time_label(relevant_lines)
    title = parse_title(relevant_lines)
    location = parse_location(relevant_lines)

    rows: list[dict[str, str]] = []
    for date_iso in date_lines:
        rows.append(
            {
                "id": f"mairie-council-{date_iso}",
                "title": title,
                "date_iso": date_iso,
                "time_label": time_label,
                "starts_at_local": f"{date_iso} {time_label}",
                "location": location,
                "source_url": args.source_url,
                "source_label": "Mairie de Cabestany · Prochain conseil municipal",
                "note": "Date publique du prochain conseil municipal publiee sur le site officiel de la mairie.",
            }
        )

    output_csv.parent.mkdir(parents=True, exist_ok=True)
    with output_csv.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "id",
                "title",
                "date_iso",
                "time_label",
                "starts_at_local",
                "location",
                "source_url",
                "source_label",
                "note",
            ],
        )
        writer.writeheader()
        writer.writerows(rows)

    print(f"Indexed {len(rows)} council meeting(s) into {output_csv}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
