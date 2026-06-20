#!/usr/bin/env python3
"""
LUMAN OS v2 runtime.

A single source of truth (luman.json) describes the system's structure.
This runtime *renders* the interface, *mutates* state, and *validates*
integrity — the menus are never hand-maintained, so they cannot drift.
State (loops, priorities, people) lives in state/. Prose stays in Markdown.
Computation lives in module engines under modules/.

Run `python3 luman.py help` for commands.
"""

import argparse
import importlib.util
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MANIFEST = ROOT / "luman.json"


# ---------- io ----------

def load(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def manifest():
    return load(MANIFEST)


def state_path(name):
    return ROOT / "state" / f"{name}.json"


def state(name):
    p = state_path(name)
    return load(p) if p.exists() else {}


def load_engine(rel_path):
    """Import a module engine (a .py under modules/) by file path."""
    spec = importlib.util.spec_from_file_location("luman_engine", ROOT / rel_path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


# ---------- rendering ----------

def banner(m):
    width = 44
    line = "═" * width
    return (
        f"╔{line}╗\n"
        f"║{m['system']['name'].center(width)}║\n"
        f"║{m['system']['subtitle'].center(width)}║\n"
        f"╚{line}╝"
    )


def recommend_next(m):
    loops = state("loops").get("open_loops", [])
    candidates = [l for l in loops if l.get("status") in ("open", "in_progress")]
    if not candidates:
        return "No open loops — pick a new priority."
    top = sorted(candidates, key=lambda x: x.get("priority", 99))[0]
    return f"({top['id']}) {top['title']}"


def daily_reading_block(m):
    """Compute today's mini Harmonic reading for the home screen, if configured."""
    cfg = m["system"].get("daily_reading")
    if not cfg:
        return None
    mod = next((md for md in m.get("modules", []) if md["id"] == cfg.get("module")), None)
    if not mod or not mod.get("engine"):
        return None
    person = ROOT / "state" / "people" / f"{cfg.get('person')}.json"
    if not person.exists():
        return None
    try:
        return load_engine(mod["engine"]).mini(load(person))
    except Exception:
        return None


def render_home(m):
    pri = state("priorities")
    loops = [l for l in state("loops").get("open_loops", []) if l.get("status") != "done"]
    out = [banner(m), ""]
    out.append(f"Mode:          {pri.get('mode', '—')}")
    out.append(f"Active Focus:  {pri.get('active_focus', '—')}")
    daily = daily_reading_block(m)
    if daily:
        out.append("")
        out.append(daily)
    out.append("")
    out.append("Top Priorities:")
    for i, p in enumerate(pri.get("top_three", []), 1):
        out.append(f"  [{i}] {p}")
    out.append("")
    out.append(f"Open Loops: {len(loops)}")
    for l in sorted(loops, key=lambda x: x.get("priority", 99))[:3]:
        out.append(f"  • ({l['id']}) {l['title']}")
    out.append("")
    out.append("MAIN MENU")
    for i, s in enumerate(m["sections"], 1):
        flag = "" if s["status"] == "active" else f"  ({s['status']})"
        out.append(f"  [{i}] {s['name']:<26} luman open {s['id']}{flag}")
    out.append("")
    out.append("Recommended Next Move:")
    out.append(f"  {recommend_next(m)}")
    return "\n".join(out)


def render_loops(m):
    loops = state("loops").get("open_loops", [])
    if not loops:
        return "No loops."
    out = ["OPEN LOOPS", ""]
    for l in sorted(loops, key=lambda x: x.get("priority", 99)):
        mark = {"done": "✓", "in_progress": "▸", "open": "○"}.get(l.get("status"), "○")
        out.append(f"  {mark} ({l['id']}) [{l.get('section','-')}] {l['title']}")
    return "\n".join(out)


def render_open(m, section_id):
    sec = next((s for s in m["sections"] if s["id"] == section_id), None)
    if not sec:
        ids = ", ".join(s["id"] for s in m["sections"])
        return f"Unknown section '{section_id}'. Available: {ids}"
    out = [f"▌ {sec['name']}  ({sec['status']})", "", sec["purpose"], ""]
    content = ROOT / sec.get("content", "")
    if content.exists():
        out.append(content.read_text(encoding="utf-8").strip())
    else:
        out.append(f"[no content file yet — expected {sec.get('content')}]")
    return "\n".join(out)


# ---------- validation ----------

def validate(m):
    problems, warnings, oks = [], [], []
    for s in m["sections"]:
        c = s.get("content")
        if not c:
            problems.append(f"section '{s['id']}' declares no content file")
        elif not (ROOT / c).exists():
            (warnings if s.get("status") == "planned" else problems).append(
                f"section '{s['id']}' "
                + ("is planned, content not built yet: " if s.get("status") == "planned"
                   else "is active but file is missing: ")
                + c
            )
        else:
            oks.append(f"section '{s['id']}' → {c}")
        mod = s.get("module")
        if mod and not any(md["id"] == mod for md in m.get("modules", [])):
            problems.append(f"section '{s['id']}' references unknown module '{mod}'")

    declared = {md["id"] for md in m.get("modules", [])}
    referenced = {s.get("module") for s in m["sections"] if s.get("module")}
    for orphan in declared - referenced:
        problems.append(f"module '{orphan}' is declared but no section uses it (orphan)")
    for md in m.get("modules", []):
        for key in ("manifest", "engine"):
            f = md.get(key)
            if f and not (ROOT / f).exists():
                problems.append(f"module '{md['id']}' → missing {key}: {f}")

    valid = {s["id"] for s in m["sections"]}
    for ls in {l.get("section") for l in state("loops").get("open_loops", [])} - valid - {None}:
        problems.append(f"open loop points at unknown section '{ls}'")
    return problems, warnings, oks


def render_doctor(m):
    problems, warnings, oks = validate(m)
    out = ["LUMAN DOCTOR", ""]
    out += [f"  ✓ {o}" for o in oks]
    if warnings:
        out.append("")
        out += [f"  ⚠ {w}" for w in warnings]
    out.append("")
    if problems:
        out.append(f"{len(problems)} problem(s):")
        out += [f"  ✗ {p}" for p in problems]
    else:
        out.append("No blocking problems. System is internally consistent.")
    return "\n".join(out), len(problems)


# ---------- mutation ----------

def next_loop_id(loops):
    nums = [int(l["id"][1:]) for l in loops if l["id"][1:].isdigit()]
    return f"L{(max(nums) + 1) if nums else 1}"


def loop_add(title, section=None, priority=None):
    data = state("loops")
    loops = data.setdefault("open_loops", [])
    lid = next_loop_id(loops)
    loops.append({
        "id": lid,
        "title": title,
        "section": section,
        "priority": priority if priority is not None else len(loops) + 1,
        "status": "open",
    })
    save(state_path("loops"), data)
    return f"Added {lid}: {title}"


def loop_done(loop_id):
    data = state("loops")
    for l in data.get("open_loops", []):
        if l["id"].lower() == loop_id.lower():
            l["status"] = "done"
            save(state_path("loops"), data)
            return f"Closed {l['id']}: {l['title']}"
    return f"No loop with id '{loop_id}'."


def set_focus(text):
    data = state("priorities")
    data["active_focus"] = text
    save(state_path("priorities"), data)
    return f"Active focus set: {text}"


# ---------- module commands ----------

def render_harmonic(m, person_id, for_year=None):
    p = state_path("people").parent / "people" / f"{person_id}.json"
    if not p.exists():
        return f"No person record '{person_id}'. Add one at state/people/{person_id}.json"
    mod = next((md for md in m["modules"] if md["id"] == "harmonic_time_analyst"), None)
    if not mod or not mod.get("engine"):
        return "Harmonic module engine not configured in luman.json."
    engine = load_engine(mod["engine"])
    return engine.render(load(p), for_year)


# ---------- interactive menu ----------

def _pause():
    try:
        input("\n[enter to return to menu] ")
    except EOFError:
        pass


def interactive_menu(m):
    """Loop the home screen and let the user pick a numbered section or a command."""
    n = len(m["sections"])
    while True:
        print("\n" + render_home(m))
        prompt = f"\nSelect [1-{n}], a command (loops/next/doctor/help), or q to quit > "
        try:
            choice = input(prompt).strip()
        except EOFError:
            break
        if not choice:
            continue
        low = choice.lower()

        if low in ("q", "quit", "exit"):
            print("Goodbye.")
            break
        if low in ("home", "menu", "back"):
            continue
        if low.isdigit():
            idx = int(low)
            if 1 <= idx <= n:
                print("\n" + render_open(m, m["sections"][idx - 1]["id"]))
            else:
                print(f"No menu item {idx}.")
            _pause()
            continue
        if low == "loops":
            print("\n" + render_loops(m)); _pause(); continue
        if low == "next":
            print(f"\nRecommended Next Move:\n  {recommend_next(m)}"); _pause(); continue
        if low == "doctor":
            text, _ = render_doctor(m); print("\n" + text); _pause(); continue
        if low == "help":
            print("\nType a section number, a section name, or: loops, next, doctor, q")
            _pause(); continue

        sec = next(
            (s for s in m["sections"] if s["id"] == low or s["name"].lower() == low),
            None,
        )
        if sec:
            print("\n" + render_open(m, sec["id"]))
        else:
            print(f"Unknown choice: {choice}")
        _pause()


# ---------- cli ----------

def build_parser():
    p = argparse.ArgumentParser(prog="luman", description="LUMAN OS v2")
    sub = p.add_subparsers(dest="cmd")

    sub.add_parser("home", help="render the home screen once")
    sub.add_parser("menu", help="interactive home screen (pick a number)")
    sub.add_parser("loops", help="list open loops")
    sub.add_parser("next", help="recommend the next move")
    sub.add_parser("doctor", help="validate system integrity")
    sub.add_parser("help", help="show commands")

    sp = sub.add_parser("open", help="open a section")
    sp.add_argument("section")

    sp = sub.add_parser("focus", help="set the active focus")
    sp.add_argument("text")

    sp = sub.add_parser("loop", help="manage loops")
    loopsub = sp.add_subparsers(dest="loopcmd")
    add = loopsub.add_parser("add")
    add.add_argument("title")
    add.add_argument("--section")
    add.add_argument("--priority", type=int)
    done = loopsub.add_parser("done")
    done.add_argument("id")

    sp = sub.add_parser("harmonic", help="produce a Harmonic Time reading")
    sp.add_argument("person")
    sp.add_argument("--year", type=int)
    return p


def main(argv):
    m = manifest()
    parser = build_parser()
    args = parser.parse_args(argv)
    # Bare `luman` opens the interactive menu in a terminal, static home otherwise.
    cmd = args.cmd or ("menu" if sys.stdin.isatty() else "home")

    if cmd == "menu":
        interactive_menu(m)
    elif cmd == "home":
        print(render_home(m))
    elif cmd == "loops":
        print(render_loops(m))
    elif cmd == "next":
        print(f"Recommended Next Move:\n  {recommend_next(m)}")
    elif cmd == "open":
        print(render_open(m, args.section))
    elif cmd == "focus":
        print(set_focus(args.text))
    elif cmd == "loop":
        if args.loopcmd == "add":
            print(loop_add(args.title, args.section, args.priority))
        elif args.loopcmd == "done":
            print(loop_done(args.id))
        else:
            print("Usage: luman loop add <title> [--section S] [--priority N] | luman loop done <id>")
            return 1
    elif cmd == "harmonic":
        print(render_harmonic(m, args.person, args.year))
    elif cmd in ("help", "-h", "--help"):
        parser.print_help()
    elif cmd == "doctor":
        text, n = render_doctor(m)
        print(text)
        return 1 if n else 0
    else:
        print(f"Unknown command '{cmd}'. Try: luman help")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
