#!/usr/bin/env python3
"""
LUMAN OS v2 — in-app Claude assistant.

Adds a conversational LUMAN voice to the web app, powered by the Claude API.
It speaks as LUMAN, with live awareness of Edward's current focus, priorities,
open loops, and daily Harmonic reading.

Requires:
  - the `anthropic` package  (pip install anthropic)
  - an ANTHROPIC_API_KEY environment variable

Both are checked at runtime; when either is missing the web UI shows friendly
setup instructions instead of failing.
"""

import os
from pathlib import Path

WEB = Path(__file__).resolve().parent
LUMAN_V2 = WEB.parent
REPO = LUMAN_V2.parent

MODEL = "claude-opus-4-8"
MAX_TOKENS = 2000


def _has_package():
    try:
        import anthropic  # noqa: F401
        return True
    except Exception:
        return False


def status():
    pkg = _has_package()
    key = bool(os.environ.get("ANTHROPIC_API_KEY"))
    return {"package": pkg, "key": key, "ready": pkg and key, "model": MODEL}


def _voice():
    f = REPO / "shared-core" / "luman_voice.md"
    return f.read_text(encoding="utf-8") if f.exists() else ""


def system_prompt(home):
    """Build LUMAN's system prompt from its voice rules and live state."""
    daily = home.get("daily")
    loops = home.get("open_loops", [])
    loop_lines = "\n".join(
        f"- ({l['id']}) {l['title']}" for l in sorted(loops, key=lambda x: x.get("priority", 99))
    ) or "- (none)"
    pri = "\n".join(f"- {p}" for p in home.get("top_three", [])) or "- (none)"
    daily_line = (
        f"{daily['date']}: Personal Year {daily['personal_year']}, "
        f"Personal Day {daily['personal_day']} — {daily['directive']}"
        if daily else "(not available)"
    )
    return f"""You are LUMAN, Edward Morales Jr.'s personal operating system and creative partner.

{_voice()}

You serve clarity, peace, creativity, discipline, family stability, spiritual
depth, and practical execution. You help Edward answer: Where am I? What matters
most right now? What is open? What should I do next? What should be improved?

Keep replies focused and useful. Offer a recommendation, not an exhaustive
survey. Respond with your final answer directly — do not narrate your reasoning.

Edward's current LUMAN state:
- Active focus: {home.get('active_focus', '—')}
- Mode: {home.get('mode', '—')}
- Today's Harmonic reading: {daily_line}

Top priorities:
{pri}

Open loops:
{loop_lines}
"""


def complete(system, user, max_tokens=3000):
    """Single-turn completion with a caller-supplied system prompt."""
    st = status()
    if not st["package"]:
        return {"error": "setup",
                "message": "The Claude library isn't installed yet. In a terminal run:  pip install anthropic"}
    if not st["key"]:
        return {"error": "setup",
                "message": "No Anthropic API key found. Set ANTHROPIC_API_KEY, then restart LUMAN."}
    try:
        import anthropic
        client = anthropic.Anthropic()
        resp = client.messages.create(
            model=MODEL, max_tokens=max_tokens, system=system,
            thinking={"type": "adaptive"},
            messages=[{"role": "user", "content": user}],
        )
        text = "".join(b.text for b in resp.content if b.type == "text").strip()
        return {"reply": text or "(no response)"}
    except Exception as e:
        name = type(e).__name__
        if "Authentication" in name:
            return {"error": "auth", "message": "Your API key was rejected. Double-check ANTHROPIC_API_KEY."}
        if "RateLimit" in name:
            return {"error": "rate", "message": "Rate limited — wait a moment and try again."}
        return {"error": "api", "message": f"{name}: {e}"}


def chat(home, history):
    """Send the conversation to Claude and return LUMAN's reply text."""
    st = status()
    if not st["package"]:
        return {"error": "setup",
                "message": "The Claude library isn't installed yet. In a terminal run:  pip install anthropic"}
    if not st["key"]:
        return {"error": "setup",
                "message": "No Anthropic API key found. Set the ANTHROPIC_API_KEY environment variable, then restart LUMAN."}
    try:
        import anthropic
        client = anthropic.Anthropic()
        resp = client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=system_prompt(home),
            thinking={"type": "adaptive"},
            messages=[{"role": m["role"], "content": m["content"]} for m in history],
        )
        text = "".join(b.text for b in resp.content if b.type == "text").strip()
        return {"reply": text or "(no response)"}
    except Exception as e:  # surface auth/rate/network errors plainly
        name = type(e).__name__
        if "Authentication" in name:
            return {"error": "auth", "message": "Your API key was rejected. Double-check ANTHROPIC_API_KEY."}
        if "RateLimit" in name:
            return {"error": "rate", "message": "Rate limited — wait a moment and try again."}
        return {"error": "api", "message": f"{name}: {e}"}
