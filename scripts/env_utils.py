#!/usr/bin/env python3

from __future__ import annotations

import os
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ENV_CANDIDATES = (
    ROOT / "apps/team-app/.env.local",
    ROOT / "apps/team-app/.env",
    ROOT / ".env.local",
    ROOT / ".env",
)


def load_env_file(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()

        if not key:
            continue

        if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
            value = value[1:-1]

        values[key] = value

    return values


def resolve_env_var(name: str, default: str = "") -> str:
    direct_value = os.environ.get(name)
    if direct_value:
        return direct_value

    for env_path in ENV_CANDIDATES:
        env_values = load_env_file(env_path)
        resolved_value = env_values.get(name)
        if resolved_value:
            return resolved_value

    return default
