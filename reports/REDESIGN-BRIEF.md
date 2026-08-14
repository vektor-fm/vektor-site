# vektor-site redesign brief — SPRIND direction

Status: **in progress** — decisions below are founder-confirmed unless marked OPEN.
Date opened: 2026-08-07.

---

## 1. What we're doing

Move https://vektor-fm.github.io/vektor-site/ toward the design language of
https://www.sprind.org/ — light, editorial, extended-grotesk, huge type
contrast, one spacing unit — while keeping the parts that make it Vektor.

Founder-confirmed direction (2026-08-07):

| Decision | Answer |
|---|---|
| What to take from SPRIND | Nearly everything — layout & rhythm, light background, type scale & hierarchy, nav & card patterns |
| Background | **Go light** |
| Accent | **Keep neon green `#39FF35`, used rarely** — links, CTA, live dot. Near-monochrome otherwise |
| Display typeface | **Free extended grotesk** — mock 2–3, pick on the render |
| Headline size | **Mock both** — full SPRIND scale vs ~30% smaller |
| Mono | **Keep IBM Plex Mono for metadata** — issue numbers, dates, tags |
| Scope | Start with index.html, ultimately the whole site |
| Process | **Throwaway mocks first**, nothing live changes until approved |
| Structure | **IA proposal in §4 accepted** — latest issue as hero, archive promoted to a visual grid, capture after the archive |
| Orphan pages | **Port the 5 unbuilt pages into the build** before the redesign lands |
| Brand scope | **Full rebrand is in scope** — founder open to keeping the Vektor terminal identity *or* pivoting to the lusher reference direction, films included later |
| Hero artwork | **Generated in-browser** (canvas/CSS) — zero asset weight, reskinnable, seeded per issue |

---

## 2. SPRIND's actual design tokens

Measured this session by fetching `https://www.sprind.org/_nuxt/entry.B1bKMcx7.css`
(406 KB) and reading the custom properties. Not from memory.

### Typeface
- Display: **GT America Extended** (`GTAmerica Extended, Helvetica Neue, Helvetica, Arial, sans-serif`)
- Text: **GT America Standard** / **GT America Light**
- Grilli Type, commercial licence. Extended-width grotesk is the single
  biggest driver of the look.
- Fallback stack is plain Helvetica/Arial — they do not use a mono for anything
  brand-facing (`--font-mono` is the Tailwind system default, i.e. unstyled).

### Type scale — fluid `vw` at desktop, fixed px at three breakpoints

Desktop (`vw`-based, values in parentheses = px at a 2304 px viewport):

| Token | Size | Line-height |
|---|---|---|
| `--font-size-4xl` | `5.73vw` (132 px) | `7.29vw` (140 px) |
| `--font-size-3xl` | `3.128vw` (52 px) | `2.813vw` (54 px) |
| `--font-size-2xl` | `1.665vw` (32 px) | `1.77vw` (34 px) |
| `--font-size-xl`  | `1.043vw` (20 px) | `1.148vw` (22 px) |
| `--font-size-m`   | `0.938vw` (18 px) | `1.043vw` (20 px) |
| `--font-size-s`   | `0.78vw` (15 px)  | `0.99vw` (19 px)  |
| `--font-size-xs`  | `0.623vw` (12 px) | `0.728vw` (14 px) |

Breakpoint sets (px, from largest to smallest viewport):

| Token | ~1440 | tablet | mobile |
|---|---|---|---|
| 4xl | 132 | 40 | 28 |
| 3xl | 52 | 32 | 24 |
| 2xl | 32 | 24 | 20 |
| xl | 20 | 18 | 16 |
| m | 18 | 16 | 14 |
| s | 15 | 14 | 14 |
| xs | 12 | 12 | 12 |

**Headline-to-body contrast is 132 : 18 ≈ 7.3×** on desktop. That extreme ratio
is what makes the pages read as editorial rather than corporate.

Note the mobile collapse: 4xl drops 132 → 28 px. The scale is not proportional;
big type is a desktop-only gesture.

