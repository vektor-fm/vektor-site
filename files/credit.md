# no. 052 — CREDIT

Every primary document in the OpenAI / Navier–Stokes credit dispute, with what each one
does and does not say. Compiled 2026-09-14. Nothing here is a summary of a summary: every
PDF listed below was downloaded and its text extracted for this sheet, and every page
count, author line and build date came from the file itself rather than from coverage of
it. Where something was not read, it says so.

Background on the maths itself (what "finite-time blowup" means and why it settles the
problem): https://vektor-fm.github.io/vektor-site/navier-stokes.html

---

## The 60-second version

- There are **three** preprints from Alpöge and Buckmaster, not one. A fourth was held
  back because its Lean verification had not finished.
- The whole line of attack belongs to **Diego Córdoba and Luis Martínez-Zoroa**.
  Buckmaster says so himself, in writing. So does OpenAI's own paper, five times.
- OpenAI's result is **unforced**; the mathematicians' Euler result is **forced**.
  Different theorems. Whether the gap is a footnote or a mountain is the whole dispute.
- OpenAI says in its own announcement that it does **not** intend to claim the Millennium
  Prize, and that it **recognises the priority** of the mathematicians' forced Euler work.
- OpenAI's 166-page paper **never names Alpöge**, anywhere, including the bibliography.
- The Clay Mathematics Institute has **confirmed nothing and awarded nothing.**
- Buckmaster explicitly says he has **not seen** OpenAI's proof and is **not accusing
  anyone of anything.**

---

## 1. The three preprints

All three sit on Buckmaster's NYU Courant page. **None of them is on arXiv.** That matters
more than it sounds: arXiv is where mathematicians timestamp priority, so a paper that
only ever lived on a personal page has no public clock on it. It is part of why this
dispute is hard to adjudicate by date alone — and why the PDF build dates below are worth
having.

**Blowup for the Euler Equations with Smooth Forcing** — 112 pages
https://cims.nyu.edu/~tristanb/euler.pdf
PDF built 2026-09-07, 19:04 (−04:00). Downloaded and read 2026-09-14.

A finite-time singularity for the incompressible Euler equations on R³ with a force that
stays smooth in space and time up to and including the blowup time. The abstract states
plainly that the construction continues the program of Córdoba and Martínez-Zoroa.

**Blowup for the Boussinesq Equations with Smooth Forcing** — 76 pages
https://cims.nyu.edu/~tristanb/boussinesq.pdf
Levent Alpöge and Tristan Buckmaster. PDF built 2026-09-07, 21:22 (−04:00).

The companion construction the Euler paper leans on. Opens by naming the Córdoba and
Martínez-Zoroa multiscale program as the thing it follows.

**Extending the Córdoba–Martínez-Zoroa IPM Blow-Up to Uniformly Space-Time Smooth
Forcing** — 57 pages
https://cims.nyu.edu/~tristanb/ipm.pdf
Levent Alpöge, Tristan Buckmaster and Matei P. Coiculescu. PDF built 2026-09-08, 03:36 UTC.

The earlier, slower result — finite-time blowup for the incompressible porous media
equation. Note the third author, and note that the title itself says whose program this is.

**The fourth paper, not released.** Buckmaster's statement says they believe they also have
blowup for hypo-dissipative Navier–Stokes, and that they withheld it for one reason: unlike
the other three, its Lean verification had not finished. He says it is suggestive of a path
to unforced Euler — which is the thing OpenAI proved.

---

## 2. Buckmaster's statement — four pages, signed

https://cims.nyu.edu/~tristanb/statement.pdf
PDF built 2026-09-08, 02:38 UTC. Downloaded and read end to end, 2026-09-14.

If you read one document in this dispute, read this one. It is short, it is in his own
words, and it quotes its own correspondence rather than summarising it.

**The timeline he gives.** Progress was slow for most of the past year. On 15 August they
obtained the smooth-forcing blowup results for both Boussinesq and Euler. The Lean
verification finished on 22 August. On 3 September, with a rumour circulating that
Anthropic had resolved a major open problem and with Alpöge having heard that information
about their progress had reached OpenAI, Buckmaster emailed a prominent mathematician at
OpenAI — he reproduces that email in full. He was asked to meet on the 4th, declined, and
was asked again on Sunday 6 September; the three of them spoke twice that afternoon, with
Sébastien Bubeck joining. Alpöge was not on the calls.

