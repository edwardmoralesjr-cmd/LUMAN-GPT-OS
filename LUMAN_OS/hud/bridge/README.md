# LUMAN Authenticated Minimum-Data Bridge

## Purpose

Provide an authenticated, read-only server-side boundary between the public LUMAN HUD and private/live sources.

The bridge does **not** become a source of truth. It retrieves current source data, minimizes it, labels provenance and freshness, and returns a disposable view model to the HUD.

```text
HUD
  -> authenticated bridge
      -> private GitHub vault
      -> Google Calendar
      -> Gmail
  <- minimum-data view model
```

## V1 Security Posture

V1 is intentionally read-only.

It has:

- no write routes;
- no KV, D1, database, durable cache, or browser persistence of source content;
- no raw Gmail message bodies;
- no email attachment retrieval;
- no Calendar descriptions or attendee lists;
- no full private-note delivery;
- no financial, medical, credential, vehicle/home, or unrelated private-vault retrieval;
- `Cache-Control: no-store` on authenticated responses;
- explicit per-source failure states;
- strict HUD-origin CORS;
- Cloudflare Access enforcement in production.

## Returned View Model

`GET /v1/context` returns a bounded object such as:

```json
{
  "version": "1.0",
  "generated_at": "2026-08-18T11:11:00-05:00",
  "identity": {
    "authenticated": true,
    "email": "masked"
  },
  "sources": {
    "private_brain": { "status": "connected" },
    "calendar": { "status": "connected" },
    "gmail": { "status": "connected" }
  },
  "today": {
    "calendar": [],
    "inbox_signals": []
  },
  "private_minimum": {
    "upcoming_commitments": []
  }
}
```

The browser does not receive raw source dumps.

## Cloudflare Deployment Model

The bridge is designed for a Cloudflare Worker protected by Cloudflare Access.

Required Worker secrets / variables:

```text
HUD_ORIGIN
ALLOWED_EMAIL
GITHUB_PRIVATE_TOKEN
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN
```

Optional:

```text
PRIVATE_REPO=edwardmoralesjr-cmd/LUMAN-GPT-Command-Center
PRIVATE_OPEN_LOOPS_PATH=LUMAN_PRIVATE_VAULT/STATE/OPEN_LOOPS.md
```

Never commit secret values to GitHub. Add them through Cloudflare encrypted secrets / protected configuration.

## Google OAuth Scope Boundary

The refresh token used by this read-only bridge should be issued only for:

```text
https://www.googleapis.com/auth/calendar.readonly
https://www.googleapis.com/auth/gmail.readonly
```

Do not give V1 Calendar or Gmail write scopes.

## Routes

```text
GET  /health
GET  /v1/context
OPTIONS *
```

There are no POST/PUT/PATCH/DELETE action routes in V1.

## Fail-Closed Rule

Production requests must arrive through Cloudflare Access. If the authenticated identity header is missing, or does not match the configured allowed identity, the Worker returns `401` or `403`.

The Worker should not be deployed publicly without Access protection configured.

## Data Ownership

```text
Private vault = owner of durable private continuity
Calendar      = owner of scheduled-event truth
Gmail         = owner of message truth
Bridge        = minimizer / transport boundary
HUD           = disposable interface
Edward        = final authority
```

## Status

Status: V1 implementation
Created: 2026-08-18