### Spacing — one unit, everything derived
```
--base-padding:        2vw   (40px at the fixed breakpoint)
--base-padding-small:  ×0.5
--base-padding-midi:   ×0.7
--base-padding-plus:   ×1.6
--base-padding-double: ×2
--base-padding-triple: ×3
--base-padding-quad:   ×4
--base-tile:           ×16 / ×28
--button-height:       ×3  (= --base-padding-triple)
```
Padding ramp: `4, 8, 16, 24, 32, 40, 48, 80, 120, 240 px`
(`--padding-xs` … `--padding-5xl`).

### Colour — effectively monochrome
```
--black:      0 0 0
--alabaster:  248 248 248        (#F8F8F8)
--color-silver-50 … -900: #f7f7f7 #ededed #dfdfdf #c9c9c9 #adadad #999 #888 #7b7b7b #676767 #545454
```
There is **no brand accent colour in the token set at all**. Everything else in
the sheet (blue/green/red/gray/slate ramps in `oklch`) is stock Tailwind
default, not brand.

### Structure
- Nav: three top-level groups (`Taten`, `Worte`, `Wir`) with dropdown submenus.
  German for roughly *Deeds / Words / Us* — organised by kind of thing, not by
  page.
- Sections alternate full-bleed and constrained; ~100–200 px between blocks.
- Cards: image-overlay with date, title, "Mehr erfahren" CTA.
- Images: WebP with blur-up placeholders.

---

## 3. What Vektor has today

Repo: `vektor-fm/vektor-site` → `https://vektor-fm.github.io/vektor-site/`.

### Build system (favourable for a redesign)
- `build.mjs` assembles each issue page from `partials/` + `manifest/no-XXX.json`
  + `src/no-XXX.body.html`.
- **All CSS and `@font-face` live in one file: `partials/head.html` (25 KB).**
  Change it, run `npm run build`, and all 19 built pages move together.
- Root `.html` files are BUILD OUTPUTS. Never hand-edit them.
- `npm run check` verifies outputs are in sync and links/assets resolve.

### Pages outside the build — must be hand-ported
`no-014`, `no-026`, `no-028`, `no-030`, `no-031` have no `src/*.body.html`.
Five pages. Either port them into the build as part of this work, or accept
they drift.

### Current identity
- Background `#101010`, text cream `#EFEADD`, accent neon green `#39FF35`,
  muted `#8F8B80`.
- Fonts shipped in `fonts/`: Tektur 900, IBM Plex Mono 400/500/600,
  Inter Tight 600, Jacquard 24, Workbench.
- Note: the films use **Printvetica**; the site has never used it. The two have
  always been separate. Founder is open to a new pairing.

### Current index IA
```
header (wordmark + "The Index")
  ↓
hero            ASCII sigil, wordmark, H1 "The AI frontier, cut to what ships."
  ↓
latest issue    single card — tag, title, CTA, social links
  ↓
newsletter      Buttondown capture, "Get every drop's pack."
  ↓
how it works    3 steps — watch reel / comment keyword / links in DMs
  ↓
archive         "Fig. 01 · archive" — plain text rows, one per issue
  ↓
footer          social nav, backref, animated wordmark
```

### Assets available for a visual grid
`og/` holds **23 issue cards** (`no-004` … `no-031`) plus `vektor-og.png`.
Missing: `no-014`, `no-028`. Present but retired: `no-025`.
These are already generated per issue by `render-og.mjs` — no new production
needed to make the archive visual.

---

## 4. IA proposal — OPEN, awaiting founder

The page's real job is link-in-bio: traffic arrives from a TikTok/IG/YT video
and wants (a) that issue's pack, (b) proof this is worth subscribing to,
(c) the newsletter signup.

Three problems with the current order:

1. **The hero is a statement, not an action.** Someone who just watched a reel
   lands on an ASCII sigil and a brand slogan. The thing they came for — the
   latest issue — is below it.
2. **"How it works" comes after the signup ask.** The mechanic that explains
   why the CTA matters is explained *after* the CTA.
