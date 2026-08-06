# The Analyst — a research loop that compounds

From Vektor NO. 032, "the state file".

Most people build an agent that does research well once. The interesting
version is the one whose fifth run is better than its first, and the thing that
makes that true is boring: **a file it writes to and reads back.**

## What's in here

| file | what it is |
|---|---|
| `SKILL.md` | the agent skill — drop it in and invoke it |
| `state-file.md` | the template for the memory. Copy to `state.md` and keep it forever |

## Install

Put `SKILL.md` where your agent looks for skills:

```
~/.claude/skills/analyst/SKILL.md
```

or, for one project only:

```
<your-project>/.claude/skills/analyst/SKILL.md
```

Then copy the state template next to wherever you want the memory to live:

```
cp state-file.md state.md
```

Open `SKILL.md` and set your own weights in the `## Framework` table before the
first run. The numbers shipped are placeholders. **Adopting someone else's
weights unexamined defeats the whole mechanism** — the loop corrects *your*
judgement, so it needs yours to start with.

## The four parts

1. **A weighted framework** — every candidate scored identically, including the
   ones you already like.
2. **A state file** — append-only, so run 5 can see runs 1 through 4.
3. **A checker** — a second pass whose job is to attack the first pass, not
   confirm it.
4. **A schedule** — it runs whether or not you remember to start it.

Drop any one of these and it stops compounding. The state file is the one people
skip, and it is the one that matters.

## The honest part

This produces a ranked shortlist and the reasoning behind it. It does not tell
you what to do, and it is **not financial advice** — if you point it at markets,
a scoring framework organises your judgement, it does not replace it, and past
outcomes do not predict future ones.

Figures it cannot source stay labelled `unverified`. That is deliberate: a
research system that hides its gaps is worse than no system, because you will
trust it.

---

*vektor /// no. 032 · [vektor.fm](https://vektor.fm)*
