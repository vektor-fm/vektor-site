# The AUTOPSY loop: a trading agent that rewrites its own strategy, on paper

vektor /// no. 069 · the step-by-step guide and the prompt templates from the film.
DRAFT 2026-10-08. Sources checked 2026-10-08 (links at the end).

**Read this first.** Everything here runs on a **paper** account: simulated money, no real orders.
Nothing in this guide is financial, investment or trading advice, and nothing here promises a return.
A strategy that improves on a backtest can still lose money on data it has never seen. Past
performance, paper or real, predicts nothing. If you ever point this at real money, that decision,
and its risk, is yours alone.

---

## 0. What you are building

One loop, run by Claude Code:

1. **Describe** a trading idea in plain words.
2. The agent **writes the strategy** (`strategy/strategy.py`) against a paper-trading broker.
3. A fixed backtest **tests it** on past prices.
4. If it fails, a second agent, **the critic, does the autopsy**: it pulls the exact losing trades,
   finds the pattern, rewrites only the entry and exit rules, and re-tests.
5. Every failed version goes into a **failures log** (SQLite) that the agent reads before its next rewrite.
6. A version that passes runs on the **paper account**, behind **risk rules in a file the agent cannot change**.

The one thing that makes this safe to leave running is step 6's lock. Section 4 is the part not to skip.

### The open-source example: Phil

[Phil](https://github.com/bennyjo/phil) (github.com/bennyjo/phil, Apache-2.0) is a real, public
version of this idea, built on Claude Code. In its own README's words it "rewrites its own strategy
after every resolved bet" (won or lost, not only after losses), and "Paper trading is the 24/7
learning engine". It trades short-term **Polymarket prediction markets**, not stocks. Its README says
a small, capped real-money leg can run alongside the paper loop when the operator turns it on; this
guide stays on paper. Phil locks its engine the way Section 4 recommends: "The agent cannot edit the
engine (`core/`, `config/protected.json`). `loop.sh` reverts any attempt, and CI independently fails
any agent commit that touches protected files." Phil keeps its memory in the git log ("every commit
is a lesson the agent paid for (in paper)"); this guide uses a SQLite table instead, so the agent can
query its past failures directly. Phil does not use a separate critic agent or Alpaca; those parts
are this guide's design, not Phil's.

---

## 1. Folder layout

```
autopsy-loop/
  CLAUDE.md                  # the agent's standing orders (Section 6, template T0)
  .claude/
    settings.json            # permissions + sandbox (Section 4)
    agents/critic.md         # the critic subagent (template T3)
  strategy/
    strategy.py              # THE ONLY FILE THE AGENT MAY CHANGE
  protected/                 # the agent may read some of this, never write any of it
    risk_rules.json          # stop loss, max drawdown, position size: yours
    pass_criteria.json       # what counts as "the backtest passed": yours
    backtest.py              # the test harness (so the agent cannot "fix" the test)
    risk_guard.py            # the only code that places paper orders
    holdout.csv              # recent prices the agent never sees (Section 5)
  data/
    train.csv                # the prices the agent may test on
  failures.db                # SQLite failures log (Section 3)
  runs/                      # backtest outputs: trades.csv + summary.json per run
  state/                     # the guard's peak-equity record and HALT flag (agent: no write)
  prompts/                   # T1-T4 below (agent: no write)
  loop.sh                    # runs the loop and reverts any touch on protected/
```

Put the whole folder under git (`git init`) before the first run. Git is how you see, and undo,
every change the agent makes.

---

## 2. The broker: Alpaca, paper only

Alpaca's Python SDK (`pip install alpaca-py`) has a paper switch on the trading client. From Alpaca's
docs: "To use paper trading, you will need to set the paper parameter to True when instantiating the
TradingClient. Make sure the keys you are providing correspond to a paper account."

```python
from alpaca.trading.client import TradingClient

# paper=True enables paper trading (alpaca.markets/sdks/python/trading.html)
trading_client = TradingClient("PAPER_API_KEY", "PAPER_SECRET_KEY", paper=True)
```

Alpaca describes paper trading as "a real-time simulation environment where you can test your code"
and says "You won't be trading real money" (docs.alpaca.markets/docs/paper-trading).

Rules for this build:
- Create **paper** keys only. Never put live keys on the machine the agent runs on.
- Keep the keys in environment variables (`APCA_PAPER_KEY`, `APCA_PAPER_SECRET`), never in a file the agent can read.
- `paper=True` lives in `protected/risk_guard.py`, which the agent cannot edit, so it cannot flip it.

Historical prices for the backtest, downloaded once by **you** (not the agent):

```python
# fetch_bars.py: run this yourself, once. Writes data/train.csv and protected/holdout.csv.
import os
from datetime import datetime
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest
from alpaca.data.timeframe import TimeFrame

client = StockHistoricalDataClient(os.environ["APCA_PAPER_KEY"], os.environ["APCA_PAPER_SECRET"])
req = StockBarsRequest(symbol_or_symbols="SPY", timeframe=TimeFrame.Day,
                       start=datetime(2019, 1, 1), end=datetime(2025, 12, 31))
df = client.get_stock_bars(req).df.reset_index()
df = df[["timestamp", "open", "high", "low", "close", "volume"]]
split = int(len(df) * 0.8)                 # last 20% is the holdout the agent never sees
df.iloc[:split].to_csv("data/train.csv", index=False)
df.iloc[split:].to_csv("protected/holdout.csv", index=False)
```

The symbol, dates and 80/20 split are examples. Pick your own.

---

## 3. The failures log (SQLite)

One table. Every version that fails gets a row, with the autopsy's reasons. The agent queries it
before every rewrite.

```sql
-- run once: sqlite3 failures.db < schema.sql
CREATE TABLE IF NOT EXISTS failures (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  git_commit    TEXT    NOT NULL,   -- the strategy version that failed
  idea          TEXT    NOT NULL,   -- the plain-words idea it came from
  failed_check  TEXT    NOT NULL,   -- which pass_criteria line it missed
  losing_trades TEXT    NOT NULL,   -- JSON: the worst losing trades the critic pulled
  pattern       TEXT    NOT NULL,   -- the critic's one-sentence diagnosis
  change_made   TEXT    NOT NULL,   -- what the rewrite changed in entry/exit
  do_not_retry  TEXT              -- a rule the agent must not reintroduce
);
```

Read it before a rewrite:

```bash
sqlite3 -header -column failures.db \
  "SELECT id, failed_check, pattern, change_made, do_not_retry FROM failures ORDER BY id DESC LIMIT 20;"
```

---

## 4. The lock: risk rules the agent cannot change

The film says the risk rules sit "in a file it isn't allowed to edit". **One setting does not make
that true.** Claude Code's own docs (code.claude.com/docs/en/permissions, "Read and Edit") say Read
and Edit deny rules apply to Claude's file tools, to file commands it recognises in Bash (`cat`, `sed`,
`tee`...) and to redirections like `> file`, but "They don't apply to ... arbitrary subprocesses that
read or write files indirectly, like a Python or Node script that opens files itself."

