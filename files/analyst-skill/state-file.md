# state.md — the analyst's memory

Copy this file to `state.md` and never delete it. It is the only part of the
system that cannot be regenerated.

**Append-only.** Never edit a past run. If a past run was wrong, add a new
entry saying so. A file you can rewrite is a file that will quietly agree with
you, and then the loop is learning from a story instead of from what happened.

---

## Framework version history

Every weight change, with the run that caused it. This table is the record of
what the system has actually learned.

| date | factor | from | to | caused by | reasoning |
|---|---|---|---|---|---|
| | | | | | |

---

## Runs

One block per run. Append to the bottom.

```
### Run <NNN> — <YYYY-MM-DD>

Framework version: <date of the most recent weight change>
Candidate set: <how it was assembled, and how many>

**Surfaced**
| candidate | score | top factor | weakest factor |
|---|---|---|---|
| | | | |

**Checker objections**
| candidate | objection | verdict |
|---|---|---|
| | | held / overruled — reason |

**Changed since last run**
- <what moved, and by how much>

**Acted**
- <what you actually did, or "nothing" — this column is what makes the
  outcome column meaningful later>

**Sources**
- <figure> — <source> — <date read> — verified / unverified
```

---

## Outcomes

Filled in later, when something plays out. This is the feedback signal; without
it the loop has memory but no learning.

| run | candidate | what happened | when | which factor was wrong | weight changed? |
|---|---|---|---|---|---|
| | | | | | |

---

## Do not resurface

Candidates ruled out for a structural reason, so future runs stop spending
attention on them. Include the reason — a rule you cannot audit becomes
superstition.

| candidate | why | date | revisit if |
|---|---|---|---|
| | | | |
