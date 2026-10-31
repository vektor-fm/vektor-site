---
name: agent-ready
description: Check whether an AI agent can use a web page you own (buy, sign up, check out), grade it with Lighthouse's Agentic Browsing category, and name every control the agent could not read. Use on your own store, signup or checkout page, in test mode only.
---

# Agent-ready check

Run this only on a page you own, with the payment provider in TEST MODE. Never enter a real card.

## 0. One-time setup (run in a terminal, not by the agent)

    claude mcp add playwright -- npx @playwright/mcp@latest --device "iPhone 15"

Restart Claude Code, run /mcp, and confirm `playwright` is connected.
Lighthouse's Agentic Browsing category is experimental and needs Chrome 150 or later.

## 1. The buy test

Using the Playwright MCP tools, open <URL> and take a `browser_snapshot`.
Then do the task: buy the one product on <URL> with test card 4242 4242 4242 4242
(any future expiry, any CVC). Log every step to AGENT-READY.md:
- what the snapshot showed for each control you used (role and name),
- every control that had a role but no name (for example a bare `button`),
- every place you had to guess or got stuck.

## 2. The grade

    npx lighthouse <URL> --only-categories=agentic-browsing --output=html --output-path=./lighthouse-before.html

Write the pass ratio (x of y) and every failing audit with its failing element into AGENT-READY.md.

## 3. The fix

For every control from step 1 with no name, and every element Lighthouse lists under
"Buttons must have discernible text" (or a missing form label):
- icon-only button: add aria-label="<what it does>", for example aria-label="Add to cart", aria-label="Close";
- input: give it a <label for="..."> (or aria-label if there is no visible label).
Name every flagged control, not only the buy button: the audit lists one failing node at a time,
and the ratio rises only when all of them have names. Change nothing else.

## 4. Rerun

Repeat steps 1 and 2 (save the report as ./lighthouse-after.html). Finish with a short table in AGENT-READY.md:
the before and after snapshot rows for each fixed control, the before and after pass ratio,
and whether the test purchase completed.
