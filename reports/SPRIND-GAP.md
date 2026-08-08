# SPRIND-GAP — sprind.org vs our mock, element by element

Written 2026-08-08. Sources: two live browser audits of www.sprind.org measured
at a forced 1440px layout viewport with `getBoundingClientRect` /
`getComputedStyle`, plus the site's own CSSOM for authored values. Our column is
read from `mocks/index.html` at head `aa289d2` plus this session's plate wiring.

**Nothing in this document has been implemented.** It exists to be approved
first. Section 1 is the part that needs your decisions; sections 2–5 are the
work list that follows from them.

A note on one measurement artefact: the audit machine renders at DPR 1.25, so
Chrome reports authored `1px` hairlines as `0.8px`. Every `0.8px` below is an
authored `1px`.

---

## 1. DECISIONS NEEDED

### 1.1 Two "locked" facts are wrong

**A. The arrow goes AFTER the label, not before.**

`HANDOFF.md` and `REDESIGN-STATE.md` both record "Arrow links | arrow **FIRST**:
`→ LABEL`, uppercase" as measured anatomy. Our mock implements that in `.alink`
with the comment *"sprind writes -> ZU DEN PROJEKTEN"*.

Measured on the live site, the arrow is **after** the label in every page-level
control: `.defaultL` section CTAs, all seven footer link cells, the newsletter
submit. The arrow is a 17×11 SVG, `align-items: baseline`, `gap: 4px`, and on
hover the **gap widens 4px → 8px** so the arrow slides right — the element grows
177.8px → 181.8px. That gap-widening *is* the hover state.

The one place the arrow leads is inside the **nav submenu panels**, where each
link is `arrow(17×19.8) → span`, gap 8px. So both forms exist, on different
components. Our mock applies arrow-first everywhere, which is right for the nav
panels and wrong for the whole page.

Also: the small card CTA (`.defaultS`, "Mehr erfahren") has **no arrow at all** —
it is a bare label with a 1px `#767676` underline. Ours adds an arrow to it.

**B. sprind's own dark mode uses `#c9c9c9` hairlines, not white.**

You chose full white `#FFFFFF` for the rectangles. That decision was made before
we knew sprind has a dark treatment of its own — and it does. The homepage
already alternates light and dark bands (S0, S1, S2, S6 and S8 are black), via a
class that swaps two tokens:

```css
.darkmode, .darknav { --black: 255 255 255; --white: 0 0 0; }
```

`--color-silver-300: #c9c9c9` is deliberately **not** swapped. The hairline is
the same mid-grey on black as it is on white. So the literal 1:1 answer for a
dark page is `#c9c9c9` — considerably softer than white, and much stronger than
our current `rgba(255,255,255,.22)`.

For reference, against a black ground: our current rule reads at ~56/255,
`#c9c9c9` at 201/255, white at 255/255.

> **DECISION 1.** Hairline colour on dark: `#c9c9c9` (sprind's literal dark-mode
> value) or `#FFFFFF` (your earlier answer, brighter than sprind's own dark
> treatment)?

### 1.2 sprind has no accent colour

There is no chromatic accent anywhere on their homepage. `--gold: #ffcc00` and
`--red: #ff0000` are defined in their tokens and **used zero times**. Every hover
state is achromatic:

| Control | Hover |
|---|---|
| `.defaultS` card CTA | gap 4→8px, colour `#767676` → full black/white |
| `.defaultL` section CTA | gap 4→8px, colour unchanged |
| Footer link cell | background → `rgba(0,0,0,0.05)`, gap 4→8px |
| Nav top-level cell | background → `rgba(255,255,255,0.2)` on dark |
| Nav panel link | **the siblings dim** to `#767676`; the hovered one stays white |
| Section `h2` | a 24×24 copy-link icon fades in at `#676767` |

Our mock recolours links to `var(--accent)` on hover throughout. A 1:1 copy has
no accent at all. The accent is a Vektor addition, and the card-grid review
recommends acid `#39FF35` on the grounds that it is the only value absent from
the photography.

> **DECISION 2.** Keep an accent for hover (acid `#39FF35` recommended), or go
> fully achromatic like sprind and use their gap-widening + grey-to-white
> pattern instead?

### 1.3 Light/dark banding

Their homepage is **not** a dark site. It alternates:

| Band | Section | Ground |
|---|---|---|
| S0 | Hero | black |
| S1 | Themen | black |
| S2 | Video | black |
| S3 | Woran wir glauben | white |
| S4 | Taten | white |
| S5 | Strategische Projekte | white |
| S6 | Podcast | black |
| S7 | Magazin | white |
| S8 | Veranstaltungen | black |
| S9 | Mitarbeit | white |
| S10 | Über uns | white |
| Footer | | **white** |

