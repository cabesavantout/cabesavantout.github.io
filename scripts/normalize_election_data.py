#!/usr/bin/env python3

from __future__ import annotations

import csv
import re
from collections import Counter
from pathlib import Path


ROOT = Path("data/elections")
OUTPUT_DIR = ROOT / "normalized"
TURNOUT_CSV = OUTPUT_DIR / "cabestany-election-turnout-by-bv.csv"
COMMUNE_RESULTS_CSV = OUTPUT_DIR / "cabestany-election-results-commune.csv"
MANIFEST_MD = OUTPUT_DIR / "README.md"

STANDARD_KEYS = {
    "__id",
    "id_election",
    "id_brut_miom",
    "code_departement",
    "libelle_departement",
    "code_canton",
    "libelle_canton",
    "code_commune",
    "libelle_commune",
    "code_circonscription",
    "libelle_circonscription",
    "code_bv",
    "inscrits",
    "abstentions",
    "votants",
    "blancs",
    "nuls",
    "exprimes",
    "ratio_abstentions_inscrits",
    "ratio_votants_inscrits",
    "ratio_blancs_inscrits",
    "ratio_blancs_votants",
    "ratio_nuls_inscrits",
    "ratio_nuls_votants",
    "ratio_exprimes_inscrits",
    "ratio_exprimes_votants",
}


def parse_election_id(election_id: str) -> tuple[str, str, str]:
    parts = election_id.split("_")
    year = parts[0] if parts else ""
    election_code = parts[1] if len(parts) > 1 else ""
    round_code = parts[2] if len(parts) > 2 else ""
    election_type_map = {
        "cant": "cantonales",
        "dpmt": "departementales",
        "euro": "europeennes",
        "legi": "legislatives",
        "muni": "municipales",
        "pres": "presidentielles",
        "regi": "regionales",
    }
    election_type = election_type_map.get(election_code, election_code)
    round_label_map = {
        "t1": "1",
        "t2": "2",
    }
    round_number = round_label_map.get(round_code, "")
    return year, election_type, round_number


def to_number(value: str) -> str:
    if value is None:
        return ""
    return value.strip()


