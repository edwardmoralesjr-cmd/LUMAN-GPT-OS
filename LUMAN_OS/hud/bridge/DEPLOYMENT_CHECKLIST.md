# LUMAN Bridge Deployment Checklist

## 1. Configure the Stage 1 GitHub Environment

Create or open the GitHub Actions environment:

```text
luman-bridge-production
```

For bootstrap, configure only:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
HUD_ORIGIN
ALLOWED_EMAIL
```

Do not add private GitHub or Google source credentials to the bootstrap workflow.

## 2. Run Stage 1 Bootstrap

Run:

```text
Bootstrap LUMAN Bridge
```

Confirm `confirm_bootstrap`.

Expected result:

```text
Worker hostname created
private-source credentials absent
REQUIRE_CF_ACCESS=true
TEAM_DOMAIN/POLICY_AUD not yet active
bridge reads fail closed until Stage 2
```

## 3. Enable Cloudflare Access

Protect the deployed Worker with Cloudflare Access and restrict the policy to the approved identity.

Required production behavior:

```text
REQUIRE_CF_ACCESS=true
ALLOWED_EMAIL=<approved identity>
```

Do not disable Access enforcement in production.

## 4. Configure Access JWT Validation

After Access is enabled, record these protected GitHub environment variables:

```text
TEAM_DOMAIN
POLICY_AUD
```

`TEAM_DOMAIN` is the HTTPS Cloudflare Access team domain used as the JWT issuer and JWK source.

`POLICY_AUD` is the audience value for the Access application protecting this Worker.

The secure Worker entrypoint must validate:

```text
JWT signature
issuer == TEAM_DOMAIN
audience == POLICY_AUD
verified JWT email identity
optional injected email header agrees with JWT identity
```

## 5. Add the Private GitHub Read Token

Create a least-privilege token able to read only the private command-center repository needed by the bridge.

Store it as the encrypted GitHub Actions environment secret:

```text
LUMAN_PRIVATE_REPO_TOKEN
```

Do not create a GitHub Actions secret named `GITHUB_PRIVATE_TOKEN`; GitHub reserves the `GITHUB_` prefix. The activation workflow maps `LUMAN_PRIVATE_REPO_TOKEN` to the Worker's internal `GITHUB_PRIVATE_TOKEN` binding at deployment time.

Do not store the token in repository files or HUD browser code.

## 6. Add Google Read-Only OAuth

Issue the bridge refresh token with only:

```text
calendar.readonly
gmail.readonly
```

Store these as protected environment secrets:

```text
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN
```

No Calendar or Gmail write scopes are required by V1.

## 7. Run Stage 2 Activation

Run:

```text
Activate LUMAN Bridge Private Reads
```

Explicitly confirm:

```text
Cloudflare Access is enabled
Google OAuth is read-only
```

The workflow must refuse activation if `TEAM_DOMAIN`, `POLICY_AUD`, `LUMAN_PRIVATE_REPO_TOKEN`, or any required private/live-source credential is missing.

## 8. Verify Fail-Closed Authentication

Verify:

```text
Unauthenticated /health -> denied by Access / bridge
Missing Access JWT -> 401
Invalid/expired JWT -> 403
Wrong issuer -> 403
Wrong audience -> 403
JWT/header identity mismatch -> 403
Wrong allowed identity -> 403
Unknown Origin -> 403
POST /v1/context -> 405 read_only_bridge
Authenticated validated GET /health -> read-only health response
Authenticated validated GET /v1/context -> minimum-data response
```

## 9. Verify Data Minimization

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

## 10. Connect HUD

Enter the protected Worker URL into the HUD bridge field.

Use `Open Access Login`, authenticate, return to the HUD, and refresh sources.

The HUD stores only the bridge URL preference. It does not persist the returned private/live context.

## 11. Sovereignty Check

Confirm the UI still distinguishes:

```text
Calendar = schedule evidence, not capacity authority
Inbox = communication signals, not priority authority
Private open loops = remembered commitments, not identity authority
LUMAN = synthesis/recommendation
Edward = final authority
```

## Deployment Gate

Bridge V1 is considered Active only after authentication, JWT validation, source separation, minimum disclosure, and read-only behavior are verified in the production HUD.
