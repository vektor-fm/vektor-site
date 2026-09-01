# The AI-native SDLC playbook, installable

Anthropic published how they actually build software with AI. The interesting
part is not the AI — it is that every stage now **ends by committing a file**.

This is that playbook with the enterprise language removed: the artifact chain,
both guardrail layers, and the one thing AI is never allowed to do.

From **vektor /// no. 045**.

---

## 1. The artifact chain

Every stage produces a file, and that file is what triggers the next stage.
Nothing is handed over in a chat window.

| Stage | Produces | Triggers |
|---|---|---|
| Intent | `intent.md` — what we want and why | the spec |
| Spec | `spec.md` — the contract, testable | the plan |
| Plan | `plan.md` — migration, then routes | the code |
| Code | the diff itself | review |

**Why it matters:** each handoff is a git commit, so the chain doubles as your
audit trail for free. You do not build the audit trail — you get it because the
work happens to be structured this way.

A real `git log` from a repo built this way reads:

```
$ git log --oneline --name-only
2cf2813  code: request + confirm endpoints
src/app.ts

98ee1a7  plan: migration, then two routes
plan.md

2b216bc  spec: single-use token, 30 min TTL
spec.md

be4579a  intent: password reset by email
intent.md
```

Read bottom-up, that is the whole decision history of the feature — who wanted
what, what was agreed, how it was going to be done, and what actually shipped.

**Install it this week:** pick one feature. Before any code, write `intent.md`
and commit it alone. Then `spec.md`, commit. Then `plan.md`, commit. Then the
code. Four commits instead of one, and the next person never has to ask why.

---

## 2. The two guardrail layers

These get used interchangeably and they are not the same thing. One is advice.
One is a wall.

| | Skills | Hooks |
|---|---|---|
| What it is | company policy, encoded | a script that runs before an action |
| The agent... | follows it | is stopped by it |
| Fails how | the agent can talk itself out of it | exit 2, the action never ran |
| Use for | conventions, house style, what "done" means | anything you cannot undo |

**Skills** look like: *never touch prod data · cite the file you changed · ask
before you spend.* The agent reads them and complies because it was asked to.

**Hooks** look like a `pre-tool-use` script that inspects the action and exits
non-zero. Nothing gets to reason its way past a non-zero exit.

**The rule:** if the consequence is reversible, a skill is enough. If it is not
— production data, spend, deploys, force-pushes — it must be a hook. Policy is
not protection.

---

## 3. The one thing AI is never allowed to do

**AI reviews every pull request. It can never approve its own code.**

A human keeps the merge button. Not because the review is worthless — the
review is genuinely useful and catches real things — but because the control is
the *approval*, not the review.

This is the line that makes the rest safe to adopt. Everything upstream can be
agent-driven precisely because this one gate is not.

---

## 4. Closing the loop

In production, an agent monitors live systems, diagnoses breaches, and writes
the next `intent.md`. The output of running the software becomes the input to
building it.

That is what makes it a loop rather than a pipeline: the last stage produces the
artifact the first stage consumes.

---

## The one-page version

1. Every stage ends by committing a file. The chain is the audit trail.
2. Skills are policy the agent follows. Hooks are scripts that block it.
   Reversible → skill. Irreversible → hook.
3. AI reviews everything and approves nothing. A human keeps the merge button.
4. Production writes the next intent file. The loop closes.

---

*One free setup a day → [@vektor.fm](https://instagram.com/vektor.fm)*
