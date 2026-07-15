# The agent starter kit — your first Claude Code agent in 60 seconds

An agent is an employee hired for ONE job. This kit is the pattern behind the
team we run a daily video channel with — a pitch agent, a build agent, and a
review judge (the review judge is a read-only agent exactly like the one in
this kit; the pitch and build steps run as skills — same one-job idea, and
you'll want both). Cut down to the smallest thing that works, so your first
agent exists in the next minute.

**What's in the box**

| File | What it is | Where it goes |
| --- | --- | --- |
| `agent-template.md` | Fill-in-the-blanks agent definition (the job contract) | `.claude/agents/<your-agent-name>.md` |
| `tools-allowlist.md` | What tools to grant, and the safety logic | keep next to your notes — it's the reference |
| `starter-skill.md` | A complete, runnable first skill: the daily review | `.claude/skills/daily-review/SKILL.md` |

## The 60-second setup

From your project root (the folder you run `claude` in):

```bash
mkdir -p .claude/agents .claude/skills/daily-review
# 1. the agent — rename it to the job you're hiring for
cp agent-template.md .claude/agents/review-judge.md
# 2. the skill — the filename MUST be SKILL.md
cp starter-skill.md .claude/skills/daily-review/SKILL.md
```

Then:

1. Open `.claude/agents/review-judge.md` and fill the `[bracketed]` blanks —
   who it is, its one job, what done looks like. Every blank has inline
   guidance. Pick its tools with `tools-allowlist.md` open (start read-only).
2. Start (or restart) a Claude Code session in the project.
3. Invoke:
   - **The skill:** type `/daily-review` — or just say "run the daily review".
   - **The agent:** say "use the review-judge agent on this diff" — or let
     Claude delegate to it automatically when a task matches its
     `description` (that's what the description is for — write it like a
     hiring ad).
   - `/agents` lists and manages everything you've hired.

That's the whole install. No plugin, no config server, no restart-the-world —
Claude Code reads `.claude/agents/` and `.claude/skills/` from the project
automatically.

## The one idea that makes agents work

**One agent, one job.** Our pitch agent pitches — it never builds. The build
agent builds — it never grades its own work. The review judge judges — it
can't edit a file even if it wants to (we didn't grant it the tools). The
moment you catch yourself writing "and also..." into an agent's job
description, that's two employees. Hire the second one — it's another
30-second file.

Three things define each hire:

1. **The .md file** — who it is, its one job, what done looks like
   (`agent-template.md`)
2. **Its tools** — what it may touch, least privilege (`tools-allowlist.md`)
3. **Its skills** — the workflows it repeats on demand (`starter-skill.md`)

## Agent vs. skill (30-second version)

- An **agent** is WHO — a separate worker with its own instructions and its
  own tool keycard. Claude hands work to it and gets a result back.
- A **skill** is HOW — a written-down procedure any session can run the same
  way every time (`/daily-review`).

Employees and SOPs. You want both; you start with one of each — and this kit
is one of each.

---

From **vektor** (@vektor.fm) — one AI teardown, every day. This kit backs
issue NO. 013: *"An AI agent is just an employee with one job."*
