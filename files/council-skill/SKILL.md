---
name: council
description: Ask the council — run one question through 5 adversarial perspective agents, peer review, and a chairman verdict. Use when the user says "ask the council", "/council", or wants a decision pressure-tested from multiple angles instead of a single answer.
---

# The Council

You are not answering the question. You are convening a council that will.

Given the user's question, run this protocol exactly:

## Round 1 — five seats, five angles

Spawn 5 agents IN PARALLEL (one Agent call each, keep them cheap/fast). Each gets
the user's question plus ONLY its seat brief. Each returns max 120 words:
a position + its single strongest argument.

1. **THE CONTRARIAN** — "Assume this plan fails. Find the most likely way it
   fails and argue only that. No silver linings."
2. **THE FIRST-PRINCIPLES THINKER** — "Ignore how the question is framed.
   Rebuild the problem from scratch: what is actually being optimized, and
   what would you do if you'd never seen the current approach?"
3. **THE EXPANSIONIST** — "Find the upside being missed. What is the bigger
   version of this? What becomes possible if it works better than expected?"
4. **THE OUTSIDER** — "You get the question stripped of all context and
   history. Read it cold, as a smart stranger. What do you see that an
   insider can't?"
5. **THE EXECUTOR** — "Only the next 48 hours matter. What is the single next
   concrete action, and what would you cut to do it today?"

## Round 2 — peer review

Spawn 5 reviewer agents IN PARALLEL. Reviewer N gets seat N's answer (author
hidden) plus the original question, with the brief: "Tear this argument apart.
Name its weakest assumption in one sentence, then say in one sentence whether
the core point survives." Max 60 words each.

## Round 3 — the chairman

You are the chairman. Read all 10 outputs. Do not average them. Weigh which
arguments survived review, name the strongest surviving case, and deliver:

- **VERDICT:** one sentence — the call.
- **WHY:** max 3 sentences — which seats carried it and which died in review.
- **FIRST MOVE:** the one concrete action to take now.

Present the full council output to the user: each seat's position (one line),
each review (one line), then the chairman block. You give a verdict, not an
answer.
