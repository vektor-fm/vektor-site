# The five installs — NO. 039

Five things to put in front of Claude Code so you stop losing hours to the usage
limit and to re-explaining your own repo every morning.

Every command below was read from the project's own source on **23 August 2026**.
Versions move — check the repo before you trust a number.

---

## Copy-all

```bash
# 1 · OmniRoute — one endpoint in front of 90+ free providers
npx -y omniroute

# 2 · claude-mem — memory that survives the session (needs Node 20+)
npx claude-mem install

# 3 · Headroom — compresses what you send before it reaches the model
pip install "headroom-ai[all]"

# 4 · Claude Code Setup — Anthropic's own, read-only
#     install from claude.com/plugins/claude-code-setup ("Install in Claude Code")

# 5 · Task Observer — turns your corrections into skills
git clone https://github.com/iamneilroberts/claude-skills
cp -r claude-skills/skills/* ~/.claude/skills/
```

Restart Claude Code after 2 and 5.

---

## 1 · OmniRoute — never hit the ceiling

`npx -y omniroute` · also `npm install -g omniroute` or `docker run diegosouzapw/omniroute`

One endpoint that fails over across providers when your model runs out, so a limit
stops being the end of the session. **MIT**, self-hosted, **53.6k stars**.

The README's own numbers: **90+ free tiers, 56 free forever, no card**, and
**"~1.51B Free Tokens / Month"** across those documented free tiers.

> **Straight about the provider count.** We read **349 providers** on 23 August 2026
> and that is the figure in the film. The README is not internally consistent — its
> stats block says **342 (v3.8.50)** and its headline promise says **351**. Same page,
> three numbers. Take the order of magnitude, not the digit.

Repo: <https://github.com/diegosouzapw/OmniRoute>

## 2 · claude-mem — stop re-explaining your codebase

```bash
npx claude-mem install
```

Or from inside Claude Code:

```
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

Persistent memory across sessions: it holds the project and the files, so a new
morning does not start with you describing your own repo again.

**Node.js 20.0.0 or higher is a real prerequisite** — it is not auto-installed.
Bun, uv and SQLite are handled for you. **Apache 2.0. Not an Anthropic project.**

**Trap:** `npm install -g claude-mem` gets you the library and none of the
behaviour — it does not register the hooks or start the worker.

Repo: <https://github.com/thedotmack/claude-mem>

## 3 · Headroom — send less, get the same answer

```bash
pip install "headroom-ai[all]"
```

Sits in front of the model and compresses your context before it goes out.
**Apache 2.0, open source, local-first.**

> **What the 77% is.** "77% fewer input tokens" is **Headroom's own traced example**
> on their own site, not an independent benchmark and not a promise about your repo.
> Measure it on your own workload before you count the saving.

Site: <https://headroomlabs.ai>

## 4 · Claude Code Setup — Anthropic's own

Install from <https://claude.com/plugins/claude-code-setup> — the page carries an
**"Install in Claude Code"** button. Badged **"Made by Anthropic"** and
**"Anthropic Verified"**, **195,067 installs** as of 23 August 2026.

It reads your repo and names the MCP servers, skills, hooks, subagents and slash
commands worth adding for your specific stack.

> **It is read-only.** It recommends; it never edits your files. If you have seen it
> described as a tool that "cleans up" or "removes the fluff" from your setup, that
> is wrong — it changes nothing.

## 5 · Task Observer — your corrections become skills

```bash
git clone https://github.com/iamneilroberts/claude-skills
cp -r claude-skills/skills/* ~/.claude/skills/
```

Captures the corrections you make while working and turns them into skill
improvements, so the same correction stops recurring. It is a **skill**, not a
plugin — every skill in that repo is `user_invocable`, so it is both a
`/slash-command` and something Claude can auto-invoke.

> **Credit where it is due.** `skills/task-observer/` is third-party, redistributed
> unmodified under **CC BY 4.0**, © Eoghan Henn (rebelytics.com).

---

*vektor /// no. 039 · the frontier, cut to what ships · @vektor.fm*
