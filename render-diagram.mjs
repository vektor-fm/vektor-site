#!/usr/bin/env node
// Render diagrams/<name>.png from diagram-src-<name>.html.
//
// WHY A RASTER PIPELINE AT ALL. The newsletter's diagram has to survive email,
// and email will not take SVG: Microsoft pulled inline SVG support from Outlook
// through late 2025 and Gmail strips attributes, so PNG is the only format that
// renders everywhere. The web version of an issue can use anything it likes;
// the emailed copy cannot.
//
// Same shape as render-og.mjs: serve the repo on an ephemeral localhost port
// (headless capture cannot load file:// fonts, which is the whole reason this
// is not a one-line capture) and shell out to the shared capture script.
//
//   npm run diagram:render                  render every diagram-src-*.html
//   npm run diagram:render -- teardown-001  render one
//
// Output is 1200x750 — email displays it at ~600px, so 2x stays sharp on retina
// without tripping the 2000px-per-side ceiling that breaks image handling.
import { createServer } from 'node:http';
import { readFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const CAPTURE = join(ROOT, '..', 'reel-engine', 'scripts', 'capture-url.mjs');
const W = 1200;
const H = 750;
const MIME = {
  '.html': 'text/html; charset=utf-8', '.png': 'image/png',
  '.woff2': 'font/woff2', '.css': 'text/css', '.xml': 'application/xml',
};

const all = readdirSync(ROOT)
  .filter((f) => /^diagram-src-.+\.html$/.test(f))
  .map((f) => f.replace(/^diagram-src-/, '').replace(/\.html$/, ''));

const asked = process.argv.slice(2);
const names = asked.length ? asked : all;
for (const n of names) {
  if (!existsSync(join(ROOT, `diagram-src-${n}.html`))) {
    throw new Error(`diagram-src-${n}.html missing (have: ${all.join(', ') || 'none'})`);
  }
}
if (!names.length) {
  console.log('no diagram sources found — nothing to render.');
  process.exit(0);
}

mkdirSync(join(ROOT, 'diagrams'), { recursive: true });

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
  for (const n of names) {
    const url = `http://127.0.0.1:${port}/diagram-src-${n}.html`;
    const out = join(ROOT, 'diagrams', `${n}.png`);
    console.log(`diagram:render ${n} -> diagrams/${n}.png`);
    // async, not execFileSync — a sync child blocks this process's event loop
    // and the server could never answer the headless browser's requests.
    const { stdout } = await promisify(execFile)('node', [CAPTURE, url, out, '--w', String(W), '--h', String(H)]);
    process.stdout.write(stdout);
  }
} finally {
  server.close();
}
console.log(`rendered ${names.length} diagram(s). Verify by looking before shipping.`);
