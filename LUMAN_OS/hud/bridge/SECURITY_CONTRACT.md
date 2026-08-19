# LUMAN Bridge Security Contract

## Constitutional Constraint

The bridge exists to increase usable context without transferring authority or exposing unnecessary private data.

```text
Minimum necessary data
Explicit source ownership
Read-only V1
Fail closed
No silent persistence
No secret-in-repository storage
```

## Allowed V1 Retrieval

### Private Brain

Only the private `STATE/OPEN_LOOPS.md` source is read by V1.

Returned fields are limited to:

```text
title
next_gate
due_trigger
```

The bridge does not return source path, note body, family details, financial details, health details, vehicle/home details, or unrelated vault content.

### Google Calendar

Returned fields are limited to:

```text
opaque event id
title
start
end
all_day
```

V1 does not return:

```text
description
attendees
organizer email
conference data
attachments
private extended properties
```

### Gmail

The list query is bounded to the recent Inbox and excludes Promotions, Spam, and Trash for the generic HUD view.

Returned fields are limited to:

```text
opaque message id
minimized sender label
subject
received_at
metadata-derived signals
priority_authority=false
```

V1 does not retrieve or return:

```text
message body
snippet
attachments
full recipient lists
thread body
raw headers beyond From/Subject/Date
```

Gmail labels and bridge ranking are weak context signals only. They are not human-priority authority.

## Authentication

Production mode requires Cloudflare Access in front of the Worker.

The secure entrypoint requires `Cf-Access-Jwt-Assertion` and validates its signature against the Access JWK set, its issuer against `TEAM_DOMAIN`, and its audience against `POLICY_AUD`. The authenticated email is taken from the verified JWT. If Cloudflare also supplies `Cf-Access-Authenticated-User-Email`, a disagreement between that header and the verified JWT identity is rejected.

The verified email is then restricted by `ALLOWED_EMAIL` as a second identity boundary.

Expected failures:

```text
missing Access JWT -> 401
invalid/expired/wrong-issuer/wrong-audience JWT -> 403
JWT/header identity mismatch -> 403
verified identity not allowed -> 403
missing production JWT configuration -> fail closed
```

Local development bypass is permitted only when:

```text
REQUIRE_CF_ACCESS=false
hostname is localhost or 127.0.0.1
DEV_AUTH_EMAIL is configured
```

Never use that bypass in production.

## CORS

The bridge accepts browser requests only from `HUD_ORIGIN` values configured outside source control.

Unknown browser origins receive `403`.

## Persistence

The Worker has no durable storage binding in V1.

Authenticated context responses use:

```text
Cache-Control: no-store
Pragma: no-cache
```

The HUD should treat bridge data as disposable session context and should not copy it into public GitHub state.

## Secrets

The following credentials must exist only in protected secret/config stores:

```text
GitHub Actions environment secret:
LUMAN_PRIVATE_REPO_TOKEN

Worker runtime secret binding created from it:
GITHUB_PRIVATE_TOKEN

Additional protected secrets:
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN
```

`LUMAN_PRIVATE_REPO_TOKEN` is the GitHub-side name because GitHub Actions reserves the `GITHUB_` prefix for secrets/configuration. The activation workflow maps it to the existing Worker binding only at deployment time.

Credentials must never be placed in:

```text
GitHub Markdown values
HUD JavaScript
browser localStorage/sessionStorage
query strings
transaction logs
public build artifacts
```

## Actions

V1 has no write routes.

Any future action bridge must be a separate gate and must preserve:

- explicit action intent;
- sovereignty classification;
- source-specific write authorization;
- transaction/provenance reporting;
- cancellation/refusal capability;
- no value/goal inference as authorization.

## Audit Rule

A connected source proves availability, not permission to persist or act.

## Status

Status: Active V1 security contract
Updated: 2026-08-19
