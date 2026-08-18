# LUMAN Bridge Secure Deployment

## Purpose

Deploy Bridge V1 without ever placing private-source credentials behind an unprotected Worker hostname.

The deployment is intentionally two-stage:

```text
Stage 1: Bootstrap
  Cloudflare Worker shell
  + HUD origin
  + allowed identity
  - no private GitHub token
  - no Google OAuth credentials

        ↓

Enable Cloudflare Access on the Worker
and restrict it to the intended identity

        ↓

Stage 2: Activate
  add least-privilege private GitHub read token
  add read-only Google OAuth credentials
  deploy the same Worker

        ↓

Run production authentication + minimum-disclosure tests
```

## GitHub Environment

Create a GitHub Actions environment named:

```text
luman-bridge-production
```

Recommended:

- enable required reviewers if available;
- restrict deployment branches to `main` if desired;
- place all bridge deployment secrets in this environment rather than repository files.

## Protected Configuration

Add these GitHub Actions environment secrets:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
HUD_ORIGIN
ALLOWED_EMAIL
GITHUB_PRIVATE_TOKEN
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN
```

No value from this list belongs in Git history.

### Cloudflare API token

Create a scoped Cloudflare API token with only the permissions needed to deploy/edit Workers on the intended account. Do not use a global API key.

### HUD_ORIGIN

Set this to the exact production HUD origin, with no path. Example shape:

```text
https://example.github.io
```

The Worker performs strict origin matching.

### ALLOWED_EMAIL

Set this to the identity Cloudflare Access should authenticate. The Worker performs a second identity allowlist check after Access.

### GITHUB_PRIVATE_TOKEN

Use a fine-grained GitHub token limited to the private LUMAN command-center repository and read-only Contents access. Do not grant write access.

### Google OAuth

The refresh token must be issued only for:

```text
https://www.googleapis.com/auth/calendar.readonly
https://www.googleapis.com/auth/gmail.readonly
```

Do not activate Bridge V1 with Calendar or Gmail write scopes.

## Stage 1 — Bootstrap

Run the GitHub Actions workflow:

```text
Bootstrap LUMAN Bridge
```

Check the `confirm_bootstrap` box.

This workflow deploys the Worker with only:

```text
HUD_ORIGIN
ALLOWED_EMAIL
```

It deliberately does **not** provide:

```text
GITHUB_PRIVATE_TOKEN
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN
```

Therefore the Worker can establish its hostname without having access to private source data.

## Enable Cloudflare Access

After bootstrap, use the deployed Worker hostname to enable Cloudflare Access.

For a `workers.dev` deployment, Cloudflare currently supports enabling Access from:

```text
Workers & Pages
→ select the Worker
→ Settings
→ Domains & Routes
→ workers.dev
→ Enable Cloudflare Access
```

Restrict the Access policy to the intended identity. Keep the Worker's own `ALLOWED_EMAIL` check as defense in depth.

Do not proceed to activation until Access is actually protecting the Worker.

## Stage 2 — Activate

Run:

```text
Activate LUMAN Bridge Private Reads
```

You must explicitly confirm both:

```text
Cloudflare Access is enabled
Google token uses read-only scopes
```

The activation workflow refuses to run unless those confirmations are true and all protected configuration exists.

It then deploys the same Worker and supplies only the six runtime secrets required by Bridge V1:

```text
HUD_ORIGIN
ALLOWED_EMAIL
GITHUB_PRIVATE_TOKEN
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN
```

## Production Validation

Deployment does not by itself mark Bridge V1 `Active`.

Run the production test matrix after activation:

1. Unauthenticated browser request is intercepted by Cloudflare Access.
2. Unauthorized identity is denied.
3. Authorized identity can reach `GET /health`.
4. Health reports `mode: read-only` and only a masked identity.
5. `GET /v1/context` returns source status plus minimized view-model data.
6. Private brain returns only active open-loop title / next gate / due trigger.
7. Calendar returns only title, start, end, and all-day status.
8. Gmail returns only minimized sender, subject, received time, and derived signals.
9. No Gmail body, snippet, attachment, Calendar description, attendee list, full private note, credentials, or unrelated private category reaches the browser.
10. POST, PUT, PATCH, and DELETE remain unavailable.
11. Responses retain `Cache-Control: no-store`.
12. Disconnect/reload clears private/live context from HUD memory.

Only after all checks pass should LUMAN state change from:

```text
BUILT / CODE-VALIDATED
```

to:

```text
ACTIVE / PRODUCTION-VALIDATED
```

## Rollback / Revocation

If anything is wrong:

- disable Cloudflare Access exposure or the Worker route;
- revoke/rotate the private GitHub token;
- revoke the Google refresh token;
- rotate the Cloudflare API token if deployment authority may be compromised;
- do not persist any returned private/live data into public GitHub as part of incident handling.

## Sovereignty Rule

```text
Deployment authority does not grant data authority.
Bridge access does not grant memory authority.
Read access does not grant write authority.
Edward remains final human authority.
```