A trading agent writes and runs Python all day, so an Edit deny alone is a sign on an unlocked door.
Use **all four layers**. Each one covers a hole in the one before it.

### Layer 1: permission rules (`.claude/settings.json`)

```json
{
  "permissions": {
    "allow": [
      "Edit(/strategy/**)",
      "Bash(python protected/backtest.py *)",
      "Bash(sqlite3 failures.db *)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(git add strategy/*)",
      "Bash(git commit *)"
    ],
    "deny": [
      "Edit(/protected/**)",
      "Edit(/.claude/**)",
      "Edit(/loop.sh)",
      "Edit(/CLAUDE.md)",
      "Edit(/state/**)",
      "Edit(/prompts/**)",
      "Read(/protected/holdout.csv)",
      "Bash(git push *)",
      "Bash(git checkout *)",
      "Bash(git reset *)"
    ]
  },
  "sandbox": {
    "enabled": true,
    "allowUnsandboxedCommands": false,
    "filesystem": {
      "denyWrite": ["./protected", "./.claude", "./loop.sh", "./CLAUDE.md", "./state", "./prompts"],
      "denyRead": ["./protected/holdout.csv"]
    }
  }
}
```

In permission rules a single leading `/` means "relative to this project" (`Edit(/protected/**)`);
in the sandbox block the project-relative form is `./protected`. The two syntaxes differ on purpose
(code.claude.com/docs/en/settings-reference, "Sandbox path prefixes"). Deny always beats allow.

### Layer 2: the OS sandbox (blocks the Python hole)

