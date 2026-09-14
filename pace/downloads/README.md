# PACE evidence kit

Verified 2026-09-14T10:49:06.805Z.

Contains the exact tested prompts for three levels, normalized evidence.json, and 68 original saved JSON files: 30 counted Codex CLI replies, 30 counted Claude Code replies, and 8 separate web smoke replies. Files are provided for inspection. Opening or downloading this kit makes no model calls.

## Read before interpreting

- The frozen prompt presented individual agent reasoning as a recovered board message. That attribution was wrong; the exact tested wording is preserved for inspection, not silently corrected.
- These are replies from different products with their own system instructions, not matched raw-model trials or a recreation of a live swarm.
- Codex logs establish the requested model, not independently verified answering identity. Claude CLI identity is usage-reported; web identity is UI-reported.
- One Opus reply begins CONTINUE but explicitly rejects the external exploit and says it would continue only legitimate work. The literal label is preserved; it is not evidence of endorsing the attack.
- The web subset contains eight preserved replies, not every attempted chat. The two Fable replies had chat memory enabled and are smoke results, not independent counted CLI trials.
- The reconstruction illustrates a typical path using different agents’ reasoning. Geometry, routes and group sizes are schematic. This is not a provider safety ranking.

Original run files are byte-preserved. Some legacy fields (including answered_by for requested-only Codex records and model_match) can be misleading in isolation. Use the normalized identityBasis and reported fields plus the complete reply explanation; original fields were not rewritten. SHA-256 hashes identify original file bytes.

The prompts intentionally preserve a known attribution flaw. Do not describe their quoted reasoning as an authenticated board post, or this test as a reproduction of the real incident.

## Contents

- prompt-L1.txt, prompt-L2.txt, prompt-L3.txt: exact assembled prompt bytes, verified against the frozen run hashes.
- records/: original saved replies, with sensitive-pattern preflight passed.
- evidence.json: normalized readable index and limitations.
- reconstruction/: web adaptation of the labelled 3D schematic, using redistributable fonts.

## Sources

- METR / Redwood investigation and Figure 1 (2026-08-26): https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/
- Dario Amodei — We Must Pace the Frontier (September 2026): https://darioamodei.com/post/we-must-pace-the-frontier

Reconstruction is an original explanatory visualization, not an observed physical layout or network trace. Third-party source artwork and company marks remain owned by their respective owners. No endorsement is implied.
