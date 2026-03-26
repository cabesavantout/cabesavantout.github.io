#!/usr/bin/env python3

from __future__ import annotations

import csv
import json
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CONTOURS_GEOJSON = ROOT / "data/bureaux-vote/cabestany-bureaux-vote-contours.geojson"
STATIONS_CSV = ROOT / "data/bureaux-vote/cabestany-bureaux-vote-2026.csv"
SUMMARY_CSV = ROOT / "data/elections/municipales/2026-municipales-cabestany-bv-validated-summary.csv"
RESULTS_CSV = ROOT / "data/elections/municipales/2026-municipales-cabestany-bv-validated-long.csv"
OUTPUT_GEOJSON = ROOT / "data/bureaux-vote/cabestany-bureaux-vote-enriched.geojson"
OUTPUT_CSV = ROOT / "data/bureaux-vote/cabestany-bureaux-vote-enriched.csv"


def load_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def main() -> int:
    stations = {row["bureau_code"]: row for row in load_csv(STATIONS_CSV)}
    summaries = {row["polling_station_code"]: row for row in load_csv(SUMMARY_CSV)}

    results_by_station: dict[str, list[dict[str, str]]] = defaultdict(list)
    for row in load_csv(RESULTS_CSV):
        results_by_station[row["polling_station_code"]].append(row)

    geo = json.loads(CONTOURS_GEOJSON.read_text(encoding="utf-8"))
    enriched_rows: list[dict[str, str]] = []

    for feature in geo["features"]:
        props = feature["properties"]
        code = props["numeroBureauVote"]
        station = stations.get(code, {})
        summary = summaries.get(code, {})
        candidate_rows = results_by_station.get(code, [])

        candidates = []
        for row in sorted(candidate_rows, key=lambda item: int(item["votes"]), reverse=True):
            candidates.append(
                {
                    "candidate_label": row["candidate_label"],
                    "candidate_last_name": row["candidate_last_name"],
                    "candidate_group": row["candidate_group"],
                    "votes": int(row["votes"]),
                }
            )

        top_candidate = candidates[0] if candidates else None
        feature["properties"] = {
            **props,
            "place_name": station.get("lieu", ""),
            "address": station.get("adresse", ""),
            "is_centralizer": station.get("bureau_centralisateur", ""),
            "source_pdf": station.get("source_pdf", ""),
            "has_validated_results_2026_t1": code in summaries,
            "inscrits_2026_t1": int(summary["inscrits"]) if summary else None,
            "votants_2026_t1": int(summary["votants"]) if summary else None,
            "blancs_2026_t1": int(summary["blancs"]) if summary else None,
            "nuls_2026_t1": int(summary["nuls"]) if summary else None,
            "exprimes_2026_t1": int(summary["exprimes"]) if summary else None,
            "top_candidate_2026_t1": top_candidate["candidate_label"] if top_candidate else None,
            "top_candidate_group_2026_t1": top_candidate["candidate_group"] if top_candidate else None,
            "top_candidate_votes_2026_t1": top_candidate["votes"] if top_candidate else None,
            "candidate_results_2026_t1": candidates,
        }

        enriched_rows.append(
            {
                "polling_station_code": code,
                "polling_station_ref": props["codeBureauVote"],
                "place_name": station.get("lieu", ""),
                "address": station.get("adresse", ""),
                "is_centralizer": station.get("bureau_centralisateur", ""),
                "geometry_type": feature["geometry"]["type"],
                "has_validated_results_2026_t1": str(code in summaries).lower(),
                "inscrits_2026_t1": summary.get("inscrits", ""),
                "votants_2026_t1": summary.get("votants", ""),
                "exprimes_2026_t1": summary.get("exprimes", ""),
                "top_candidate_2026_t1": top_candidate["candidate_label"] if top_candidate else "",
                "top_candidate_group_2026_t1": top_candidate["candidate_group"] if top_candidate else "",
                "top_candidate_votes_2026_t1": str(top_candidate["votes"]) if top_candidate else "",
            }
        )

    OUTPUT_GEOJSON.write_text(json.dumps(geo, ensure_ascii=False, indent=2), encoding="utf-8")

    with OUTPUT_CSV.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "polling_station_code",
                "polling_station_ref",
                "place_name",
                "address",
                "is_centralizer",
                "geometry_type",
                "has_validated_results_2026_t1",
                "inscrits_2026_t1",
                "votants_2026_t1",
                "exprimes_2026_t1",
                "top_candidate_2026_t1",
                "top_candidate_group_2026_t1",
                "top_candidate_votes_2026_t1",
            ],
        )
        writer.writeheader()
        writer.writerows(enriched_rows)

    print(f"Wrote {OUTPUT_GEOJSON}")
    print(f"Wrote {OUTPUT_CSV}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
