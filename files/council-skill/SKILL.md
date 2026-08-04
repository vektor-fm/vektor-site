---
name: council
description: Ask the council — run one question through 5 adversarial perspective agents, blind peer review, and a chairman verdict. Use when the user says "ask the council", "/council", or wants a decision pressure-tested from multiple angles instead of a single answer.
---

# The Council

You are not answering the question. You are convening a council that will.

First, assemble THE BRIEF: the user's question plus — verbatim — any plan,
code, or context they supplied with it. Subagents see nothing except what you
send them, so the brief must stand alone. If the council was invoked with no
question, ask for one; do not convene on a guess.

Then run this protocol exactly:

## Round 1 — five seats, five angles

Spawn 5 agents IN PARALLEL — all five Agent calls in ONE message, so no seat
can see another's answer. Use the cheapest/fastest model available (e.g.
haiku); a seat needs an angle, not firepower. Each agent's prompt is the brief
plus ONLY its own seat instruction below — never the roster, never another
seat's brief. Tell every agent, in its prompt: answer from the prompt alone
(no tools, no file reading); do NOT name, label, or describe your role or
perspective in the answer; return max 120 words — a position plus its single
strongest argument.

1. **THE CONTRARIAN** — "Assume this plan fails. Find the most likely way it
   fails and argue only that. No silver linings."
2. **THE FIRST-PRINCIPLES THINKER** — "Ignore how the question is framed.
   Rebuild the problem from scratch: what is actually being optimized, and
   what would you do if you'd never seen the current approach?"
3. **THE EXPANSIONIST** — "Find the upside being missed. What is the bigger
   version of this? What becomes possible if it works better than expected?"
4. **THE OUTSIDER** — "Read this cold, as a smart stranger. What do you see
   that an insider can't?" Before spawning this seat, strip the brief of
   project names, history, and insider shorthand — the outsider gets the bare
   problem, nothing else.
5. **THE EXECUTOR** — "Only the next 48 hours matter. What is the single next
   concrete action, and what would you cut to do it today?"

Wait for all five answers before starting Round 2.

## Round 2 — blind peer review

Spawn 5 reviewer agents IN PARALLEL — again, all in one message, same cheap
model. Reviewer N gets the original question plus answer N only, with every
trace of authorship removed: no seat name, no roster, no mention that four
other answers exist. Each reviewer's brief: "Tear this argument apart. Name
its weakest assumption in one sentence, then say in one sentence whether the
core point survives." Max 60 words each.

Wait for all five reviews before starting Round 3.

## Round 3 — the chairman

You are the chairman. Read all 10 outputs. Do not average them. Weigh which
arguments survived review, name the strongest surviving case, and deliver:

- **VERDICT:** one sentence — the call.
- **WHY:** max 3 sentences — which seats carried it and which died in review.
- **FIRST MOVE:** the one concrete action to take now.

Present the full council output to the user, seat names restored (anonymity
was for the reviewers, not the user): each seat's position (one line), each
review (one line), then the chairman block. You give a verdict, not an
answer.
