#!/usr/bin/env node
// dewatermark.mjs — strip the Google sparkle stamp from a Gemini-generated
// plate, then hand a clean 3:2 frame to ingest-plates.mjs.
//
// Nano Banana burns an opaque, vector-crisp sparkle into the lower-right of
// every image at roughly 91% x 86% of the frame. It survives downscaling and is
// legible at card size, so it has to come off at source. Taking the top-left
// 88% x 84% clears it with margin; the result is then centre-cropped back to
// exactly 3:2.
//
//   node dewatermark.mjs plates-src/015.raw.png plates-src/015.png
//   node dewatermark.mjs --check plates-src/015.raw.png    (report only)
//
// --check prints the mean luminance of the corner the stamp lives in, before
// and after. A large drop is the stamp being removed; almost no change means
// either there was no stamp, or the crop missed it — look before trusting it.

import sharp from 'sharp';
import { existsSync } from 'node:fs';

const KEEP_W = 0.88, KEEP_H = 0.84;   // fraction of the frame retained
const RATIO = 3 / 2;

const args = process.argv.slice(2);
const check = args.includes('--check');
const [src, dst] = args.filter(a => !a.startsWith('--'));

if (!src || (!check && !dst)) {
  console.error('usage: node dewatermark.mjs <in> <out>   |   node dewatermark.mjs --check <in>');
  process.exit(1);
}
if (!existsSync(src)) { console.error('no such file: ' + src); process.exit(1); }

const img = sharp(src);
const { width: W, height: H } = await img.metadata();

// mean luminance of the stamp's corner, for the before/after sanity check
async function cornerMean(input) {
  const s = sharp(input);
  const m = await s.metadata();
  const w = Math.round(m.width * 0.16), h = Math.round(m.height * 0.18);
  const { data } = await s.extract({ left: m.width - w, top: m.height - h, width: w, height: h })
    .removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let sum = 0, n = 0;
  for (let i = 0; i < data.length; i += 3) {
    sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]; n++;
  }
  return +(sum / n).toFixed(1);
}

const before = await cornerMean(src);

// step 1 — drop the corner the stamp lives in
const cw = Math.round(W * KEEP_W), ch = Math.round(H * KEEP_H);
let buf = await sharp(src).extract({ left: 0, top: 0, width: cw, height: ch }).toBuffer();

// step 2 — bring it back to exactly 3:2, cropping the long axis from the centre
const m2 = await sharp(buf).metadata();
let fw = m2.width, fh = Math.round(m2.width / RATIO);
if (fh > m2.height) { fh = m2.height; fw = Math.round(m2.height * RATIO); }
buf = await sharp(buf).extract({
  left: Math.round((m2.width - fw) / 2),
  top: Math.round((m2.height - fh) / 2),
  width: fw, height: fh,
}).png().toBuffer();

const after = await cornerMean(buf);

console.log(`${src}`);
console.log(`  source        ${W}x${H}`);
console.log(`  after crop    ${fw}x${fh}  (ratio ${(fw / fh).toFixed(3)})`);
console.log(`  corner mean   ${before} -> ${after}`);
if (Math.abs(before - after) < 3) {
  console.log('  NOTE: the corner barely changed. Either there was no stamp, or the');
  console.log('        crop missed it. Look at the output before ingesting.');
}

if (!check) {
  await sharp(buf).toFile(dst);
  console.log(`  written       ${dst}`);
  console.log('\nNext: node ingest-plates.mjs');
}