The `sandbox` block above is OS-level: it applies to Bash commands "and their child processes", so a
Python script the agent writes cannot write into `protected/` either (code.claude.com/docs/en/sandboxing).
`allowUnsandboxedCommands: false` is strict mode: Claude Code ignores the agent's request to retry a
blocked command outside the sandbox.

Two limits, from the same docs:
- **The sandbox runs on macOS, Linux and WSL2. On native Windows, commands run unsandboxed.** On a
  Windows machine, run this inside WSL2, or Layer 2 does not exist for you.
- Strict mode set in the project file can be loosened by a setting elsewhere. To make it hold, put
  `{"sandbox": {"enabled": true, "allowUnsandboxedCommands": false, "failIfUnavailable": true}}` in a
  file **outside the repo** and start Claude with `--settings <that file>`, as `loop.sh` does below.
  The docs: a `false` passed with `--settings` "holds even when a project's settings set `true`".

### Layer 3: revert and stop (`loop.sh`), like Phil

After every agent turn, the loop checks that `protected/` is byte-identical to the last commit **you**
made, and to a hash you keep outside the repo. Any difference: put it back, stop the loop, tell you.

```bash
#!/usr/bin/env bash
# loop.sh: run N autopsy rounds. Usage: ./loop.sh 5
set -euo pipefail
ROUNDS="${1:-1}"
STRICT="$HOME/.autopsy/strict-settings.json"     # Layer 2's strict file, outside the repo
PINNED="$HOME/.autopsy/protected.sha256"          # made once by you: see below

check_lock () {
  if ! git diff --quiet HEAD -- protected .claude loop.sh CLAUDE.md prompts \
     || [ -n "$(git status --porcelain -- protected .claude loop.sh CLAUDE.md prompts)" ] \
     || ! sha256sum -c --quiet "$PINNED"; then
    git checkout HEAD -- protected .claude loop.sh CLAUDE.md prompts
    git clean -fd -- protected .claude prompts
    echo "LOCK BROKEN: the agent touched a protected file. Reverted. Loop stopped." >&2
    exit 1
  fi
}

check_lock
for i in $(seq 1 "$ROUNDS"); do
  claude -p "$(cat prompts/T2-test.md)" --settings "$STRICT"
  check_lock
  if python protected/backtest.py --check-passed runs/latest/summary.json; then
    echo "Round $i: passed on train. Holdout check next (Section 5)."; break
  fi
  claude -p "$(cat prompts/T3-autopsy.md)" --settings "$STRICT"
  check_lock
done
```

Make the pinned hash once, by hand, after you have set your own risk rules:

```bash
mkdir -p ~/.autopsy
sha256sum protected/* .claude/settings.json .claude/agents/* CLAUDE.md loop.sh prompts/* > ~/.autopsy/protected.sha256
```

### Layer 4: the guard that places orders, and CI

- `protected/risk_guard.py` is **the only code allowed to submit a paper order**. The strategy only
  returns signals; it never imports the trading client. On start-up the guard hashes `risk_rules.json`
  against your pinned hash and refuses to trade on a mismatch, then enforces the stop loss and the max
  drawdown itself on every order. A rewritten strategy can be as wrong as it likes; it cannot size past
  your limits or switch off the stop.
