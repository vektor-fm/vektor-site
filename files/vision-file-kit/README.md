# The vision file kit (NO.061, vektor /// no. 061 · @vektor.fm · comment keyword `VISION`)

One short file that tells Claude Code what you are building, what good looks like to you, and which
calls stay yours. Plus plan mode, so Claude proposes before it edits. Three steps.

Status: **tested 2026-10-02, Claude Code 2.1.285**, `--model haiku --strict-mcp-config`, in throwaway
directories outside any real repo (never committed), Windows 11, both PowerShell and POSIX (Git Bash)
install paths. Every mechanism below is quoted from `https://code.claude.com/docs/en/memory` and
`https://code.claude.com/docs/en/permission-modes` (both re-read 2026-10-02, same wording as the 2026-10-01
pass that drafted this kit). Nothing here is invented; if a step does not match your Claude Code version,
the docs win. Full test log: `data/2026-10-04-vision-file/asset/TEST.md` in the Vektor repo.

## Step 1. Put `VISION.md` at the root of your project

Copy `VISION.md` from this kit next to your `CLAUDE.md` and fill the five sections.

| | macOS / Linux / Git Bash | Windows (PowerShell) |
|---|---|---|
| Copy the template | `cp vision-file-kit/VISION.md ./VISION.md` | `Copy-Item vision-file-kit\VISION.md .\VISION.md` |

(Tested 2026-10-02 on this exact machine: both commands land the file next to an existing `CLAUDE.md`
without disturbing it.)

Keep it short: the docs say to target under 200 lines per CLAUDE.md file, and an imported file loads at
launch too, so it costs context every session ("Imports help you organize a long file but don't reduce its
context cost, because imported files also load at launch").

## Step 2. Import it from `CLAUDE.md` with one line

Add this line anywhere in `CLAUDE.md` (see `CLAUDE.md.snippet.md` for the full block, which also has a
reminder sentence about section 4):

```text
@VISION.md
```

If you already have a `CLAUDE.md`, append just the bare block below, by hand, onto the end of the file —
do **not** pipe the whole `CLAUDE.md.snippet.md` file in with `cat >>` or `Get-Content | Add-Content`.
That file wraps its own example in a fenced code block (so GitHub and this README render it legibly), and
a fence is exactly what defeats the import: tested 2026-10-02 by appending the *whole* snippet file
verbatim into a `CLAUDE.md` — Claude never loaded `VISION.md` at launch; it only found the content because
it went and read the file itself off its own curiosity, one extra turn and one `Read` tool call later,
which is not something you can depend on. The docs say why: "Import parsing skips Markdown code spans and
fenced code blocks." Copy only the text between the fences, never the fences themselves:

```text
# Vision
@VISION.md

Before planning anything that touches more than one file, read VISION.md section 4 and stop at the
calls that stay mine.
```

Tested 2026-10-02, both shells, appending to an existing non-empty `CLAUDE.md` without disturbing its
prior content — in each case Claude answered a VISION.md-only question in its **first** turn with **no**
`Read` tool call (checked with `claude -p --verbose --output-format stream-json`), proving the file was
already in context at launch, not fetched on demand.

macOS / Linux / Git Bash:

```bash
printf '\n# Vision\n@VISION.md\n\nBefore planning anything that touches more than one file, read VISION.md section 4 and stop at the calls that stay mine.\n' >> CLAUDE.md
```

Windows (PowerShell):

```powershell
Add-Content .\CLAUDE.md "`n# Vision`n@VISION.md`n`nBefore planning anything that touches more than one file, read VISION.md section 4 and stop at the calls that stay mine."
```

Docs: "CLAUDE.md files can import additional files using `@path/to/import` syntax. Imported files are
expanded and loaded into context at launch alongside the CLAUDE.md that references them."

Two traps the docs name:
- A path wrapped in backticks is NOT imported ("To mention a path in your CLAUDE.md without importing it,
  wrap it in backticks"). Write `@VISION.md` bare, not in code formatting.
- "Relative paths resolve relative to the file containing the import, not the working directory."

Check it loaded: run `/context` in an **interactive** session and look for `VISION.md` under **Memory
files**. (`/context` is an interactive-only command — in a headless `claude -p` run it is just read back as
a plain prompt, not the structured breakdown. To prove the import loaded in a script or a `-p` call, ask
Claude a question only `VISION.md` can answer, the way this kit's own test did.)

## Step 3. Plan mode: Claude proposes, you decide

Press `Shift+Tab` until the status bar reads `⏸ plan mode on` (on a current install this usually starts in
auto mode, so the cycle runs default → accept-edits → plan — "until" is doing real work in that
instruction, it is rarely one press), or prefix one prompt with `/plan`, or start the session with:

```bash
claude --permission-mode plan
```

or set it as the project default (see below).

Docs: "Plan mode tells Claude to research and propose changes without making them. Claude reads files, runs
shell commands to explore, and writes a plan, but does not edit your source. Except in interactive terminal
sessions with bypass permissions available, edits stay blocked until you approve the plan."

**Tested 2026-10-02, Claude Code 2.1.285, headless (`claude -p --model haiku --strict-mcp-config`), in a
throwaway directory:** asked Claude to create a file and confirm it; checked the directory before and
after. Both ways of turning plan mode on were verified to block the write — the file was never created,
and Claude reported a plan instead of a result:
- `--permission-mode plan` on the command line.
- `"permissions": {"defaultMode": "plan"}` in `.claude/settings.json`, with no flag at all (see the JSON
  block under "Optional" below) — confirms the docs' claim that the settings-file default has the same
  effect as the CLI flag.

When the plan is ready Claude asks how to proceed. The options are **Yes, and use auto mode** (reads
**Yes, auto-accept edits** where auto mode is unavailable), **Yes, manually approve edits**, and **No, keep
planning**. `Ctrl+G` opens the plan in your editor so you can change it before Claude proceeds.

Optional: make plan mode the default for this project's terminal sessions. In `.claude/settings.json`:

```json
{
  "permissions": {
    "defaultMode": "plan"
  }
}
```

(Docs: "set `defaultMode` to `plan` in `.claude/settings.json`"; the key lives under `permissions`.
VS Code sessions do not read project settings for the starting mode; set `claudeCode.initialPermissionMode`
to `plan` in VS Code user settings instead.)

## Three honest caveats

1. The vision file is guidance, not a lock. Docs: "Claude treats CLAUDE.md files as context, not enforced
   configuration." Plan mode is the gate; the file is what the plan is judged against.
2. A current install does not start in plan mode, or even in "ask me first" mode, unless you set it that
   way. As of Claude Code 2.1.283+, an interactive terminal session's built-in starting mode is **auto
   mode** (a classifier reviews actions instead of you prompting for each one) — Manual review-everything
   mode is no longer the default. Step 3 above is how you opt this project into plan mode; without it,
   Claude edits and runs commands the classifier allows, without asking.
3. Plan mode's block on edits does not apply in an interactive terminal session where bypass permissions
   are available (docs, same page). If you run with `--dangerously-skip-permissions`, plan mode is advice
   only.

## Files

- `VISION.md`: the template, five sections, fill-in prompts in angle brackets.
- `CLAUDE.md.snippet.md`: the import line and the optional plan-mode default.
