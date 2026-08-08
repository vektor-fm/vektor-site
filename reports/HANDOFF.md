# HANDOFF — vektor-site sprind redesign

The paste block is at the bottom. Everything above it is what that block refers to.

Written 2026-08-08. Branch `feature/sprind-redesign`, head `5d7056b`. Nothing pushed.

---

## Start here

```
cd C:/Users/julia/projects/vektor-site
git checkout feature/sprind-redesign
python -m http.server 4322 --directory C:/Users/julia/projects/vektor-site
```
Open **http://localhost:4322/mocks/**

Four dev toggles sit bottom-right (accent / hero plate / type pairing). They are
review furniture — **do not port them**.

Read `reports/REDESIGN-STATE.md` for sprind's measured anatomy and the imagery
post-mortem. This file is the operating brief.

---

## THE LOGO — read this before touching anything visual

**`vektor/brand/logo/export/` is the RETIRED original mark. Do not use it.**
It is Archivo 800 + a teal `#0E9C86` caret block. A previous session mistook it
for the current logo, built it into the mock, and derived the site's accent
colour from its teal. All of that was wrong and has been reverted.

**The real wordmark** is defined in `partials/head.html:174-186` and ships on
<https://vektor-fm.github.io/vektor-site/>:

- **Inter Tight 600**, `letter-spacing:-0.045em`, cream `#EFEADD`
- Markup: two `.wm-plate` spans (`.wm-acid` `#39FF35`, `.wm-orchid` `#C77BC9`)
  plus `.wm-main` containing six `.ch` spans, each with a `.g` glyph and a `.l`
  letter. Glyph sequence `% # Z 8 @ W` → `v e k t o r`.
- Sizes: 30px masthead, 34px footer, `clamp(40px,11vw,84px)` hero.
- On the live site it animates: chromatic plates slide from `translate(7px,4px)`
  and `translate(-6px,-4px)` into alignment and fade over 1.15s while each
  character flashes its glyph.

**The animation is RETIRED in the redesign** (founder, 2026-08-08) — it fought
sprind's restraint. The mock renders it static: letters visible, glyphs and
plates `display:none`. That is the live site's `prefers-reduced-motion` state
promoted to default. The spans are retained so it can be restored by deleting
three CSS rules.

`vektor-site/partials/head.html` is the source of truth for the wordmark.

---

## Locked — do not relitigate

| Area | Decision |
|---|---|
| Direction | sprind.org copied 1:1 in structure, dimensions, rhythm |
| Theme | Dark — black ground, white type |
| Display face | Archivo Expanded Regular **400** (SIL OFL, self-hosted, 14 KB) |
| Body face | Archivo Regular 400 (SIL OFL, 14 KB) |
| Meta / labels | Printvetica, caps-only subset (type mode C) — retires IBM Plex Mono |
| Wordmark | Inter Tight 600, static, per above |
| IA | nav → hero → LATEST → film → HOW IT WORKS → ARCHIVE → footer |
| Card imagery | Generated 3:2 plates, one per issue |
| Order | Plates first, then port |

sprind uses **weight 400 everywhere** — no bold anywhere on that site, and no
letter-spacing on headings. Size does all the work. Three mocks were rejected
partly for getting this wrong.

## OPEN — needs a decision next session

**The accent colour.** Founder will decide on the render. The toggle cycles
teal `#0E9C86` → gold `#FFCC00` → mono → acid `#39FF35`. Current default is
teal, but *only* because of the retired-logo error — treat it as unset. The live
logo uses acid `#39FF35` and orchid `#C77BC9`, so acid is the natural candidate.

## Anatomy the mock implements

Measured in a browser on the live sprind site, not inferred from their CSS.

| Element | Value |
|---|---|
| h1 / section h2 | 52px / 54px, weight 400, uppercase, no letter-spacing |
| Card | **700 x 234** — image 350 LEFT at 3:2, text right, `padding:16px 0 0 16px` |
| Card title | 18px/22 uppercase — **same size as the body under it** |
| Meta | 15px uppercase, `.025em`, `#676767` (lifted to `#999` on dark) |
| Module padding | `40px 40px 80px` |
| Footer cells | 506 x 128 (`padding:48px 0`), 18px uppercase, **arrow first** |
| Newsletter CTA | unfilled cell bounded by hairlines — never a filled button |
| Hairlines | `gap:1px` + a 1px **outline** per cell (outlines take no space) |
| Type ramp | 132 / 52 / 32 / 20 / 18 / 15 / 12, fluid vw above 1600 |
| Space ramp | 4 8 16 24 32 40 48 80 120 240 |

Verified in-browser: no horizontal overflow at 1440 / 1536 / 900 / 500, all
fonts load, cards measure 2.99:1, console clean.

---

## Next steps, in order

1. **Generate the 22 card plates.** Paste each block from
   `reports/PLATE-PROMPTS.md` into a free image model — Google AI Studio's
   browser free tier. Local generation is impossible here: Intel integrated
   graphics, 2 GB VRAM. Save into `plates-src/` named by issue number, then
   `npm i -D sharp && node ingest-plates.mjs`.
2. **Review the real card grid** before porting. The card is the most repeated
   element on the page.
