# LUMAN Authenticated Bridge Test Matrix

## Static / CI Tests

```text
Bridge dependencies install .............. required PASS
Worker JavaScript syntax ................. required PASS
Worker Wrangler dry-run bundle ........... required PASS
HUD JavaScript syntax .................... required PASS
Secure entrypoint is configured .......... required PRESENT
Cf-Access-Jwt-Assertion validation ........ required PRESENT
JWT issuer/audience validation ............ required PRESENT
Unexpected V1 write-method route .......... required NONE
read_only_bridge guard .................... required PRESENT
no-store response policy ................. required PRESENT
common committed-secret patterns .......... required NONE
```

## Runtime Authentication Tests

### Stage 1 Bootstrap State

```text
Private-source credentials present ........ MUST BE NO
TEAM_DOMAIN / POLICY_AUD present ........... MUST BE NO
GET /health before Access activation ....... fail closed / 503 bridge config denial
GET /v1/context before activation .......... MUST NOT expose source data
```

### Stage 2 Production State

```text
No Cloudflare Access session .............. Access denial / 401
Missing Access JWT at Worker ............... 401
Invalid/expired Access JWT ................. 403
Wrong JWT issuer ........................... 403
Wrong JWT audience ......................... 403
JWT/header identity mismatch ............... 403
Wrong allowed identity ..................... 403
Allowed validated identity ................. PASS
Unknown browser Origin ..................... 403
Allowed HUD Origin ......................... PASS
```

## Source Isolation Tests

### Private Brain

```text
Reads only private open-loop state ......... PASS required
Returns title / next gate / due only ....... PASS required
Returns full private note body ............. MUST BE NO
```

### Calendar

```text
Read-only primary-calendar window .......... PASS required
Returns title/start/end/all-day only ....... PASS required
Returns descriptions/attendees ............. MUST BE NO
Write scope required ....................... MUST BE NO
```

### Gmail

```text
Recent bounded Inbox metadata .............. PASS required
Promotions/Spam/Trash generic scan ......... EXCLUDED
Bodies/snippets/attachments ................ MUST BE NO
Label/bridge ranking as priority authority . MUST BE NO
Write scope required ....................... MUST BE NO
```

## HTTP Boundary Tests

```text
GET /health ................................ PASS for validated identity
GET /v1/context ............................ PASS for validated identity
POST /v1/context ........................... 405 read_only_bridge
PUT /v1/context ............................ 405 read_only_bridge
PATCH /v1/context .......................... 405 read_only_bridge
DELETE /v1/context ......................... 405 read_only_bridge
Cache-Control .............................. no-store
```

## HUD Tests

```text
Bridge URL only persisted locally .......... PASS required
Private/live response persisted locally .... MUST BE NO
Disconnect clears rendered context ......... PASS required
Source errors visible ...................... PASS required
Missing source data guessed ................ MUST BE NO
Calendar free time interpreted as capacity . MUST BE NO
Inbox signals interpreted as human priority  MUST BE NO
```

## Release Rule

A bridge build cannot move from `Built / Awaiting Deployment` to `Active` until production authentication, JWT validation, source-minimization, and read-only checks pass.
