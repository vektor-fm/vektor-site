# Auto-Markdown for Claude Code

vektor /// no. 060 · @vektor.fm · comment keyword `MARKDOWN`

A drop-in hook that makes Claude Code convert PDFs to Markdown automatically
before reading them, so you install it once and never think about it again.

## What it does, in one paragraph

Per Anthropic's own docs (`platform.claude.com/docs/en/build-with-claude/pdf-support`,
read 2026-10-01): when Claude reads a PDF, it converts every page to an
**image** and extracts the page's **text**, and both go into context. A
Markdown file only carries text. This kit installs a `PreToolUse` hook on
Claude Code's `Read` tool: the moment Claude is about to read a `.pdf`, the
hook runs Microsoft's `markitdown` CLI on it first, caches the converted
`.md`, and rewrites the tool call to read the `.md` instead — so the page
images are never generated for that file. If anything about the PDF or your
environment makes that a bad trade, the hook backs off and lets the original
PDF through untouched (see "When it does NOT convert" below).

## Install

**1. Install the `markitdown` CLI** (needs Python; pick ONE):

| Tool | macOS / Linux | Windows (PowerShell) |
|---|---|---|
| uv (recommended — isolated, no venv to manage) | `uv tool install "markitdown[pdf]"` | `uv tool install "markitdown[pdf]"` |
| pipx | `pipx install "markitdown[pdf]"` | `pipx install "markitdown[pdf]"` |
| pip | `pip install "markitdown[pdf]"` | `pip install "markitdown[pdf]"` |

(The MarkItDown README's own example uses single quotes,
`pip install 'markitdown[pdf]'` — that's a bash-ism. Use double quotes on
Windows, or no quotes at all if your shell doesn't need them; single quotes
are passed through literally by `cmd.exe` and PowerShell and will break the
install.)

Confirm it's on PATH: `markitdown --version` (this kit was tested against
`markitdown 0.1.8`).

**2. Copy the hook into your project** (or your home directory, for every
project — see "Project vs. user scope" below):

```
mkdir -p .claude/hooks
cp markitdown-claude-kit/.claude/hooks/markitdown-pretooluse.mjs .claude/hooks/
```

**3. Wire it into `settings.json`.** Merge the relevant snippet below into
your existing `hooks` block (don't just overwrite the file if you already
have hooks configured — merge the `PreToolUse` array entry).

### Project scope — `.claude/settings.json` in the repo

Use `settings.snippet.project.json`. This only affects Claude Code sessions
run inside that one project.

### User scope — `~/.claude/settings.json` (every project, every repo)

