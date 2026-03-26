#!/usr/bin/env python3

from __future__ import annotations

import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data/elections/archives/cabestany-archive-pages.csv"


ROWS = [
    {
        "election_type": "municipales",
        "year": "2014",
        "level": "commune",
        "url": "https://www.archives-resultats-elections.interieur.gouv.fr/resultats/MN2014/066/066028.php",
        "confidence": "confirmed",
        "notes": "Page communale officielle vérifiée dans les archives.",
    },
    {
        "election_type": "municipales",
        "year": "2020",
        "level": "commune",
        "url": "https://www.archives-resultats-elections.interieur.gouv.fr/resultats/municipales-2020/066/066028.php",
        "confidence": "confirmed",
        "notes": "Page communale officielle vérifiée dans les archives.",
    },
    {
        "election_type": "presidentielles",
        "year": "2022",
        "level": "commune",
        "url": "https://www.archives-resultats-elections.interieur.gouv.fr/resultats/presidentielle-2022/076/066/066028.php",
        "confidence": "confirmed",
        "notes": "Page communale officielle vérifiée; tours 1 et 2 présents sur la même page.",
    },
    {
        "election_type": "legislatives",
        "year": "2024",
        "level": "commune",
        "url": "https://www.archives-resultats-elections.interieur.gouv.fr/resultats/legislatives2024/ensemble_geographique/76/66/6601/66028/index.php",
        "confidence": "confirmed",
        "notes": "Page communale officielle vérifiée; Cabestany rattachée à la 1ère circonscription.",
    },
    {
        "election_type": "europeennes",
        "year": "2024",
        "level": "commune",
        "url": "https://www.archives-resultats-elections.interieur.gouv.fr/resultats/europeennes2024/ensemble_geographique/76/66/66028/index.php",
        "confidence": "inferred",
        "notes": "URL de commune déduite depuis la page lettre C du département; à confirmer dans un navigateur.",
    },
    {
        "election_type": "presidentielles",
        "year": "2017",
        "level": "commune",
        "url": "https://www.archives-resultats-elections.interieur.gouv.fr/resultats/presidentielle-2017/076/066/066028.php",
        "confidence": "inferred",
        "notes": "Pattern cohérent avec la structure 2022 et les autres communes Occitanie; à confirmer dans un navigateur.",
    },
    {
        "election_type": "presidentielles",
        "year": "2012",
        "level": "commune",
        "url": "https://www.archives-resultats-elections.interieur.gouv.fr/resultats/PR2012/091/066/066028.php",
        "confidence": "inferred",
        "notes": "Pattern confirmé sur d'autres communes des Pyrénées-Orientales en 2012; Cabestany reste à valider explicitement.",
    },
    {
        "election_type": "legislatives",
        "year": "2022",
        "level": "commune",
        "url": "https://www.archives-resultats-elections.interieur.gouv.fr/resultats/legislatives-2022/066/06601028.php",
        "confidence": "confirmed",
        "notes": "Page communale officielle vérifiée; Cabestany rattachée à la 1ère circonscription.",
    },
    {
        "election_type": "legislatives",
        "year": "2017",
        "level": "commune",
        "url": "https://www.archives-resultats-elections.interieur.gouv.fr/resultats/legislatives-2017/066/06601028.php",
        "confidence": "inferred",
        "notes": "Pattern 2017 cohérent avec 2022 et avec les autres communes du département; à confirmer explicitement.",
    },
    {
        "election_type": "legislatives",
        "year": "2012",
        "level": "commune",
        "url": "https://www.archives-resultats-elections.interieur.gouv.fr/resultats/LG2012/066/06601028.php",
        "confidence": "inferred",
        "notes": "URL HTML déduite du schéma 2012 et de l'export XML communal présent pour Cabestany.",
    },
    {
        "election_type": "legislatives",
        "year": "2012",
        "level": "download_xml_t1",
        "url": "https://www.archives-resultats-elections.interieur.gouv.fr/telechargements/LG2012/resultatsT1/066/06601028.xml",
        "confidence": "confirmed",
        "notes": "Export XML 1er tour visible dans l'index officiel des téléchargements 2012.",
    },
    {
        "election_type": "legislatives",
        "year": "2012",
        "level": "download_xml_t2",
        "url": "https://www.archives-resultats-elections.interieur.gouv.fr/telechargements/LG2012/resultatsT2/066/06601028.xml",
        "confidence": "inferred",
        "notes": "URL de 2d tour déduite du schéma de téléchargement LG2012; à confirmer explicitement.",
    },
    {
        "election_type": "europeennes",
        "year": "2019",
        "level": "commune",
        "url": "https://www.archives-resultats-elections.interieur.gouv.fr/resultats/europeennes-2019/076/066/066028.php",
        "confidence": "inferred",
        "notes": "Pattern confirmé sur d'autres communes des Pyrénées-Orientales en 2019; Cabestany reste à valider explicitement.",
    },
    {
        "election_type": "europeennes",
        "year": "2014",
        "level": "commune",
        "url": "https://www.archives-resultats-elections.interieur.gouv.fr/resultats/ER2014/066/066028.php",
        "confidence": "confirmed",
        "notes": "Page communale officielle vérifiée dans les archives.",
    },
]


def main() -> int:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=["election_type", "year", "level", "url", "confidence", "notes"],
        )
        writer.writeheader()
        writer.writerows(ROWS)
    print(f"Wrote {OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
