# Four things to do with Claude Fable 5.1

The four moves from NO. 046, with the prompts written out. Copy them, change the
bracketed parts, run them. Nothing here needs a subscription to anything but the
model itself.

Anthropic shipped Fable 5.1 on 1 September 2026. The reason to open this is not
the benchmark table. It is that a frontier model you last used six months ago is
now good enough to be pointed at your own work and told to be honest about it.

---

## 1. Point it at something you already built

Not a toy. A thing that exists and that you care about: an app, a site, a
contract, a deck, a spreadsheet that runs part of your business.

> Here is [THE THING]. I built it and I am too close to it.
>
> Go through it as three different people, and label which one you are being:
> (a) a hostile reviewer whose job is to find the weakest part,
> (b) a new hire who has to use it on day one with no explanation,
> (c) the person who has to maintain it in two years.
>
> For each one, tell me: what is broken, what is missing, and what you would
> change first. Rank everything by what it costs me to leave it alone.
>
> Do not be encouraging. I am not asking whether it is good.

**Why the three-reader framing.** Asking "what's wrong with this" gets you a
list of small, safe notes. Asking it to hold a specific reader in mind produces
findings that contradict each other, and the contradictions are where the real
problems are.

**A real example of the move.** In Anthropic's launch material, Millennium
describe pointing the model at a rare crash in their internal systems that none
of their engineers, or any other model, had explained after four to five years
of trying. It found the cause. That is the same instruction as above, aimed at a
bug instead of a document.

---

## 2. Build an agent

Something that runs without you. It can be small. Most people still have not
built one, which is fair, because until recently they were flaky. That stopped
being true this year.

Start with a job you do on a schedule and resent.

> I want to build a small agent that does one job end to end, without me.
>
> The job: [DESCRIBE IT IN ONE SENTENCE].
> It runs: [WHEN - on a schedule, on an event, when I ask].
> It has access to: [FILES / A FOLDER / AN API / NOTHING BUT THE WEB].
> It is finished when: [THE OBSERVABLE END STATE].
>
> Before writing anything, ask me the questions you need answered to build it
> properly. Then write it as the smallest thing that could work, with the loop
> written out explicitly: what it reads, what it does, how it checks its own
> work, and what it does when the check fails.
>
> Tell me the one failure mode most likely to bite me in week one.

**The shape that matters** is read, do, check, and back to read. An agent that
cannot check its own work is a script with extra steps.

**Start it read-only.** Give it the ability to look and to propose, and hold
back the ability to change anything until you have watched it run a few times.

---

## 3. Describe the hardest unsolved problem you have

The one you have been avoiding. In detail, the whole thing. This is the move
people skip because it feels like it will not work.

> I am going to describe a problem I have not solved. It is not a coding
> problem. Read all of it before you respond.
>
> [THE WHOLE THING. What it is. How long it has been going. What you have
> already tried and why each attempt failed. Who else is involved. What you are
> afraid the real answer is.]
>
> First, play it back to me: what do you think the actual problem is, as opposed
> to the one I described? Say it plainly even if it is unflattering.
>
> Then give me three moves I could make this week. For each, tell me what it
> costs if it is wrong.
>
> Do not motivate me. Do not summarise what I said back at me as agreement.

**Give it the failures.** The list of what you already tried is what turns this
from a horoscope into an analysis. Without it you get the obvious three
suggestions you already rejected.

**Length is a feature here.** This is the one prompt where a page of context
beats a tidy paragraph.

---

## 4. Experiment with effort levels

The pricing moved, so the arithmetic moved with it. Anthropic cut cache reads by
75 percent, to 25 cents per million tokens, and puts that at roughly a quarter
off a normal workload and close to half off an agentic one. Knowing which tier a
job actually needs is now real money.

> For each of these jobs, tell me the cheapest model tier and effort setting
> that still does it correctly, and say what specifically breaks if I go one
> step cheaper:
>
> 1. [A HIGH-VOLUME, LOW-JUDGEMENT JOB - classifying, extracting, tagging]
> 2. [A DRAFTING JOB - first drafts a human will edit]
> 3. [A JOB WHERE BEING WRONG IS EXPENSIVE - anything customer-facing or legal]
> 4. [A LONG AGENTIC JOB - many steps, lots of re-reading]
>
> For number 4, tell me what to cache and what not to bother caching, and why.
>
> Give me a one-line rule I can apply to a new job without asking you again.

**The rule of thumb worth having:** high volume plus low judgement goes to the
cheapest tier that passes your own spot check. Keep the expensive tier for the
work where being wrong costs more than the tokens saved.

**Caching is the part people leave on the table.** In a long agentic run the
same context is read over and over. That is exactly the read the price cut
applies to.

---

## The order to do them in

If you only do one, do the first. It takes ten minutes and it tells you whether
the rest of this is worth your afternoon.

If you do two, do the first and the third. They are the two that need nothing
but a model and honesty, and they are the two nobody does.

---

*NO. 046 - vektor - The AI frontier, cut to what ships - @vektor.fm*
