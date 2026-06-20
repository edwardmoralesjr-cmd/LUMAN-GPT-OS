#!/usr/bin/env python3
"""
LUMAN OS v2 — local web server.

A zero-dependency (standard library only) HTTP server that serves the LUMAN
home page and a small JSON API. All logic is reused from luman.py and the
module engines, so the web UI and the CLI share one source of truth.

Run:  python3 web/server.py   (or use the luman-web launcher)
Then open http://127.0.0.1:8765 in your browser.
"""

import json
import subprocess
import sys
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

WEB = Path(__file__).resolve().parent
ROOT = WEB.parent
REPO = ROOT.parent
sys.path.insert(0, str(ROOT))

import luman  # noqa: E402
import assistant  # noqa: E402

HOST = "127.0.0.1"
PORT = 8765


def _section(m, sid):
    sec = next((s for s in m["sections"] if s["id"] == sid), None)
    if not sec:
        return None
    content_path = ROOT / sec.get("content", "")
    content = content_path.read_text(encoding="utf-8") if content_path.exists() else ""
    return {
        "id": sec["id"],
        "name": sec["name"],
        "status": sec["status"],
        "purpose": sec.get("purpose", ""),
        "content": content,
        "module": sec.get("module"),
    }


def _harmonic(m, person_id):
    return {"text": luman.render_harmonic(m, person_id)}


def _git(*args):
    """Run a git command in the repo; return (ok, combined output)."""
    try:
        p = subprocess.run(["git", "-C", str(REPO), *args],
                           capture_output=True, text=True, timeout=120)
        return p.returncode == 0, (p.stdout + p.stderr).strip()
    except FileNotFoundError:
        return False, "git is not installed or not on your PATH"
    except Exception as e:
        return False, str(e)


def _save(message=None):
    """Commit all changes and push to the current branch."""
    ok, _ = _git("--version")
    if not ok:
        return {"ok": False, "message": "Can't save to the cloud: git isn't available on this PC. "
                "You can still commit changes with GitHub Desktop."}
    _git("add", "-A")
    ok, status = _git("status", "--porcelain")
    if ok and not status:
        return {"ok": True, "message": "Nothing new to save — everything is already committed."}
    msg = (message or "").strip() or "Update LUMAN OS from the web app"
    ok, out = _git("commit", "-m", msg)
    if not ok:
        return {"ok": False, "message": f"Commit failed: {out}"}
    ok, out = _git("push", "origin", "HEAD")
    if not ok:
        return {"ok": False, "message": "Saved locally, but the push to GitHub failed "
                f"(you may need to sign in via GitHub Desktop):\n{out}"}
    return {"ok": True, "message": "Saved and pushed to GitHub."}


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass  # quiet

    def _send(self, code, body, ctype="application/json"):
        data = body.encode("utf-8") if isinstance(body, str) else body
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _json(self, obj, code=200):
        self._send(code, json.dumps(obj, ensure_ascii=False))

    def do_GET(self):
        m = luman.manifest()
        path = self.path.split("?")[0]
        if path == "/" or path == "/index.html":
            return self._send(200, (WEB / "index.html").read_text(encoding="utf-8"),
                              "text/html; charset=utf-8")
        if path == "/api/home":
            return self._json(luman.home_data(m))
        if path.startswith("/api/section/"):
            sec = _section(m, path.rsplit("/", 1)[-1])
            return self._json(sec) if sec else self._json({"error": "not found"}, 404)
        if path.startswith("/api/harmonic/"):
            return self._json(_harmonic(m, path.rsplit("/", 1)[-1]))
        if path == "/api/assistant/status":
            return self._json(assistant.status())
        return self._json({"error": "not found"}, 404)

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length) if length else b"{}"
        try:
            payload = json.loads(raw or b"{}")
        except json.JSONDecodeError:
            return self._json({"error": "bad json"}, 400)
        path = self.path.split("?")[0]
        if path == "/api/loop/done":
            msg = luman.loop_done(payload.get("id", ""))
            return self._json({"message": msg})
        if path == "/api/loop/add":
            msg = luman.loop_add(payload.get("title", "").strip(),
                                 payload.get("section") or None,
                                 payload.get("priority"))
            return self._json({"message": msg})
        if path == "/api/focus":
            msg = luman.set_focus(payload.get("text", "").strip())
            return self._json({"message": msg})
        if path == "/api/chat":
            home = luman.home_data(luman.manifest())
            history = payload.get("messages", [])
            return self._json(assistant.chat(home, history))
        if path == "/api/save":
            return self._json(_save(payload.get("message")))
        return self._json({"error": "not found"}, 404)


def main():
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    url = f"http://{HOST}:{PORT}"
    print(f"LUMAN OS web server running at {url}")
    print("Press Ctrl+C to stop.")
    if "--no-browser" not in sys.argv:
        try:
            webbrowser.open(url)
        except Exception:
            pass
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping LUMAN OS web server.")
        server.shutdown()


if __name__ == "__main__":
    main()
