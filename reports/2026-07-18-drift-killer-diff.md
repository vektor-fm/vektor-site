# Spec B — drift-killer: built-vs-live diff report

**Branch:** `feature/site-drift-killer` · **Date:** 2026-07-18
**Scope:** current-gen issue pages `no-007…no-013 + no-015` (8 pages) + `index.html` +
`sitemap.xml`. Gen-A (`no-004/005/006`) deferred to phase 2; `no-014` untracked (excluded).

## What shipped (the build system)

The 8 issue pages are no longer 8 hand-copied files. Each is now assembled by
`build.mjs` from:
- `partials/head.html · masthead.html · footer.html · scripts.html` — the shared,
  drift-prone blocks, ONE copy each, tokenised (`{{MARKER}}`, `{{SLUG}}`, …).
- `manifest/no-0NN.json` — the small per-issue variables (title, OG, marker, sticky
  text, backref, copy-event, subscribe flag).
- `src/no-0NN.body.html` — the page's bespoke body (hero + cards), extracted **verbatim**.

`index.html` archive rows + latest card, and `sitemap.xml`, generate from `site.json`
(kills the "copy this `<a.row>` block" hand-edit + the orphan-row/404 class of bug).

Run: `npm run build` (writes the served `.html`). Guardrail: `npm run check` — fails if
any output is out of sync, or any archive-row target / OG image / local `./files` payload
doesn't resolve. **`npm run check` is green.**

## Proof: nothing visual changed except the intended normalisations

Built output was diffed against the committed (= current-live) pages. Verified
programmatically:

| Region | Result |
|---|---|
| Page **bodies** (hero→cards), all 8 | **byte-identical** ✓ |
| **Masthead** markup (wordmark/marker/sticky/weave), all 8 | **byte-identical** ✓ |
| **Footer** markup (newsletter/socials/backref/wordmark), all 8 | **byte-identical** ✓ |
| **index.html** (full page) | **byte-identical** — generation reproduces it exactly ✓ |
| **sitemap.xml** | **byte-identical** ✓ |
| Subscribe tracking (per page) | **preserved exactly** — no analytics regression ✓ |

So the *entire* diff lives in two shared regions: the head `<style>` and the closing
`<script>`. Both are behaviour-preserving. The itemised deltas:

### 1. Fonts: 7-face → 13-face block (all 8 pages)
Adds the `-latin-ext` `@font-face` variants (already used by `index.html`; files present
in `fonts/`). Effect on current content: ≈ none (headlines/copy are ASCII + punctuation
already covered by the latin face). Correct going forward for any accented character.

### 2. Text-column widths → 44ch / 48ch (all pages except 015)
`.hero .sub` max-width `38–42ch → 44ch`; `.card .one` `46ch → 48ch`. ~2ch wider columns →
slight desktop re-wrap. This is the "standardise to latest values" you approved. (015 was
already at the latest values → no change.)

### 3. Footer backref link colour → acid (pages 007–010 only) — the one notable visual delta
`.backref a{color:var(--acid)}` was added to the shared CSS. On **007, 008, 009, 010** the
small footer backref link (e.g. "No. 008 is live →") changes from paper to **acid green** —
matching 011–015, which already had it, and the site's link-accent convention elsewhere.
011–015: no change.

### 4. Dead consistency-CSS (zero render effect)
The shared CSS is the superset of both widget generations, so each page now *defines*
`.snippet` + `.proof` + `.copy` even where it doesn't use them (e.g. `.snippet` on 007,
`.copy` on 011–015). Unused → no visual effect; present only so one source covers every page.

### 5. Woven brand band → full-bleed (founder-requested, all pages incl. index)
`.weave` changed from a fixed `min(230px,60vw)` chip to `width:100%; margin:0` — the band
now spans the full page width edge-to-edge. One-line change in `partials/head.html` +
`src/index.body.html`; applies everywhere at once (the drift-killer paying off). Deliberate
design change on top of the refactor.

### 6. Closing scripts unified (behaviour-identical)
The per-page copy/share/sticky/UTM/wordmark scripts became one shared block. Copy handler
binds both widget types (`.copybtn` and `#snipCopy`). Share/sticky/UTM/reveal identical.
Subscribe-submit tracking fires only where it did before (`subscribe_track` flag:
007–010 on, 011–015 off).

## Deferred (documented, not dropped)
- **Gen-A (004/005/006):** phase 2 — model their multi-card rotation as a manifest
  `items[]` and fold in `.c-signal`/`.c-orchid`/ASCII. Index rows + sitemap already cover them.
- **`--rail` gutter:** issue pages unified at 64px; `index.html` retains 72px as a
  distinct page type (not shared drift). Flag if you'd rather index also be 64.
- **Spec A** (funnel restructure, incl. per-page subscribe tracking = flip the flags on):
  separate PR after this, approved on a real render first.

## Approval
Per the Approval Protocol: one built page approved on the real render before merge. A
local render of 007 + 015 was visually verified to render clean. Awaiting founder sign-off
on the built page + this diff before merging to `main`.
