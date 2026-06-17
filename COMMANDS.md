# LUMAN GPT OS Commands

This file defines activation phrases Edward can use when asking ChatGPT/LUMAN to work from this repository.

## Core Repository Commands

### Use GitHub

When Edward says:

`Use GitHub`

or:

`Use GitHub. Update [file/path] with [content]`

ChatGPT should activate the LUMAN GitHub update workflow.

Use this file:

- `00_CORE/LUMAN_GITHUB_UPDATE_PROTOCOL.md`

Default behavior:

1. Identify the target repo file or likely vault.
2. Read the current file before updating when possible.
3. Create or update the smallest useful set of files.
4. Keep commit messages clear and future-readable.
5. Confirm the changed files and commit SHAs back to Edward.
6. Never store secrets, credentials, seed phrases, private financial details, employer-confidential data, or sensitive family records.

### Update LUMAN OS

When Edward says:

`Update LUMAN OS:`

followed by new information, ChatGPT should decide where the update belongs and prepare or commit the appropriate GitHub changes.

Use these files when relevant:

- `00_CORE/LUMAN_GITHUB_UPDATE_PROTOCOL.md`
- `00_CORE/ACTIVE_PRIORITIES.md`
- `00_CORE/OPEN_LOOPS.md`
- `07_KNOWLEDGE_PACKS/LUMAN_KNOWLEDGE_PACK.md`
- `06_SESSION_LOGS/`

Default behavior:

1. Classify the update as permanent, active, working canon, locked canon, task, open loop, or temporary.
2. Route the update to the correct vault or module.
3. Ask for clarification only if the update would be unsafe or impossible to place responsibly.
4. Otherwise, make the best practical update and report what changed.

### Create summary

When Edward says:

`Create summary`

ChatGPT should generate a LUMAN GitHub Update Packet.

Use this file:

- `00_CORE/LUMAN_CREATE_SUMMARY_PACKET_TEMPLATE.md`

Default behavior:

1. Summarize the session into a structured memory packet.
2. Identify main vault, secondary vaults, key decisions, permanent updates, active updates, tasks, open loops, and files to update.
3. Include exact Markdown for session logs, changelog entries, active priorities, open loops, and knowledge packs when useful.
4. Do not commit anything yet unless Edward also asks to commit it.

### Commit this summary to GitHub

When Edward says:

`Commit this summary to GitHub`

ChatGPT should convert the latest LUMAN GitHub Update Packet into repository changes.

Default behavior:

1. Create or update the session log.
2. Update the changelog.
3. Update active priorities.
4. Update open loops.
5. Update the relevant knowledge pack or module file.
6. Confirm changed files and commit SHAs.

### Open LUMAN OS

When Edward says:

`Open LUMAN OS`

ChatGPT should treat the repo as the active operating system and orient the session around the current state of:

- `README.md`
- `COMMANDS.md`
- `DEPLOYMENT_INDEX.md`
- `00_CORE/ACTIVE_PRIORITIES.md`
- `00_CORE/OPEN_LOOPS.md`
- `07_KNOWLEDGE_PACKS/LUMAN_KNOWLEDGE_PACK.md`

Default behavior:

1. Give Edward a concise status snapshot.
2. Show active priorities and open loops.
3. Suggest one next best action only when useful.

### Open [vault name]

When Edward says:

`Open Roseborn vault`

or:

`Open Lucid Syntax vault`

or another named vault, ChatGPT should locate the relevant module or vault folder and operate from that context.

Default behavior:

1. Search or open the most relevant folder/files.
2. Summarize the active state.
3. Continue the project using the correct canon, voice, and workflow rules.

## Project Workflow Commands

### Lucid Syntax promotion

When Edward says:

`Lucid Syntax promotion`

or:

`Lucid Syntax promotion for [song title]`

ChatGPT should activate the Lucid Syntax Promo Pro workflow.

Use these files:

- `lucid-syntax-promo-pro/deployment_instructions.md`
- `lucid-syntax-promo-pro/activation_prompt.md`
- `lucid-syntax-promo-pro/quick_start.md`
- `lucid-syntax-promo-pro/promo_output_format.md`
- `lucid-syntax-promo-pro/album_metadata.md`
- `lucid-syntax-promo-pro/platform_templates.md`
- `lucid-syntax-promo-pro/knowledge_manifest.md`
- `shared-core/luman_voice.md`
- `shared-core/edward_style_rules.md`
- `shared-core/project_index.md`

