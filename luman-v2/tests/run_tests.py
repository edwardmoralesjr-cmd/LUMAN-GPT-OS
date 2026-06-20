#!/usr/bin/env python3
"""
LUMAN OS v2 tests. Dependency-free: `python3 tests/run_tests.py`.
Exits non-zero on any failure, so it can gate a commit or CI run.
"""

import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

import luman  # noqa: E402


def load_engine():
    spec = importlib.util.spec_from_file_location(
        "engine", ROOT / "modules" / "harmonic_time_analyst.py"
    )
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


failures = []


def check(name, got, want):
    if got == want:
        print(f"  ✓ {name}")
    else:
        print(f"  ✗ {name}: got {got!r}, want {want!r}")
        failures.append(name)


def main():
    e = load_engine()
    edward = {"name": "Edward Morales Jr.", "birth_date": "1986-02-17"}

    print("Numerology engine reproduces Edward's documented numbers:")
    check("life_path", e.life_path("1986-02-17"), 7)
    check("expression", e.expression(edward["name"]), 4)
    check("personal_year 2026 (master 11)", e.personal_year("1986-02-17", 2026), 11)

    from datetime import date as _date
    on = _date(2026, 6, 20)
    check("personal_month 2026-06-20", e.personal_month("1986-02-17", on), 8)
    check("personal_day 2026-06-20", e.personal_day("1986-02-17", on), 1)
    check("directive exists for personal day", bool(e.directive(1)), True)
    check("master number preserved", e.reduce_number(11), 11)
    check("non-master reduces", e.reduce_number(28), 1)

    print("System validates clean:")
    problems, _warnings, _oks = luman.validate(luman.manifest())
    check("doctor has no blocking problems", problems, [])

    print()
    if failures:
        print(f"FAILED ({len(failures)})")
        return 1
    print("ALL PASSED")
    return 0


if __name__ == "__main__":
    sys.exit(main())
