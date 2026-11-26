#!/bin/sh
# run.sh <with|without> <n> ["task"]
# One run of the Vektor no. 006 / NO.098 test: the same task, the same model, a fresh copy of cart.py.
# Run it from this folder (the one holding cart.py, test_cart.py, CLAUDE.md and this script).
# Needs: Claude Code (claude) logged in, git, Python. Each run is capped at $0.50 of usage.
#
#   ./run.sh without 1 && ./run.sh with 1
#
# Results land in runs/: <arm>-<n>.diff is what Claude changed, <arm>-<n>.jsonl is the whole session.
set -u
arm=${1:?usage: ./run.sh with|without N [task]}
n=${2:?usage: ./run.sh with|without N [task]}
TASK="${3:-Add discount code support to total(). The code SAVE10 takes 10% off.}"
kit=$(cd "$(dirname "$0")" && pwd)
d="$kit/runs/$arm-$n"
rm -rf "$d"; mkdir -p "$d"; cp "$kit/cart.py" "$kit/test_cart.py" "$d/"
cd "$d" && git init -q && git add cart.py test_cart.py && git -c user.email=t@t -c user.name=t commit -qm base

EXTRA=""
[ "$arm" = with ] && EXTRA="--append-system-prompt-file $kit/CLAUDE.md"

# Both arms switch off every CLAUDE.md Claude Code would normally load (your ~/.claude/CLAUDE.md,
# and this kit's own CLAUDE.md one folder up) plus auto memory, so the only difference between the
# arms is the file passed with --append-system-prompt-file.
start=$(date +%s)
CLAUDE_CODE_DISABLE_CLAUDE_MDS=1 CLAUDE_CODE_DISABLE_AUTO_MEMORY=1 claude -p "$TASK" \
  --model sonnet --strict-mcp-config --setting-sources project --max-budget-usd 0.50 \
  --no-session-persistence --permission-mode acceptEdits \
  --allowedTools "Read,Edit,Write,Glob,Grep,Bash(python:*),Bash(python3:*),Bash(git diff:*),Bash(git status:*)" \
  --output-format stream-json --verbose $EXTRA > "../$arm-$n.jsonl" 2> "../$arm-$n.err"
echo "exit $? secs $(( $(date +%s) - start ))" > "../$arm-$n.meta"
git diff --stat > "../$arm-$n.diffstat"; git diff > "../$arm-$n.diff"; git status --short > "../$arm-$n.status"
echo "done: runs/$arm-$n.diff"
