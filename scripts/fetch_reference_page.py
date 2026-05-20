#!/usr/bin/env python3

from __future__ import annotations

import argparse
import sys
import urllib.request
from pathlib import Path


DEFAULT_USER_AGENT = (
    "Mozilla/5.0 (compatible; CabestanyCampaignBot/1.0; +https://cabestany.local)"
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Telecharge une page de reference et la stocke localement."
    )
    parser.add_argument("--url", required=True, help="URL a telecharger")
    parser.add_argument("--output", required=True, help="Fichier de sortie")
    parser.add_argument(
        "--user-agent",
        default=DEFAULT_USER_AGENT,
        help="User-Agent HTTP a utiliser",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    request = urllib.request.Request(
        args.url,
        headers={
            "User-Agent": args.user_agent,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.7",
        },
    )

    try:
      with urllib.request.urlopen(request, timeout=60) as response:
          content = response.read()
    except Exception as exc:  # pragma: no cover - network dependent
      print(f"Download failed: {exc}", file=sys.stderr)
      return 1

    output_path.write_bytes(content)
    print(f"Saved {args.url} -> {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