That alternation is a large part of the page's rhythm — the thing you asked to
copy 1:1. Our mock is black end to end, footer included.

> **DECISION 3.** Three options: (a) all-black as now, losing the banding;
> (b) keep the banding but invert it, so their white bands become our black and
> their black bands become a lifted near-black surface; (c) reproduce the
> alternation literally, accepting white bands on our site.

### 1.4 The hero has no image

Measured: the sprind hero is **black + a gradient + the wordmark**. No image, no
video. The wordmark is an inline SVG at `w-2/3` — a **960×361 box** on a 1440
viewport, with the glyph 960×125.7 centred in it. Above it sits a 15/19 uppercase
eyebrow; below, an `h1` at 52/54 and an `h2` at 18/22, both centred, in a block
with `padding: 0 40px 120px`.

Our hero is a full-bleed plate image with a scrim, and the wordmark is set type
at `clamp(40px, 11vw, 84px)` — roughly a fifth of their size.

> **DECISION 4.** Drop the hero plate and go to sprind's black-plus-wordmark
> hero at their scale, or keep our image hero?

### 1.5 Section inventory

Their IA and ours are different sets. Yours was approved on 2026-08-07, so this
is a question about how far "1:1" reaches — structure only, or section types too.

| sprind section | Component type | Ours |
|---|---|---|
| S0 Hero | black + wordmark | hero with plate |
| S1 Themen | 4 teaser cards, 2-up | LATEST (4 cards) ✓ |
| S2 Video | 16:9 player, hover scrim + blur, scrub bar | film module ✓ (close) |
| S3 Woran wir glauben | 2-col: h2 left, 7-row accordion right | HOW IT WORKS ✓ |
| S4 Taten | 2 large cards, 3:2 image above text | — |
| S5 Strategische Projekte | 4-card stacked slider with scale transforms | — |
| S6 Podcast | dark band, bg image, 2 episode rows | — |
| S7 Magazin | 4-col grid, feature spans 2×2 | ARCHIVE (2-col) |
| S8/S9/S10 | 2-col: 3:2 image left, heading + CTA right | — |
| Footer | 3-block lattice | footer ✓ (close) |

> **DECISION 5.** Match their section *types* (adding S4/S5/S6/S8-style modules
> and rebuilding ARCHIVE as their 4-col-with-2×2-feature magazine grid), or keep
> our IA and copy only the shared components 1:1?

---

## 2. THE LATTICE — why the rectangles are missing

Three separate techniques on their page. They are not interchangeable, and we
currently use the wrong one in most places.

### Technique A — section dividers
Every top-level section carries its own `border-bottom: 1px solid #c9c9c9`.
Section-to-section gap measures **0.00px** across all 11 pairs — sections abut,
and the only thing between them is that border.

*Note for implementation:* their wrapper `<div class="grid divide-y divide-silver-300">`
is **dead markup** — every child measures `border-top-width: 0`. Do not copy it.

**Ours:** `.stack > * { border-top: 1px solid var(--rule) }`. Structurally
equivalent, wrong colour.

### Technique B — card hairlines, ONE edge only
Cards are unfilled cells bounded by a **single** hairline, never boxed.

| Lattice | Edge ≥1024 | Edge <1024 |
|---|---|---|
| News teasers (S1) | `border-top` | `border-left` |
| Taten cards (S4) | `border-left` | `border-left` |
| Podcast episodes (S6) | `border-top` | `border-top` |
| Magazine teasers (S7) | `border-left` | `border-left` |
| Accordion rows (S3) | `border-bottom`, `last:border-b-0` | same |

**Ours:** `.teaser { border-top: 1px; border-left: 1px }` — **two** edges on every
card, at every width, and no flip at the breakpoint. This is a real difference in
the page's texture: theirs draws a single rule, ours draws an L.

### Technique C — the true lattice, footer only
```css
.gaplines { gap: 1px; }
.gapline, .gaplines > * { outline: 1px solid var(--color-silver-300); }
```
A 1px grid gap plus a 1px **outline** on every child. Outlines paint outside the
border box and consume no layout space, so two neighbours' outlines meet inside
the 1px gutter and read as one continuous hairline. This is the only place on the
page where a 1px gap has anything showing through it.

**Ours:** correct technique, correct place (`footer`, `.lattice`), wrong colour.

### The actual answer to "why can't I see the rectangles"
Two independent causes, and fixing only the first would not have worked:

1. `--rule: rgba(255,255,255,.22)` reads at ~56/255 on black. It preserves
   sprind's contrast *delta* but not its *presence*.