Default behavior:

1. Treat Lucid Syntax as the active project.
2. Use the Visionary era as the current campaign unless Edward says otherwise.
3. Use Paint as the default single focus if Edward does not name a song.
4. If Edward names a song, build the promo around that song.
5. Preserve the human-led positioning: human heart, AI vessel.
6. Do not lead with “AI band” or “AI music” unless Edward asks for transparent explanation.
7. Generate useful promotional material immediately.
8. Ask for clarification only when absolutely necessary.
9. Keep campaign pacing human, intentional, and not rushed.

Words That Breathe All-In-One Knowledge File:

Use:

`lucid-syntax-promo-pro/Lucid_Syntax_All_In_One_Knowledge_File_v5.txt`

as the main source for Words That Breathe era song promotions.

When Edward says:

`Lucid Syntax promotion for [Words That Breathe song title]`

use the all-in-one knowledge file for:

- Lyrics
- Song angle
- Best hook
- Engagement question
- Artwork filename
- Platform rules
- Backdrop prompt rules
- Hashtag defaults

Formatting rule:

All Lucid Syntax promotion outputs must use separate copy/paste text boxes for every major item.

Important rendering rule:

Do not wrap the full promotion package inside one large writing block, document block, canvas block, or single combined editable container.

Output each section as normal chat text with its own standalone unlabeled fenced copy/paste block.

Recommended outputs:

- TikTok captions
- YouTube lyric video descriptions
- Facebook posts
- X posts
- Instagram captions
- Pinterest captions
- DistroKid-style promo copy
- Lyric quote graphic prompts
- Spotify Canvas ideas
- Lyric video concepts
- Rollout calendars
- Campaign checklists

### Roseborn canon

When Edward says:

`Roseborn canon`

or:

`Update Roseborn canon:`

ChatGPT should activate the Roseborn Canon Guardian workflow and preserve continuity between locked canon and working canon.

Default behavior:

1. Identify whether Edward is locking canon or drafting working canon.
2. Keep new lore consistent with existing Roseborn architecture.
3. Preserve contradictions as open questions instead of silently overwriting canon.
4. Update the correct Roseborn vault files when Edward asks for GitHub commits.

### Life OS sync

When Edward says:

`Life OS sync`

or:

`Run Weekly Sync`

ChatGPT should activate Edward’s Life Operating System workflow.

Default behavior:

1. Provide a status snapshot.
2. Identify top priorities.
3. Review automation, budget, family, health, home, vehicle, and creative systems when relevant.
4. Convert durable changes into LUMAN OS updates when Edward asks.

### KIA service records

When Edward says:

`KIA service records`

or:

`Update KIA records:`

ChatGPT should activate the KIA Service Records workflow.

Default behavior:

1. Capture date, mileage, work performed, findings, cost, and next recommended action.
2. Separate completed work from open diagnostic items.
3. Preserve preventive maintenance context.
4. Avoid treating already-completed oil service as due unless date or mileage changes.

### Work quality dashboard

When Edward says:

`Work quality dashboard`

or:

`Quality analysis:`

ChatGPT should activate Edward’s work-quality/data-analysis workflow.

Default behavior:

1. Help structure measurement, defect, SPC, Minitab, process improvement, and dashboard work.
2. Keep employer-confidential data out of public GitHub files.
3. Store only generic templates, workflows, and non-sensitive knowledge in the repo.

### OMNI-Vault template

When Edward says:

`OMNI-Vault template`

or:

`Update OMNI-Vault:`

ChatGPT should activate the OMNI-Vault / Second Brain workflow.

Default behavior:

1. Classify information into the correct vault.
2. Distinguish permanent, active, draft, temporary, task, and open-loop items.
3. Use GitHub as the durable source of truth when Edward asks to commit updates.

## Command Shortcut List

- `Open LUMAN OS`
- `Use GitHub`
- `Update LUMAN OS:`
- `Create summary`
- `Commit this summary to GitHub`
- `Open Roseborn vault`
- `Open Lucid Syntax vault`
- `Lucid Syntax promotion`
- `Lucid Syntax promotion for [song title]`
- `Roseborn canon`
- `Update Roseborn canon:`
- `Life OS sync`
- `Run Weekly Sync`
- `KIA service records`
- `Update KIA records:`
- `Work quality dashboard`
- `Quality analysis:`
- `OMNI-Vault template`
- `Update OMNI-Vault:`
