#!/bin/sh
# run.sh <arm: with|without> <n>  - one run of the same task, same model, fresh copy of base/
arm=$1; n=$2; d="runs/$arm-$n"; TASK="${3:-Add discount code support to total(). The code SAVE10 takes 10% off.}"; rm -rf "$d"; mkdir -p "$d"; cp base/cart.py base/test_cart.py "$d/"
cd "$d" && git init -q && git add cart.py test_cart.py && git -c user.email=t@t -c user.name=t commit -qm base

EXTRA=""
[ "$arm" = with ] && EXTRA="--append-system-prompt-file ../../src/CLAUDE.md"
start=$(date +%s)
CLAUDE_CODE_DISABLE_CLAUDE_MDS=1 CLAUDE_CODE_DISABLE_AUTO_MEMORY=1 timeout 600 claude -p "$TASK" --model sonnet --strict-mcp-config --setting-sources project --max-budget-usd 0.50 --no-session-persistence --permission-mode acceptEdits --allowedTools "Read,Edit,Write,Glob,Grep,Bash(python:*),Bash(git diff:*),Bash(git status:*)" --output-format stream-json --verbose $EXTRA > ../$arm-$n.jsonl 2> ../$arm-$n.err
echo "exit $? secs $(( $(date +%s) - start ))" > ../$arm-$n.meta
git diff --stat > ../$arm-$n.diffstat; git diff > ../$arm-$n.diff; git status --short > ../$arm-$n.status