**What he says he was told, and what changed during the call.** He writes that he was shown
a prompt and told the internal model had simply been given the problem statement with very
little human input — and that over the course of the call this turned out not to be so. His
account is that an entire team had been working on it, that this was one of a number of
things tried, that the model had been set easier problems first, that the prompt he had
been shown was itself written by prompting Codex, and that the first prompt had gone out
only in the previous few days, after word of his work reached OpenAI.

**The question that did not get an answer.** He asked whether the model had been trained on,
or had access to, the Codex sessions he and Alpöge had been putting every draft into. He
writes that he was told the model did not look up user data — and that when he asked again,
about training specifically, he did not get an answer. The two questions are not the same
question, and that distinction is doing a lot of work.

**The two proposals.** He describes being offered two arrangements and declining both. He
also describes being told that if OpenAI posted after them, OpenAI would say they deserved
the Clay Prize and were the closest humans to the problem.

**What he explicitly does not claim.** He states that he has not seen OpenAI's proof, does
not know what their model did or how, does not know whether his data was used, and is not
accusing anyone of anything. He says he is setting out what he was told, when, and what was
proposed to him. **Anyone citing this statement as proof of theft is claiming more than its
author does.**

**He is also hard on his own papers.** He says he is unhappy with the presentation quality,
that the Boussinesq and Euler write-ups are much closer to what models produce under human
direction than to a paper written by a person, and he apologises for it. Worth knowing
before treating 112 pages as 112 pages of finished mathematics.

---

## 3. What OpenAI published

**The announcement — "On the Navier–Stokes Millennium Prize Problem"**
https://openai.com/index/navier-stokes-solution/
Dated 8 September 2026, bylined to OpenAI rather than to any person.
Read directly in a browser on 2026-09-14; a plain fetch returns HTTP 403.

Three things on that page that most of the coverage left out:

1. **They say they are not claiming the prize.** In their own words, they do not intend to
   claim the Millennium Prize for this result.
2. **They recognise the mathematicians' priority.** They state that they recognise the
   priority of Alpöge and Buckmaster's work on forced Euler and congratulate them on it.
3. **They draw the forced/unforced distinction themselves.** In the Euler case, Alpöge and
   Buckmaster proved a result *with* external forcing; OpenAI's system proved one *without*.

They also say their own effort began on 1 September, after hearing a rumour they later
connected to Alpöge — described on their page as an Anthropic employee — and Buckmaster.

**The paper — "Finite Time Blowup for Navier–Stokes", 166 pages**
https://cdn.openai.com/pdf/32d9f210-8b73-45e0-91bc-82a30aef8a9a/navier-stokes.pdf
Downloaded, text-extracted and searched 2026-09-14. PDF built 2026-09-08, 19:06 UTC.

- The author line reads **OPENAI**. No individual names. The PDF's own author and title
  metadata fields are empty.
- There is **no acknowledgements section** anywhere in the 166 pages.
- 22 references. **Buckmaster appears twice**, both times for a 2019 Annals paper with Vlad
  Vicol on nonuniqueness of weak solutions — unrelated to this work.
- **Alpöge is never named.** A search for the string "Alp" across the whole extracted text
  returns zero hits, in the body and in the bibliography.

**Who published first.** Buckmaster's statement PDF was built at 02:38 UTC on 8 September;
OpenAI's paper PDF at 19:06 UTC the same day, about sixteen and a half hours later. Both
figures are from the PDFs' own metadata. A build time is when a file was compiled, not when
it was posted — treat it as a floor on publication, not as publication itself.

**The Lean formalisation**
https://github.com/openai/NavierStokesAndEuler
README read directly 2026-09-14: "Lean 4 formalizations of the results presented in
'Finite time blowup for Navier-Stokes' and 'Finite time blowup for the Euler equation'
by OpenAI."

