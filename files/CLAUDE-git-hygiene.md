# CLAUDE.md — git hygiene for AI coding agents

<!--
  A drop-in section for your project's CLAUDE.md (or ~/.claude/CLAUDE.md for
  every repo you own). Claude Code reads CLAUDE.md at the start of every
  session and keeps it in context, so these rules apply before it runs a
  single git command.

  WHY THIS EXISTS: the moment you run more than one agent session — or an
  agent next to your own editor — the working tree stops being "yours".
  A broad `git add -A` doesn't know which changes are its own; it stages
  everything it finds, including another session's half-finished edits.
  These six rules are the ones we run in production on a repo that has
  several Claude sessions working in parallel every day. They exist to
  prevent collisions and silent data loss, not to add ceremony.

  Paste the section below into your CLAUDE.md as-is. The <!-- --> comments
  are for you; Claude follows the numbered rules.
-->

## Git hygiene — always

Multiple sessions (or an agent plus a human) may touch this repo at the same
time. To prevent collisions and silent data loss, every session MUST:

1. **Stage explicit paths only.** Use `git add <specific files>` — NEVER
   `git add -A`, `git add .`, or `git commit -a`. A broad add can sweep
   another session's in-flight edits into your commit. Only stage files you
   personally changed in this session.
   <!-- WHY: this is the #1 multi-session failure. The commit "works", the
        history looks clean, and someone else's half-done change shipped
        inside it. Explicit paths make that impossible. -->

2. **Check for a second session before committing.** If `git status` shows
   changes you didn't make, do NOT stage them — they may belong to a parallel
   session or an open editor. Commit only your own work, and say what you
   left behind.
   <!-- WHY: `git status` is the only cheap way to detect a collision BEFORE
        it becomes a bad commit. Unrecognized files are a stop sign, not
        clutter to be swept up. -->

3. **Push after you commit.** "Committed" is not "backed up" — until it's
   pushed, a commit exists on one machine and nowhere else. After committing,
   run `git push`; if pushing isn't possible (no network, no permission),
   explicitly say the work is committed-but-unpushed so a human can finish it.
   Never end a work session with silent unpushed commits.
   <!-- WHY: local-only commits fail in silence. Nothing looks wrong until
        the machine is gone. -->

4. **Never commit secrets or junk.** Before the first commit in any repo,
   make sure `.gitignore` excludes `node_modules/`, `.env` and credential
   files, model weights / large binaries, build outputs, and large media.
   If a repo has no remote at all, flag it — it is not backed up anywhere.
   <!-- WHY: a leaked .env is an incident; a committed node_modules/ is a
        repo tax forever. Both are one broad add away — see rule 1. -->

5. **Write meaningful commit messages.** One commit = one coherent change.
   The message says what changed and why — never "wip", "fixes", or "update".
   <!-- WHY: agents produce many commits fast; the message is the only
        audit trail a human reviews later. -->

6. **Put parallel work in worktrees.** Two sessions on the same repo means
   two working trees: use `git worktree` (in Claude Code:
   `claude --worktree <name>`) so each session gets an isolated folder and
   branch instead of fighting over one checkout.
   <!-- WHY: rules 1-2 reduce collision damage; worktrees remove the
        collision. Note: config in a PARENT folder (hooks, settings) applies
        to every worktree beneath it — treat shared-parent config as global. -->

<!--
  Tuning notes:
  - Keep the rules verbatim if you can — each line exists because removing it
    caused a real mistake. Prune anything else in your CLAUDE.md that Claude
    could infer from the code itself.
  - If a rule must fire EVERY time without exception (e.g. blocking commits
    to main), enforce it with a hook or a git pre-commit hook as well —
    CLAUDE.md instructs, hooks enforce.
  - Branching model, PR conventions, and test-before-merge rules belong in
    their own section; this one is only about not losing work.
  One free AI teardown a day → vektor.fm
-->
