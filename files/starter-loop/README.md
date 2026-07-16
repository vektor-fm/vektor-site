# The starter loop — plan → run → check → repeat

Stop one-shot prompting. This is **loop engineering** in the smallest honest
form: about 20 lines that prompt an AI CLI, check the result against a real
done-condition, and re-run until the check passes — the pattern Boris Cherny,
head of Claude Code, points to as the actual skill now.

**What's in the box**

| File | What it is |
| --- | --- |
| `agent-loop.sh` | The loop, in bash. Runnable as-is. |
| `agent-loop.py` | The same loop, in Python — for Windows or no-bash. Standard library only. |
| `stop-prompting-write-loops.md` | The one-page why: the pattern, the done-condition, when a loop is the wrong tool. |

## The 60-second run

You need a project with a **done-condition** — a command that exits `0` only
when the work is finished (your tests, a build, a linter, a health check) — and
an AI CLI that can edit the project. Default is [Claude
Code](https://claude.com/claude-code)'s `claude -p`.

```bash
# from the project root:
TASK="Fix the failing tests. Edit the source, not the tests." \
CHECK="npm test" \
MAX_ITERS=5 \
bash agent-loop.sh
```

or the Python twin:

```bash
TASK="..." CHECK="pytest -q" MAX_ITERS=5 python agent-loop.py
```

Watch it **plan → run → check → repeat**, feeding each failure back in, and
stop itself the moment the check goes green.

## The three knobs

- **`TASK`** — what you want done, plain English. Tell it to fix the *source*,
  not the check, or a stuck loop will "win" by deleting the test.
- **`CHECK`** — the done-condition. The most important line. If you can't write
  it, you don't yet know what "done" means — and neither will the model. Point
  it at a command that was already telling you the truth before any AI was
  involved.
- **`MAX_ITERS`** — the hard cap. A loop without a cap is a bill without a cap.
  Hitting it means your TASK or CHECK is too vague, not that you need more
  iterations.

## The one idea

**The model doesn't decide it's done. The check does.** A one-shot prompt has
no idea whether it succeeded and hands the verifying back to you, by hand, every
time. Move the check into code and the model keeps working — against a bar it
can't fake — until the bar is met. That's the whole shift from prompting to
loops.

Swap `AI="claude -p"` for any coding CLI that takes a prompt argument; the loop
doesn't care which model runs inside it.

---

From **vektor** (@vektor.fm) — one AI teardown, every day. This kit backs issue
NO. 015: *"Stop prompting. Write loops."*