A Lean 4 proof is one a computer checks line by line, so it answers *is this proof correct*.
It does not answer *whose proof is this*. And it is not a point of difference between the
two sides: the mathematicians' three released papers were Lean-verified on 22 August, per
Buckmaster's own statement, and Tao's blog post notes the formalisation independently.

---

## 4. Where the credit actually starts — Córdoba and Martínez-Zoroa

Two names that are in almost none of the coverage and in every one of the documents.

Diego Córdoba and Luis Martínez-Zoroa spent years constructing blowups with rough forcing.
Every paper in this story builds on that program.

- **Buckmaster says so himself.** His statement says the program was not started by him and
  was not proposed by a language model, that the credit for the basic idea belongs to
  Córdoba and Martínez-Zoroa, and that in his view Martínez-Zoroa deserves a Fields Medal.
  What he and Alpöge did, on his account, was take that program from rough forcing to smooth
  forcing and on to Euler, with heavy use of LLMs.
- **OpenAI's paper says so too.** Córdoba and Martínez-Zoroa are cited five times across its
  introduction and bibliography, including the hypodissipative Navier–Stokes work with Fan
  Zheng. (Searched in the downloaded PDF, 2026-09-14.)

Both sides agree on whose program this is. They disagree about who finished it.

**One more thing from the statement:** Buckmaster describes the collaboration as purely
personal, with no institutional agreement or official involvement from either employer, and
says he paid for the tools out of his own research funds — including a large bill to OpenAI.

---

## 5. Terence Tao, twice

**The blog post, 7 September — the maths**
https://terrytao.wordpress.com/2026/09/07/finite-time-blowup-with-smooth-forcing-term-for-the-incompressible-porous-medium-boussinesq-and-incompressible-euler-equations/
Read directly 2026-09-14.

Written before OpenAI's announcement and not mentioning it. Tao walks through the
mathematicians' construction, places it in the Córdoba and Martínez-Zoroa lineage, and
notes that their work has also been formalised in Lean.

**The Mastodon post — the pattern**
https://mathstodon.xyz/@tao/117237320796901560
Read directly on mathstodon 2026-09-14.

His point is about scarcity: it is now the identification of a promising problem that is the
rare and precious resource. And that we have now seen the mere rumour of someone working on
a problem trigger enough AI-powered effort to flatten it before the original research
project has time to reach its full potential.

---

## 6. What the Clay Mathematics Institute actually said

**The problem page — unchanged**
https://www.claymath.org/millennium/navier-stokes-equation/
Fetched and read 2026-09-14. It still describes Navier–Stokes as originally stated. It does
not mention OpenAI and does not record a 2026 resolution.

**The announcement page, dated 2026-09-11**
https://www.claymath.org/news/navier-stokes-announcement/
Fetched and read 2026-09-14. CMI says it is "excited" and that the problem "has apparently
been settled," and that its evaluation will be "deliberately unhurried" under the prize
rules.

**Nothing has been awarded.** As of 2026-09-14 the Clay Mathematics Institute has confirmed
nothing and awarded nothing. Anyone telling you a Millennium Prize has been won is ahead of
the only organisation that can award one — and ahead of OpenAI, which says it is not
claiming it. The two phrases to hold on to are *apparently settled* and *unhurried
evaluation*.

---

## 7. Provenance — what was read, and how

Read directly on 2026-09-14, for this sheet:

- All four NYU PDFs downloaded and text-extracted: the statement end to end; the three
  preprints for titles, author lines, abstracts, page counts and build dates.
- OpenAI's 166-page proof PDF downloaded, text-extracted and searched; metadata read.
- OpenAI's announcement, Tao's blog post, Tao's Mastodon post, the Lean repository README
  and both Clay Mathematics Institute pages read on the pages themselves.

**What this sheet will not tell you:** whether OpenAI trained on anyone's Codex sessions.
Nobody outside OpenAI knows that, and the man at the centre of it says plainly that he does
not know either. Where an account is one side's account of a private call, this sheet says
whose.

Every link here goes to a primary source, never to coverage of one.

— vektor /// no. 052 · @vektor.fm
