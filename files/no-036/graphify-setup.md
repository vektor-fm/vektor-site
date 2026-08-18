# Graphify — give Claude Code a map of your codebase

The exact setup we ran, with our own measured receipts. From vektor /// no. 036.

Every new Claude Code session rebuilds its mental model of your repo — the same
greps, the same file reads, paid for again each session. Graphify scans the
codebase once, builds a knowledge graph, and lets future sessions query the
graph instead of re-reading the code.

Repo: https://github.com/Graphify-Labs/graphify
(107,661 stars, Apache-2.0, last push 2026-08-17 — all read from the GitHub API
on 2026-08-18.)

---

## 1. Install

```
uv tool install graphifyy
```

Note the **double y** — `graphifyy` is the real package name. The single-y
spelling is a different package. We ran this on 2026-08-18 and it worked first
try. (No `uv`? Install it first: https://docs.astral.sh/uv/)

## 2. Build the graph

From your repo root:

```
graphify update .
```

This scans the codebase and writes the graph to `graphify-out/graph.json`.
On our render engine, one run scanned 196 files.

## 3. Query it

```
graphify query "how does our caption system connect to the render pipeline?"
```

Swap the quoted question for your own. The answer comes back inside a bounded
token budget instead of as a pile of file contents. On our run, the graph
answered that exact question with a real route — `Captions()` -> `Video.tsx` ->
`SceneBody()` — and every edge on that route exists in `graph.json` (we
verified the path by walking the graph ourselves, 2026-08-18).

To use it from Claude Code: tell Claude the graph exists (a line in your
CLAUDE.md pointing at `graphify-out/` and the `graphify query` command), so it
reaches for the map before it reaches for grep.

---

## Our measured receipts

One run, one real question, measured by us on our own render engine on
2026-08-18. Token figures are bytes/4 estimates.

| Measurement | Value | Measured |
|---|---|---|
| Files scanned by `graphify update` | 196 | 2026-08-18 |
| Graph size (raw) | 1,764 nodes / 3,457 edges | 2026-08-18 |
| Graph size (after clustering) | 2,993 nodes, 135 communities | 2026-08-18 |
| Tokens to answer our query by reading the 6 involved files | ~27,184 (bytes/4 estimate) | 2026-08-18 |
| Tokens for the graph's budgeted answer to the same query | ~2,000 (97 of 173 relevant nodes shown) | 2026-08-18 |
| Ratio, that one query | ~14x fewer tokens | 2026-08-18 |

What ~14x is, and is not: one query, on one codebase, measured once. Not a
benchmark. Your number will differ with your repo and your question. It is the
only Graphify speedup figure in this sheet that anyone actually measured.

---

## Honest caveats

- **The full graph is BIGGER than the codebase.** On our engine, `graph.json`
  weighs about 403k tokens against roughly 371k tokens for the code itself
  (both bytes/4 estimates, measured 2026-08-18). The win is per-query — a
  bounded ~2k-token answer instead of file reads — never whole-graph savings.
- **The graph goes stale.** It is a snapshot at scan time. After code changes,
  run `graphify update` again or it answers from an outdated map (repo README).
- **It maps code relationships, not process boundaries.** Our render script
  shells out to a CLI and shares no AST edge with the source tree, so no path
  to it exists in the graph. Questions that cross a process boundary will not
  be answered by the map.

## Two viral claims to ignore

1. **"70x fewer tokens per search."** The repo README never says this.
   Graphify's own blog calls the 71.5x figure "a community-reported number
   rather than a benchmark" (read at source, 2026-08-18). One user's anecdote,
   repeated until it sounded like a spec. Our measured figure was ~14x.
2. **"Every new session Claude re-reads your entire codebase."** False as
   stated — Claude Code uses on-demand agentic search and does not ingest your
   repo at session start (docs.anthropic.com, read 2026-08-18). The true
   kernel: it re-greps and re-reads the same files across sessions, and that
   repeated cost is real. That is what the graph removes.

---

vektor /// no. 036 · 08-2026 · the frontier, by the numbers
Full page with sources: https://vektor-fm.github.io/vektor-site/no-036.html
