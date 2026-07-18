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
import shutil
import subprocess
import sys

# ── CONFIGURE (override any of these as environment variables) ───────────────
TASK = os.environ.get(
    "TASK", "Make the test suite pass. Fix the source code, do not edit the tests."
)
CHECK = os.environ.get("CHECK", "npm test")   # the DONE-CONDITION: exits 0 when done
# AI — the CLI that edits your project. `--permission-mode acceptEdits` is what
# lets Claude Code actually APPLY its edits headlessly; without it `claude -p`
# asks for approval it can never get in a script, so the edits are dropped and
# the check can never pass. Drop the flag if your CLI doesn't use it.
AI = os.environ.get("AI", "claude -p --permission-mode acceptEdits")
MAX_ITERS = int(os.environ.get("MAX_ITERS", "6"))  # a loop needs a cap


def shell(cmd, **kw):
    """Run a command through the shell, text mode."""
    return subprocess.run(cmd, shell=True, text=True, **kw)


def run_ai(ai: str, prompt: str) -> subprocess.CompletedProcess:
    """Invoke the AI CLI with the prompt as a single argument, NO shell.

    The prompt is passed straight through as one argv element, so it is never
    re-parsed by a shell — the same call works on Windows and POSIX. (The old
    version shell-quoted with shlex.quote, which emits POSIX single-quotes that
    cmd.exe does not understand, mangling any prompt with spaces on Windows.)
    """
    parts = shlex.split(ai, posix=(os.name != "nt"))
    exe = shutil.which(parts[0]) or parts[0]  # resolve the npm .cmd shim on Windows
    return subprocess.run([exe, *parts[1:], prompt], text=True)


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
        run_ai(AI, prompt)

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
