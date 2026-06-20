"""
Harmonic Time System Analyst — computation engine.

Numerology is deterministic arithmetic, so it is *computed* here rather than
guessed. This is what lets the module respect LUMAN's accuracy guardrail:
numbers that can be calculated are calculated; an exact natal chart cannot be
recalculated from prose, so documented placements are passed through labeled,
never re-derived.

Pure standard library. No external dependencies.
"""

from datetime import date

# Pythagorean letter values
_LETTER = {}
for i, ch in enumerate("ABCDEFGHIJKLMNOPQRSTUVWXYZ"):
    _LETTER[ch] = (i % 9) + 1

_VOWELS = set("AEIOU")
_MASTERS = {11, 22, 33}


def reduce_number(n, keep_masters=True):
    """Reduce to a single digit, preserving master numbers 11/22/33."""
    while n > 9 and not (keep_masters and n in _MASTERS):
        n = sum(int(d) for d in str(n))
    return n


def _digits_sum(value):
    return sum(int(d) for d in str(value) if d.isdigit())


def life_path(birth_iso):
    """Component method: reduce month, day, year separately, then combine."""
    y, m, d = (int(p) for p in birth_iso.split("-"))
    parts = [reduce_number(m), reduce_number(d), reduce_number(_digits_sum(y))]
    return reduce_number(sum(parts))


def _name_value(name, predicate=lambda ch: True):
    total = 0
    for ch in name.upper():
        if ch in _LETTER and predicate(ch):
            total += _LETTER[ch]
    return reduce_number(total)


def expression(name):
    return _name_value(name)


def soul_urge(name):
    return _name_value(name, lambda ch: ch in _VOWELS)


def personality(name):
    return _name_value(name, lambda ch: ch not in _VOWELS)


def personal_year(birth_iso, for_year=None):
    y, m, d = (int(p) for p in birth_iso.split("-"))
    year = for_year or date.today().year
    total = reduce_number(m) + reduce_number(d) + reduce_number(_digits_sum(year))
    return reduce_number(total)


def personal_month(birth_iso, on=None):
    on = on or date.today()
    py = reduce_number(personal_year(birth_iso, on.year), keep_masters=False)
    return reduce_number(py + reduce_number(on.month))


def personal_day(birth_iso, on=None):
    on = on or date.today()
    pm = reduce_number(personal_month(birth_iso, on), keep_masters=False)
    return reduce_number(pm + reduce_number(on.day))


# Short, grounded directives in LUMAN's voice (clarity, discipline, depth).
DAILY_DIRECTIVE = {
    1: "New beginnings — initiate one clear action and lead, don't wait.",
    2: "Patience and partnership — refine, cooperate, and listen before deciding.",
    3: "Expression — create, write, and communicate; let ideas flow outward.",
    4: "Structure — build the system, handle the details, do the disciplined work.",
    5: "Change — stay adaptable; welcome movement but keep your center.",
    6: "Responsibility — tend family, home, and what you love; nurture and balance.",
    7: "Reflection — go inward; study, analyze, and seek depth and insight.",
    8: "Power — focus on results and execution; act with authority and clarity.",
    9: "Completion — finish, release, and clear space for the next cycle.",
    11: "Intuition — trust the inner signal; spiritual insight is heightened today.",
    22: "Master builder — think big and lay foundations for something lasting.",
}


def directive(n):
    return DAILY_DIRECTIVE.get(n) or DAILY_DIRECTIVE.get(
        reduce_number(n, keep_masters=False), ""
    )


def _label(n):
    """Show master numbers as e.g. '11/2'."""
    if n in _MASTERS:
        return f"{n}/{reduce_number(n, keep_masters=False)}"
    return str(n)


def reading(person, for_year=None):
    """Build a full numerology reading dict from a person record."""
    name = person["name"]
    birth = person["birth_date"]
    year = for_year or date.today().year
    return {
        "name": name,
        "for_year": year,
        "numerology": {
            "life_path": _label(life_path(birth)),
            "expression": _label(expression(name)),
            "soul_urge": _label(soul_urge(name)),
            "personality": _label(personality(name)),
            "personal_year": _label(personal_year(birth, year)),
        },
        "astrology": {
            "computed": False,
            "note": person.get(
                "chart_basis",
                "No documented chart basis — astrology not recalculated.",
            ),
            "documented_placements": person.get("documented_placements", {}),
        },
    }


def mini(person, on=None):
    """Compact daily reading for the home screen."""
    on = on or date.today()
    birth = person["birth_date"]
    pd = personal_day(birth, on)
    lines = [f"Daily Harmonic Reading — {on.isoformat()} ({person['name']})"]
    lines.append(
        f"  Personal Year {_label(personal_year(birth, on.year))} · "
        f"Personal Month {_label(personal_month(birth, on))} · "
        f"Personal Day {_label(pd)}"
    )
    lines.append(f"  Directive: {directive(pd)}")
    return "\n".join(lines)


def render(person, for_year=None):
    r = reading(person, for_year)
    n = r["numerology"]
    out = [f"HARMONIC TIME READING — {r['name']}  ({r['for_year']})", ""]
    out.append("Numerology (computed):")
    out.append(f"  Life Path:     {n['life_path']}")
    out.append(f"  Expression:    {n['expression']}")
    out.append(f"  Soul Urge:     {n['soul_urge']}")
    out.append(f"  Personality:   {n['personality']}")
    out.append(f"  Personal Year: {n['personal_year']}")
    out.append("")
    a = r["astrology"]
    out.append("Astrology (documented, not recalculated):")
    out.append(f"  Basis: {a['note']}")
    for k, v in a["documented_placements"].items():
        out.append(f"  {k.capitalize()}: {v}")
    out.append("")
    out.append("Note: Numerology values are calculated. Astrology placements are")
    out.append("passed through from a documented chart basis and framed as")
    out.append("reflective guidance, not fixed destiny.")
    return "\n".join(out)
