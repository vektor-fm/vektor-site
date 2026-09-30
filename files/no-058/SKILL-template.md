---
name: your-skill-name
description: What this procedure does, in one or two sentences. Use when asked to <verb>, <verb>, <verb> or <verb> <the thing> (the words you would actually type when you need it).
---

# your-skill-name

<!--
vektor /// no. 058 · blank SKILL.md template · 2026-09-30

Where it goes: .claude/skills/your-skill-name/SKILL.md (this repo only)
or ~/.claude/skills/your-skill-name/SKILL.md (every repo on your machine).

How it loads (code.claude.com/docs/en/skills, read 2026-09-29):
- At startup Claude Code puts a listing of skill names and descriptions
  into context. The body below stays on disk.
- When your request matches the description, the rendered SKILL.md enters
  the conversation as a single message and stays there for later turns.
- description + when_to_use are truncated at 1,536 characters in the
  listing, so put the trigger words first.

If it never fires: check the description includes the words you would
naturally say (the docs' "Skill not triggering" step 1). You can also
call it by name: /your-skill-name.

Delete this comment block when you are done.
-->

Paste the procedure you moved out of CLAUDE.md here: the multi-step
commands, the order they run in, what counts as pass or fail.

1. First step, with the exact command.
2. Second step.
3. What to report at the end.
