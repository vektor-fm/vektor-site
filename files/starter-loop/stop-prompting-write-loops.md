# Stop prompting. Write loops.

One page on **loop engineering** — the shift Boris Cherny, head of Claude Code,
describes as the real skill now. It isn't "write a better prompt." It's: stop
one-shot prompting, and instead write a **loop** that prompts the model, checks
the result against a done-condition, and re-runs until the work actually passes.

*(Context, cited honestly: Fortune reported on June 11, 2026 that Claude Code
grew from nothing to a flagship product in roughly eight months. Cherny leads
that product; he did not build it alone. This page is our plain-English take on
the loop idea, not a quote from him.)*

---

## The problem with one-shot prompting

You write a careful prompt. The model does one pass. You read the output, spot
what's wrong, and write *another* careful prompt. **You are the loop** — the
slow part, the part that gets bored, the part that stops checking on pass four.

A one-shot prompt has no idea whether it succeeded. It hands you text and moves
on. Every check of "is this actually done?" falls back on you, by hand, every
time.

## The fix: make the model close its own loop

Move the check into code. The pattern is four steps that repeat:

1. **Plan / prompt** — hand the model the task, plus (after the first pass) the
   exact output of the last check. Concrete failure text beats "try again."
2. **Run** — let it do one turn of real work with tools (edit files, run
   commands).
3. **Check** — run a **done-condition**: any command that exits 0 only when the
   work is genuinely finished. Tests. A build. A linter. A `curl` that must
   return `200`. The model does not get to *declare* victory — the check does.
4. **Repeat** — if the check fails, feed its output back in and loop. If it
   passes, stop. If you hit a cap, stop and tell the human.

That's the whole idea. The included `agent-loop.sh` / `agent-loop.py` is
exactly this — about 20 lines of real, runnable loop, no framework.

## The one line that matters most: the done-condition

```bash
CHECK="npm test"        # or: pytest -q · npm run build · ./verify.sh · curl -fsS localhost:3000/health
```

If you can't write this line, you don't yet know what "done" means — and
neither will the model. **A loop is only as honest as its check.** A vague
check ("looks right") loops forever or stops early. A real check — one that was
already telling you the truth before any AI was involved — turns the model from
a text generator into something that keeps working until the bar is met.

Corollary: **never let the model edit its own check.** If the task is "make the
tests pass," tell it to fix the source, not the tests — or a stuck loop will
"win" by deleting the assertion. (The starter loop's default TASK says exactly
this.)

## Why the cap exists

Every loop needs a hard `MAX_ITERS`. A loop without a cap is a bill without a
cap, and a task that can't converge in a few passes is a signal, not a reason
to raise the number. When you hit the cap, the fix is almost never "more
iterations" — it's a **sharper TASK** or a **tighter CHECK**. Fix one of those.

## When a loop is the wrong tool

Honesty check — loops don't fix everything:

- **No real done-condition?** If success is subjective ("make it feel
  premium"), you can't write `CHECK`. Keep a human in the loop, or find a proxy
  the human trusts.
- **Each pass is expensive or irreversible** (sends emails, spends money, moves
  prod)? Don't auto-loop it. Loop in a sandbox; gate the real action behind a
  person.
- **The task is genuinely one-shot** (a quick rename, a single answer)? A loop
  is overhead. Just prompt.

## Try it in 60 seconds

```bash
# in a repo that has a test command, with Claude Code installed:
TASK="Fix the failing tests. Edit the source, not the tests." \
CHECK="npm test" \
MAX_ITERS=5 \
bash agent-loop.sh
```

Watch it plan → run → check → repeat, and stop itself the moment the check goes
green. Then change `CHECK` to whatever "done" means for your next task. That's
loop engineering.

---

From **vektor** (@vektor.fm) — one AI teardown, every day. This page backs
issue NO. 015: *"The head of Claude Code writes loops, not prompts."*
