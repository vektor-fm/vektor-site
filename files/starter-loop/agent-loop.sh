#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# starter-loop — plan → run → check → repeat, until a done-condition passes.
#
# The pattern behind "loop engineering": stop one-shot prompting. Write a loop
# that PROMPTS the model, CHECKS the result against a real done-condition, and
# RE-RUNS — feeding the failure back in — until the check passes or you hit a
# cap. The model doesn't decide it's finished. The check does.
#
# This is a genuine minimal loop, not a demo. It shells out to an AI CLI that
# can edit your project (default: Claude Code's `claude -p`), then runs YOUR
# done-condition. Point CHECK at a command that already tells you the truth —
# your tests, a build, a linter, a curl that must return 200 — and let it run.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── 1. CONFIGURE (override any of these as environment variables) ────────────

# TASK — what you want done, in plain English.
TASK="${TASK:-Make the test suite pass. Fix the source code, do not edit the tests.}"

# CHECK — the DONE-CONDITION. ANY command that exits 0 when the work is done.
#   e.g.  npm test  ·  pytest -q  ·  npm run build  ·  ./verify.sh
# This is the heart of the loop. If you can't write this line, you don't yet
# know what "done" means — and neither will the model.
CHECK="${CHECK:-npm test}"

# AI — the CLI that reads a prompt and edits your project. Default: Claude Code.
#   `claude -p "<prompt>"` runs ONE non-interactive turn with tools enabled.
#   Swap in any coding CLI that takes a prompt argument.
AI="${AI:-claude -p}"

# MAX_ITERS — hard cap. A loop without a cap is a bill without a cap.
MAX_ITERS="${MAX_ITERS:-6}"

# ── 2. THE LOOP ──────────────────────────────────────────────────────────────
last_output=""
for i in $(seq 1 "$MAX_ITERS"); do
  echo "─── iteration $i/$MAX_ITERS ──────────────────────────────────────"

  # PLAN + RUN — prompt the model with the task and, if we've looped, the exact
  # output the check produced last time. Concrete failure text beats "try again".
  prompt="$TASK

Done means this command exits 0:
    $CHECK"
  if [ -n "$last_output" ]; then
    prompt="$prompt

The check just failed. Here is its output — find the cause, fix it, then stop:
$last_output"
  fi
  $AI "$prompt"

  # CHECK — run the done-condition. Capture its output so we can feed it back.
  echo "─── checking: $CHECK"
  if last_output="$(eval "$CHECK" 2>&1)"; then
    echo "$last_output"
    echo "✓ done in $i iteration(s): the check passed."
    exit 0
  fi
  echo "$last_output"
  echo "✗ not done yet — looping."
done

echo "✗ hit MAX_ITERS ($MAX_ITERS) without passing. Read the last output above." >&2
echo "  Loop engineering rule: if it can't get there in a few passes, your TASK" >&2
echo "  or your CHECK is too vague — tighten one, not the number of iterations." >&2
exit 1
