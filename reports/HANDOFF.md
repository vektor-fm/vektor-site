# HANDOFF — vektor-site

Rewritten 2026-08-14. **The redesign is finished and live.** Everything below
describes the shipped state, not a plan.

Live: <https://vektor-fm.github.io/vektor-site/> — and the bare domain
<https://vektor-fm.github.io/> now redirects there.

`main` and `develop` are in sync. Nothing is unpushed. Pages deploys from `main`.

---

## What shipped

| | |
|---|---|
| Landing page | sprind structure, dark, 9 sections, cards generated from `site.json` |
| Issue pages | all 20 re-skinned from one stylesheet, zero body rewrites |
| Nav | one shared component, hidden until summoned, drawer on mobile |
| Funnel | email-first, popup at 50% scroll, per-issue ungated offer |
| Plates | 20/20 |

## The five rules the design actually follows

Measured off sprind in a browser, not inferred. Get these wrong and the copy
stops being 1:1.

1. **Hairline is `#c9c9c9` in both themes.** sprind's dark class swaps
   `--white`/`--black` and deliberately leaves the hairline alone. Do not
   "invert" it.
2. **Weight 400 everywhere, `letter-spacing: normal` on every heading.** Their
   only exceptions are two podcast titles at 500. Browser-default `<h2>` bold is
   the trap — there is a global reset for it.
3. **The arrow goes AFTER the label** on page controls (`LABEL →`), and the
   hover state *is* the gap widening 4px → 8px. Arrow-first survives only in the
   nav submenu panels. An earlier version of this file recorded the opposite and
   the mistake shipped.
4. **Nothing is ever a filled button.** Every control is an unfilled cell
   bounded by hairlines.
5. **Cards carry ONE edge, not two** — `border-top` at ≥1024, flipping to
   `border-left` below.

## How the build works

`node build.mjs` → 42 outputs. `node build.mjs --check` is the pre-merge gate.

- `index.html` comes from `src/index.body.html` **alone**.
- Issue pages are `head + masthead + body + footer + scripts`.
- The nav is injected into both from `partials/nav.html` + `partials/nav-css.html`.
  **Edit the component, never a copy** — the moment the issue pages inherited the
  shared markup they also inherited touch-target bugs that had been fixed in the
  landing page's stylesheet instead of the component's.
- Card grids and the per-issue lead magnet are generated from `site.json` and the
  manifests. Adding an issue to `site.json` is the only edit needed to publish it.
- `ingest-plates.mjs` reads `site.json`. It used to carry a hardcoded list, which
  produced 20 plates for issues that did not exist while the newest had none.

## Verification harness

The MCP browser stalled six times in one session; **headless Chrome via
Puppeteer is the tool that works.** The scripts live in the session scratchpad —
recreate them if gone, they are short:

- all 20 pages at 1440 and 390 → overflow, heavy headings, failed requests
- link crawl → dead links, missing files, unresolved anchors
- deep mobile audit at 390×844 DPR 2 touch → touch targets, iOS zoom, inner
  scroll, contrast, layout shift

Run with `NODE_PATH="C:/Users/julia/AppData/Roaming/npm/node_modules"` —
puppeteer and sharp are installed globally, not in this repo.

**Never read images into the main thread.** Delegate visual judgement to a
subagent; it returns a text verdict.

---

## Open

Nothing blocking. In rough order of value:

- **14 of 20 issues have no downloadable pack**, so their email ask falls back to
  the vaguer "the *X* setup" wording. This is the biggest remaining conversion
  lever and it is a content job, not a code one.
- **Capture-point data.** All four points (`sticky`, `popup`, `midcap`, `footer`)
  now report separately to GoatCounter, plus `popup-view` / `popup-dismiss` /
  `sticky-view` for denominators. After a week or two, cut whatever is not
  earning its place and test an inline capture under the hero against a real
  baseline. Do not tune on benchmarks once real numbers exist.
- **5 orphan pages** — `no-014`, `026`, `028`, `030`, `031` exist as built HTML
  but have no `src/*.body.html` and are absent from `site.json`, so they are
  unreachable from the archive and did not move with the redesign. They need a
  source file or deletion.
- **Landing page accordion: 5px of phantom inner overflow** on `.split`/`.acc`/
  `.row`. Four attempts did not clear it and it detached from the element that
  originally caused it. No page-level overflow, sits inside 24px of padding,
  invisible to users. Unresolved, not hidden.
- **A custom domain** would make `vektor-fm/vektor-fm.github.io` redundant —
  point the domain at the site repo instead.

## Decisions, so they are not relitigated

Dark, with sprind's banding inverted (`--band:#141414`). Hairline `#c9c9c9`.
Accent caret teal `#0E9C86` — note sprind itself has **no** accent, so this is a
deliberate Vektor addition. Archivo Expanded + Archivo; Printvetica on labels and
carrying the retired Jacquard accent role; IBM Plex Mono at one weight for code
only. Hero has no image. Menu trigger is two rules plus the word. Conversion
furniture (sticky bar, pop-up, weave) kept and rebuilt rather than deleted. Packs
stay free and ungated — the site promises that in writing.

Printvetica ships in the repo (founder, 2026-08-14; commercial licence purchased
from guaschetti via Gumroad 2026-07-29).

Superseded but kept for the measurements in them: `REDESIGN-STATE.md` (pre-port
state), `SPRIND-GAP.md` (the gap list, now closed), `ISSUE-PAGES-AUDIT.md` (the
audit, now executed).
