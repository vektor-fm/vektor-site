# CLAUDE.md — house rules for Claude Code

<!--
  Claude Code reads this file at the START OF EVERY SESSION and keeps it in context.
  Put it in your project ROOT (or ~/.claude/CLAUDE.md for rules that apply everywhere).

  ONE meta-rule, from Anthropic's own docs: earn every line.
    "Would removing this line make Claude make a mistake?" If no, delete it.
  Anthropic is blunt about the failure mode: "Bloated CLAUDE.md files cause Claude
  to ignore your actual instructions." So: only what Claude CANNOT infer from the
  code itself — your commands, your structure, your conventions, your gotchas.
  Keep the whole file under ~200 lines. These <!-- --> comments are stripped before
  Claude reads it, so notes like this cost you nothing.

  The two sections below (OPERATING RULES) are ready to use as-is. Everything after
  is a template — replace the examples with YOUR project's real values, or delete a
  section you don't need. Run `/init` in Claude Code to auto-draft the project bits.
-->

## Operating rules — always

These seven are the whole point. They stop Claude Code overengineering, ignoring your
style, and calling things "done" that aren't. Keep them verbatim; they're universal.

1. **Smallest change that works.** Solve the actual task, nothing more — no refactors,
   no "while I'm here" edits, no new abstractions unless asked. Six lines, not a hundred.
2. **Match the style of the file you're in.** Read the surrounding code first and copy
   its patterns, naming, and imports. Don't impose a different style on one file.
3. **Done means the tests pass.** "Done" is never a claim — it's green tests. Red isn't
   done. Run the test command below before you say a task is finished.
4. **When unsure, ask — and never invent an API.** If a function, flag, or endpoint
   isn't confirmed to exist, stop and ask or check. Do not guess signatures or fabricate.

## Operating rules — faster & cheaper

Every line Claude reads is context it pays for, and a wrong turn costs the mistake plus
the correction plus the redo. These three cut your token bill and your review time:

5. **Plan first.** Before touching anything, list every file you intend to change and
   wait for my go. Planning against a file list beats discovering the plan mid-edit.
6. **Search before read.** Grep for the exact symbol; don't load whole files into
   context. On a real run this returned **4 lines instead of a 2,251-line file** — same
   answer, a fraction of the tokens.
7. **Show the diff first.** Print the exact change — old lines out, new lines in — and
   wait for a yes before writing. Approving 3 lines you can see beats 400 you can't.

<!-- ─────────────────────────────────────────────────────────────────────────
     TEMPLATE BELOW — replace the examples with your project's real values.
     This is where a CLAUDE.md earns its keep: the stuff Claude can't guess.
     ───────────────────────────────────────────────────────────────────────── -->

## Project overview

<!-- 1-2 lines: what it is + the stack. Orientation only — don't describe the codebase. -->
Example: Payments API. TypeScript + Node 20, Fastify, PostgreSQL via Prisma, pnpm.

## Commands

<!-- The single highest-value section: the exact commands Claude would otherwise guess
     wrong or waste tokens rediscovering. Use your real invocations. -->
- Install: `pnpm install`
- Dev server: `pnpm dev`
- Test one file (PREFER this — faster than the whole suite): `pnpm test path/to/file.test.ts`
- Test everything: `pnpm test`
- Lint / format: `pnpm lint` / `pnpm format`
- Typecheck: `pnpm typecheck`

## Architecture

<!-- Where things live, so Claude edits the right place. Non-obvious structure only. -->
- Route handlers: `src/routes/` — keep them thin, no business logic here.
- Business logic: `src/core/`
- DB access goes through `src/db/repositories/`, never raw queries from routes.
- Shared types: `src/types/` — import from here, don't redefine.

## Code style

<!-- ONLY what differs from defaults or what the linter doesn't already enforce.
     Don't restate conventions Claude already knows. -->
- ES modules (`import`/`export`), never CommonJS `require`.
- Named exports only; no default exports.
- Throw the project's `AppError`, never a bare `new Error`.

## Testing

- Framework + location: e.g. Vitest, `*.test.ts` next to the source file.
- Write a failing test that reproduces a bug BEFORE fixing it.
- Use the factories in `test/factories/` for test data — don't inline mocks.

## Git & PRs

- Branches: `feature/<kebab>`, `fix/<kebab>`. Never commit straight to `main`.
- Commit messages: imperative mood, say what changed and why.
- Run typecheck + tests before opening a PR.

## Gotchas

<!-- Non-obvious footguns that have bitten people. This section pays for itself. -->
- Required env: `DATABASE_URL`, `API_KEY` (see `.env.example`).
- `legacy/` is frozen — don't touch it.

<!-- ─────────────────────────────────────────────────────────────────────────
     Keep it under ~200 lines and prune whenever Claude repeats a mistake — treat
     this file like code. For rules that must fire EVERY time (not just "usually"),
     use a hook instead; for file-type-specific rules, use .claude/rules/*.md with
     `paths:` frontmatter so they load only when relevant.
     One free AI teardown a day → vektor.fm
     ───────────────────────────────────────────────────────────────────────── -->