2. **Closed rectangles barely exist in our markup.** Technique C — the only one
   that draws a rectangle — is used solely in the footer. Everywhere else we draw
   single top/left borders. At any colour, most of the page would draw L-shapes,
   not rectangles.

Worth being precise about: on sprind, most of the page draws single rules too.
The full rectangle lattice is the footer and the nav. If you want rectangles
across the whole page, that is a departure from sprind, not a correction toward
it — and it belongs in Decision 3's territory.

---

## 3. THE NAV — the largest single gap

### 3.1 It is invisible by default
At scroll 0 on first load, `#primary-navigation` is `position: fixed; top: 0` with
`transform: translate3d(0, -100%, 0)` — entirely off-screen. Adding `.nav-visible`
sets `transform: translateZ(0)`.

Reveal triggers, all verified:
- `mouseenter` on an invisible fixed strip: `div.top-0.right-0.left-0.z-40.fixed.w-full.h-6`,
  rect `[0, 0, 1424.8, 24]` — **a 24px-tall full-width hover zone at the top of the viewport**
- clicking the hero's `button[aria-label="Menü öffnen"]` (64×64 at the top right)
- `:focus-within` on the nav, for keyboard

**Scroll never reveals it.** Tested at scrollY 0 → 200 → 400 → 800 → 1600 and
back to 600: `nav-visible` never appeared. Synthetic `wheel` and `mousemove` do
nothing. Once revealed it is sticky — `mouseleave` and further scrolling leave it
in place. Transition: `transform 0.4s ease`.

**Ours:** a permanently visible fixed bar. This is why the top of the page does
not feel like theirs.

### 3.2 Three states
| State | Height |
|---|---|
| Off-screen | — |
| Bar only | **81.8px** = 44 bar + 1 gap + 36.8 submenu row |
| Fully open | **326.8px** |

Bar → open is driven by `:hover` on the nav (`.group:hover .slider`), animating
`max-height: 0 → 24rem` with `max-height 0.5s ease-out, opacity 0.5s ease-out`.
It **covers** the page; nothing is pushed, and there is **no scroll lock** at
desktop (`body { overflow: visible }` throughout).

### 3.3 The bar at 1440 (homepage / dark)
| | value |
|---|---|
| Height | 44px (8 padding + 28 content + 8) |
| Padding | 8px all sides at ≥768px; `8px 12px` below 640 |
| Background | homepage `#000`; **every other page `#fff`** |
| Hairline | `outline: 1px solid #c9c9c9` — surrounds the whole bar, not a border |
| `box-shadow` | `none`, ever |
| On scroll | **nothing changes.** Sampled at scrollY 0/300/600/1200/1400 — bar bg, colour, height, outline, shadow all byte-identical |
| Type | GT America Standard 15/22, `letter-spacing: normal` |

Contents left to right: logo SVG **136×19** at x=8 (`flex: 1`, so its anchor box
is 682.5 wide but the glyph stays 136×19); breadcrumb, 15/22 w400 **uppercase**
`#767676`; then a right cluster at `[1324.56, 8, 92.24, 28]` with `gap: 4px` —
search button 44×28 (`border-radius: 6px`, 16×16 icon, `#767676`), "DE" 15/22
**w500** white, "EN" 15/22 w400 `#767676`.

There is **no desktop menu button.** The hamburger is `display: none` at ≥768px.

**Ours:** a bar with wordmark / centred label / utilities, plus a 3-cell
`.navgrid`. No breadcrumb, no search, no language switcher, no skip link, and the
bar is always visible.

### 3.4 The submenu lattice
`ul` is `grid-auto-flow: column; grid-auto-columns: minmax(0,1fr); gap: 1px`,
computing to **3 × 474.263px** at 1440. Technique C throughout.

Headers: TATEN `/taten`, WORTE `/worte`, WIR `/wir` — 15/22, w400,
`letter-spacing: normal`, **uppercase, centred**, padding 8px, each cell 474.26×38.

Panels (`div.slider`): `border-top: 1px #c9c9c9`, `margin-bottom: -1px` (which
swallows the doubled hairline), inner padding 16px, inner gap 32px. Link list is
`gap: 2px`, rows 19.8px tall. Each link is `arrow(17×19.8)` then `span`, gap 8px,
**15/19 w400 sentence case** — not uppercase. The `span` carries a
`border-bottom: 1px rgba(0,0,0,0)` that is reserved but never activates on hover.

A `.bottom-slider` cell spans all three columns at `[0, 291.8, 1424.8, 36]`: six
20×20 social icons on the left (28px pitch, inverted by filter under `.darknav`),
and Kontakt / Impressum / Barrierefreiheit on the right with `gap: 32px`.

Panel hover is a **dim-the-siblings** pattern, not highlight-the-target: hovering
one link sends every *other* link from `#ffffff` to `#767676` while the hovered
one stays white. `transition: color 0.1s ease-in-out`.

