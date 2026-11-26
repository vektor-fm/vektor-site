# Rerun our test: the Karpathy CLAUDE.md, with and without

This is the kit behind Vektor no. 006 (the KARPATHY page). On 2026-11-11 we gave Claude Code the same small request
on the same 15-line cart script, with and without the andrej-karpathy-skills `CLAUDE.md`, and compared the diffs.

## What is in here

- `cart.py`: the 15-line script (`line_total`, `total`, and an unused `_old_tax`).
- `test_cart.py`: its one test.
- `CLAUDE.md`: the file under test, word for word from
  https://raw.githubusercontent.com/multica-ai/andrej-karpathy-skills/main/CLAUDE.md (65 lines, 2,357 bytes,
  unchanged since its one commit on 2026-01-27; MIT, as stated in that repo's README).
- `run.sh`: one run of one arm.

## What you need

Claude Code (`claude`) logged in, `git`, Python, and a POSIX shell (macOS, Linux, WSL or Git Bash on Windows).

## Run it

From this folder:

```sh
chmod +x run.sh
./run.sh without 1 && ./run.sh with 1
./run.sh without 2 && ./run.sh with 2
```

Each run copies `cart.py` and `test_cart.py` into a fresh git repo under `runs/`, asks Claude (Sonnet, through
`claude -p`) to "Add discount code support to total(). The code SAVE10 takes 10% off.", and saves what it changed.
Each run is capped at $0.50; in our runs each one cost $0.037 to $0.055 of Claude Code usage.

Try another request by passing it as the third argument:

```sh
./run.sh without 1 "Add input validation to total()."
./run.sh with 1 "Add input validation to total()."
```

(Runs of the same arm and number overwrite each other, so give each request its own numbers.)

## What to look for

Open `runs/without-1.diff` and `runs/with-1.diff` side by side.

1. **Extra structure.** In our 4 runs without the file, Claude added a `DISCOUNT_CODES = {"SAVE10": 0.10}` table
   holding one code, every time. In our 4 runs with it, a single `if code == "SAVE10":` check, every time.
2. **Assumptions said out loud.** Read the last message in each `.jsonl`. With the file, all 4 of ours named the
   unknown-code choice as an assumption and offered to change it; without it, 2 of 4 did.
3. **Tests run and reported truthfully.** Both arms did this in all 14 of our runs, so the file had nothing to fix here.
4. **Code it was not asked to touch.** `_old_tax` stayed untouched in all 14 of our runs, in both arms.

## How the two arms differ, exactly

- Both arms set `CLAUDE_CODE_DISABLE_CLAUDE_MDS=1` and `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`, so neither your own
  `~/.claude/CLAUDE.md` nor this kit's `CLAUDE.md` is loaded the normal way.
- The "with" arm passes the file through `--append-system-prompt-file`. That stands in for putting it at your
  project root; it is not literally the project-root install.
- One change from our original script: `Bash(python3:*)` is allowed as well as `Bash(python:*)`, for machines where
  Python is only `python3`. We also dropped the `timeout 600` wrapper, which macOS does not ship; the $0.50 cap still
  bounds each run.

## Limits

One model (Sonnet in Claude Code 2.1.322), one toy repo, four runs a side on the main request. Your model version
and your repo will differ. The file's own test is the one to keep: "fewer unnecessary changes in diffs, fewer
rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes."
