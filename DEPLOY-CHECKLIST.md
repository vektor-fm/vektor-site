# DEPLOY CHECKLIST — NO.028 SUPERPOWERS funnel (founder-approved step)

Everything below is PREPARED and committed locally but NOT deployed. Two
commits exist, neither pushed:

- `vektor` repo, branch `feature/no028-library-videos`:
  "funnel: POWERS keyword for NO.028 (undeployed)" — funnel/ig-dm-webhook/keywords.json
- `vektor-site` repo, branch `main` (unpushed):
  "NO.028 landing page + superpowers one-pager (unpublished)" —
  no-028.html, og-src-no-028.html, files/superpowers-onepager/README.md, this file

## THE LAW (NO.014 precedent — read before deploying anything)

**The keyword must never point at a 404.** NO.014 shipped with the keyword
live while the landing page wasn't — every DM delivered a dead link until the
emergency fix (commit 083d789 "fix live 404 funnel"). Order is therefore
PAGE FIRST, WORKER SECOND, and nothing goes live until the page returns 200.

## Step 0 — pre-deploy: render the OG share card (one-time)

`og-src-no-028.html` is committed; `og/no-028.png` is not rendered yet (needs a
browser). no-028 is a standalone page (no-014/no-025 precedent), so
`npm run og:render` won't pick it up — render directly:

```powershell
cd C:\Users\julia\projects\vektor-site
# serve the repo so the headless capture can load the woff2 fonts (file:// won't)
npx http-server -p 8899 .
# in a second shell:
node ..\reel-engine\scripts\capture-url.mjs http://127.0.0.1:8899/og-src-no-028.html og\no-028.png --w 1200 --h 630
```

Verify by looking (sub-agent, never main thread), then:

```powershell
git add og/no-028.png
git commit -m "NO.028 OG share card"
```

Page works without it (only the DM/social link preview is affected), but ship it.

## Step 1 — publish the landing page (vektor-site → GitHub Pages)

```powershell
cd C:\Users\julia\projects\vektor-site
node build.mjs --check      # sanity: existing outputs still in sync (no-028 is standalone, not covered)
git push origin main
```

## Step 2 — LAUNCH GATE: verify the page is live (BLOCKING)

GitHub Pages takes ~1–3 min after push. All three must return 200 before Step 3:

```powershell
# 1. the landing page itself
curl.exe -s -o NUL -w "%{http_code}`n" https://vektor-fm.github.io/vektor-site/no-028.html
# 2. the exact tracked link shape the DM sends ({link} = page + utm params)
curl.exe -s -o NUL -w "%{http_code}`n" "https://vektor-fm.github.io/vektor-site/no-028.html?utm_source=ig&utm_medium=dm&utm_campaign=no-028&utm_content=0"
# 3. the lead-magnet payload the page's download button serves
curl.exe -s -o NUL -w "%{http_code}`n" https://vektor-fm.github.io/vektor-site/files/superpowers-onepager/README.md
```

Then open the page in a real browser once: hero renders, the install-command
Copy button works, both one-pager buttons download/open, repo links reach
github.com/obra/superpowers.

## Step 3 — deploy the DM worker (activates the POWERS keyword)

Only after Step 2 is all-200. Deploys from the local working tree, so stay on
`feature/no028-library-videos` (the branch carrying the keywords.json commit):

```powershell
cd C:\Users\julia\projects\vektor\funnel\ig-dm-webhook
npx wrangler deploy
```

## Step 4 — post-deploy verification

- Worker readout: `GET https://vektor-ig-dm.vektor-fm.workers.dev/report?k=<REPORT_KEY>`
  (key in the worker secrets) — confirm the deploy took and `powers` routes.
- End-to-end: comment "powers" on any @vektor.fm post from a test account →
  expect the follow-gate DM → reply "done" → expect the tracked no-028 link →
  link opens the live page → download works.
- The keyword goes in the NO.028 caption ("comment POWERS") — captions say
  COMMENT, never DM (comment-only funnel law in keywords.json `_comment`).

## Step 5 — git hygiene close-out

- `vektor` repo: push `feature/no028-library-videos`; merge to `develop` per
  Git Flow when NO.028 ships (tests/gates green first).
- `vektor-site`: already pushed in Step 1.
- Optional follow-up (not blocking): migrate no-028 into the build system
  (site.json + manifest/no-028.json + src/no-028.body.html) so it appears in
  the index archive and is covered by `build.mjs --check`, like the other
  registered issues. no-014 and no-025 share this standalone status.
