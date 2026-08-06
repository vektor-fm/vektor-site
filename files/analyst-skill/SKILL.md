---
name: analyst
description: Run a repeatable, self-auditing research loop over a set of candidates — screen against a weighted framework, log every run to a state file, challenge the first pass with a checker, and re-weight from what actually happened. Use when the user says "run the analyst", "/analyst", or wants a research process that compounds instead of restarting.
---

# The Analyst

This is not a stock picker and it does not give financial advice. It is a
**research loop that remembers**. The worked example below screens companies,
because that is a domain with a lot of public data and an obvious feedback
signal — but the architecture is the point, and it transfers to suppliers,
job candidates, papers, grants, or anything else you rank repeatedly.

Four parts make it compound:

1. a **weighted framework**, so every candidate is scored the same way
2. a **state file**, so every run can see every previous run
3. a **checker**, so the first pass gets argued with before you act
4. a **schedule**, so it runs without you starting it

Remove any one and you are back to a chatbot that starts from zero.

---

## Before the first run

Create `state.md` from `state-file.md` in this folder. It starts empty. It is
the single most important file here — **everything else is replaceable, the
state file is not.** Back it up.

Set your own weights in `## Framework` below. The numbers shipped here are
**illustrative placeholders**, not a recommendation. Weights encode what you
believe matters; if you adopt someone else's weights unexamined you have
learned nothing and the loop has nothing of yours to correct.

---

## The loop

### Step 0 — read the state file FIRST

Before anything else, read `state.md` end to end. Specifically pull out:

- every candidate surfaced before, and what it scored
- every weight adjustment made, and the run that caused it
- anything on the **Do not resurface** list, and why

If `state.md` is empty, say so plainly and continue. Never skip this step
because the file looks long. A run that has not read the state file is a first
run wearing a costume.

### Step 1 — gather

Pull current data on the candidate set. Note the **date and the source for
every figure**, in the state file, at the moment you record it. A number whose
provenance you cannot reconstruct is not evidence, and six months later you
will not remember.

If a figure cannot be sourced, record it as `unverified` rather than dropping
it. The gap is information.

### Step 2 — score against the framework

For every candidate, score each factor 0–10, multiply by that factor's weight,
sum. No exceptions, no "this one is obviously good". The value of a framework
is that it is applied identically to things you like and things you do not.

Show your working per candidate: factor, raw score, weight, contribution. If
you cannot justify a raw score in one sentence, it is a guess — mark it as one.

### Step 3 — the checker

Now run a **second, adversarial pass** over the shortlist. Its job is not to
confirm the first pass. Its job is to try to kill it. For each shortlisted
candidate, the checker looks for:

- what the first pass did not look at
- evidence that **contradicts** the reason it scored well
- concentration risk — one customer, one supplier, one product, one person
- anything the framework structurally cannot see

The checker gets the candidate and the thesis, and is told to argue against it.
If the checker cannot find anything, that is a finding too — say so.

### Step 4 — write the run to the state file

Append one row per run. Never edit history; append corrections as new entries.
The append-only rule is what makes the file trustworthy — a file you can
rewrite is a file that will quietly agree with you.

### Step 5 — re-weight from outcomes, not from feelings

When something you flagged plays out — well or badly — go back and ask which
factor was wrong, not whether you were unlucky. Then change that factor's
weight and **log the change with the run that caused it**.

This is the whole point of the system. One example: if you weighted a factor
heavily, a candidate scored well on it, and the outcome went against you — the
weighting was probably too aggressive for that category. Adjust it, record why,
and let the next run inherit the correction.

Do not re-weight from a single case if the case is ambiguous. Two cases
pointing the same way is a signal; one is an anecdote.

---

## Framework

Replace these with your own. The weights must sum to 1.0.

| factor | weight | what a 10 looks like | what a 0 looks like |
|---|---|---|---|
| *(factor 1)* | 0.30 | | |
| *(factor 2)* | 0.30 | | |
| *(factor 3)* | 0.25 | | |
| *(factor 4)* | 0.15 | | |

**Worked example — company screening.** Insider buying, free cash flow,
earnings surprises, analyst sentiment. Four factors that are public, checkable,
and mean different things, which is what you want: factors that all move
together are one factor wearing four hats.

---

## Tools

The loop works with nothing but the state file and a browser. These make it
faster:

| tool | what it adds |
|---|---|
| A web-scraping tool (e.g. Firecrawl) | reads public sources without you pasting them |
| A browser driver (e.g. Playwright) | works interactive screeners that have no API |
| A knowledge-base MCP (e.g. Obsidian) | reads and writes the state file where your notes already live |

Nothing here depends on a specific vendor. If a tool is missing, do that step
by hand and record it — a slower loop that runs is worth more than a faster one
that does not.

---

## Schedule

Run it on a timer — weekly is enough for most things. On each run:

1. read `state.md`
2. pull fresh data
3. score the set
4. cross-reference against last run: **what changed, and what does that tell you**
5. run the checker
6. append the run
7. output a ranked shortlist plus a one-page thesis per top candidate

The one-page thesis matters more than the ranking. A ranking you cannot explain
is a number you will not trust in three months.

---

## What this deliberately does not do

- **It does not tell you what to do.** It produces a ranked shortlist and the
  reasoning behind it. The decision is yours, and so is the responsibility.
- **It is not financial advice**, and nothing in it is a recommendation to buy
  or sell anything. If you apply it to investing, understand that a scoring
  framework is a way of organising your own judgement, not a substitute for it,
  and that past outcomes do not predict future ones.
- **It does not hide uncertainty.** Unverified figures stay labelled
  unverified, guesses stay labelled guesses, and the checker's objections are
  reported even when they are inconvenient.

---

*From Vektor — the AI frontier, cut to what ships. `vektor /// no. 032`*
