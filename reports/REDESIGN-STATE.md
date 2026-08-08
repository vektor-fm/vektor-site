# vektor-site redesign — consolidated state

Last updated 2026-08-07. Supersedes the decision tables in `REDESIGN-BRIEF.md`
(which stays as the sprind teardown reference). Prompt pack: `PLATE-PROMPTS.md`.

Branch: `feature/sprind-redesign` off `develop` (created this session — the repo
had no `develop`). Nothing merged. The live site is untouched.

---

## 1. Locked decisions

| Area | Decision | Notes |
|---|---|---|
| Direction | sprind.org, copied 1:1 in structure, dimensions and rhythm | Founder rejected three looser interpretations first |
| Theme | **Dark** — black ground, white type | sprind's own hero and nav are already black |
| Display face | **Archivo Expanded Regular (400)** | SIL OFL, self-hosted, 14 KB. Weight 400 only — sprind uses no bold anywhere |
| Body face | **Archivo Regular (400)** | SIL OFL, self-hosted, 14 KB |
| Meta / label face | **Printvetica** — mode C | Founder-selected 2026-08-07. Retires IBM Plex Mono from the site |
| Accent | Toggleable: acid `#39FF35` / gold `#FFCC00` / mono | Not yet locked |
| **Logo** | **Unchanged.** Archivo 800, `letter-spacing:-.045em`, caret block `.12em x .98em` in caretTeal `#0E9C86` | Reproduced from `vektor/brand/logo/export/_base.css`. NOT up for redesign |
| Page IA | nav → hero → LATEST → film → HOW IT WORKS → ARCHIVE → footer | Founder-approved |
| Card imagery | Generated 3:2 plates, one per issue | Recipe in `PLATE-PROMPTS.md`; **not yet produced** |
| Hero wordmark | Set type (Archivo 800 logo) | Cavalry route dropped as inefficient; Brik rejected on licence + non-uniqueness |

### Colour, reconciled

There is no conflict between the site, the logo and the films — the canon already
carries both accents as separate named tokens:

```
color.fields.ink        #101010    ground
color.accents.acid      #39FF35    site accent
color.accents.caretTeal #0E9C86    LOGO ONLY — never repointed
color.accents.paper     #EFEADD
color.fields.cream      #F4EFDF
```

In the mock, `--caret` is a separate variable from `--accent` precisely so the
accent toggle can never change the logo.

---

## 2. sprind's measured anatomy

Taken from their live site in a browser, not inferred from their CSS. These are
the numbers the mock implements.

| Element | Value |
|---|---|
| h1 / section h2 | **52px / 54px, weight 400, uppercase, no letter-spacing** |
| Card title | **18px / 22 uppercase** |
| Card body | **18px / 22 — same size as the title** |
| Date / meta | 15px uppercase, `letter-spacing:.025em`, `#676767` |
| Body line-height | 22px |
| Teaser card | **700 x 234** — image 350 LEFT at 3:2, text 350 right, `padding:16px 0 0 16px` |
| Card rules | hairline across the TOP spanning image+text, plus a LEFT hairline |
| Module padding | `40px 40px 80px` |
| Archive grid | 2 x 700.4px, gap `48px 40px` |
| Nav cells | 506 x 38, 15px uppercase |
| Footer cells | 506 x 128 (`padding:48px 0`), 18px uppercase |
| Arrow links | arrow **FIRST**: `→ LABEL`, uppercase |
| Newsletter CTA | **unfilled** cell bounded by hairlines — never a filled button |
| Hairline colour | `#c9c9c9`; lattices use `gap:1px` + a 1px **outline** per cell |
| Spacing ramp | 4 8 16 24 32 40 48 80 120 240 |
| Type ramp | 132 / 52 / 32 / 20 / 18 / 15 / 12 (fluid vw above 1600) |

---

## 3. Font weights and page cost

| File | Size | Role |
|---|---|---|
| `archivo-expanded-400.woff2` | 14 KB | all headings |
| `archivo-400.woff2` | 14 KB | body |
| `archivo-800.woff2` | 14 KB | **logo only** |
| `printvetica-caps.woff2` | **200 KB** | meta / labels / dates |

Printvetica is a distressed face — the full ASCII subset is 332 KB and the
unsubset web build is 739 KB. The caps-only cut is the only viable form, and it
works because every heading and label in this design is uppercase anyway.
**Never use Printvetica for body copy.**

Licence: commercial licence purchased from guaschetti via Gumroad, confirmed
2026-07-29, recorded in `vektor/canon/canon.yml`. **Open item:** confirm that
licence covers *webfont embedding*, not desktop use alone — Gumroad commercial
tiers frequently exclude it.

---

## 4. Imagery — what happened and what is true

Four rounds of a slit-scan pipeline (`plate.py`, session scratchpad) failed to
reach the reference quality. The failure is structural, not a tuning problem:

- Round 1: the films' long static holds meant one-column-per-frame produced
  ~150px slabs of intact poster. Readable headlines, bullet lists and an entire
  news article survived into the output.
- Round 2: motion-gating killed the readable text, but isotropic blur made every
  plate read as a blurry screenshot, and over-clamping crushed one plate into an
  8% slice of the value range.
- Round 3: **the metric being tuned was measuring grain, not structure** — 91% of
  every plate's fine detail was noise. Adding grain raised the score. The
  horizontal smear also ran *along* text lines, making the screenshot tell worse.
- Round 4: fixed the axis (anisotropy 0.31–1.23, inside the reference band of
  0.07–1.11) but vertical-edge energy collapsed to 0.36–0.87 against a reference
  range of **3.1–21.2**, and highlights topped out at 188 against 244–255.

The references are each **one clear form in generous negative space**. A smeared
screenshot is destroyed form, not abstract form. No parameter adds a subject.

**Resolution:** card plates come from a free image model using the locked recipe
in `PLATE-PROMPTS.md`. Slit-scan output is retained only as low-contrast texture.

Brik (brik.space) was evaluated and rejected: it is Wix-owned, its output is
monochrome kinetic typography rather than the reference genre, cropping its
watermark is legally grey under Wix ToU §2.3, and §5.2 states output "may not be
unique to you" — disqualifying for a brand wordmark.

---

## 5. Next steps, in order

1. **Verify the mock in a browser.** In progress. Mock D shipped a 136px
   horizontal overflow that was invisible outside a browser.
2. **Port the design into `partials/head.html`.** One file drives all 19 built
   pages; `npm run build` then moves the whole site. Copy the four woff2 files
   into `fonts/` and drop the six IBM Plex Mono files if mode C stands.
3. **Generate the 23 card plates** per `PLATE-PROMPTS.md`, save as
   `og/plate-no-XXX.png` at 3:2. Cards currently show slit-scan placeholders.
4. **Port the 5 orphan pages into the build** — `no-014`, `no-026`, `no-028`,
   `no-030`, `no-031` have no `src/*.body.html` and will not move with the
   redesign.
5. **Run `npm run check`** — verifies outputs are in sync and every link and
   asset resolves. This is the pre-merge gate.
6. Merge to `develop`, then to `main`. Pages deploys from `main` via
   `.github/workflows/pages.yml`.

## 6. Open items

- [ ] Accent: acid green vs gold vs monochrome — not locked
- [ ] Printvetica webfont licence confirmation
- [ ] `no-014` and `no-028` have no OG card and no plate
- [ ] The free image model's real daily limit is unverified (the "100/day at
      2048px" figure came from a comparison listicle, not from Google)
- [ ] Decide whether the films adopt Archivo Expanded in return, or stay
      Printvetica-only