3. **Lock the accent** on the render.
4. **Port into `partials/head.html`** — one file drives all 19 built pages. Copy
   the Archivo woff2 files into `fonts/`, keep `inter-tight-600` (the wordmark
   needs it), drop the six IBM Plex Mono files, remove the dev toggles, then
   `npm run build`.
5. **Port the 5 orphan pages** — `no-014, 026, 028, 030, 031` have no
   `src/*.body.html` and will not move with the redesign.
6. **`npm run check`** — verifies outputs are in sync and every link and asset
   resolves. Pre-merge gate.
7. Merge to `develop`, then `main`. Pages deploys from `main`.

## Open items

- [ ] **Accent colour** — unset, decide on the render.
- [ ] **Printvetica webfont licence.** Commercial licence purchased (guaschetti,
      Gumroad, 2026-07-29, in `vektor/canon/canon.yml`). Confirm it covers
      *webfont embedding*, not desktop use alone — Gumroad commercial tiers
      frequently exclude it. Type mode C puts it on every page. The font is
      **gitignored**: this repo is public, and committing it is redistribution,
      a different grant again. Rebuild with `python mocks/subset-printvetica.py`.
- [ ] Free image model's real daily limit is **unverified** — the "100/day at
      2048px" figure came from a comparison listicle, not from Google.
- [ ] `no-014` and `no-028` have no OG card and no plate.
- [ ] `vektor/brand/logo/export/README.md` was written marking that folder
      retired, but is **uncommitted** — that repo sits on `feature/funnel-d1`,
      apparently another workstream, so it was left alone.
- [ ] **Nothing is pushed.** `develop` and `feature/sprind-redesign` exist only
      on this laptop.

## Tried and rejected — do not redo

- **Three looser interpretations** of sprind (Instrument / Prism / Press) —
  founder wants 1:1.
- **A light-background 1:1** — wrong; sprind's own hero and nav are black.
- **Slit-scan plates as hero art** — four rounds, `REDESIGN-STATE.md` §4.
  Structural failure, not tuning: the references are one clear form in generous
  negative space; a smeared screenshot is destroyed form. Round 3 was tuned
  against a metric that turned out to measure grain. Kept only as texture.
- **Brik (brik.space)** — Wix-owned. Output is monochrome kinetic typography,
  not the reference genre. Cropping its watermark is grey under Wix ToU §2.3 and
  §5.2 says output "may not be unique to you" — disqualifying for a brand mark.
- **GT America Extended** — sprind's real face. Cannot be hotlinked (no CORS
  header; this silently broke an earlier mock). Archivo Expanded is the free
  self-hostable stand-in.
- **Cavalry for the hero wordmark** — founder ruled it out as inefficient.

## Standing context

Vektor's visual identity is **in open discovery** — see the project memory
`vektor-visual-discovery-mode`. Nothing is settled, including the video look.
The founder wants the possibility left open that the films adopt site decisions
(sprind structure, Archivo Expanded, dark palette) as a test to iterate on.
Printvetica being the films' only face does not make it permanent. Propose
convergence, never impose it.

---

## PASTE THIS INTO THE FRESH SESSION

```
Continuing the vektor-site redesign. Read these two files first, in order:

  C:/Users/julia/projects/vektor-site/reports/HANDOFF.md
  C:/Users/julia/projects/vektor-site/reports/REDESIGN-STATE.md

Goal: redesign https://vektor-fm.github.io/vektor-site/ to copy
https://www.sprind.org/ 1:1 in structure, dimensions and rhythm, but dark.
Landing page first; the other pages follow via partials/head.html.

State: branch feature/sprind-redesign, head 5d7056b, nothing pushed, live
site untouched. The mock is mocks/index.html — serve the repo root with
`python -m http.server 4322` and open http://localhost:4322/mocks/. It is
browser-verified: no overflow at 1440/1536/900/500, all fonts load, cards
measure 2.99:1.

LOCKED, do not relitigate: dark theme; Archivo Expanded 400 display +
Archivo 400 body, self-hosted; Printvetica on meta/labels only; sprind's
weight-400-everywhere and no-letter-spacing rules.

THE LOGO: vektor/brand/logo/export/ is the RETIRED original mark (Archivo
800 + teal caret) — do NOT use it, a previous session was misled by it. The
real wordmark is Inter Tight 600 at -.045em in cream #EFEADD, defined in
partials/head.html:174-186. Its glitch-decode animation is retired for this
redesign; it renders static.

OPEN, needs deciding on the render: the site accent colour. The toggle
cycles teal / gold / mono / acid. It currently defaults to teal only because
of the retired-logo error — treat it as unset. The live logo uses acid
#39FF35, so acid is the natural candidate.

NEXT: generate the 22 card plates using the paste-ready prompts in
reports/PLATE-PROMPTS.md, run `npm i -D sharp && node ingest-plates.mjs`,
review the real card grid, lock the accent, then port into
partials/head.html.

Do NOT re-attempt the slit-scan plate pipeline or Brik — both evaluated and
rejected, reasons in REDESIGN-STATE.md §4 and HANDOFF.md.

Check HANDOFF.md's open items before acting. The Printvetica webfont licence
is unconfirmed and that font is deliberately gitignored.
```
