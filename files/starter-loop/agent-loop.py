#!/usr/bin/env python3
# ─────────────────────────────────────────────────────────────────────────────
# starter-loop — plan → run → check → repeat, until a done-condition passes.
#
# The Python twin of agent-loop.sh, for Windows or anyone without bash. Same
# idea, same honesty: stop one-shot prompting. Write a loop that PROMPTS the
# model, CHECKS the result against a real done-condition, and RE-RUNS (feeding
# the failure back) until the check passes or you hit a cap. The check decides
# "done", not the model.
#
# Standard library only — no dependencies. Works with any AI CLI that edits your
# project from a prompt argument (default: Claude Code's `claude -p`).
#
#   Run:  TASK="..." CHECK="pytest -q" python agent-loop.py
# ─────────────────────────────────────────────────────────────────────────────
import os
import shlex
import subprocess
import sys

# ── CONFIGURE (override any of these as environment variables) ───────────────
TASK = os.environ.get(
    "TASK", "Make the test suite pass. Fix the source code, do not edit the tests."
)
CHECK = os.environ.get("CHECK", "npm test")   # the DONE-CONDITION: exits 0 when done
AI = os.environ.get("AI", "claude -p")         # the CLI that edits your project
MAX_ITERS = int(os.environ.get("MAX_ITERS", "6"))  # a loop needs a cap


def shell(cmd, **kw):
    """Run a command through the shell, text mode."""
    return subprocess.run(cmd, shell=True, text=True, **kw)


def main() -> int:
    last_output = ""
    for i in range(1, MAX_ITERS + 1):
        print(f"─── iteration {i}/{MAX_ITERS} " + "─" * 30)

        # PLAN + RUN — prompt with the task and last time's real check output.
        prompt = f"{TASK}\n\nDone means this command exits 0:\n    {CHECK}"
        if last_output:
            prompt += (
                "\n\nThe check just failed. Here is its output — find the cause, "
                f"fix it, then stop:\n{last_output}"
            )
        shell(f"{AI} {shlex.quote(prompt)}")

        # CHECK — run the done-condition; capture output to feed back next time.
        print(f"─── checking: {CHECK}")
        result = shell(CHECK, capture_output=True)
        last_output = (result.stdout or "") + (result.stderr or "")
        print(last_output, end="")
        if result.returncode == 0:
            print(f"\n✓ done in {i} iteration(s): the check passed.")
            return 0
        print("✗ not done yet — looping.")

    print(
        f"✗ hit MAX_ITERS ({MAX_ITERS}) without passing. Read the last output "
        "above.\n  If it can't get there in a few passes, your TASK or your "
        "CHECK is too vague — tighten one, not the iteration count.",
        file=sys.stderr,
    )
    return 1


if __name__ == "__main__":
    sys.exit(main())
