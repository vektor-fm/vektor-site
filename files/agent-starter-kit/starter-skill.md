---
# ── SAVE THIS FILE AS: .claude/skills/daily-review/SKILL.md ────────────
# A skill = a named, repeatable workflow. The file lives in its own folder
# (the folder name is the skill name) and MUST be called SKILL.md.
# Invoke it by typing /daily-review in Claude Code — or just ask ("run the
# daily review"); Claude matches the request against the description below.
name: daily-review
description: End-of-day review of everything that changed in this repo today. Checks the working tree, unpushed commits, tests, and leftover debris, then returns a strict GO / FIX-FIRST verdict with specific actions. Use at the end of a work session, before merging, or whenever asked "are we good to stop here?".
---

You are running the **daily review** — the end-of-day quality gate for this
repo. Act like a strict reviewer, not a cheerleader: your job is to find the
thing that will hurt tomorrow, while it still costs nothing to fix today.

## Every run

Work through ALL five checks, in order. Actually run the commands — never
answer any check from memory or from earlier conversation.

1. **The working tree.** Run `git status`. Anything uncommitted? For each
   change, decide: commit it (with a real message), or flag it as
   deliberately in-progress. Untracked files you don't recognize are a
   finding, not noise.
2. **The backup gap.** Run `git log --branches --not --remotes --oneline`.
   Every commit listed exists on this machine only — a laptop away from
   gone. Unpushed work is always a finding.
3. **The checks.** Run the repo's test / lint / build command (whatever this
   project uses — check package.json scripts, Makefile, or CI config if you
   don't know). Red is an automatic FIX-FIRST. No test command at all: note
   it once, move on.
4. **The debris.** Grep today's changed files (`git diff --name-only` +
   the working tree) for leftovers: `TODO`, `FIXME`, `console.log`,
   commented-out blocks, debug flags, hardcoded secrets or API keys.
   Secrets are an automatic FIX-FIRST.
5. **The promise check.** Read today's commit messages
   (`git log --since=midnight --oneline`). Does what shipped match what
   they claim? A message that says "fix X" on a commit that half-fixes X
   is tomorrow's confusion.

## What done looks like

Report EXACTLY this, nothing else:

```
DAILY REVIEW — <date>
VERDICT: GO | FIX-FIRST

FINDINGS (worst first):
1. [check #] <what's wrong> → <the specific action, as a runnable command where possible>

CLEAN: <the checks that passed, one line>
```

Verdict rule: any secret, red test, or unpushed commit ⇒ FIX-FIRST.
Otherwise GO. Maximum 6 findings — if there are more, report the worst 6.

## Rules

- **Resist "looks fine".** Reviewers drift toward approval. Default to
  reporting a real finding over waving the day through — an empty findings
  list must be earned, never assumed.
- **Read-only.** Report and recommend; never commit, push, or edit anything
  during the review itself. The human (or the next session) acts on it.
- **Every finding gets an action.** A finding without a "→ do this" line
  is gossip, not review.
