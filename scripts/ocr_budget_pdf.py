#!/usr/bin/env python3

from __future__ import annotations

import argparse
import subprocess
import tempfile
from pathlib import Path


def count_pages(pdf_path: Path) -> int:
    result = subprocess.run(
        ["pdfinfo", str(pdf_path)],
        check=True,
        capture_output=True,
        text=True,
    )
    for line in result.stdout.splitlines():
        if line.startswith("Pages:"):
            return int(line.split(":", 1)[1].strip())
    raise RuntimeError("Pages count not found")


def ocr_page(image_path: Path) -> str:
    result = subprocess.run(
        ["tesseract", str(image_path), "stdout", "--psm", "6"],
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf_path")
    parser.add_argument("output_txt")
    parser.add_argument("--dpi", type=int, default=200)
    parser.add_argument("--from-page", type=int, default=1)
    parser.add_argument("--to-page", type=int)
    args = parser.parse_args()

    pdf_path = Path(args.pdf_path)
    output_txt = Path(args.output_txt)
    output_txt.parent.mkdir(parents=True, exist_ok=True)

    total_pages = count_pages(pdf_path)
    from_page = max(1, args.from_page)
    to_page = min(args.to_page or total_pages, total_pages)

    page_texts: list[str] = []

    with tempfile.TemporaryDirectory(prefix="budget-ocr-") as tmp_dir:
      tmp_path = Path(tmp_dir)
      for page in range(from_page, to_page + 1):
          prefix = tmp_path / f"page-{page:03d}"
          subprocess.run(
              [
                  "pdftoppm",
                  "-f",
                  str(page),
                  "-l",
                  str(page),
                  "-r",
                  str(args.dpi),
                  "-png",
                  str(pdf_path),
                  str(prefix),
              ],
              check=True,
              capture_output=True,
          )
          candidates = sorted(tmp_path.glob(f"{prefix.name}-*.png"))
          if not candidates:
              raise RuntimeError(f"No PNG generated for page {page}")
          image_path = candidates[0]
          page_text = ocr_page(image_path).strip()
          page_texts.append(f"=== PAGE {page} ===\n{page_text}\n")

    output_txt.write_text("\n\f\n".join(page_texts), encoding="utf-8")
    print(f"OCR written to {output_txt} for pages {from_page}-{to_page}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