def normalize_historical_file(path: Path) -> list[dict[str, str]]:
    rows_out = []
    with path.open(encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            year, election_type, round_number = parse_election_id(row["id_election"])
            rows_out.append(
                {
                    "source_file": str(path),
                    "source_format": "ministere_bv_csv",
                    "election_id": row["id_election"],
                    "election_year": year,
                    "election_type": election_type,
                    "round_number": round_number,
                    "department_code": row["code_departement"],
                    "department_name": row["libelle_departement"],
                    "canton_code": row["code_canton"],
                    "canton_name": row["libelle_canton"],
                    "circonscription_code": row["code_circonscription"],
                    "circonscription_name": row["libelle_circonscription"],
                    "commune_code": row["code_commune"],
                    "commune_name": row["libelle_commune"],
                    "polling_station_code": row["code_bv"],
                    "polling_station_ref": row["id_brut_miom"],
                    "inscrits": to_number(row["inscrits"]),
                    "abstentions": to_number(row["abstentions"]),
                    "votants": to_number(row["votants"]),
                    "blancs": to_number(row["blancs"]),
                    "nuls": to_number(row["nuls"]),
                    "exprimes": to_number(row["exprimes"]),
                    "abstentions_pct_inscrits": to_number(row["ratio_abstentions_inscrits"]),
                    "votants_pct_inscrits": to_number(row["ratio_votants_inscrits"]),
                    "blancs_pct_inscrits": to_number(row["ratio_blancs_inscrits"]),
                    "blancs_pct_votants": to_number(row["ratio_blancs_votants"]),
                    "nuls_pct_inscrits": to_number(row["ratio_nuls_inscrits"]),
                    "nuls_pct_votants": to_number(row["ratio_nuls_votants"]),
                    "exprimes_pct_inscrits": to_number(row["ratio_exprimes_inscrits"]),
                    "exprimes_pct_votants": to_number(row["ratio_exprimes_votants"]),
                }
            )
    return rows_out


def normalize_commune_results(path: Path) -> list[dict[str, str]]:
    rows_out = []
    with path.open(encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            rows_out.append(
                {
                    "source_file": str(path),
                    "source_format": "ministere_commune_csv",
                    "election_type": row["type_election"],
                    "election_year": row["annee"],
                    "round_number": row["tour"],
                    "date_scrutin": row["date_scrutin"],
                    "commune_code": row["code_commune"],
                    "commune_name": row["commune"],
                    "status": row["statut_resultat"],
                    "inscrits": row["inscrits"],
                    "abstentions": row["abstentions"],
                    "votants": row["votants"],
                    "blancs": row["blancs"],
                    "nuls": row["nuls"],
                    "exprimes": row["exprimes"],
                    "abstentions_pct_inscrits": row["abstentions_pct_inscrits"],
                    "votants_pct_inscrits": row["votants_pct_inscrits"],
                    "blancs_pct_inscrits": row["blancs_pct_inscrits"],
                    "blancs_pct_votants": row["blancs_pct_votants"],
                    "nuls_pct_inscrits": row["nuls_pct_inscrits"],
                    "nuls_pct_votants": row["nuls_pct_votants"],
                    "exprimes_pct_inscrits": row["exprimes_pct_inscrits"],
                    "exprimes_pct_votants": row["exprimes_pct_votants"],
                    "liste": row["liste"],
                    "conduite_par": row["conduite_par"],
                    "nuance": row["nuance"],
                    "voix": row["voix"],
                    "voix_pct_inscrits": row["voix_pct_inscrits"],
                    "voix_pct_exprimes": row["voix_pct_exprimes"],
                    "sieges_conseil_municipal": row["sieges_conseil_municipal"],
                    "sieges_conseil_communautaire": row["sieges_conseil_communautaire"],
                    "source_url": row["source_url"],
                }
            )
    return rows_out


def build_manifest(turnout_rows: list[dict[str, str]], commune_rows: list[dict[str, str]], source_files: list[Path]) -> str:
    election_counter = Counter(row["election_type"] for row in turnout_rows)
    bureau_counter = Counter(row["polling_station_code"] for row in turnout_rows)
    lines = [
        "# Elections normalisées",
        "",
        "## Fichiers produits",
        "",
        "- `cabestany-election-turnout-by-bv.csv`",
        "- `cabestany-election-results-commune.csv`",
        "",
        "## Couverture",
        "",
        f"- fichiers sources traités: {len(source_files)}",
        f"- lignes bureau normalisées: {len(turnout_rows)}",
        f"- lignes communales par liste: {len(commune_rows)}",
        f"- bureaux distincts: {len(bureau_counter)}",
        "",
        "## Elections couvertes au niveau bureau",
        "",
    ]
    for election_type, count in sorted(election_counter.items()):
        lines.append(f"- {election_type}: {count} lignes")
    lines.extend(
        [
            "",
            "## Limites actuelles",
            "",
            "- les CSV historiques normalisés ici couvrent surtout la participation et les indicateurs bureau par bureau",
            "- les voix par candidat ou liste ne sont pas encore reconstruites depuis ces fichiers",
            "- les municipales 2026 officielles ajoutées ici sont au niveau commune, pas au niveau bureau",
        ]
    )
    return "\n".join(lines) + "\n"


def main() -> int:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    source_files = sorted(
        path
        for path in ROOT.rglob("*.csv")
        if "normalized" not in path.parts
    )

    turnout_rows: list[dict[str, str]] = []
    commune_rows: list[dict[str, str]] = []

    for path in source_files:
        if path.name == "2026-municipales-cabestany-commune.csv":
            commune_rows.extend(normalize_commune_results(path))
            continue

        with path.open(encoding="utf-8-sig", newline="") as handle:
            reader = csv.DictReader(handle)
            fieldnames = reader.fieldnames or []

        if set(fieldnames) >= STANDARD_KEYS:
            turnout_rows.extend(normalize_historical_file(path))

    with TURNOUT_CSV.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "source_file",
                "source_format",
                "election_id",
                "election_year",
                "election_type",
                "round_number",
                "department_code",
                "department_name",
                "canton_code",
                "canton_name",
                "circonscription_code",
                "circonscription_name",
                "commune_code",
                "commune_name",
                "polling_station_code",
                "polling_station_ref",
                "inscrits",
                "abstentions",
                "votants",
                "blancs",
                "nuls",
                "exprimes",
                "abstentions_pct_inscrits",
                "votants_pct_inscrits",
                "blancs_pct_inscrits",
                "blancs_pct_votants",
                "nuls_pct_inscrits",
                "nuls_pct_votants",
                "exprimes_pct_inscrits",
                "exprimes_pct_votants",
            ],
        )
        writer.writeheader()
        writer.writerows(turnout_rows)

    with COMMUNE_RESULTS_CSV.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "source_file",
                "source_format",
                "election_type",
                "election_year",
                "round_number",
                "date_scrutin",
                "commune_code",
                "commune_name",
                "status",
                "inscrits",
                "abstentions",
                "votants",
                "blancs",
                "nuls",
                "exprimes",
                "abstentions_pct_inscrits",
                "votants_pct_inscrits",
                "blancs_pct_inscrits",
                "blancs_pct_votants",
                "nuls_pct_inscrits",
                "nuls_pct_votants",
                "exprimes_pct_inscrits",
                "exprimes_pct_votants",
                "liste",
                "conduite_par",
                "nuance",
                "voix",
                "voix_pct_inscrits",
                "voix_pct_exprimes",
                "sieges_conseil_municipal",
                "sieges_conseil_communautaire",
                "source_url",
            ],
        )
        writer.writeheader()
        writer.writerows(commune_rows)

    MANIFEST_MD.write_text(
        build_manifest(turnout_rows, commune_rows, source_files),
        encoding="utf-8",
    )

    print(f"Wrote {TURNOUT_CSV}")
    print(f"Wrote {COMMUNE_RESULTS_CSV}")
    print(f"Wrote {MANIFEST_MD}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
