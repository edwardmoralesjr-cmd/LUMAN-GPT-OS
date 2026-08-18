# LUMAN Authenticated Bridge Test Matrix

## Static / CI Tests

```text
Worker JavaScript syntax ................ required PASS
HUD JavaScript syntax ................... required PASS
Unexpected V1 write-method route ........ required NONE
read_only_bridge guard .................. required PRESENT
no-store response policy ................ required PRESENT
common committed-secret patterns ........ required NONE
```

## Runtime Authentication Tests

```text
No Access identity ...................... 401 / Access denial
Wrong Access identity ................... 403
Allowed Access identity ................. PASS
Unknown browser Origin .................. 403
Allowed HUD Origin ...................... PASS
```

## Source Isolation Tests

### Private Brain

```text
Reads only private open-loop state ....... PASS required
Returns title / next gate / due only ..... PASS required
Returns full private note body ........... MUST BE NO
```

### Calendar

```text
Read-only primary-calendar window ........ PASS required
Returns title/start/end/all-day only ..... PASS required
Returns descriptions/attendees ........... MUST BE NO
Write scope required ..................... MUST BE NO
```

### Gmail

```text
Recent bounded Inbox metadata ............ PASS required
Promotions/Spam/Trash generic scan ....... EXCLUDED
Bodies/snippets/attachments .............. MUST BE NO
Label/bridge ranking as priority authority MUST BE NO
Write scope required ..................... MUST BE NO
```

## HUD Tests

```text
Bridge URL only persisted locally ........ PASS required
Private/live response persisted locally .. MUST BE NO
Disconnect clears rendered context ....... PASS required
Source errors visible .................... PASS required
Missing source data guessed .............. MUST BE NO
Calendar free time interpreted as capacity MUST BE NO
Inbox signals interpreted as human priority MUST BE NO
```

## Release Rule

A bridge build cannot move from `Built / Awaiting Deployment` to `Active` until production authentication and source-minimization checks pass.