3. **The archive is buried and weightless.** 20+ issues of proof rendered as
   grey text rows at the bottom. It is the strongest argument for subscribing
   and it is doing the least work.

### Proposed order

```
header + real nav      Issues · The Teardown · About       ← SPRIND's 3-group nav
  ↓
hero = latest issue    full-bleed. Big issue number, big title,
                       its OG card as the image, one CTA.
                       Brand line demoted to an eyebrow.
  ↓
ritual strip           3 steps, thin band, directly under hero —
                       explains the mechanic before any ask
  ↓
archive grid           the OG cards as a visual grid. The proof-of-volume.
                       Promoted from footer to main body.
  ↓
newsletter band        full-bleed. Placed after the archive — you subscribe
                       once you've seen the body of work.
  ↓
footer                 socials, slim second capture, wordmark
```

Rationale per move:
- **Latest-issue-as-hero** — SPRIND opens on a featured item, not an abstract
  statement. Matches what the visitor actually arrived for.
- **Ritual up** — one thin strip; it is the only thing that makes "comment the
  keyword" legible to a first-time visitor.
- **Archive up + visual** — uses assets we already generate; fills the
  SPRIND-shaped hole where photography goes; turns the strongest asset
  (volume) into the strongest visual.
- **Capture after archive** — the ask lands after the evidence.
- **Real nav** — three top-level groups make it read as a publication rather
  than a linktree.

The brand statement H1 is not lost — it moves to the eyebrow above the featured
issue, or into a full-bleed type band between archive and capture.

---

## 5. The reference screenshots

Four images the founder supplied (2026-08-07). None is a layout — all four are
**full-bleed abstract hero artwork**, no chrome, no cards, no containers.

1. Vertical slit-scan slats — ~60 hard-edged vertical bands, warm cream/peach on
   the left through burnt orange and navy to pale blue on the right. A photograph
   destroyed into stripes. Clipped text fragments at the left edge confirm a
   text column was cropped away.
2. Black field, two soft orange-to-white light columns, off-centre and cropped by
   the right edge. Strict three-value palette: black, orange, white. Film grain.
3. 3D iridescent ribbon/pipe forms on flat mint green — nested rounded bends with
   a dichroic mint→cyan→periwinkle→lilac shader. Empty upper-left quadrant.
4. Radial fan of tapered blades (palm-frond macro), origin off-canvas bottom-centre,
   deep cobalt at the base resolving to pale yellow-green at the tips. Left blades
   thrown out of focus.

**Common thread — the three things to reproduce:**

1. **Repeated linear elements as the structure** — parallel slats, parallel
   columns, nested ribbons, radiating blades. Rhythm of repeating strips replaces
   a visible grid.
2. **A directional gradient across the frame** — warm→cool or dark→light. Never
   flat colour.
3. **Off-centre cropping that implies continuation past the frame**, with one
   quadrant left empty for the headline. The set reads as a **split hero:
   left-aligned text column, artwork filling the remaining 65–90%.**

Note the tension, stated plainly: these references are lush, warm and high-key.
That is the opposite of both SPRIND's monochrome *and* Vektor's neon-green-on-black.
Founder's call: full rebrand is in scope.

---

## 6. The three mocks

Served locally at `http://localhost:4321/` from the session scratchpad.
Self-contained single files. Nothing in the repo is touched.

| | Direction | Typeface | Hero art | Archive | Palette |
|---|---|---|---|---|---|
| **A** | **Instrument** | Archivo (wdth 125) @ full SPRIND 132px | vertical slit-scan slats, seeded per issue | hard-ruled card grid, greyscale until hover | ink `#0E0E0E` / paper `#F8F8F8` / cream `#EFEADD` / acid `#2BD127` |
| **B** | **Prism** | Bricolage Grotesque (wdth 140–150) @ ~90px | iridescent nested ribbons | soft rounded card grid with a dichroic overlay | warm white `#FBFAF7` / mint / cyan / periwinkle / lilac |
| **C** | **Press** | Anybody (wdth 145–150) @ full 132px, uppercase | radial blade fan, one acid-green blade as the brand signal | dense index **table**, thumbnail on hover | true black / alabaster `#F8F8F8` / silver ramp / acid |

