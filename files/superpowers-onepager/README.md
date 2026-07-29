# Superpowers — the install + the 4-move workflow, on one page

Superpowers ([github.com/obra/superpowers](https://github.com/obra/superpowers))
is an open-source framework that stops your coding agent from jumping straight
to code. It ships as 14 composable Markdown "skills" that trigger automatically
inside the agent and enforce one workflow: **brainstorm → plan → test-first →
two-stage review**. 263,036 GitHub stars as of 2026-07-29.

The honest part, up front: stars measure popularity, not code quality.
Superpowers imposes process and discipline — it does not make an AI that never
fails. What it changes is *where* failures surface: in a brainstorm, a plan, or
a failing test, instead of in your repo.

## The install

**Claude Code — one marketplace command:**

```
/plugin install superpowers@claude-plugins-official
```

Restart the session and the skills are live. (Alternative, via the project's
own marketplace: `/plugin marketplace add obra/superpowers-marketplace`, then
`/plugin install superpowers@superpowers-marketplace`.)

**Not on Claude Code?** Superpowers runs on 8+ agent harnesses — each has its
own short install, documented in the repo:

Claude Code · Codex (CLI + App) · Cursor · GitHub Copilot CLI · Kimi Code ·
OpenCode · Factory Droid · Antigravity

→ per-agent instructions: <https://github.com/obra/superpowers>

## The 4 moves, in plain language

1. **Brainstorm.** Before any solution exists, the agent interrogates the
   problem with you — what you're actually trying to do, what the constraints
   are, what "good" looks like. Bad ideas die here, where they're cheap.
2. **Plan.** The agent writes the plan down — which files, which steps, what
   done means — and you approve it before a single file changes. You review
   3 paragraphs instead of 400 lines.
3. **Test-first.** A failing test pins down "done" before the code that passes
   it is written (test-driven development). "It works" stops being the agent's
   opinion and becomes a green test.
4. **Two-stage review.** Finished work is checked twice: once against the spec
   (did it build the right thing?) and once for code quality (did it build the
   thing right?). Only then is it done.

The point of all four: every move produces something a human can veto *before*
the expensive mistake, not after.

## The 14 skills

The workflow above is delivered as these skills — each one a Markdown file the
agent loads automatically when the situation matches:

| # | Skill | What it does |
|---|-------|--------------|
| 1 | `brainstorming` | Interrogates the problem before any design is accepted |
| 2 | `writing-plans` | Turns the brainstorm into a written, reviewable plan |
| 3 | `executing-plans` | Works the plan step by step instead of freelancing |
| 4 | `test-driven-development` | Failing test first, then the code that passes it |
| 5 | `requesting-code-review` | Packages finished work for review |
| 6 | `receiving-code-review` | Takes review feedback and applies it systematically |
| 7 | `systematic-debugging` | Root-causes bugs methodically instead of guess-patching |
| 8 | `verification-before-completion` | Blocks "done" claims until the work is verified |
| 9 | `dispatching-parallel-agents` | Fans independent work out to parallel subagents |
| 10 | `subagent-driven-development` | Structures bigger builds around delegated subagents |
| 11 | `using-git-worktrees` | Isolates parallel work in git worktrees |
| 12 | `finishing-a-development-branch` | Lands a branch cleanly (tests, merge, tidy-up) |
| 13 | `using-superpowers` | Teaches the agent to find and apply the right skill |
| 14 | `writing-skills` | Lets you write new skills in the same format |

## The 8 supported agents

Claude Code, Codex (CLI + App), Cursor, GitHub Copilot CLI, Kimi Code,
OpenCode, Factory Droid, Antigravity — distributed via the Anthropic plugin
marketplace, with per-harness installs in the repo docs.

## One link

Everything above, plus the source: **<https://github.com/obra/superpowers>**

---

From **vektor** (@vektor.fm) — one AI teardown, every day. This one-pager backs
issue NO. 028: *"250,000 stars is popularity. Not proof."*