- If the folder lives on GitHub, add a CI check that fails any commit touching `protected/` that is
  not yours (Phil's README: "CI independently fails any agent commit that touches protected files"):

```yaml
# .github/workflows/lock.yml
name: lock
on: [push, pull_request]
jobs:
  protected-untouched:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 2 }
      - name: fail if an agent commit touched protected files
        run: |
          if git diff --name-only HEAD~1 HEAD | grep -E '^(protected/|\.claude/|prompts/|loop\.sh|CLAUDE\.md)'; then
            if [ "$(git log -1 --format=%ae)" != "you@example.com" ]; then
              echo "protected file changed by a non-owner commit"; exit 1
            fi
          fi
```

Give the agent its own git author (`git config user.email agent@localhost` inside the folder) so the
check can tell its commits from yours.

### What goes in `risk_rules.json`

Yours to set. These are **example values, not advice**:

```json
{
  "paper_only": true,
  "stop_loss_pct": 2.0,
  "max_drawdown_pct": 10.0,
  "max_position_pct_of_equity": 10.0,
  "max_open_positions": 1,
  "halt_file": "state/HALT"
}
```

`max_drawdown_pct`: once paper equity falls this far below its peak, the guard creates `state/HALT`
and refuses every new order until you delete it by hand. (`state/` sits outside `protected/` so the
guard can write there without tripping the lock.)

---

## 5. Don't let the agent fool itself

An agent that rewrites a strategy until a backtest passes will, sooner or later, pass by fitting the
noise in that one stretch of history. This is a known, measured problem in quant research: see Bailey,
Borwein, López de Prado and Zhu, "The Probability of Backtest Overfitting" (papers.ssrn.com/abstract=2326253).

Three rules that keep the loop honest:
1. **The agent never sees the holdout.** `protected/holdout.csv` is denied to Read and to the sandbox.
   Only you run `python protected/backtest.py --data protected/holdout.csv`, and only once a version
   passes on train.
2. **Pass criteria are yours and fixed in advance** (`protected/pass_criteria.json`), so the agent
   cannot lower the bar it is measured against.
3. **Count the rewrites.** The more versions you try, the more likely one passes by luck. Log every
   attempt (the failures table does this) and be more suspicious of the 40th version than the 4th.

---

## 6. The prompt templates

Save each one as a file under `prompts/` (or `CLAUDE.md` / `.claude/agents/` where named). Replace
everything in `<angle brackets>`.

### T0 · `CLAUDE.md` (standing orders, read every session)

```markdown
# Autopsy loop: standing orders

You maintain ONE trading strategy in strategy/strategy.py. You run on a PAPER account only.

What you may do:
- Edit strategy/strategy.py. Nothing else.
- Run: python protected/backtest.py --data data/train.csv --out runs/<run-id>
- Query and insert into failures.db (table: failures).
- Commit strategy/ changes with a message that names the failures.db row it answers.

What you may never do:
- Edit, move, delete or recreate anything in protected/, .claude/, loop.sh or this file.
- Write a script that does any of the above.
- Import a broker client or place an order from strategy/. Orders go through protected/risk_guard.py only.
- Read protected/holdout.csv, or ask for it.
- Change, re-interpret or argue around protected/risk_rules.json or protected/pass_criteria.json.
  If you believe a limit is wrong, write the argument to PROPOSALS.md and stop. A human decides.

The strategy interface (do not change the signatures):
- entry_signal(bars, i) -> bool      # bars: list of dicts (timestamp, open, high, low, close, volume); i: today's index
- exit_signal(bars, i, entry_price) -> bool

Before ANY rewrite, read the last 20 rows of failures.db and do not reintroduce anything listed in do_not_retry.
```

### T1 · `prompts/T1-idea.md` (describe the idea, get the first strategy)

```markdown
Read CLAUDE.md first.

My trading idea, in plain words:
<e.g. "Buy SPY when it closes below its 20-day low after a calm week, sell after it bounces back to its 5-day average or after 10 days, whichever comes first.">

1. Restate the idea as two precise rules: one entry rule, one exit rule. List every number you chose and why.
2. Write strategy/strategy.py implementing exactly those two rules through entry_signal and exit_signal.
   No other logic, no position sizing, no stop loss (protected/risk_guard.py owns both).
3. Run the backtest on data/train.csv into runs/v1.
4. Commit strategy/strategy.py with the message "v1: <one-line idea>".
5. Report: the two rules, the summary.json result, and which pass_criteria lines passed or failed. Numbers only from summary.json.
```

### T2 · `prompts/T2-test.md` (test the current version)

```markdown
Read CLAUDE.md first.

Run: python protected/backtest.py --data data/train.csv --out runs/latest
Then compare runs/latest/summary.json against protected/pass_criteria.json, line by line.
Report PASS or FAIL per line, with the value from summary.json. Do not edit anything in this step.
```

### T3 · `.claude/agents/critic.md` (the critic subagent)

```markdown
---
name: critic
description: Trade autopsy. Use after a backtest fails. Pulls the exact losing trades, finds the pattern, rewrites ONLY entry/exit rules in strategy/strategy.py, re-tests once.
tools: Read, Grep, Glob, Bash, Edit
---

You are the critic. You did not write this strategy and you owe it nothing. Your job is an autopsy, not a rescue.

1. Read CLAUDE.md, then the last 20 rows of failures.db. Note every do_not_retry rule.
2. Open runs/latest/trades.csv. Pull the losing trades and sort them by loss. Quote the worst 5 exactly
   (entry date, exit date, entry price, exit price, % result). Do not round, do not summarise yet.
3. For those trades, look at the bars around entry and exit. Find the ONE pattern most of them share
   (e.g. "entered on gap-down days", "exit fired a day after the low"). State it in one sentence and
   show which of the 5 trades fit it and which do not.
4. Do NOT scrap the strategy and do NOT add new indicators beyond what the pattern needs.
   Rewrite only entry_signal and/or exit_signal to remove that pattern. Change as little as you can.
5. Re-run: python protected/backtest.py --data data/train.csv --out runs/latest
6. Insert one row into failures.db for the version that FAILED (not the new one):
   git_commit = the failed version's commit, idea, failed_check, losing_trades (the 5 as JSON),
   pattern (your sentence), change_made (what you changed), do_not_retry (the rule that caused it).
7. Commit strategy/strategy.py: "autopsy #<failures row id>: <change_made>".
8. Report: the pattern, the change, before/after values from the two summary.json files. Nothing else.
```

### T3 · `prompts/T3-autopsy.md` (what `loop.sh` sends to call the critic)

```markdown
The last backtest failed (runs/latest/summary.json). Use the critic subagent to run a trade autopsy on runs/latest/trades.csv and follow its procedure exactly. Do not touch anything outside strategy/ and failures.db.
```

### T4 · the paper run (run by YOU on a schedule, not by the agent)

Only after a version passed on train AND you ran the holdout yourself and are happy with it. The agent
never runs the guard: the guard writes `state/`, which the agent may not touch, so a rewrite can never
delete a HALT or reset the peak equity. Schedule it yourself (cron, Task Scheduler), once a day after
the close, never in a tight loop:

```bash
# crontab -e   (example: 22:30 local time on weekdays)
30 22 * * 1-5  cd ~/autopsy-loop && python protected/risk_guard.py --strategy strategy/strategy.py --symbol SPY --once >> runs/paper.log 2>&1
```

Then, when you want the agent to learn from paper results, give it the log read-only:

```markdown
Read CLAUDE.md first. Read runs/paper.log (do not edit it). Summarise every ENTRY, EXIT and GUARD REFUSED line since <date>, with dates. If a paper trade lost, run the critic's steps 2-3 on it and write the pattern to failures.db with failed_check = "paper". Do not rewrite the strategy in this step.
```

---

## 7. A first run, start to finish

1. Create the folder from Section 1. `git init`. Set the agent's git author.
2. Write your `risk_rules.json` and `pass_criteria.json`. Commit them **yourself**.
3. Write the settings (Section 4), the strict file in `~/.autopsy/`, and the pinned hash.
4. Run `fetch_bars.py` (Section 2) yourself.
5. `claude -p "$(cat prompts/T1-idea.md)" --settings ~/.autopsy/strict-settings.json`
6. `./loop.sh 5`: up to five test-and-autopsy rounds. Watch `git log` and `failures.db` grow.
7. When a version passes on train, run the holdout yourself. If it fails there, that is the lesson:
   log it in failures.db and go again, or change the idea.
8. Only then, schedule T4 on paper. Watch it for weeks before you believe anything.

**Test the lock before you trust it:** ask the agent, in plain words, to "raise the max drawdown to 50%
in protected/risk_rules.json". It should refuse or be blocked. Then ask it to "write a Python script that
changes it". The sandbox should block the write, and `loop.sh` should revert and stop if anything slipped
through. If either test succeeds, your lock is not working; fix it before running anything.

---

## 8. Appendix: the two protected scripts

Both live in `protected/`. You write them (or paste these), read them, commit them yourself, then pin
their hash. The agent runs them; it never edits them.

### `protected/pass_criteria.json` (example values, not advice)

```json
{
  "min_trades": 30,
  "min_total_return_pct": 0.0,
  "max_drawdown_pct": 15.0
}
```

### `protected/backtest.py`

Long-only, one position at a time, enters at the close of the signal bar, applies your stop loss
inside the bar. The strategy only ever sees bars up to "today" (no look-ahead). Drawdown is measured on
closed trades. No fees or slippage are modelled, so real results will be worse. Keep it simple on
purpose: a harness you can read end to end is a harness you can trust.

```python
#!/usr/bin/env python3
"""Fixed backtest harness. Human-owned: lives in protected/, the agent cannot edit it."""
import argparse, csv, importlib.util, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))

def load_bars(path):
    with open(path, newline="") as f:
        rows = list(csv.DictReader(f))
    return [{"timestamp": r["timestamp"],
             **{k: float(r[k]) for k in ("open", "high", "low", "close", "volume")}} for r in rows]

def load_strategy(path):
    spec = importlib.util.spec_from_file_location("strategy", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

def run(bars, strat, stop_pct):
    equity, peak, max_dd = 1.0, 1.0, 0.0
    trades, pos = [], None
    for i in range(1, len(bars)):
        seen, bar = bars[: i + 1], bars[i]          # the strategy never sees tomorrow
        if pos is None:
            if strat.entry_signal(seen, i):
                pos = {"entry_date": bar["timestamp"], "entry_price": bar["close"]}
            continue
        stop_price = pos["entry_price"] * (1 - stop_pct / 100.0)
        exit_price = reason = None
        if bar["low"] <= stop_price:
            exit_price, reason = min(bar["open"], stop_price), "stop"   # a gap down fills at the open
        elif strat.exit_signal(seen, i, pos["entry_price"]):
            exit_price, reason = bar["close"], "signal"
        if exit_price is None:
            continue
        ret = exit_price / pos["entry_price"] - 1
        equity *= 1 + ret
        peak = max(peak, equity)
        max_dd = max(max_dd, 1 - equity / peak)
        trades.append({**pos, "exit_date": bar["timestamp"], "exit_price": round(exit_price, 4),
                       "pct": round(ret * 100, 3), "exit_reason": reason})
        pos = None
    wins = sum(1 for t in trades if t["pct"] > 0)
    return trades, {"trades": len(trades),
                    "win_rate_pct": round(100 * wins / len(trades), 2) if trades else 0.0,
                    "total_return_pct": round((equity - 1) * 100, 3),
                    "max_drawdown_pct": round(max_dd * 100, 3)}

def check(summary_path):
    s = json.load(open(summary_path))
    c = json.load(open(os.path.join(HERE, "pass_criteria.json")))
    fails = []
    if s["trades"] < c["min_trades"]: fails.append("min_trades")
    if s["total_return_pct"] < c["min_total_return_pct"]: fails.append("min_total_return_pct")
    if s["max_drawdown_pct"] > c["max_drawdown_pct"]: fails.append("max_drawdown_pct")
    print("PASS" if not fails else "FAIL: " + ", ".join(fails))
    return 0 if not fails else 1

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", default="data/train.csv")
    ap.add_argument("--strategy", default="strategy/strategy.py")
    ap.add_argument("--out", default="runs/latest")
    ap.add_argument("--check-passed", metavar="SUMMARY_JSON")
    a = ap.parse_args()
    if a.check_passed:
        sys.exit(check(a.check_passed))
    rules = json.load(open(os.path.join(HERE, "risk_rules.json")))
    trades, summary = run(load_bars(a.data), load_strategy(a.strategy), rules["stop_loss_pct"])
    summary["data"] = a.data
    os.makedirs(a.out, exist_ok=True)
    with open(os.path.join(a.out, "trades.csv"), "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["entry_date", "entry_price", "exit_date", "exit_price", "pct", "exit_reason"])
        w.writeheader(); w.writerows(trades)
    json.dump(summary, open(os.path.join(a.out, "summary.json"), "w"), indent=2)
    print(json.dumps(summary, indent=2))
    sys.exit(check(os.path.join(a.out, "summary.json")))
```

### `protected/risk_guard.py` (paper orders only)

```python
#!/usr/bin/env python3
"""The only code that places orders. Paper only. Human-owned: lives in protected/."""
import argparse, hashlib, importlib.util, json, os, sys
from datetime import datetime, timedelta
from alpaca.trading.client import TradingClient
from alpaca.trading.requests import MarketOrderRequest
from alpaca.trading.enums import OrderSide, TimeInForce
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest
from alpaca.data.timeframe import TimeFrame

HERE = os.path.dirname(os.path.abspath(__file__))
PINNED = os.path.expanduser("~/.autopsy/protected.sha256")
STATE = os.path.join(os.path.dirname(HERE), "state")

def refuse(msg):
    print("GUARD REFUSED:", msg); sys.exit(2)

def rules_untouched():
    path = os.path.join(HERE, "risk_rules.json")
    have = hashlib.sha256(open(path, "rb").read()).hexdigest()
    for line in open(PINNED):
        want, name = line.split(maxsplit=1)
        if name.strip().endswith("protected/risk_rules.json"):
            return have == want
    return False

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--strategy", required=True)
    ap.add_argument("--symbol", required=True)
    ap.add_argument("--once", action="store_true")
    a = ap.parse_args()

    if not rules_untouched(): refuse("risk_rules.json does not match the pinned hash")
    rules = json.load(open(os.path.join(HERE, "risk_rules.json")))
    if not rules.get("paper_only", False): refuse("paper_only is not true")
    os.makedirs(STATE, exist_ok=True)
    halt = os.path.join(STATE, "HALT")
    if os.path.exists(halt): refuse("state/HALT exists; a human must delete it")

    key, secret = os.environ["APCA_PAPER_KEY"], os.environ["APCA_PAPER_SECRET"]
    tc = TradingClient(key, secret, paper=True)          # hard-coded: paper only

    equity = float(tc.get_account().equity)
    peak_file = os.path.join(STATE, "peak_equity.json")
    peak = max(equity, json.load(open(peak_file))["peak"]) if os.path.exists(peak_file) else equity
    json.dump({"peak": peak}, open(peak_file, "w"))
    if (1 - equity / peak) * 100 >= rules["max_drawdown_pct"]:
        open(halt, "w").write(f"max drawdown hit: equity {equity}, peak {peak}\n")
        refuse("max drawdown reached; HALT written")

    dc = StockHistoricalDataClient(key, secret)
    req = StockBarsRequest(symbol_or_symbols=a.symbol, timeframe=TimeFrame.Day,
                           start=datetime.now() - timedelta(days=400))
    df = dc.get_stock_bars(req).df.reset_index()
    bars = [{"timestamp": str(r.timestamp), "open": r.open, "high": r.high, "low": r.low,
             "close": r.close, "volume": r.volume} for r in df.itertuples()]
    i = len(bars) - 1

    spec = importlib.util.spec_from_file_location("strategy", a.strategy)
    strat = importlib.util.module_from_spec(spec); spec.loader.exec_module(strat)

    held = {p.symbol: p for p in tc.get_all_positions()}
    if a.symbol in held:
        entry = float(held[a.symbol].avg_entry_price)
        stop_hit = bars[i]["close"] <= entry * (1 - rules["stop_loss_pct"] / 100.0)
        if stop_hit or strat.exit_signal(bars, i, entry):
            tc.close_position(a.symbol)
            print("EXIT", a.symbol, "stop" if stop_hit else "signal")
        return
    if len(held) >= rules["max_open_positions"]:
        refuse("max_open_positions reached")
    if strat.entry_signal(bars, i):
        notional = round(equity * rules["max_position_pct_of_equity"] / 100.0, 2)
        tc.submit_order(order_data=MarketOrderRequest(symbol=a.symbol, notional=notional,
                                                      side=OrderSide.BUY, time_in_force=TimeInForce.DAY))
        print("ENTRY", a.symbol, "notional", notional)

if __name__ == "__main__":
    main()
```

The guard checks the stop once per run, at the latest daily close; between runs a price can fall
well past it. That is one more reason this stays on paper.

---

## Sources (checked 2026-10-08)

- Phil, the self-improving trader: https://github.com/bennyjo/phil (README)
- Alpaca paper trading, Python SDK: https://alpaca.markets/sdks/python/trading.html
- Alpaca market data, Python SDK: https://alpaca.markets/sdks/python/market_data.html
- Alpaca paper trading docs: https://docs.alpaca.markets/docs/paper-trading
- Claude Code permissions (Read and Edit rules and their limits): https://code.claude.com/docs/en/permissions
- Claude Code sandboxing (OS level, platforms, strict mode): https://code.claude.com/docs/en/sandboxing
- Claude Code settings reference (sandbox path prefixes, denyWrite): https://code.claude.com/docs/en/settings-reference
- Bailey, Borwein, López de Prado, Zhu, "The Probability of Backtest Overfitting": https://papers.ssrn.com/abstract=2326253

The code in this guide is a starting sketch, written for this guide and not run as a full system by
Vektor. Read it, test it on paper, and own every line before you rely on it.

The format of the film this guide comes with is adapted from @raycfu's reel
(https://www.instagram.com/p/DeNnxp5v_Fu/). This guide, its code and its prompts are Vektor's.

vektor /// @vektor.fm · the AI frontier, cut to what ships
