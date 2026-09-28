# vektor-site review and fix pass — 2026-09-27

Live at review time: https://vektor-fm.github.io/vektor-site/ = `origin/main` @ 5af5f96 (fetched 2026-09-27).
Fix branch: `feature/site-review-2026-09-27`, cut from origin/main. Founder call the same evening: implement
everything except the "How it works" rewrite, and keep it free (no paid image generation).

## 1. What a visitor saw (ranked) and what was done

| # | Finding | Evidence (2026-09-27) | Done |
|---|---|---|---|
| 1 | **18 of 39 issue cards were black boxes**: all four Latest cards (054, 053, 047, 046) and 14 archive cards. | live index: 18 x `class="img noplate"`; `ingest-plates.mjs --check`: 20/39 covered | 19 plates (the 18 + 052) rendered through a FREE route, see section 2. Zero blank cards after build. |
| 2 | **"Play the reel" was a dead prop**: static plate, a button with no handler, no video, hard-coded fake timestamps 00:24 / 00:38. | `src/index.body.html` L804-812; live DOM `filmVideo:false` | Wired to a real film: NO.006 on YouTube (hdzmUkqMkY8, 60s, the only vektor upload newer films are not on YouTube). Player iframe is created on click only, youtube-nocookie. Fake scrub removed. |
| 3 | **"All 22 issues"** while 40 archive links were on the page. | L796 hard-coded; `TOTAL_COUNT` token existed in build.mjs and was never used | Token wired: reads 39 and follows site.json from now on. |
| 4 | **Nav Packs panel said "One email opens any of them"** while the pack wall is OFF in build.mjs and no-054 says "no email needed". | `partials/nav.html` L41; build.mjs GATE comment (wall disabled 2026-09-01, restore is one expression) | Panel copy fixed. NOTE: the index's "How it works" ("No signup, no gate") is therefore TRUE today and was left untouched, as instructed. Memory `newsletter-email-wall` (founder 2026-09-01: "wall off the packs") does not match the shipped build. Founder to confirm which is intended. |
| 5 | **Featured packs and the nav Packs panel were July issues** (004, 020 / 004, 013, 015, 010). | `partials/nav.html` L36-41; index packs section | Both generated from site.json: packs = the 2 newest after Latest, nav = the 4 newest titles. |
| 6 | **The Teardown band listed no teardowns**; five exist. | site.json teardowns[] = 5; index band = form only | Newest 3 editions listed above the form; link to all editions on newsletter.html. |
| 7 | **Wordmark 8px from the screen edge** on wide screens. | `.menu .bar{padding:var(--p-s)}` vs page gutter `--p-m` | Bar horizontal padding = `--p-m`. |
| 8 | **"One short a day" / "a new keyword daily"** in the hero meta, Watch, About, nav and 32 issue manifests (sticky bar + backref on every issue page). Actual cadence: last 6 issues 2026-09-01 to 09-24, average 4.6 days (site.json lastmod). | grep over manifests/, partials/, src/ | All changed to weekly EXCEPT the "How it works" row (founder). |

## 2. The plates: free route, judged three times

`gen-plates.mjs` (OpenAI, paid) was not run. New tooling, both committed:

- `plates-gen.html` renders one plate procedurally in a 1536x1024 canvas, seeded by issue number: a large sculpted light form (petal, sheet, flame, crescent) with terminator shading, warm cream/gold rim to green-black shadow, halo, one soft-masked crisp region with fine material texture, film grain, lens falloff. No text, no UI by construction.
- `gen-plates-free.mjs` drives it through headless Edge (`../reel-engine/scripts/capture-url.mjs`) into `plates-src/`, then the existing `ingest-plates.mjs` makes the card/hero webp the site serves. `--missing` renders whatever a built issue lacks.

Sub-agent judge (Opus, one pass, defects only, against 4 reference plates on a contact sheet):

| Pass | Verdict |
|---|---|
| v1 (bars and points on black) | 5/19 pass. "Small bokeh points and bars on mostly empty black; striations read digital." |
| v2 (big surfaces, saturated orange) | 4/19 pass (041, 035, 054, 052). "Saturated orange-on-black blobs, soft everywhere; references have one crisp textured edge and a cream-to-green range." |
| v3 (cream/gold palette, petal/sheet/crescent families, textured rim) | see section 6 |

