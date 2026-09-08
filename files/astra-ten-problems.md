# Ten problems Astra moved — in plain English

Sources: OpenAI, "Ten advances in mathematics and theoretical computer science," openai.com, dated **August 1, 2026** ([openai.com/index/ten-advances-in-mathematics](https://openai.com/index/ten-advances-in-mathematics/)) · the paper, [cdn.openai.com/pdf/ten-proofs-oai.pdf](https://cdn.openai.com/pdf/ten-proofs-oai.pdf) · the model's reasoning walkthroughs, [cdn.openai.com/pdf/reasoning-walkthroughs.pdf](https://cdn.openai.com/pdf/reasoning-walkthroughs.pdf) · Lean proof certificates, [github.com/openai/ten-proofs](https://github.com/openai/ten-proofs).

**Honest caveat.** These are OpenAI's own claims: an internal version of Astra (since released as GPT-6 Astra, 2026-09-03) generated the mathematical arguments, the model formalized each one in a Lean proof certificate, and humans then prepared the manuscripts with the model. That is not the same thing as independent peer review — treat this as OpenAI's account of what their model produced. And "moved a limit" is not always the same as "solved the problem": for sphere packing specifically (problem 1 below), the new result is a ceiling on what one specific proof technique can ever show, not a resolution of the sphere-packing problem itself. Where that distinction matters for a problem, it's called out below.

---

## 1. High-dimensional sphere packing

**The problem.** Pack identical balls into a space that has far more than the usual three dimensions — what's the largest fraction of that space the balls can possibly fill? In most dimensions, nobody has an exact answer, only limits on how good any packing could be.

**What changed.** The paper states: "This is the first improvement since 1978 to the general sphere-packing exponent" [ten-proofs-oai.pdf p.6]. It adds: "The matching lower bound shows that no Cohn–Elkies auxiliary function can improve this exponent" [p.6] — meaning this result is a ceiling on what that one bounding method (the Cohn–Elkies linear program) can ever prove, not a solved sphere-packing problem. In dimensions 8 and 24 the exact optimal packing was already proved (Viazovska 2017 and Cohn–Kumar–Miller–Radchenko–Viazovska 2017); this result is a general upper bound covering every other dimension.

**In its own words.** "A global norm forgets where the negative mass lies." [reasoning-walkthroughs.pdf p.7]

**Links:** paper ch.1, p.6 · walkthrough p.7 · [Lean repo](https://github.com/openai/ten-proofs)

---

## 2. Binary and spherical codes

**The problem.** How many distinct strings of 0s and 1s — or points scattered on a high-dimensional sphere — can you pack in, if every pair has to differ (or be far apart) by at least some fixed amount?

**What changed.** From the paper's abstract: "These are the first improvements to the respective general high-dimensional exponents since 1977 and 1978" [ten-proofs-oai.pdf p.31], improving the classical McEliece–Rodemich–Rumsey–Welch bound for binary codes and the Kabatianskii–Levenshtein bound for spherical codes.

**In its own words.** "The gain comes not from abandoning scalar linear programming, but from recovering multiplicity that its usual fixed-vector construction never uses." [reasoning-walkthroughs.pdf p.11]

**Links:** paper ch.2, p.31 · walkthrough p.11 · [Lean repo](https://github.com/openai/ten-proofs)

---

## 3. Non-sofic groups

**The problem.** A "group" is a set of moves with a rule for combining them — like the possible twists of a Rubik's cube. Some groups can be closely mimicked by shuffling a large but finite set of objects; those are called "sofic." Nobody knew whether every group had this property.

**What changed.** "We prove that the unit group LF2(1, 2)^x of the binary Leavitt algebra is not sofic, answering negatively the question of whether every countable group is sofic" [ten-proofs-oai.pdf p.82].

**In its own words.** "Its central difficulty is extracting one usable expander from many expanding components." [reasoning-walkthroughs.pdf p.15]

**Links:** paper ch.3, p.82 · walkthrough p.15 · [Lean repo](https://github.com/openai/ten-proofs)

---

## 4. Connes's rigidity conjecture

**The problem.** From a group of symmetries you can build an algebraic object — a "von Neumann algebra" — that records how those symmetries combine. Connes conjectured that, for a certain rigid class of groups, that object always remembers exactly which group produced it.

**What changed.** "We disprove the conjecture by constructing a countably infinite family of pairwise nonisomorphic, mutually commensurable, finitely generated ICC property-(T) groups with isomorphic group von Neumann algebras" [ten-proofs-oai.pdf p.100].

**In its own words.** "The difficulty is to preserve both rigidity hypotheses while hiding an honest difference between the underlying groups." [reasoning-walkthroughs.pdf p.20]

**Links:** paper ch.4, p.100 · walkthrough p.20 · [Lean repo](https://github.com/openai/ten-proofs)

---

## 5. Arithmetic circuit complexity

**The problem.** The "permanent" of a grid of numbers is a value similar to a determinant, but far harder to compute quickly. How many basic add/multiply steps does any method need?

**What changed.** The paper proves two lower bounds: "Division-free circuits with unrestricted reuse of intermediate values require Ω(n² log log n) arithmetic gates," and "Arithmetic formulas require Ω(n⁴/log n) variable-labeled leaves" [ten-proofs-oai.pdf p.118].

**In its own words.** "These sustained failures identified the real problem: we needed a permanent-specific geometric invariant that did not presume generic coefficients." [reasoning-walkthroughs.pdf p.25]

**Links:** paper ch.5, p.118 · walkthrough p.25 · [Lean repo](https://github.com/openai/ten-proofs)

---

## 6. Quantum parallel repetition

**The problem.** Two separated players try to convince a referee they can win a game, sharing a quantum-entangled resource but unable to talk once play starts. If the referee makes them play many independent copies at once and requires winning every one, does their success chance shrink exponentially fast — the way it's known to for non-quantum players?

**What changed.** "We resolve this quantum analogue affirmatively" for every finite two-player entangled game [ten-proofs-oai.pdf p.158], extending Raz's classical parallel repetition theorem (1995) to the quantum setting for the first time for arbitrary games.

**In its own words.** "These repeated failures shift the search away from another ordinary information bound and toward a purification gauge whose entropy control survives conditioning without a spectral cutoff." [reasoning-walkthroughs.pdf p.33]

**Links:** paper ch.6, p.158 · walkthrough p.33 · [Lean repo](https://github.com/openai/ten-proofs)

---

## 7. Closest vector problem

**The problem.** Given a repeating grid of points in space (a "lattice") and a target location, how hard is it to even *approximately* find the nearest grid point? That hardness is part of what some post-quantum encryption relies on.

**What changed.** "We present a deterministic polynomial-time many-one reduction from 3SAT to GapCVP" that "does not invoke the PCP theorem or assume the Projection Games Conjecture" [ten-proofs-oai.pdf p.187] — a direct hardness-of-approximation result for the problem.

**In its own words.** "The common obstacle is cancellation: a short global object must be forced to encode at least one consistent satisfying assignment." [reasoning-walkthroughs.pdf p.37]

**Links:** paper ch.7, p.187 · walkthrough p.37 · [Lean repo](https://github.com/openai/ten-proofs)

---

## 8. Ehrhart's volume conjecture

**The problem.** Take a convex blob in many dimensions whose only interior grid point is its own center of mass. How large can that blob's volume possibly be?

**What changed.** "We prove the sharp bound that an n-dimensional convex body whose barycenter is its only interior lattice point has volume at most (n + 1)^n/n!" [ten-proofs-oai.pdf p.223] — settling, in every dimension, a bound Ehrhart conjectured decades ago.

**In its own words.** "The missing n! is not a minor loss that a sharper estimate should automatically restore." [reasoning-walkthroughs.pdf p.41]

**Links:** paper ch.8, p.223 · walkthrough p.41 · [Lean repo](https://github.com/openai/ten-proofs)

---

## 9. Multicolor Ramsey numbers

**The problem.** Color every connection between a set of points using k different colors. How many points force at least one same-colored triangle to appear, no matter how you color?

**What changed.** OpenAI's own summary: "A superexponential lower bound for multicolor triangle Ramsey numbers, resolving Erdős problem 183." The paper's result establishes that this number grows as k^Θ(k) [ten-proofs-oai.pdf p.233].

**In its own words.** "Attempts to prove L < ∞ and attempts to achieve factorial growth had exposed the same missing ingredient: controlled reuse of colors across different blocks." [reasoning-walkthroughs.pdf p.46]

**Links:** paper ch.9, p.233 · walkthrough p.46 · [Lean repo](https://github.com/openai/ten-proofs)

---

## 10. Extremal number conjectures

**The problem.** In a large network, if you're told to avoid certain small patterns, how many connections can you still pack in? Two old conjectures made claims about how this scales — one about combining several forbidden patterns at once (the "compactness conjecture"), one about a structural property of a single pattern called "degeneracy."

**What changed.** OpenAI's own summary: "Results on the compactness and degeneracy conjectures in extremal graph theory, resolving Erdős problems 146 and 180." The paper states: "This disproves the Erdős–Simonovits compactness conjecture" and, separately, "This disproves a conjecture of Erdős on extremal numbers of r-degenerate graphs" [ten-proofs-oai.pdf p.240].

**In its own words.** "Each route confused abundance of copies with the ability to coordinate their overlaps." [reasoning-walkthroughs.pdf p.50]

**Links:** paper ch.10, p.240 · walkthrough p.50 · [Lean repo](https://github.com/openai/ten-proofs)

---

@vektor.fm
