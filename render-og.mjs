#!/usr/bin/env node
// Render og/<slug>.png from the generated og-src-<slug>.html card sources.
// Serves the repo on an ephemeral localhost port (headless capture can't load
// file:// fonts) and captures via ../reel-engine/scripts/capture-url.mjs at
// exactly 1200x630.
//
//   npm run og:render               render every card configured with an og_card
//   npm run og:render -- 007 013    render specific issues
//   npm run og:render -- index      render just the hub card
//
// Run `node build.mjs` first — this renders the BUILT og-src outputs.
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const CAPTURE = join(ROOT, '..', 'reel-engine', 'scripts', 'capture-url.mjs');
const MIME = {
  '.html': 'text/html; charset=utf-8', '.png': 'image/png',
  '.woff2': 'font/woff2', '.css': 'text/css', '.xml': 'application/xml',
};

const site = JSON.parse(readFileSync(join(ROOT, 'site.json'), 'utf8'));

// Slugs, not bare numbers, since 2026-08-17 — the hub needed a card and it has no
// manifest and no issue number. `index` is the only non-issue slug today; the
// shape generalises if another utility page ever wants one.
const withCard = site.issues.filter((i) => {
  const p = join(ROOT, 'manifest', `no-${i.number}.json`);
  return i.built && existsSync(p) && JSON.parse(readFileSync(p, 'utf8')).og_card;
}).map((i) => `no-${i.number}`);
if (site.index.og_card) withCard.push('index');

// `007`, `no-007` and `no007` all still mean the issue; `index` means the hub.
const asked = process.argv.slice(2).map((a) => (
  /^\d+$/.test(a.replace(/^no-?/, '')) ? `no-${a.replace(/^no-?/, '').padStart(3, '0')}` : a
));
const slugs = asked.length ? asked : withCard;
for (const s of slugs) {
  if (!withCard.includes(s)) throw new Error(`${s}: no og_card block configured (nothing to render)`);
  if (!existsSync(join(ROOT, `og-src-${s}.html`))) throw new Error(`og-src-${s}.html missing — run: node build.mjs`);
}

const server = createServer((req, res) => {
  const rel = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^[/\\]+/, '');
  const p = join(ROOT, rel);
  if (!p.startsWith(ROOT) || !existsSync(p)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' });
  res.end(readFileSync(p));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

try {
  for (const s of slugs) {
    const url = `http://127.0.0.1:${port}/og-src-${s}.html`;
    const out = join(ROOT, 'og', `${s}.png`);
    console.log(`og:render ${s} -> og/${s}.png`);
    // async, not execFileSync — a sync child would block this process's event
    // loop and the server could never answer the headless browser's requests
    const { stdout } = await promisify(execFile)('node', [CAPTURE, url, out, '--w', '1200', '--h', '630']);
    process.stdout.write(stdout);
  }
} finally {
  server.close();
}
console.log(`rendered ${slugs.length} card(s). Verify by looking before shipping.`);
