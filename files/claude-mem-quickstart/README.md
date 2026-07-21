# claude-mem — the 5-minute quick-start

Claude Code forgets everything when you close it. `claude-mem` gives it persistent
memory across sessions. **87,000+ stars.** This is the exact install + the hook config,
with the traps that aren't obvious from the README.

> Repo: <https://github.com/thedotmack/claude-mem> · Apache 2.0 · not an Anthropic project.
> Every fact below was verified against the repo source on **2026-07-17**. Star counts and
> APIs move — check the repo before you trust a number.

---

## 1. Install

```bash
npx claude-mem install
```

Then **restart Claude Code**. That's it.

**Trap — do not use `npm install -g claude-mem`.** The repo's own README:

> `npm install -g claude-mem` installs the SDK/library only — it does not register the
> plugin hooks or set up the worker service.

You'd get the package and none of the behaviour, and nothing would tell you why.

**What the installer actually does:** auto-installs Bun and uv, bundles SQLite via
`bun:sqlite`, starts the worker. **Node.js 20+ is a real prerequisite** — it is *not*
auto-installed. The installer is **interactive**: it multi-selects your IDEs and prompts
for an LLM provider + API key. For unattended installs use the flags:

```bash
npx claude-mem install --ide claude-code --provider <provider> --model <model>
```

**Alternative, from inside Claude Code:**

```
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

**Telemetry is ON by default.** Opt out:

```bash
npx claude-mem telemetry disable
```

---

## 2. The hook config — what actually gets registered

From the shipped `plugin/hooks/hooks.json` (**not** the README — see the warning below).
Five Claude Code lifecycle events, plus a `Setup` version-check pre-hook:

| Hook | Matcher | What it does |
|---|---|---|
| `SessionStart` | `startup\|clear\|compact` | starts the worker + injects context (two hooks) |
| `UserPromptSubmit` | — | `session-init` |
| `PreToolUse` | **`Read` only** | `file-context` (async) |
| `PostToolUse` | `*` | `observation` (async) |
| `Stop` | — | `summarize` (async) |

**Two things worth knowing:**

1. **`PreToolUse` fires only on `Read`** — not on every tool call. If you expected capture
   on every tool, that's not what's registered.
2. **The repo's README contradicts its own shipped config.** The README lists `SessionEnd`
   (which is **not** registered anywhere) and omits `PreToolUse` (which **is**). If you're
   debugging hooks, read `plugin/hooks/hooks.json`, never the README.

---

## 3. How it works — three moves

1. **CAPTURE** — the hooks above watch the session: tool calls, decisions, file reads.
2. **STORE** — everything is compressed into a local **SQLite** database with AI-written
   summaries, plus a **Chroma** vector index for hybrid semantic + keyword search.
   (Source: `src/services/sqlite/`, `src/services/sync/ChromaSync.ts`.)
3. **RESTORE** — next session, `SessionStart` injects the relevant slice back automatically.

---

## 4. Real commands

These are the actual CLI commands (they require Bun, which the installer sets up):

```bash
npx claude-mem status     # worker status — PID, port, version, uptime
npx claude-mem doctor     # diagnose install/runtime health (bun, uv, worker)
npx claude-mem search <q> # search your stored context
npx claude-mem start|stop|restart
npx claude-mem repair     # run this after an upgrade
npx claude-mem update
npx claude-mem uninstall
```

**Note:** `status` reports **worker health**, not hook health. There is no command that
prints a hook count — if you want to know what's registered, read `hooks.json`.

---

## 5. Where it runs

**11 hosts**, per the CLI's own help output (`src/npx-cli/index.ts`):

```
claude-code, cursor, opencode, openclaw, windsurf,
codex-cli, copilot-cli, antigravity, goose, roo-code, warp
```

**Not all integrations are equal:**

- **Claude Code, Codex, Cursor** — hook-based. Automatic capture.
- **Copilot CLI** — **MCP-only**. You get *search*, but **not** automatic transcript
  capture. The CLI says so itself: *"Transcript capture is not available for {ideLabel}."*
- **Gemini is not a host.** It's an **LLM provider** option — the API used to compress
  observations, in the same slot as OpenRouter. If you're on Gemini CLI, this won't hook in.

---

## The honest caveat

This is a fast-moving third-party repo with ~87K stars, no Anthropic affiliation, and an
open issue count in the hundreds. It is genuinely useful and genuinely young. Read the
source before you point it at anything sensitive — and note the telemetry default above.

---

*vektor /// no. 014 — the AI frontier, cut to what ships. [@vektor.fm](https://instagram.com/vektor.fm)*