All three share: light page, the accepted IA, IBM Plex Mono for metadata, green
used sparingly, SPRIND's one-unit spacing system, real issue titles pulled from
`site.json` + the live archive rows, and live OG cards as thumbnails.

---

## 7. Round 2 — mocks A/B/C rejected, rebuilt as a 1:1

Founder rejected all three first-round mocks (2026-08-07): *"copy their structure,
weights, design, everything there is to consider 1 to 1."*

### What round 1 got wrong

Read from their stylesheet, not inferred:

| | Round-1 mocks | sprind, actually |
|---|---|---|
| H1 size | 88–132px | **52px** (`--font-size-3xl`, `3.128vw` above 1440) |
| H1 weight | 600–800 | **400.** GT America Extended ships **Regular only** — there is no bold on that site at all. Size does the work, never weight. |
| Letter-spacing | −.02 to −.05em on headings | **none.** `tracking-wide` (.025em) appears on meta text only |
| Hero | split — text column left, art right | **full-bleed media, white gradient scrim rising from the bottom, type bottom-centred over it** |
| Cards | bordered boxes / grid cells | **hang off a single left hairline**, image `aspect-[3/2] object-cover`, text block indented 16px |
| Hairlines | borders + a grey grid background | `gap:1px` + a 1px **outline** per cell — outlines take no space, so the rules stay exact |

The round-1 grey-background grid technique also leaves a visible grey void when the
last row is short. Confirmed in the browser on mock A. Not used in mock D.

### Mock D — the 1:1

Page order, matching sprind module for module:

| sprind | vektor |
|---|---|
| fixed nav: bar + 3-column `gap-[1px]` panel grid (Taten / Worte / Wir) | Issues / Packs / About, same hover-panel mechanic |
| `landing-intro` — bg video, white scrim, bottom-centred H1 + copyL | same, hero media toggleable |
| module "Themen" — 2-col teaser grid, one wide image-left card | module "Latest" — 4 issues, same grid, same wide card |
| full-bleed video module with scrub line | the reel, same treatment |
| "Woran wir glauben" accordion, heading left / rows right | "How it works" — the ritual as an accordion |
| module "Taten" — 2-col big cards | module "The archive" |
| footer lattice: newsletter cell + link cells + colophon | same lattice, The Teardown in the newsletter cell |

### Round-2 decisions (founder, 2026-08-07)

| Decision | Answer |
|---|---|
| Typeface | **Buy GT America Extended.** Mock loads it from sprind's origin for evaluation only — that hotlink must not ship |
| Hero media | Leaning **generated art**; wants to compare **still image + scrim**. Both are toggles in mock D |
| Green | **Keep the three touches** — wordmark dot, required-field asterisk, arrow-link hover. Otherwise monochrome |

### GT America licensing — what is actually known

Checked `grillitype.com/typeface/gt-america` and `/information` this session.
Neither page publishes tier prices. What they do state:

- **Web licences are priced by maximum unique monthly visitors**, not per style flat-rate.
- **All prices are in US Dollars.**
- **Unlimited/corporate tier starts at $10,000 per style** — not the tier a site
  like vektor needs, but it sets the ceiling.
- Server, HTML5-ad, Office-embed and device-embed licences are quote-only.

**No entry-tier figure is verified.** Any number quoted earlier in this session for
a single web weight was from memory and should be disregarded. The real figure
comes from their shop checkout at vektor's actual traffic band. Only one style is
needed — **GT America Extended Regular (400)** — plus GT America Standard Regular
for body copy.

---

## 8. Open items

- [ ] Founder decision on the §4 IA proposal
- [ ] Reference screenshots the founder supplied — read & fold into card spec
- [ ] Choose extended grotesk candidates, self-host as woff2 into `fonts/`
- [ ] Decide: port the 5 unbuilt pages into the build, or let them drift
- [ ] `no-014` / `no-028` have no OG card — needed if the archive goes visual