Use `settings.snippet.user.json`, and put the hook script at
`~/.claude/hooks/markitdown-pretooluse.mjs` (not inside any one project).

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read",
        "hooks": [
          { "type": "command", "command": "node \"$HOME/.claude/hooks/markitdown-pretooluse.mjs\"" }
        ]
      }
    ]
  }
}
```

**Windows note, tested 2026-10-01 on Claude Code 2.1.285:** Claude Code
expands hook `command` strings through a POSIX-style shell on every OS this
was tested on, Windows included (via Git Bash). Use `$HOME`, **not**
`%USERPROFILE%` — `%USERPROFILE%` was tried first and silently failed (the
hook command never ran, no error surfaced, Claude Code just fell through to
reading the original PDF). `$HOME` is set correctly on a normal Git-for-Windows
install, which is already close to a prerequisite for Claude Code on Windows.
If `$HOME` isn't set in your environment, set it once (`setx HOME %USERPROFILE%`
in a terminal, then restart your shell) rather than fighting the hook syntax.

No restart of Claude Code is needed after editing `settings.json` for a new
session; an already-running session needs `/hooks` or a restart to pick up
the change (standard Claude Code hook-reload behaviour).

## When it does NOT convert (and why that's correct, not a bug)

The hook backs off to the original, unmodified PDF — same as if the hook
weren't installed — in every one of these cases, and prints one line to
stderr each time:

1. **`markitdown` isn't on PATH.** Nothing is installed, nothing breaks.
2. **The PDF looks figure-heavy.** A zero-dependency heuristic counts
   embedded image objects against an estimated page count, straight from the
   PDF's raw bytes (no parsing library). Above ~0.5 images/page by default,
   the hook assumes the page images matter (charts, diagrams, screenshots,
   slide decks) and leaves the PDF alone. **This heuristic is approximate** —
   it can both over- and under-trigger (see Limitations) — so it's a safety
   default, not a guarantee.
3. **The converted Markdown is near-empty.** A scanned PDF has no text
   layer, and `markitdown`'s base install does not OCR (OCR is a separate
   `markitdown-ocr` plugin this kit does not install — see the MarkItDown
   README). Converting a scan yields ~0 characters of Markdown, which is
   strictly worse than the original PDF (Claude can at least see the scanned
   page as an image), so the hook detects this after conversion and falls
   back.
4. **You told it to skip**, two ways:
   - Per file: name the file `something.images.pdf`. Any path ending in
     `.images.pdf` is never converted.
   - Globally, for the session: `export MARKITDOWN_SKIP=1` (or set it before
     launching Claude Code). The hook becomes a no-op.

**Override the figure-heavy guess** (not the near-empty guard — converting a
scan to nothing is never useful) with `MARKITDOWN_FORCE=1`.

## When NOT to use this at all

Per Anthropic's PDF-support docs and the MarkItDown README (both read
2026-10-01):

- **Chart- or diagram-heavy PDFs**, where the visual is the content, not a
  decoration. Converting drops the image; Claude can no longer *see* the
  chart, only whatever caption text sat near it. The figure-heavy fallback
  tries to catch this automatically but is a heuristic, not a guarantee —
  for anything you know is visual, use the `.images.pdf` bypass and skip the
  guesswork.
- **Scanned PDFs with no text layer.** The hook catches this after the fact
  (empty conversion → fallback) rather than before, since there's no cheap
  way to know in advance without OCR.
- **Anything where table structure matters.** MarkItDown's PDF converter
  (pdfminer-backed) does not reliably preserve tables. On the 48-page NIST
  report used to build this kit, cover-page and other tables came out as
  broken pipe-rows (measured, see "What's actually measured" below) — still
  readable as text, not a clean table.

## What's actually measured (and what is NOT)

Every number below is from `data/2026-10-02-os-end-to-end/MEASURE.md` in the
Vektor repo, measured 2026-10-01, `markitdown 0.1.8`, on NIST AI 100-1
("Artificial Intelligence Risk Management Framework", Jan 2023, US federal
public-domain work):

| | |
|---|---|
| Source PDF | 48 pages, 1,946,127 bytes |
| Converted Markdown | 113,989 bytes, 12,625 words, 1,705 lines (UTF-8, `markitdown report.pdf -o report.md`, recorded 2026-10-01) |
| Conversion wall time | 3.4 s (recorded run, 2026-10-01; an earlier shell-redirect run took 2.9 s but wrote cp1252 on Windows, so use `-o`) |
| Output quality | Cover-page and several other tables broken into pipe-rows (149 lines); 231 lines have word-spacing loss from PDF text extraction; body paragraphs clean |

**Not measured, and not claimed anywhere in this kit or in the film: any
token saving.** Converting removes the page-image half of what a PDF Read
sends to Claude, but the actual token count of `report.pdf` vs. `report.md`
through Claude's own tokenizer was never measured (no API key was available
in the session that built this kit — see MEASURE.md "UNMEASURED — token
counts" for the full account). The only token figures anywhere in the film
or this README are Anthropic's own published range for PDF text —
1,500–3,000 tokens per page — stated as Anthropic's figure, not ours, with
the image cost explicitly billed **on top of** that, never netted against it.
If you want your own real number: run `/context` in Claude Code before and
after `Read`-ing a PDF, then again after converting it, and compare.

## Limitations

- The figure-heavy heuristic is a raw byte-scan for `/Subtype /Image` and
  `/Type /Page` markers in the PDF — not a real PDF parser. It under-counts
  on PDFs using compressed object streams, and it can flag a page with one
  large logo or letterhead image the same as a page full of charts. Treat it
  as a safety default you can override (`MARKITDOWN_FORCE=1`,
  `MARKITDOWN_SKIP=1`, or the `.images.pdf` filename bypass), not ground
  truth. Tested case: a genuinely figure-bearing 10-page excerpt of the same
  NIST report correctly tripped it (8 images / 10 pages ≈ 0.8/page); the
  48-page full report did not (stayed under the 0.5/page default) and
  converted cleanly.
- Cache keys are `sha1(absolute path + size + mtime)`, stored at
  `.claude/markitdown-cache/<hash>.md` under the current project
  (`$CLAUDE_PROJECT_DIR`), with one append-only `log.jsonl` line per
  decision (convert / cache-hit / fallback, with the reason). Nothing is
  cleaned up automatically — it's plain files, delete the directory to
  clear it.
- Only the `Read` tool is hooked. If something else in your workflow reads
  the PDF bytes directly (a Bash `cat`, a script), this kit does not touch
  that path.
- Zero npm dependencies by design (Node built-ins only: `fs`, `path`,
  `crypto`, `child_process`), but it still depends on Python + `markitdown`
  being installed and on PATH — that's the one external dependency this kit
  can't remove, because conversion has to happen somewhere.

## Files in this kit

```
markitdown-claude-kit/
  .claude/hooks/markitdown-pretooluse.mjs   the hook itself (Node, zero deps)
  settings.snippet.project.json             merge into .claude/settings.json (project scope)
  settings.snippet.user.json                merge into ~/.claude/settings.json (user scope, every project)
  README.md                                 this file
```

---

the AI frontier, cut to what ships → @vektor.fm
