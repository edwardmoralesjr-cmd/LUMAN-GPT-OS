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
- Cloudflare Access enforcement in production;
- Worker-side validation of the Cloudflare Access JWT signature, issuer, audience, and authenticated email before private/live reads.

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

Required protected configuration includes:

```text
GitHub Actions environment secrets:
HUD_ORIGIN
ALLOWED_EMAIL
LUMAN_PRIVATE_REPO_TOKEN
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN

GitHub Actions environment variables after Access is enabled:
TEAM_DOMAIN
POLICY_AUD

Worker runtime secret binding:
GITHUB_PRIVATE_TOKEN <- LUMAN_PRIVATE_REPO_TOKEN
```

Optional Worker configuration:

```text
PRIVATE_REPO=edwardmoralesjr-cmd/LUMAN-GPT-Command-Center
PRIVATE_OPEN_LOOPS_PATH=LUMAN_PRIVATE_VAULT/STATE/OPEN_LOOPS.md
```

Never commit secret values to GitHub. Add them through protected GitHub Actions / Cloudflare secret configuration.

## Secure GitHub Actions Deployment

Production deployment is intentionally two-stage:

```text
Bootstrap LUMAN Bridge
  -> deploy Worker hostname without private-source credentials
  -> enable Cloudflare Access

Activate LUMAN Bridge Private Reads
  -> explicit Access + read-only OAuth confirmation
  -> validate Access JWT configuration
  -> inject least-privilege private-source credentials
  -> deploy same Worker
  -> run production minimum-disclosure validation
```

Full setup and rollback instructions:

```text
LUMAN_OS/hud/bridge/SECURE_DEPLOYMENT.md
```

The GitHub Actions environment is named:

```text
luman-bridge-production
```

Deployment workflows are manual (`workflow_dispatch`); a normal push does not silently redeploy the private bridge.

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

Production requests must arrive through Cloudflare Access. The secure entrypoint requires and validates `Cf-Access-Jwt-Assertion`; missing, invalid, wrong-issuer, or wrong-audience assertions are denied before the source-reading bridge executes. The verified JWT email is then subject to the `ALLOWED_EMAIL` defense-in-depth check.

The private/live credentials must not be activated until Access protection and JWT validation configuration are present.

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

Status: V1 implementation + secure deployment workflow
Updated: 2026-08-19
