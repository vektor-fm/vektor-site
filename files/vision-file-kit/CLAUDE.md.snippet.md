# CLAUDE.md snippet

Paste the text **between** the fences below into your project's `CLAUDE.md` — never pipe this whole
`.md` file in with `cat >>` or `Get-Content | Add-Content`. The fences below exist so this file renders
legibly; they are not part of what you paste, and if they land in your `CLAUDE.md` too, the `@VISION.md`
line sits inside a fenced code block and is **not** imported ("Import parsing skips Markdown code spans
and fenced code blocks" — docs). Tested 2026-10-02: appending this whole file verbatim produced a
`CLAUDE.md` where Claude never loaded `VISION.md` at launch. See `README.md` for copy-pasteable
bash/PowerShell one-liners that write the bare block directly. Docs:
https://code.claude.com/docs/en/memory#import-additional-files (read 2026-10-01, re-verified 2026-10-02).

```text
# Vision
@VISION.md

Before planning anything that touches more than one file, read VISION.md section 4 and stop at the
calls that stay mine.
```

Optional, `.claude/settings.json`, so every terminal session in this project starts in plan mode
(docs: https://code.claude.com/docs/en/permission-modes#set-plan-mode-as-the-default, read 2026-10-01):

```json
{
  "permissions": {
    "defaultMode": "plan"
  }
}
```

Check: run `/context` in an **interactive** session; `VISION.md` should appear under Memory files. The
status bar should read `⏸ plan mode on`. (`/context` only works interactively — in a headless `-p` run it
is just read back as a plain prompt; ask a VISION.md-only question instead, as this kit's own test did.)
