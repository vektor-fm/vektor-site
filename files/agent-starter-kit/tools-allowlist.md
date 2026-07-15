# The tools allowlist — what to grant, and why

An agent's `tools:` line (in the frontmatter of `.claude/agents/<name>.md`)
is its keycard. It lists exactly which tools the agent may use, comma-
separated. **Omit the line and the agent inherits everything** — including
the ability to edit files and run arbitrary commands. That's fine for a
builder; it's wrong for a judge.

The rule is the same one you'd use for a human hire: **least privilege**.
Grant the tools the job needs, nothing more. Not because the agent is
malicious — because an agent that *can't* do the wrong thing never does it
by accident, no matter how the prompt drifts.

## The tiers

### Tier 1 — Reader (research, triage, review)

```yaml
tools: Read, Grep, Glob
```

- `Read` — read any file
- `Grep` — search file contents
- `Glob` — find files by name/pattern

Can inspect the entire repo; cannot change a byte of it. Start every new
agent here and promote only when a run actually fails for lack of a tool.

### Tier 2 — Reader + terminal (reviewers that run checks)

```yaml
tools: Read, Grep, Glob, Bash
```

Adds `Bash`: the agent can run commands — `git diff`, the test suite,
a linter, a build. Most review/judge agents live here, because a verdict
based on *running the tests* beats a verdict based on reading them.

**Know what you're granting:** Bash is the sharp knife. A shell can write
files and touch the network even when `Write`/`Edit` are withheld, so a
Tier-2 agent is "read-only" by instruction, not by physics. Two mitigations:

1. Say it in the agent's Rules section ("Read-only: never modify anything")
   — instructions do most of the work.
2. Enforce it in `.claude/settings.json` permissions, which apply underneath
   every agent — deny the commands nobody should run unattended:

```json
{
  "permissions": {
    "deny": [
      "Bash(git push --force*)",
      "Bash(rm -rf*)",
      "Read(.env)",
      "Read(.env.*)"
    ]
  }
}
```

### Tier 3 — Builder (does the actual work)

```yaml
tools: Read, Grep, Glob, Bash, Write, Edit
```

Adds `Write` (create/overwrite files) and `Edit` (targeted changes). This is
the agent you delegate real work to — and the reason your review judge must
NOT be this agent. Builder builds, judge judges; the two roles in one set of
hands is how bad work approves itself.

### Add-ons (grant per job, not by default)

- `WebSearch`, `WebFetch` — the open web. For research/pitch agents that
  need fresh information. Leave off anything that handles untrusted input
  it doesn't need.
- `Task` (spawn subagents) — lets the agent delegate to other agents.
  Powerful for orchestrators; overkill for single-job employees.

## The three employees, cast

| Agent | Tools | Why |
| --- | --- | --- |
| pitch agent | `Read, Grep, Glob, Bash, WebSearch, WebFetch, Write` | researches the fresh stuff, writes ONE pitch file |
| build agent | `Read, Grep, Glob, Bash, Write, Edit` | does the work — full toolbelt, no web it doesn't need |
| review judge | `Read, Grep, Glob, Bash` | runs the checks, renders the verdict, changes nothing |

## The 10-second audit

For every agent you have, ask: **"what's the worst thing this agent could do
with the tools it has — and does its job require that?"** If the answer is
"no", remove the tool. You can always grant it back the day a run needs it.
