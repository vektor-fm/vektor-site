# HANDOFF — vektor-site sprind redesign

Paste the block at the bottom into a fresh session. Everything below it is the
context that block refers to.

Written 2026-08-08. Branch `feature/sprind-redesign`, commit `fffa388`.

---

## Where to look first

```
cd C:/Users/julia/projects/vektor-site
git checkout feature/sprind-redesign
python -m http.server 4322 --directory C:/Users/julia/projects/vektor-site
```
Then open **http://localhost:4322/mocks/**

Four dev toggles sit bottom-right of the mock (accent / hero plate / type
pairing). They are review furniture and must NOT be ported to the real site.

**Read `reports/REDESIGN-STATE.md` before doing anything.** It carries the locked
decisions, sprind's measured anatomy, and the imagery post-mortem.

---

## What is decided and must not be relitigated

| Area | Decision |
|---|---|
| Direction | sprind.org copied 1:1 in structure, dimensions, rhythm |
| Theme | Dark — black ground, white type |
| Display | Archivo Expanded Regular **400** (SIL OFL, self-hosted, 14 KB) |
| Body | Archivo Regular 400 (SIL OFL, 14 KB) |
| Meta/labels | Printvetica, caps-only subset (mode C) — retires IBM Plex Mono |
| Accent | **caretTeal `#0E9C86`** — one green, the logo's. Acid `#39FF35` stays in the films |
| Logo | **UNCHANGED.** Archivo 800, `-.045em`, caret `.12em x .98em` in `#0E9C86` |
| IA | nav → hero → LATEST → film → HOW IT WORKS → ARCHIVE → footer |
| Card imagery | Generated 3:2 plates, one per issue |
| Order of work | Plates first, then port |

sprind uses **weight 400 everywhere** — there is no bold anywhere on that site,
and no letter-spacing on headings. Size does all the work. Three earlier mocks
were rejected partly for getting this wrong.

## Anatomy the mock implements (measured in a browser, not from their CSS)

| Element | Value |
|---|---|
| h1 / section h2 | 52px / 54px, weight 400, uppercase, no letter-spacing |
| Card | **700 x 234** — image 350 LEFT at 3:2, text right, `padding:16px 0 0 16px` |
| Card title | 18px/22 uppercase — **same size as the body text under it** |
| Meta | 15px uppercase, `.025em`, `#676767` (lifted to `#999` on dark) |
| Module padding | `40px 40px 80px` |
| Footer cells | 506 x 128 (`padding:48px 0`), 18px uppercase, **arrow first** |
| Newsletter CTA | unfilled cell bounded by hairlines — never a filled button |
| Hairlines | `gap:1px` + a 1px **outline** per cell (outlines take no space) |
| Type ramp | 132 / 52 / 32 / 20 / 18 / 15 / 12, fluid vw above 1600 |
| Space ramp | 4 8 16 24 32 40 48 80 120 240 |

---

## Next steps, in order

1. **Generate the 22 card plates.** Paste each block from
   `reports/PLATE-PROMPTS.md` into a free image model (Google AI Studio's
   browser free tier — local generation is impossible on this machine: Intel
   integrated graphics, 2 GB VRAM). Save into `plates-src/` named by issue
   number. Then `npm i -D sharp && node ingest-plates.mjs`.
2. **Review the real card grid** in the mock before porting. The card is the
   most repeated element on the page.
3. **Port into `partials/head.html`** — one file drives all 19 built pages.
   Copy the three Archivo woff2 into `fonts/`, drop the six IBM Plex Mono files,
   remove the dev toggles, then `npm run build`.
4. **Port the 5 orphan pages** — `no-014, 026, 028, 030, 031` have no
   `src/*.body.html` and will not move with the redesign.
5. **`npm run check`** — verifies outputs are in sync and every link/asset
   resolves. This is the pre-merge gate.
6. Merge to `develop`, then `main`. Pages deploys from `main`.

## Open items

- [ ] **Printvetica webfont licence.** A commercial licence was purchased
      (guaschetti, Gumroad, 2026-07-29, recorded in `vektor/canon/canon.yml`).
      Confirm it covers *webfont embedding*, not desktop use alone — Gumroad
      commercial tiers frequently exclude it. Mode C puts it on every page.
      The font is **gitignored** because this repo is public and committing it
      is redistribution, a different grant again. Rebuild locally with
      `python mocks/subset-printvetica.py`.
- [ ] The free image model's real daily limit is **unverified** — the
      "100/day at 2048px" figure came from a comparison listicle, not Google.
- [ ] `no-014` and `no-028` have no OG card and no plate.
- [ ] Decide whether the films adopt Archivo Expanded in return, or stay
      Printvetica-only.
- [ ] Nothing is pushed. `develop` and `feature/sprind-redesign` exist only on
      this laptop.

## Things that were tried and rejected — do not redo

- **Three looser interpretations** of sprind (Instrument / Prism / Press) —
  rejected; the founder wants 1:1.
- **A light-background 1:1** — wrong; sprind's own hero and nav are black.
- **Slit-scan plates as hero art** — four rounds, documented in
  `REDESIGN-STATE.md` §4. Structural failure, not a tuning problem: the
  references are one clear form in generous negative space, and a smeared
  screenshot is destroyed form. Round 3 was tuned against a metric that turned
  out to be measuring grain. Kept only as texture.
- **Brik (brik.space)** — Wix-owned. Output is monochrome kinetic typography,
  not the reference genre. Cropping its watermark is grey under Wix ToU §2.3,
  and §5.2 states output "may not be unique to you" — disqualifying for a brand
  mark.
- **GT America Extended** — sprind's actual face. Cannot be hotlinked (their
  server sends no CORS header, which silently broke an earlier mock). Archivo
  Expanded is the free, self-hostable stand-in and is already the logo's family.
- **Cavalry for the hero wordmark** — founder ruled it out as inefficient.

---

## PASTE THIS INTO THE FRESH SESSION

```
Continuing the vektor-site redesign. Read these first, in order:

  C:/Users/julia/projects/vektor-site/reports/HANDOFF.md
  C:/Users/julia/projects/vektor-site/reports/REDESIGN-STATE.md

We are redesigning https://vektor-fm.github.io/vektor-site/ to copy
https://www.sprind.org/ 1:1 in structure, dimensions and rhythm, but dark.
The landing page is being finished first; the other pages follow via
partials/head.html.

State: on branch feature/sprind-redesign (commit fffa388), nothing pushed,
live site untouched. The mock is at mocks/index.html — serve the repo root
with `python -m http.server 4322` and open http://localhost:4322/mocks/.
It has been verified in a browser: no overflow at 1440/1536/900/500, all
fonts load, cards measure 2.99:1.

Locked, do not relitigate: dark theme; Archivo Expanded 400 display +
Archivo 400 body, both self-hosted; Printvetica on meta/labels only;
accent is caretTeal #0E9C86; the logo is UNCHANGED (Archivo 800, -.045em,
teal caret) and is not part of the redesign.

Next step is generating the 22 card plates using the paste-ready prompts in
reports/PLATE-PROMPTS.md, then `node ingest-plates.mjs` (needs `npm i -D
sharp`), then reviewing the real card grid before porting into
partials/head.html.

Do not re-attempt the slit-scan plate pipeline or Brik — both were
evaluated and rejected for reasons recorded in REDESIGN-STATE.md §4.

Read HANDOFF.md's open items before acting; the Printvetica webfont licence
is unconfirmed and the font is deliberately gitignored.
```
