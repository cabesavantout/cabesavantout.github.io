#!/usr/bin/env python3

from __future__ import annotations

import argparse
import csv
import re
import unicodedata
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse


class LinkCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[dict[str, str]] = []
        self.current_href: str | None = None
        self.current_text: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag != "a":
            return

        href = dict(attrs).get("href")
        if not href:
            return

        self.current_href = href
        self.current_text = []

    def handle_data(self, data: str) -> None:
        if self.current_href is not None:
            self.current_text.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag != "a" or self.current_href is None:
            return

        text = " ".join(part.strip() for part in self.current_text if part.strip()).strip()
        self.links.append({"href": self.current_href, "label": text})
        self.current_href = None
        self.current_text = []


def infer_kind(url: str) -> str:
    lower_url = url.lower()
    if lower_url.endswith(".pdf"):
        return "pdf"
    if "/wp-content/uploads/" in lower_url:
        return "upload"
    return "page"


def normalize_text(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_only = normalized.encode("ascii", "ignore").decode("ascii")
    return re.sub(r"\s+", " ", ascii_only).strip().lower()


def extract_year(value: str) -> str:
    match = re.search(r"\b(20\d{2}|19\d{2})\b", value)
    return match.group(1) if match else ""


def classify_link(label: str, absolute_url: str, path: str) -> tuple[str, str, str]:
    haystack = " ".join(
        part for part in [normalize_text(label), normalize_text(absolute_url), normalize_text(path)] if part
    )

    rules = [
        (
            "budget",
            [
                "budget",
                "budget primitif",
                "compte financier",
                "cfu",
                "orientation budgetaire",
                "orientations budgetaires",
                "rob",
                "debat d orientation budgetaire",
            ],
            "high",
        ),
        (
            "proces_verbal",
            ["proces verbal", "compte rendu", "compte-rendu", "pv conseil", "pv du conseil"],
            "high",
        ),
        (
            "convocation",
            ["convocation", "ordre du jour", "odj conseil", "seance du conseil"],
            "high",
        ),
        (
            "deliberation",
            ["deliberation", "deliberations", "conseil municipal", "decision du conseil"],
            "medium",
        ),
        (
            "arrete",
            ["arrete", "arretes", "arr municipal", "police municipale"],
            "high",
        ),
        (
            "marche_public",
            ["marche public", "marches publics", "appel d offres", "consultation"],
            "medium",
        ),
        (
            "urbanisme",
            ["plu", "urbanisme", "permis", "amenagement", "voirie", "lotissement"],
            "medium",
        ),
    ]

    matched_tags: list[str] = []
    for category, keywords, confidence in rules:
        hits = [keyword for keyword in keywords if keyword in haystack]
        if hits:
            matched_tags.extend(hits)
            return category, confidence, "|".join(sorted(set(matched_tags)))

    if "/wp-content/uploads/" in absolute_url.lower():
        return "document", "low", "upload"

    return "page_information", "low", ""


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Extrait un index simple des liens depuis une page source de la mairie."
    )
    parser.add_argument("html_path", help="Fichier HTML source")
    parser.add_argument("output_csv", help="CSV de sortie")
    parser.add_argument("--base-url", required=True, help="URL de base pour resoudre les liens relatifs")
    parser.add_argument(
        "--domain",
        default="ville-cabestany.fr",
        help="Domaine a conserver dans l'index",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    html_path = Path(args.html_path)
    output_csv = Path(args.output_csv)

    if not html_path.exists():
        raise SystemExit(f"Missing source file: {html_path}")

    parser = LinkCollector()
    parser.feed(html_path.read_text(encoding="utf-8", errors="ignore"))

    rows: list[dict[str, str]] = []
    seen: set[tuple[str, str]] = set()

    for link in parser.links:
        absolute_url = urljoin(args.base_url, link["href"])
        parsed = urlparse(absolute_url)
        if args.domain not in (parsed.netloc or ""):
            continue

        label = link["label"] or parsed.path.rsplit("/", 1)[-1] or absolute_url
        kind = infer_kind(absolute_url)
        category, confidence, tags = classify_link(label, absolute_url, parsed.path)
        key = (absolute_url, label)
        if key in seen:
            continue
        seen.add(key)
        rows.append(
            {
                "label": label,
                "url": absolute_url,
                "kind": kind,
                "path": parsed.path,
                "category": category,
                "confidence": confidence,
                "year": extract_year(" ".join([label, absolute_url, parsed.path])),
                "tags": tags,
            }
        )

    rows.sort(key=lambda row: (row["category"], row["kind"], row["label"].lower(), row["url"]))
    output_csv.parent.mkdir(parents=True, exist_ok=True)
    with output_csv.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=["label", "url", "kind", "category", "confidence", "year", "tags", "path"],
        )
        writer.writeheader()
        writer.writerows(rows)

    print(f"Indexed {len(rows)} links into {output_csv}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
