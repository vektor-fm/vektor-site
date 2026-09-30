---
name: gate-video
description: One-command pre-delivery gate for a rendered Vektor video. Runs the canon gate + footage-rights + technical check + a verify-by-looking still + the pinned canon-judge, and returns a single GO / REVISE / NO-GO with the specific fixes. Use when asked to gate, QA, check, or vet a rendered vektor video (out/<slug>.mp4) before delivery.
---

# gate-video — full pre-delivery gate for a Vektor `<slug>`

Run ALL gates on `out/<slug>.mp4` and return one clear verdict. Run from the vektor repo root.

**0. KT BRANCH (check FIRST — KT films are the default since 2026-08-09).** If the film
is registered in `canon/kt-canon.yml#films` (or has no `data/<slug>/video.json`), it is
a KT film: SKIP steps 1, 1b and 4 (they require video.json and will exit 2 ENOENT) and
run instead:
   `node scripts/check-kt.mjs --film <no-0NN> --render`  (blocking — 0 blockers required for GO)
   plus `node scripts/check-kt-goldens.mjs --film <no-0NN>` if present.
   Steps 2 (footage-rights), 3 (technical) and 5 (judge) still run. Any mock/cover/still
   shown to the founder must ALSO have passed `node scripts/check-mock.mjs <file.html>`
   (founder ruling 2026-08-29 — nothing off-canon reaches the founder's eyes).

1. **Canon gate (blocking, measurable — LEGACY video.json films only):**
   `node ../reel-engine/scripts/check-canon.mjs --brand vektor --slug <slug>`
1b. **Golden gate (pixel truth + wireframe contract + voice lock):**
   `node ../reel-engine/scripts/check-goldens.mjs --brand vektor --slug <slug>`
   (diffs the chrome band + end-card lockup vs `canon/goldens/`, checks mascot slots /
   forbidden elements vs `canon/wireframes/wireframes.json`, and blocks if the narrator
   voice fingerprint drifted from `canon/canon.yml#voice.fingerprint`)
2. **Footage-rights (strike prevention):**
   `node scripts/check-footage-rights.mjs --slug <slug>`
3. **Technical:**
   `node ../reel-engine/scripts/qa-measure.mjs out/<slug>.mp4`  (pass must be true)
4. **Verify by looking (never trust a summary):**
   `node ../reel-engine/scripts/render-still.mjs --input data/<slug>/video.json --output out/_qa/<slug>-gate.png --frame 30`, then **Read the PNG** and eyeball it.
5. **Subjective judge (pinned agent):**
   `node ../reel-engine/scripts/canon-judge.mjs --brand vektor --slug <slug>` to extract frames + compile the prompt, then spawn the **`canon-judge`** agent (agentType: `canon-judge`) with the printed `PROMPT.md` contents. It returns the verdict JSON.

## Verdict
- **GO** only if: canon = GO (0 blockers) · golden gate = GO (0 blockers) · footage-rights = PASS · technical pass = true · judge = GO.
- **NO-GO** if any canon blocker, a footage-rights fail, or a judge `critical`. List the exact fixes.
- **REVISE** if any judge `major` or a soft warning worth fixing. List them.

Report the verdict + the reasons in a few lines. Do not deliver on anything but GO.

## Pipeline order (moved from CLAUDE.md 2026-09-29, founder: "Yes, delete before the capture")

KT films (default): concept → register in `kt-canon.yml#films` → author TSX +
generated words file (docs/KT-RUNBOOK.md) → check-mock on every mock → studio
scrub (Gate 2) → render → check-kt --render → deliver.
Legacy video.json path (dead skins, render-blocked): pitch/concept → build `data/<slug>/video.json` (build-concept.mjs) → compose script + VO
(compose-script → voiceover → master-voice) → `render:video` → gates + canon-judge →
founder approval on the REAL render → post-pack + funnel keyword → deliver to founder.