Contact sheets for the founder's own eye: scratchpad `contact-plates-v3.png` (session temp) and the built cards in `og/plate-no-*-card.webp`.
Paid fallback for any plate the founder rejects: `node gen-plates.mjs <num>` then `node ingest-plates.mjs` (newest file per issue wins). List price about $0.25 per image, from memory, unverified.

## 3. "How it works" — NOT changed (founder 2026-09-27)

Draft kept for reference only:
- Watch the reel. New shorts every week on TikTok, Instagram, YouTube and X. Sixty seconds, no intro, no outro.
- Comment the keyword. Every film ends on a single word. Comment it and the bot DMs you the link.
- Open the pack. The link lands on this site; the files are on the issue page.
- The archive is public. Every issue page, every film, every source stays here permanently.

## 4. Cross-page audit (Explore agent 2026-09-27; load-bearing items re-verified by hand)

- **no-052.html was a live 404** while site.json marked it built and the funnel keyword CREDIT DMs that URL (vektor `funnel/ig-dm-webhook/keywords.json`). Its page files sat UNTRACKED in the local checkout from an earlier session. Verified by curl. Shipped in this branch (manifest, body, files/credit.md, og/no-052.png, built page and unlock page).
- Nav on issue and teardown pages: Issues and About pointed at `#latest` / `#about`, anchors that exist only on the index. Fixed with a per-page HOME token.
- `pack.html` is the welcome pack (5 external tool links), not a pack index; the index called it "Browse every pack". Relabelled and pointed at the archive.
- `sitemap.xml` listed every site.json row including unbuilt ones (404s) and no teardowns. Now: built issues, 5 teardowns, newsletter, about.
- No About page; "The long version" and "Read more" both looped to `#about`. `about.html` added from the shared partials (`manifest/about.json`, `src/about.body.html`).
- No custom 404; GitHub's stock page served. `404.html` added, self-contained, absolute links.
- no-048, no-050, no-051 are live pages with no manifest and no site.json row: reachable from DMs only, absent from index and sitemap. Left as is.
- YouTube @vektorfm holds 4 shorts, all uploaded 2026-07 (yt-dlp). The reel module can only show NO.006 until newer films are uploaded.
- All same-site links on index and pack.html returned 200 (71 targets); OG tags and canonicals present on the pages checked.
- The email pop-up opened during the headless capture, so the landing page was re-captured with it suppressed for the visual check.

## 5. Not done / for the founder

- How it works copy (by instruction).
- Upload recent films to YouTube so the reel module can rotate to the latest issue (then change `data-yt` and the caption in `src/index.body.html`).
- Register no-048 / 050 / 051 with manifests if they should appear in the archive.
- Confirm the pack-wall intent (section 1, item 4).

## 6. Final judge verdict and ship list

Third pass (Opus judge, one pass, contact sheet vs 4 references, 2026-09-27): PASS 054, 046, 052, 034, 035, 041. FAIL 053, 047, 031, 030, 028, 026, 014, 036, 037, 039, 038, 045, 044 (reasons: flat single-hue, no crisp rim, reads as a letter C / a donut / a clip line, near-twins). Series verdict: MOSTLY; remaining gap "every plate is the same smooth amber; references have crisp textured edges and a real green/cream range".

Staged: the 6 that passed. The 13 that failed stay BLANK (a bad plate beside the references is worse than a gap; the judge is the gate). All 19 renders are on the contact sheet at `reports/plates-contact-2026-09-27.png` for the founder's own eye. To ship any of the 13 anyway: `node gen-plates-free.mjs <num> && node ingest-plates.mjs && node build.mjs`. To replace them with the paid route: `node gen-plates.mjs <nums>` then the same ingest + build.

Browser check of the built pages (local server, 2026-09-27): 39 issues in the count, 3 teardown rows, nav Packs panel = 4 newest titles, packs section = 046 + 033, reel button creates the YouTube iframe on click, wordmark at x=16, about.html renders with 5 cards and no unfilled tokens, `node build.mjs --check` OK.

## 7. Founder call 2026-09-28: ship all 19, widen the palette

Founder on the v3 sheet: "those are good but use a wide palette of colours, not just that yellow." The founder eye overrules the judge 13 fails; all 19 plates ship. v4 gives each plate its own colour family (cobalt, rose, teal, violet, crimson, emerald, copper, ice, magenta, one gold), spread so neighbouring cards differ; the shadow tint and the colour drift follow the family. Sheet: reports/plates-contact-2026-09-28.png. Zero blank cards after build; build.mjs --check OK.