Staggered reveal: `.subnav li` child *n* gets `transition: opacity {0.1×n}s ease-in-out {0.02×n}s`.

**Ours:** 3-cell navgrid with hover panels — the right skeleton. Missing the
bottom-slider row, the dim-the-siblings hover, the stagger, and the panel link
type is wrong (ours uppercase, theirs sentence case).

### 3.5 Mobile (500px)
Below 768 the whole component changes: hamburger appears (16×10, three lines,
`gap: 2px`), breadcrumb hides, the submenu becomes a full-width accordion drawer
pushing down from the bar (`max-height: 0 → 100svh` over 0.4s), **all three panels
are open simultaneously** (the hover gating is md+ only), and **mobile does
scroll-lock** (`body { overflow: hidden }`) where desktop does not.

---

## 4. WHAT MATCHES ALREADY

Confirmed identical, no work needed:

- **Type ladder.** Our three breakpoints reproduce theirs exactly:
  132/52/32/20/18/15/12 at ≤1920, 40/32/24/18/16/14/12 at ≤1024,
  28/24/20/16/14/14/12 at ≤640, with matching line-heights.
- **Space ladder.** 4 8 16 24 32 40 48 80 120 — matches, including the
  ≤1024 and ≤640 steps.
- **Page gutter 40px, content width 1360, no `max-width` anywhere.**
- **Section padding** `40 / 40 / 80 / 40` (`.module`), `40` all round
  (`.module-equal`).
- **Header→content row gap 80px.**
- **Weight 400 everywhere, letter-spacing `normal` on every heading** — confirmed
  with zero exceptions across all 10 section headings.
- **`letter-spacing: 0.025em`** on the meta/CTA layer only (0.45px at 18,
  0.375px at 15) — ours matches.
- **No filled buttons anywhere.** Even the newsletter submit is transparent with
  no border. Ours matches.
- **Card geometry.** Image left at 3:2, text right, `padding: 16px 0 0 16px`,
  title and body both 18/22, date 15/22 uppercase `#767676`. Ours matches, and
  all 22 cards measure exactly 700×234 with images at 1.500.
- **No scroll animation of any kind.** An off-screen section 7096px below the
  fold measured `opacity: 1, transform: none`. The only load-time motion is a
  `fade-in 0.3s ease-in-out` on the hero.

Two exceptions worth recording, since our rule is "weight 400 everywhere":
- The **only** non-400 text on their homepage is the two podcast episode titles
  at `font-weight: 500`.
- The nav's active language ("DE") is also 500.

---

## 5. WORK LIST, once decisions 1–5 are answered

Ordered by how much of the page each item changes.

1. **Nav reveal behaviour** — 24px hover strip, `translate3d(0,-100%,0)` default,
   `transform 0.4s ease`, sticky once shown. (§3.1)
2. **Light/dark banding** — depends on Decision 3; touches every section.
3. **Hairline colour** — one token, depends on Decision 1.
4. **Card hairlines** — one edge, not two, with the ≥1024 top / <1024 left flip
   on the news teasers. (§2 Technique B)
5. **Arrow direction** — after the label on all page CTAs, before it in nav
   panels only; remove the arrow entirely from `.defaultS` card CTAs. (§1.1A)
6. **Hover states** — gap 4→8px everywhere; depends on Decision 2 for colour.
7. **Hero** — depends on Decision 4.
8. **Nav bottom-slider row**, dim-the-siblings panel hover, opacity stagger.
9. **Panel link type** — 15/19 sentence case, not uppercase.
10. **Missing bar furniture** — breadcrumb, search modal (this one *does*
    scroll-lock), DE/EN switcher, skip link.
11. **Section copy-link buttons** — 24×24, `#676767`, opacity 0→1 on `h2` hover.
12. **New section types** — depends on Decision 5.
13. **Mobile nav drawer** — accordion, all panels open, scroll-locked.

---

## 6. STILL OPEN FROM BEFORE

- **Plates 026 and 030** have no art — the OpenAI account ran out of credits
  mid-run. 20 of 22 are generated and ingested. Those two cards currently fall
  back to a slit-scan placeholder, and the fallback for 026 measures mean
  luminance 149, the second-brightest tile on the page. It reads as broken.
- **Four plates are off-set** and should be regenerated: `015` (worst — high-key
  lilac/mint, mean 163 against a set median of 78), `023` salmon, `024` cream
  glass, `022` chartreuse. Borderline: `009`, `004`.
- **Printvetica webfont licence** unconfirmed; the font stays gitignored.
- **Nothing is pushed.** `develop` and `feature/sprind-redesign` are local only.
