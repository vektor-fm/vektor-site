# Navier–Stokes: a source-linked reading guide

Prepared for Vektor’s 10 September 2026 film. Read the linked primary sources before treating any statement here as a settled mathematical verdict.

## What the film is showing

The film follows the intuition behind a reported construction: start with a smooth, calm three-dimensional flow; viscosity is positive and the initial energy is finite; the flow is then forced toward a finite-time singularity where speed becomes unbounded. The strands, pinch and vortex are a conceptual diagram of that story. They are not a numerical solution of real water and do not show a measured velocity field.

## What OpenAI reports

OpenAI’s announcement says its internal model discovered a candidate solution to the existence and smoothness problem, and that Astra helped formalise the argument in Lean. The accompanying paper gives the mathematical construction and scope of the claim. The exact hypotheses, definitions and proof obligations belong to the paper, not to this short guide.

## Read the sources in this order

1. [OpenAI announcement](https://openai.com/index/navier-stokes-solution/) — the accessible overview and attribution of the model/formalisation workflow.
2. [Accompanying paper (PDF)](https://cdn.openai.com/pdf/32d9f210-8b73-45e0-91bc-82a30aef8a9a/navier-stokes.pdf) — the technical statement and construction.
3. [OpenAI formalisation repository](https://github.com/openai/NavierStokesAndEuler) — Lean files, README and the independent-comparator instructions.
4. [Clay Mathematics Institute problem statement](https://www.claymath.org/millennium/navier-stokes-equation/) — the original Millennium Problem context. At the time of this guide it still presents Navier–Stokes as an unsolved problem; this guide does not claim that Clay has accepted or awarded a solution.

## Reproducing the public formalisation

The repository’s README is authoritative for versions and commands. Its documented setup is:

```sh
git clone https://github.com/openai/NavierStokesAndEuler.git
cd NavierStokesAndEuler
lake exe cache get
lake build
```

Install Lean through the official [Lean installation guide](https://lean-lang.org/install/), which uses `elan` (the Lean version manager). Then follow the repository README’s independent-comparator section if you want to check the comparison proof separately. This guide does not claim that Vektor ran the Lean build.

## Three words to keep straight

- **Smooth:** the velocity field has the required derivatives and no abrupt mathematical break.
- **Finite energy:** the flow’s energy starts within the finite-energy class specified by the problem.
- **Unbounded speed:** the construction forces the velocity magnitude to exceed every finite bound as the singular time is approached.

Those terms describe the mathematical object in the paper. They do not mean that a real glass of water suddenly becomes infinitely fast.

## Source and date

Primary source links were frozen for this guide on 10 September 2026. The announcement, paper and repository are OpenAI sources; the problem statement is from the Clay Mathematics Institute.
