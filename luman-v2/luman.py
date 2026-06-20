#!/usr/bin/env python3
"""
LUMAN OS v2 runtime.

A single source of truth (luman.json) describes the system's structure.
This runtime *renders* the interface and *validates* it — the menus are
never hand-maintained, so they cannot drift. State (loops, priorities)
lives in state/*.json. Prose content stays in Markdown.

Usage:
    python3 luman.py home
    python3 luman.py loops
    python3 luman.py next
    python3 luman.py open <section-id>
    python3 luman.py doctor
    python3 luman.py help
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MANIFEST = ROOT / "luman.json"


def load(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def manifest():
    return load(MANIFEST)


def state(name):
    path = ROOT / "state" / f"{name}.json"
    return load(path) if path.exists() else {}


# ---------- rendering ----------

def banner(m):
    sys_ = m["system"]
    width = 44
    line = "═" * width
    title = sys_["name"].center(width)
    sub = sys_["subtitle"].center(width)
    return f"╔{line}╗\n║{title}║\n║{sub}║\n╚{line}╝"


def render_home(m):
    sys_ = m["system"]
    pri = state("priorities")
    loops = state("loops").get("open_loops", [])
    out = [banner(m), ""]
    out.append(f"Mode:          {pri.get('mode', '—')}")
    out.append(f"Active Focus:  {pri.get('active_focus', '—')}")
    out.append("")
    out.append("Top Priorities:")
    for i, p in enumerate(pri.get("top_three", []), 1):
        out.append(f"  [{i}] {p}")
    out.append("")
    open_loops = [l for l in loops if l.get("status") != "done"]
    out.append(f"Open Loops: {len(open_loops)}")
    for l in sorted(open_loops, key=lambda x: x.get("priority", 99))[:3]:
        out.append(f"  • ({l['id']}) {l['title']}")
    out.append("")
    out.append("MAIN MENU")
    for i, s in enumerate(m["sections"], 1):
        flag = "" if s["status"] == "active" else f"  ({s['status']})"
        out.append(f"  [{i}] {s['name']:<26} luman {s['command']}{flag}")
    out.append("")
    out.append("Recommended Next Move:")
    out.append(f"  {recommend_next(m)}")
    return "\n".join(out)


def render_loops(m):
    loops = state("loops").get("open_loops", [])
    out = ["OPEN LOOPS", ""]
    for l in sorted(loops, key=lambda x: x.get("priority", 99)):
        mark = {"done": "✓", "in_progress": "▸", "open": "○"}.get(l.get("status"), "○")
        out.append(f"  {mark} ({l['id']}) [{l.get('section','-')}] {l['title']}")
    return "\n".join(out)


def recommend_next(m):
    loops = state("loops").get("open_loops", [])
    candidates = [l for l in loops if l.get("status") in ("open", "in_progress")]
    if not candidates:
        return "No open loops — pick a new priority."
    top = sorted(candidates, key=lambda x: x.get("priority", 99))[0]
    return f"({top['id']}) {top['title']}"


def render_open(m, section_id):
    sec = next((s for s in m["sections"] if s["id"] == section_id), None)
    if not sec:
        ids = ", ".join(s["id"] for s in m["sections"])
        return f"Unknown section '{section_id}'. Available: {ids}"
    out = [f"▌ {sec['name']}  ({sec['status']})", "", sec["purpose"], ""]
    content = ROOT / sec.get("content", "")
    if content.exists():
        out.append(f"Content: {sec['content']}")
        out.append("-" * 40)
        out.append(content.read_text(encoding="utf-8").strip())
    else:
        out.append(f"[no content file yet — expected {sec.get('content')}]")
    return "\n".join(out)


# ---------- validation (the thing the old system couldn't do) ----------

def render_doctor(m):
    problems, warnings, oks = [], [], []
    for s in m["sections"]:
        c = s.get("content")
        if not c:
            problems.append(f"section '{s['id']}' declares no content file")
        elif not (ROOT / c).exists():
            if s.get("status") == "planned":
                warnings.append(f"section '{s['id']}' is planned, content not built yet: {c}")
            else:
                problems.append(f"section '{s['id']}' is active but file is missing: {c}")
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
        mf = md.get("manifest")
        if mf and not (ROOT / mf).exists():
            problems.append(f"module '{md['id']}' → missing manifest: {mf}")
    loop_sections = {l.get("section") for l in state("loops").get("open_loops", [])}
    valid = {s["id"] for s in m["sections"]}
    for ls in loop_sections - valid - {None}:
        problems.append(f"open loop points at unknown section '{ls}'")

    out = ["LUMAN DOCTOR", ""]
    for ok in oks:
        out.append(f"  ✓ {ok}")
    if warnings:
        out.append("")
        for w in warnings:
            out.append(f"  ⚠ {w}")
    out.append("")
    if problems:
        out.append(f"{len(problems)} problem(s):")
        for p in problems:
            out.append(f"  ✗ {p}")
    else:
        out.append("No blocking problems. System is internally consistent.")
    return "\n".join(out), len(problems)


def render_help(m):
    out = ["GLOBAL COMMANDS", ""]
    for g in m["global_commands"]:
        out.append(f"  luman {g['command']:<10} {g['does']}")
    out.append("")
    out.append("SECTIONS")
    for s in m["sections"]:
        out.append(f"  luman {s['command']}")
    return "\n".join(out)


# ---------- entry ----------

def main(argv):
    m = manifest()
    cmd = argv[0] if argv else "home"
    if cmd == "home":
        print(render_home(m))
    elif cmd == "loops":
        print(render_loops(m))
    elif cmd == "next":
        print(f"Recommended Next Move:\n  {recommend_next(m)}")
    elif cmd == "open":
        if len(argv) < 2:
            print("Usage: luman open <section-id>")
            return 1
        print(render_open(m, argv[1]))
    elif cmd == "doctor":
        text, n = render_doctor(m)
        print(text)
        return 1 if n else 0
    elif cmd in ("help", "-h", "--help"):
        print(render_help(m))
    else:
        print(f"Unknown command '{cmd}'. Try: luman help")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
