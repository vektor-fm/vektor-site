# CLAUDE.md or skill? The sorting rule

vektor /// no. 058 · 2026-09-30 · one page

## The rule, in Anthropic's words

> "Keep it to facts Claude should hold in every session: build commands, conventions, project layout, 'always do X' rules. If an entry is a multi-step procedure or only matters for one part of the codebase, move it to a skill or a path-scoped rule instead."
>
> code.claude.com/docs/en/memory (read 2026-09-29)

## Why it matters

- CLAUDE.md is loaded into context at the start of every session, in full (same page).
- A skill is not. At startup Claude Code loads only a listing of skill names and descriptions; the SKILL.md body loads when your request matches the description, then stays in the conversation for the rest of the session (code.claude.com/docs/en/skills, read 2026-09-29).
- So a procedure in CLAUDE.md costs context in every session. The same procedure in a skill costs its name and description until the day you need it.

## Stays in CLAUDE.md

- Build, test and run commands you use most days.
- Conventions: naming, style, branching.
- Project layout: where things live.
- "Always do X" and "never do Y" rules that apply every session. Example from mine: never `git add -A`, stage explicit paths.

## Moves to a skill

- A multi-step procedure you run on one kind of day: a release checklist, a pre-delivery gate, a migration runbook.
- Reference material only one task needs.
- Anything that only matters for one part of the codebase (or use a path-scoped rule for that).

## The test, one question per block

1. Would a session that never touches this task be worse off without it? If no, it can leave CLAUDE.md.
2. Is it a sequence of steps, not a standing rule? Then it is a skill.
3. Does it only apply to one folder? Then it is a path-scoped rule.

## Writing the description so it fires

- Say what it does, then "Use when asked to ..." with the verbs you would type. Mine: "Use when asked to gate, QA, check, or vet a rendered vektor video".
- Front-load the trigger words: description + when_to_use are cut at 1,536 characters in the listing.
- If it never fires, the description is the first thing to check: Claude makes the match, so it needs your words (docs, "Skill not triggering").

## What I measured on my own repo

Counted with `wc`, 2026-09-29/30:

| | before | after |
|---|---|---|
| Three CLAUDE.md files (user, projects, repo) | 492 lines | 468 lines |
| The moved block (gates + pipeline order) | 24 lines, 204 words in CLAUDE.md | 57 words of name + description in the skill listing |

The skill file itself is `gate-video-SKILL.md` in this folder, exactly as moved on 2026-09-29. Its commands are mine and some point at a render system I have since frozen: keep the shape, swap in your own steps. A blank version is `SKILL-template.md`.
