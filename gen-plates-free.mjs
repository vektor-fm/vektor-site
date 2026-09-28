#!/usr/bin/env node
// gen-plates-free.mjs — render card plates with plates-gen.html through headless
// Edge (../reel-engine/scripts/capture-url.mjs). Zero cost, deterministic.
//
//   node gen-plates-free.mjs 054            one issue
//   node gen-plates-free.mjs 054 053 047    several
//   node gen-plates-free.mjs --missing      every built issue with no file in plates-src/
//
// Writes plates-src/<issue>.png at 1536x1024 (exact 3:2). Then run
// `node ingest-plates.mjs` to build the card/hero variants the site serves.
// The paid route (gen-plates.mjs, OpenAI gpt-image-1) is unchanged and remains
// the better plate when the budget allows; both write the same file, and the
// newest file per issue wins in ingest-plates.mjs.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'plates-src');
const CAPTURE = join(ROOT, '..', 'reel-engine', 'scripts', 'capture-url.mjs');
if (!existsSync(CAPTURE)) { console.error('capture-url.mjs not found at ' + CAPTURE); process.exit(1); }
mkdirSync(SRC, { recursive: true });

let nums = process.argv.slice(2).filter((a) => /^\d{3}$/.test(a));
if (process.argv.includes('--missing')) {
  const site = JSON.parse(readFileSync(join(ROOT, 'site.json'), 'utf8'));
  const have = new Set(readdirSync(SRC).map((f) => (f.match(/(\d{3})/) || [])[1]).filter(Boolean));
  nums = site.issues.filter((i) => i.built && !have.has(i.number)).map((i) => i.number);
}
if (!nums.length) { console.error('nothing to render (pass issue numbers or --missing)'); process.exit(1); }

// plates-gen.html only knows the subjects it defines; anything else would
// silently render the default plate, which is how two issues end up twins.
const html = readFileSync(join(ROOT, 'plates-gen.html'), 'utf8');
const known = new Set([...html.matchAll(/^\s*'(\d{3})': \(\) =>/gm)].map((m) => m[1]));

const pageUrl = 'file:///' + join(ROOT, 'plates-gen.html').replace(/\\/g, '/');
for (const n of nums) {
  if (!known.has(n)) { console.error(`${n}: no subject in plates-gen.html — add one before rendering`); process.exitCode = 1; continue; }
  const out = join(SRC, `${n}.png`);
  execFileSync(process.execPath, [CAPTURE, `${pageUrl}?n=${n}`, out, '--w', '1536', '--h', '1024', '--scale', '1'], { stdio: 'inherit' });
  console.log(`${n} -> plates-src/${n}.png`);
}
