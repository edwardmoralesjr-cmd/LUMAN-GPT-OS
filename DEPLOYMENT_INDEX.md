# LUMAN GPT OS Deployment Index

## Core LUMAN OS Protocols

- `00_CORE/LUMAN_DASHBOARD.md`
- `00_CORE/LUMAN_GITHUB_UPDATE_PROTOCOL.md`
- `00_CORE/LUMAN_CREATE_SUMMARY_PACKET_TEMPLATE.md`
- `00_CORE/LUMAN_LOOP_ENGINEERING_SYSTEM.md`
- `00_CORE/LUMAN_LOOP_COMMANDS.md`
- `00_CORE/LUMAN_DAILY_NEXT_MOVE_LOOP.md`
- `00_CORE/ACTIVE_PRIORITIES.md`
- `00_CORE/OPEN_LOOPS.md`
- `00_CORE/CHANGELOG.md`
- `07_KNOWLEDGE_PACKS/LUMAN_KNOWLEDGE_PACK.md`

## Deployment-Ready GPTs

- Roseborn Canon Guardian
- Lucid Syntax Promo Pro
- Life Operating System
- OMNI-Vault GPT
- KIA Service Records GPT
- Work Quality Dashboard GPT

## Activation Commands

Edward can use short command phrases to activate a GPT workflow.

### Open LUMAN dashboards

Activates the LUMAN OS dashboard layer.

Use this file:

- `00_CORE/LUMAN_DASHBOARD.md`

Default behavior:

1. Show the current system status.
2. Summarize active priorities.
3. Summarize open loops.
4. Show vault status.
5. List the most useful available commands.
6. Give one next best action.

### Use GitHub

Activates the LUMAN GitHub update workflow.

Use this file:

- `00_CORE/LUMAN_GITHUB_UPDATE_PROTOCOL.md`

Default behavior:

1. Treat the repository as the source of truth for LUMAN GPT OS instructions and reusable systems.
2. Read the current target file before updating it when possible.
3. Keep updates clean, specific, and version-aware.
4. Avoid storing secrets, private financial details, employer-confidential data, or sensitive family records.
5. Use platform-neutral language unless Edward names a specific tool for the task.

### Update LUMAN OS

Activates a direct memory/update workflow.

Use these files when relevant:

- `00_CORE/LUMAN_GITHUB_UPDATE_PROTOCOL.md`
- `00_CORE/ACTIVE_PRIORITIES.md`
- `00_CORE/OPEN_LOOPS.md`
- `07_KNOWLEDGE_PACKS/LUMAN_KNOWLEDGE_PACK.md`
- `06_SESSION_LOGS/`

Default behavior:

1. Determine which vault or module the update belongs to.
2. Preserve durable facts in the correct knowledge pack or module file.
3. Add active work to `00_CORE/ACTIVE_PRIORITIES.md` when it affects current focus.
4. Add unresolved work to `00_CORE/OPEN_LOOPS.md` when it needs follow-up.
5. Create a session log when the update represents a meaningful conversation or system change.

### Create summary

Activates the LUMAN session-summary workflow.

Use this file:

- `00_CORE/LUMAN_CREATE_SUMMARY_PACKET_TEMPLATE.md`

Default behavior:

1. Generate a LUMAN GitHub Update Packet.
2. Identify the main vault, secondary vaults, permanent updates, active updates, tasks, open loops, and files to update.
3. Provide exact Markdown for session logs, changelogs, active priorities, open loops, and knowledge packs when relevant.
4. Keep the packet usable for direct GitHub updates.

### Commit this summary to GitHub

Activates the summary-commit workflow.

Default behavior:

1. Convert the latest LUMAN GitHub Update Packet into real repository changes.
2. Create or update the session log, changelog, open loops, active priorities, and knowledge pack files.
3. Confirm changed files and commit SHAs back to Edward.
4. Do not add sensitive information to public repository files.

### Loop Engineering Commands

Activates the LUMAN loop engineering layer.

Use these files:

- `00_CORE/LUMAN_LOOP_ENGINEERING_SYSTEM.md`
- `00_CORE/LUMAN_LOOP_COMMANDS.md`
- `00_CORE/LUMAN_DAILY_NEXT_MOVE_LOOP.md`

Available commands:

- `/start daily next move loop`
- `/start daily next move loop: [project]`
- `/start loop: [loop name]`
- `/run quality loop on this`
- `/run decision loop`
- `/upgrade luman os`

Default behavior:

1. Load the relevant LUMAN context or vault.
2. Choose the smallest useful next action.
3. Execute or draft the action when possible.
4. Check the result for clarity, usefulness, safety, and project fit.
5. Log what changed.
6. Name the next step.

Core loop formula:

```text
LOAD -> CHOOSE -> ACT -> CHECK -> LOG -> NEXT
```

### Lucid Syntax promotion

Activates:

`lucid-syntax-promo-pro/`

Primary files:

- `lucid-syntax-promo-pro/deployment_instructions.md`
- `lucid-syntax-promo-pro/activation_prompt.md`
- `lucid-syntax-promo-pro/quick_start.md`
- `lucid-syntax-promo-pro/promo_output_format.md`
- `lucid-syntax-promo-pro/album_metadata.md`
- `lucid-syntax-promo-pro/platform_templates.md`
- `lucid-syntax-promo-pro/knowledge_manifest.md`

All-In-One Knowledge File

Primary Words That Breathe knowledge file:
"lucid-syntax-promo-pro/Lucid_Syntax_All_In_One_Knowledge_File_v5.txt"

Use this file when building Words That Breathe song-specific promo packs.

This file supports:
- Reduced Custom GPT upload count
- Song-angle lookup
- Lyrics lookup
- Artwork filename matching
- Platform-specific promotion
- Backdrop prompt generation
- Brand voice consistency

Default behavior:

Generate Lucid Syntax promotional material using the standard promo package format.

If Edward says only:

`Lucid Syntax promotion`

default to the Visionary era and Paint as the single focus.

If Edward says:

`Lucid Syntax promotion for [song title]`

make that song the promo focus.

Required output sections:

1. Campaign Angle
2. Emotional Hook
3. Main Promo Caption
4. Platform Versions With Titles
5. Short-Form Video Script
6. Visual Direction
7. CTA
8. Exactly 5 Hashtags
9. Next Best Use

Formatting rule:

All full Lucid Syntax promotion packages must use separate copy/paste text boxes.

Important rendering rule:

Do not wrap the full promotion package inside one large writing block, document block, canvas block, or single combined editable container.

Output each section as normal chat text with its own standalone unlabeled fenced copy/paste block.

Each major output item should appear under its own heading and inside its own unlabeled fenced copy/paste block.

Do not combine the whole promo package into one large block.

Clean box rule:

Use unlabeled fenced copy/paste blocks.

## How To Use

1. Open the desired GPT folder in this repository.
2. Copy the full content of `deployment_instructions.md` into the Custom GPT instruction field in ChatGPT.
3. Upload or reference the supporting knowledge files from that same GPT folder, such as `locked_canon.md`, `album_metadata.md`, or `security_rules.md`.
4. Run the test prompts included in the deployment file to verify behavior.
5. Record any changes, improvements, or issues in the GPT folder’s `changelog.md`.

## Safety Reminder

Do not upload or store passwords, API keys, seed phrases, private keys, live financial balances, confidential employer data, or private family records in this repository or in any Custom GPT connected to it.

Each deployment file contains strict safety boundaries appropriate to its domain. Always follow those boundaries when using the GPTs.
