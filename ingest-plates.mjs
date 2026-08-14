#!/usr/bin/env node
// ingest-plates.mjs — turn generated plate art into the two variants the site
// serves, and tell you what is still missing.
//
// Drop whatever a generator gives you into plates-src/ named by issue number:
//   plates-src/026.png   plates-src/no-031.jpg   plates-src/024-v2.webp
// Anything with a 3-digit issue number in the filename is matched; the newest
// file wins if there are several for one issue.
//
// Produces, per issue:
//   og/plate-no-XXX-card.webp   700x467   served in the card grid (rendered 350x233)
//   og/plate-no-XXX-hero.webp  2000x1333  served full-bleed behind the hero
//
// Why two: the source art is ~1500x1000+ and the card renders it at 350x233.
// Serving the full plate into 24 cards cost 18.9 MB in testing; the card
// variants cost 66 KB — 288x smaller. Do not skip this step.
//
//   node ingest-plates.mjs            build variants + report coverage
//   node ingest-plates.mjs --check    report only, write nothing
//
// Requires sharp:  npm i -D sharp

import { readdirSync, existsSync, mkdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'plates-src');
const OUT = join(ROOT, 'og');
const CHECK = process.argv.includes('--check');

// every issue the site renders a card for — read from site.json, never
// hardcoded. A hardcoded list is what produced 20 plates for the wrong issues:
// it carried the mock's invented numbers (026/030/031, none of which are built)
// and omitted 033, the newest issue, which then rendered as an empty cell.
const ISSUES = JSON.parse(readFileSync(join(ROOT, 'site.json'), 'utf8'))
  .issues.filter((i) => i.built).map((i) => i.number);

const CARD = { w: 700,  h: 467,  q: 82 };
const HERO = { w: 2000, h: 1333, q: 80 };

if (!existsSync(SRC)) {
  console.error(`no plates-src/ — create it and drop the generated art in.\n  ${SRC}`);
  process.exit(1);
}

// newest source file per issue number
const found = new Map();
for (const f of readdirSync(SRC)) {
  if (!/\.(png|jpe?g|webp|avif|tiff?)$/i.test(f)) continue;
  const m = f.match(/(\d{3})/);
  if (!m) continue;
  const num = m[1];
  const path = join(SRC, f);
  const mtime = statSync(path).mtimeMs;
  const prev = found.get(num);
  if (!prev || mtime > prev.mtime) found.set(num, { path, mtime, name: f });
}

const have = ISSUES.filter((n) => found.has(n));
const missing = ISSUES.filter((n) => !found.has(n));
const extra = [...found.keys()].filter((n) => !ISSUES.includes(n));

console.log(`plates-src: ${found.size} file(s) matched`);
console.log(`covered:    ${have.length}/${ISSUES.length}`);
if (missing.length) console.log(`MISSING:    ${missing.join(', ')}`);
if (extra.length)   console.log(`not an issue on the site: ${extra.join(', ')}`);

if (CHECK) process.exit(missing.length ? 1 : 0);
if (!have.length) { console.log('nothing to build.'); process.exit(0); }

let sharp;
try {
  ({ default: sharp } = await import('sharp'));
} catch {
  console.error('\nsharp is not installed. run:  npm i -D sharp');
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

let bytes = 0;
for (const num of have) {
  const { path, name } = found.get(num);
  const meta = await sharp(path).metadata();
  const ratio = meta.width / meta.height;
  if (Math.abs(ratio - 1.5) > 0.08) {
    console.log(`  no-${num}: source is ${meta.width}x${meta.height} (${ratio.toFixed(2)}:1) — ` +
                `cropping to 3:2, expect trim`);
  }
  for (const [tag, v] of [['card', CARD], ['hero', HERO]]) {
    const out = join(OUT, `plate-no-${num}-${tag}.webp`);
    await sharp(path)
      .resize(v.w, v.h, { fit: 'cover', position: 'attention' })
      .webp({ quality: v.q, effort: 6 })
      .toFile(out);
    bytes += statSync(out).size;
  }
  console.log(`  no-${num}  <- ${name}`);
}

console.log(`\nwrote ${have.length * 2} files, ${(bytes / 1024).toFixed(0)} KB total`);
if (missing.length) {
  console.log(`\nstill missing ${missing.length}: ${missing.join(', ')}`);
  console.log('prompts: reports/PLATE-PROMPTS.md');
}
