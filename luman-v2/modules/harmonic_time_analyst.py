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
