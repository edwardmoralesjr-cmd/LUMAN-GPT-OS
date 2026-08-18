# LUMAN Bridge Deployment Checklist

## 1. Protect the Worker First

Before exposing `/v1/context`, place the Worker behind Cloudflare Access and restrict access to Edward's approved identity.

Required bridge behavior in production:

```text
REQUIRE_CF_ACCESS=true
ALLOWED_EMAIL=<approved identity>
```

Do not disable Access enforcement in production.

## 2. Set Browser Origin

Set `HUD_ORIGIN` to the exact HTTPS origin that hosts the LUMAN HUD.

If more than one approved HUD origin is needed, use a comma-separated list.

The Worker rejects unknown browser origins.

## 3. Private GitHub Token

Create a least-privilege token able to read only the private command-center repository needed by the bridge.

Store it as the encrypted Worker secret:

```text
GITHUB_PRIVATE_TOKEN
```

Do not store the token in GitHub repository files or HUD browser code.

## 4. Google Read-Only OAuth

Issue the bridge refresh token with only:

```text
calendar.readonly
gmail.readonly
```

Store these as protected Worker secrets:

```text
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN
```

No Calendar or Gmail write scopes are required by V1.

## 5. Deploy Worker

From `LUMAN_OS/hud/bridge/`:

```bash
npm install
npm run check
npx wrangler secret put GITHUB_PRIVATE_TOKEN
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler secret put GOOGLE_REFRESH_TOKEN
npx wrangler deploy
```

Set non-secret protected configuration such as `HUD_ORIGIN` and `ALLOWED_EMAIL` through the Cloudflare deployment environment rather than committing personal values to the public repository.

## 6. Verify Fail-Closed Behavior

Verify:

```text
Unauthenticated /health -> denied by Access / bridge
Wrong identity -> 403
Unknown Origin -> 403
POST /v1/context -> 405 read_only_bridge
Authenticated GET /health -> read-only health response
Authenticated GET /v1/context -> minimum-data response
```

## 7. Verify Data Minimization

Inspect the browser network response and confirm it contains no:

```text
raw private note body
private source paths
Gmail body/snippet/attachments
recipient lists
Calendar descriptions/attendees
credentials/tokens
financial/health/vehicle/home details
```

## 8. Connect HUD

Enter the protected Worker URL into the HUD bridge field.

Use `Open Access Login`, authenticate, return to the HUD, and refresh sources.

The HUD stores only the bridge URL preference. It does not persist the returned private/live context.

## 9. Sovereignty Check

Confirm the UI still distinguishes:

```text
Calendar = schedule evidence, not capacity authority
Inbox = communication signals, not priority authority
Private open loops = remembered commitments, not identity authority
LUMAN = synthesis/recommendation
Edward = final authority
```

## Deployment Gate

Bridge V1 is considered deployed only after authentication, source separation, minimum disclosure, and read-only behavior are verified in the production HUD.
