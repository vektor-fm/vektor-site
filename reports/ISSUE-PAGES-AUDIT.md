# Issue pages — what a redesign actually costs

Written 2026-08-14, after porting the landing page. Measured across all 20
built issue bodies and `partials/head.html`, not estimated.

---

## 1. The headline

**The redesign surface is one 196-line stylesheet, not twenty pages.**

| | |
|---|---|
| Built issue pages | 20 |
| Total body markup | 2,834 lines (median 138/page) |
| Distinct CSS classes across all bodies | 49 |
| Of those, styled in `partials/head.html` | **44** |
| Used but never styled (dead or inline) | 5 — `c-fog`, `code`, `issue`, `meta`, `num` |
| Classes bespoke to a single page | 7 |
| The design CSS itself | **196 lines**, one `<style>` block |

The pages share one component vocabulary and use it consistently — `btn`,
`card`, `kick`, `disp`, `fig`, `hero` and `actions` appear on 19 or 20 of 20.
There are no rogue pages.

**The consequence: if the class names are kept and only the CSS is replaced,
all 20 pages re-skin from one file with zero edits to any body.** That is a
fundamentally different job from the one implied by "20 pages to redesign".

The five unstyled classes should be deleted from the bodies at the same time —
they currently do nothing.

---

## 2. The component families

Nine, derived from the class co-occurrence:

| Family | Classes | Reach | sprind analogue |
|---|---|---|---|
| Hero | `hero` `kick eye` `disp` `dot` `sub` | 20/20 | their hero — exists |
| Cards | `issues` `card` + 6 colour variants, `top` `tag` `goth` `one` `proof` | 19/20 | teaser / magazine card — exists |
| Code snippet | `snippet` `bar` `f` `snipbtn` | 11/20 | **none** |
| Actions | `actions` `btn` `btn primary` | 20/20 | their CTA — exists, but theirs is never a filled button |
| Rule | `rule` | 20/20 | hairline — exists |
| Figure | `fig` `gaccent` `line` | 20/20 | **none** |
| Ledger | `ledger` `lrow` `n` `t` | 15/20 | accordion / lattice — close enough |
| Copy-to-clipboard | `copy` `copybtn` | 7/20 | their section copy-link — exists |
| Misc | `midcap` `note` `stars` `ascii` `tpl` | varies | partial |

Two families have no sprind equivalent and need a decision rather than a
translation: the **code snippet** block and the **figure** block.

---

## 3. What has to be decided, not just ported

These are identity questions. None of them is a mechanical port.

### 3.1 The blackletter accent (`.goth`)

`Jacquard 24`, 52px, used **101 times across 19 of 20 pages**. It is the single
most-used decorative element on the issue pages and it has no counterpart
anywhere in the sprind structure or on the new landing page.

Keeping it means the issue pages carry a voice the landing page does not.
Retiring it removes a strong existing signature. This is the biggest visual
decision in the whole redesign and it cannot be answered by measurement.

### 3.2 Coloured cards

The current cards are tinted surfaces:

| Variant | Colour | Pages |
|---|---|---|
| `c-ink` | `#101010` | 19 |
| `c-cream` | `#F4EFDF` | 16 |
| `c-aqua` | `#8FC5C9` | 16 |
| `c-orchid` | `#C77BC9` | 7 |
| `c-signal` | — | 5 |
| `c-fog` | `#E8ECEA` | unstyled |

sprind has no coloured surfaces at all — its entire system is black, white and
one grey hairline. The new landing page follows that, with a single lifted band
at `#141414`. Carrying six tinted card colours into it would be the loudest
departure from the 1:1 anywhere on the site.

### 3.3 Five display faces down to two

| Face | Role now | Under the redesign |
|---|---|---|
| Tektur 900 | `.disp` — page headlines | → Archivo Expanded 400 |
| Workbench | `.kick` — labels | → Printvetica (mode C) |
| Jacquard 24 | `.goth` — accent | → decision 3.1 |
| IBM Plex Mono | body copy **and** code | body → Archivo; **code must stay mono** |
| Inter Tight 600 | wordmark | unchanged |

Note the redesign's weight-400-everywhere rule collides directly with
`.disp { font-weight: 900 }`. Every issue-page headline is currently heavy.

The six IBM Plex Mono files cannot simply be dropped as the handoff assumed —
11 of 20 pages have code snippets, and those legitimately need a monospace
face. One weight would do instead of six.

### 3.4 The bespoke chrome

`partials/masthead.html` carries a sticky 64px masthead, a sticky follow CTA,
a `weave` background element and a newsletter pop-up dialog. The redesign's nav
is the opposite: hidden until summoned, no shadow, no sticky bar. These cannot
coexist; the pop-up and sticky CTA are conversion furniture and retiring them
is a marketing decision, not a design one.

---

## 4. Suggested order

1. Decide 3.1 (blackletter) and 3.2 (card colour) — everything else follows.
2. Rewrite the 196-line block against the new tokens, keeping every class name.
3. Delete the 5 dead classes from the bodies.
4. Rebuild, then check all 20 pages headless at 390/768/1440 the same way the
   landing page was checked.
5. Reconcile `partials/masthead.html` and `partials/footer.html` with the new
   nav and footer.
6. `npm run check`, then merge.

Steps 2–4 are mechanical once 1 is answered. Step 5 is the second real
decision point.

---

## 5. Also outstanding

- **5 orphan pages** — `no-014`, `no-026`, `no-028`, `no-030`, `no-031` exist as
  built HTML but have no `src/*.body.html` and are absent from `site.json`, so
  they are unreachable from the archive and will not move with the redesign.
  They need either a source file or deletion.
- **Plate `033`** is the only gap in the card art; it renders as an empty cell.
- **Printvetica licence** unconfirmed. The font is gitignored, so production
  currently falls back to Helvetica for meta and labels.
- Several landing-page sections carry **invented placeholder copy** — `#series`,
  the `#teardown` episode rows, and the `#packs` card titles.
