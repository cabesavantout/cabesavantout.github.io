#!/usr/bin/env python3

from __future__ import annotations

import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_LONG = ROOT / "data/elections/municipales/2026-municipales-cabestany-bv-validated-long.csv"
OUTPUT_SUMMARY = ROOT / "data/elections/municipales/2026-municipales-cabestany-bv-validated-summary.csv"


LONG_FIELDS = [
    "commune_code",
    "commune_name",
    "election_type",
    "election_year",
    "round_number",
    "date_scrutin",
    "polling_station_code",
    "inscrits",
    "votants",
    "blancs",
    "nuls",
    "exprimes",
    "candidate_label",
    "candidate_last_name",
    "candidate_group",
    "votes",
    "source_status",
    "source_note",
]

SUMMARY_FIELDS = [
    "polling_station_code",
    "inscrits",
    "votants",
    "blancs",
    "nuls",
    "exprimes",
    "status",
    "coverage_note",
]


def main() -> int:
    rows = [
        ("0003", 907, 519, 3, 3, 513, "Jean-Pierre BRAZES", "Brazes", "UN CAP POUR CABESTANY", 110),
        ("0003", 907, 519, 3, 3, 513, "Édith PUGNET", "Pugnet", "LA PASSION DE CABESTANY", 218),
        ("0003", 907, 519, 3, 3, 513, "Olivier MAS", "Mas", "CABESTANY NOUVELLE VAGUE", 131),
        ("0003", 907, 519, 3, 3, 513, "Eric POUPET", "Poupet", "CABESTANY AVANT TOUT", 54),
        ("0004", 815, 518, 5, 3, 510, "Jean-Pierre BRAZES", "Brazes", "UN CAP POUR CABESTANY", 125),
        ("0004", 815, 518, 5, 3, 510, "Édith PUGNET", "Pugnet", "LA PASSION DE CABESTANY", 231),
        ("0004", 815, 518, 5, 3, 510, "Olivier MAS", "Mas", "CABESTANY NOUVELLE VAGUE", 110),
        ("0004", 815, 518, 5, 3, 510, "Eric POUPET", "Poupet", "CABESTANY AVANT TOUT", 44),
        ("0006", 950, 547, 10, 6, 531, "Jean-Pierre BRAZES", "Brazes", "UN CAP POUR CABESTANY", 90),
        ("0006", 950, 547, 10, 6, 531, "Édith PUGNET", "Pugnet", "LA PASSION DE CABESTANY", 274),
        ("0006", 950, 547, 10, 6, 531, "Olivier MAS", "Mas", "CABESTANY NOUVELLE VAGUE", 134),
        ("0006", 950, 547, 10, 6, 531, "Eric POUPET", "Poupet", "CABESTANY AVANT TOUT", 33),
        ("0008", 1007, 612, 7, 4, 601, "Jean-Pierre BRAZES", "Brazes", "UN CAP POUR CABESTANY", 128),
        ("0008", 1007, 612, 7, 4, 601, "Édith PUGNET", "Pugnet", "LA PASSION DE CABESTANY", 250),
        ("0008", 1007, 612, 7, 4, 601, "Olivier MAS", "Mas", "CABESTANY NOUVELLE VAGUE", 158),
        ("0008", 1007, 612, 7, 4, 601, "Eric POUPET", "Poupet", "CABESTANY AVANT TOUT", 65),
        ("0009", 1106, 675, 3, 5, 667, "Jean-Pierre BRAZES", "Brazes", "UN CAP POUR CABESTANY", 144),
        ("0009", 1106, 675, 3, 5, 667, "Édith PUGNET", "Pugnet", "LA PASSION DE CABESTANY", 327),
        ("0009", 1106, 675, 3, 5, 667, "Olivier MAS", "Mas", "CABESTANY NOUVELLE VAGUE", 140),
        ("0009", 1106, 675, 3, 5, 667, "Eric POUPET", "Poupet", "CABESTANY AVANT TOUT", 56),
    ]

    with OUTPUT_LONG.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=LONG_FIELDS)
        writer.writeheader()
        for code, inscrits, votants, blancs, nuls, exprimes, label, last_name, group_name, votes in rows:
            writer.writerow(
                {
                    "commune_code": "66028",
                    "commune_name": "Cabestany",
                    "election_type": "municipales",
                    "election_year": "2026",
                    "round_number": "1",
                    "date_scrutin": "2026-03-15",
                    "polling_station_code": code,
                    "inscrits": inscrits,
                    "votants": votants,
                    "blancs": blancs,
                    "nuls": nuls,
                    "exprimes": exprimes,
                    "candidate_label": label,
                    "candidate_last_name": last_name,
                    "candidate_group": group_name,
                    "votes": votes,
                    "source_status": "validated_partial",
                    "source_note": "Bureau valide a partir du releve manuel recroise avec le fichier officiel de participation.",
                }
            )

    summary_rows = [
        ("0003", 907, 519, 3, 3, 513),
        ("0004", 815, 518, 5, 3, 510),
        ("0006", 950, 547, 10, 6, 531),
        ("0008", 1007, 612, 7, 4, 601),
        ("0009", 1106, 675, 3, 5, 667),
    ]

    with OUTPUT_SUMMARY.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=SUMMARY_FIELDS)
        writer.writeheader()
        for code, inscrits, votants, blancs, nuls, exprimes in summary_rows:
            writer.writerow(
                {
                    "polling_station_code": code,
                    "inscrits": inscrits,
                    "votants": votants,
                    "blancs": blancs,
                    "nuls": nuls,
                    "exprimes": exprimes,
                    "status": "validated_partial",
                    "coverage_note": "Resultats candidats disponibles et controles.",
                }
            )

    print(f"Wrote {OUTPUT_LONG}")
    print(f"Wrote {OUTPUT_SUMMARY}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
