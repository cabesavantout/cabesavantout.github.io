#!/usr/bin/env python3

from __future__ import annotations

import json
import re
import sys
import urllib.request
from pathlib import Path


PAGE_URL = "https://ville-cabestany.fr/le-debat-dorientation/"
SNAPSHOT_PATH = Path("data/budget/cabestany-debat-orientation-links.json")


def fetch_html(url: str) -> str:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0",
        },
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8", errors="replace")


def extract_links(html: str) -> list[dict[str, str]]:
    pattern = re.compile(
        r'"class":"(?P<class>et_pb_blurb_\d+)","url":"(?P<url>https:\\/\\/[^"]+)","target":"(?P<target>[^"]+)"'
    )
    title_pattern = re.compile(
        r'<h4 class="et_pb_module_header"><span>(?P<title>[^<]+)</span></h4>'
    )

    titles = title_pattern.findall(html)
    links = []
    for index, match in enumerate(pattern.finditer(html)):
        item = match.groupdict()
        item["url"] = item["url"].replace("\\/", "/")
        item["title"] = titles[index] if index < len(titles) else item["class"]
        links.append(item)
    return links


def main() -> int:
    html_override = None
    if len(sys.argv) == 3 and sys.argv[1] == "--html":
        html_override = Path(sys.argv[2]).read_text(encoding="utf-8")
    elif len(sys.argv) != 1:
        print("Usage: check_cabestany_budget_page.py [--html <path>]")
        return 1

    html = html_override if html_override is not None else fetch_html(PAGE_URL)
    current = {
        "page_url": PAGE_URL,
        "documents": extract_links(html),
    }

    previous = None
    if SNAPSHOT_PATH.exists():
        previous = json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))

    SNAPSHOT_PATH.parent.mkdir(parents=True, exist_ok=True)
    SNAPSHOT_PATH.write_text(
        json.dumps(current, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    if previous is None:
        print("Snapshot created.")
        return 0

    old_urls = {item["url"] for item in previous.get("documents", [])}
    new_urls = {item["url"] for item in current.get("documents", [])}

    added = sorted(new_urls - old_urls)
    removed = sorted(old_urls - new_urls)

    if not added and not removed:
        print("No change detected.")
        return 0

    if added:
        print("Added:")
        for url in added:
            print(f"- {url}")

    if removed:
        print("Removed:")
        for url in removed:
            print(f"- {url}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
