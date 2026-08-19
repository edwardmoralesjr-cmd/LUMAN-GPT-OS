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
  - no Access audience/team-domain activation config

        ↓

Enable Cloudflare Access on the Worker
and restrict it to the intended identity

        ↓

Capture Access validation config
  TEAM_DOMAIN
  POLICY_AUD

        ↓

Stage 2: Activate
  validate Cf-Access-Jwt-Assertion cryptographically
  add least-privilege private GitHub read token
  add read-only Google OAuth credentials
  deploy the same Worker

        ↓

Run production authentication + minimum-disclosure tests
```

Stage 1 is intentionally fail-closed for authenticated bridge reads. Until Stage 2 supplies the Access team domain and application audience, the secure entrypoint returns `access_validation_not_configured` rather than trusting an identity header by itself.

## GitHub Environment

Create a GitHub Actions environment named:

```text
luman-bridge-production
```

Recommended:

- enable required reviewers if available;
- restrict deployment branches to `main` if desired;
- place deployment secrets and protected activation variables in this environment rather than repository files.

## Protected Configuration

### Environment secrets

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
HUD_ORIGIN
ALLOWED_EMAIL
LUMAN_PRIVATE_REPO_TOKEN
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN
```

### Environment variables used only after Access is enabled

```text
TEAM_DOMAIN
POLICY_AUD
```

No identity-specific value or credential belongs in Git history.

### Cloudflare API token

Create a scoped Cloudflare API token with only the permissions needed to deploy/edit Workers on the intended account. Do not use a global API key.

### HUD_ORIGIN

Set this to the exact production HUD origin, with no path. Example shape:

```text
https://example.github.io
```

The Worker performs strict origin matching.

### ALLOWED_EMAIL

Set this to the identity Cloudflare Access should authenticate. The bridge performs a second identity allowlist check after the Access JWT is cryptographically validated.

### TEAM_DOMAIN

Set this to the Cloudflare Access team domain used as the JWT issuer, for example the account's HTTPS `cloudflareaccess.com` team domain.

The secure bridge entrypoint uses this domain to obtain Access JWKs from `/cdn-cgi/access/certs` and to validate the JWT issuer.

### POLICY_AUD

Set this to the audience (`aud`) value for the Access application protecting the Worker. The secure entrypoint rejects JWTs that are validly signed but were issued for another Access application.

### LUMAN_PRIVATE_REPO_TOKEN

Use a fine-grained GitHub token limited to the private LUMAN command-center repository and read-only Contents access. Do not grant write access.

Store that credential in the GitHub Actions environment as:

```text
LUMAN_PRIVATE_REPO_TOKEN
```

The activation workflow maps it at deployment time to the Worker's internal secret binding:

```text
GITHUB_PRIVATE_TOKEN
```

The GitHub-side secret intentionally does not use a `GITHUB_` prefix because GitHub reserves that prefix for its own secret/configuration namespace.

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
TEAM_DOMAIN
POLICY_AUD
LUMAN_PRIVATE_REPO_TOKEN
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN
```

Therefore the Worker can establish its hostname without having access to private source data. Because `REQUIRE_CF_ACCESS=true` and the secure entrypoint lacks Stage 2 JWT validation config, authenticated bridge reads remain fail-closed during bootstrap.

## Enable Cloudflare Access

After bootstrap, use the deployed Worker hostname to enable Cloudflare Access.

For a `workers.dev` deployment, Cloudflare supports enabling Access from:

```text
Workers & Pages
→ select the Worker
→ Settings
→ Domains & Routes
→ workers.dev
→ Enable Cloudflare Access
```

Restrict the Access policy to the intended identity. Keep the Worker's own `ALLOWED_EMAIL` check as defense in depth.

Then record the Access team domain and the application's audience value in the protected GitHub environment as:

```text
TEAM_DOMAIN
POLICY_AUD
```

Do not proceed to activation until Access is actually protecting the Worker and both validation values are present.

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

It deploys the same Worker with:

```text
Protected variables:
TEAM_DOMAIN
POLICY_AUD

GitHub environment secrets:
HUD_ORIGIN
ALLOWED_EMAIL
LUMAN_PRIVATE_REPO_TOKEN
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN

Worker runtime secret binding:
GITHUB_PRIVATE_TOKEN <- LUMAN_PRIVATE_REPO_TOKEN
```

The production request path is then:

```text
Cloudflare Access policy
        ↓
Cf-Access-Jwt-Assertion
        ↓
secure-entry.js validates signature + issuer + audience
        ↓
verified JWT email becomes the bridge identity
        ↓
index.js enforces ALLOWED_EMAIL + read-only/minimum-data rules
```

## Production Validation

Deployment does not by itself mark Bridge V1 `Active`.

Run the production test matrix after activation:

1. Unauthenticated browser request is intercepted by Cloudflare Access or denied by the bridge.
2. Missing `Cf-Access-Jwt-Assertion` cannot reach bridge data.
3. Invalid, expired, wrong-issuer, or wrong-audience Access JWT is rejected.
4. A disagreement between the verified JWT email and the injected Access email header is rejected.
5. Unauthorized identity is denied by `ALLOWED_EMAIL`.
6. Authorized identity can reach `GET /health`.
7. Health reports `mode: read-only` and only a masked identity.
8. `GET /v1/context` returns source status plus minimized view-model data.
9. Private brain returns only active open-loop title / next gate / due trigger.
10. Calendar returns only title, start, end, and all-day status.
11. Gmail returns only minimized sender, subject, received time, and derived signals.
12. No Gmail body, snippet, attachment, Calendar description, attendee list, full private note, credentials, or unrelated private category reaches the browser.
13. POST, PUT, PATCH, and DELETE remain unavailable.
14. Responses retain `Cache-Control: no-store`.
15. Disconnect/reload clears private/live context from HUD memory.

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
- rotate/recreate the Access application if its audience or policy boundary is suspect;
- do not persist any returned private/live data into public GitHub as part of incident handling.

## Sovereignty Rule

```text
Deployment authority does not grant data authority.
Bridge access does not grant memory authority.
Read access does not grant write authority.
Edward remains final human authority.
```
