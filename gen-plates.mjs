#!/usr/bin/env node
// gen-plates.mjs — generate the card plates with OpenAI gpt-image-1.
//
// The 22 prompts are the locked recipe in reports/PLATE-PROMPTS.md: a per-issue
// subject line plus one shared style block that never varies. The style block is
// the constant that makes the set read as one photographer's series, so it is
// duplicated here verbatim rather than paraphrased.
//
//   node gen-plates.mjs 026            one issue (use this to price a run first)
//   node gen-plates.mjs 031 030 024    several
//   node gen-plates.mjs --all          every issue with no file in plates-src/
//   node gen-plates.mjs --all --force  regenerate everything
//
// Writes plates-src/<issue>.png at 1536x1024 (exact 3:2), then ingest-plates.mjs
// crops and builds the card/hero variants. Prints token usage per image so the
// real billed cost is visible instead of estimated.

import { writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'plates-src');

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error('OPENAI_API_KEY is not set.'); process.exit(1); }

const STYLE = ' Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field — one region of the form must be crisply IN FOCUS with resolved fine detail and hard micro-edges, falling away to heavy defocus at one edge. Not an all-soft bokeh study. Fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.';

const SUBJECTS = {
  '004': 'Five tapered blades radiating from an origin below the frame, teal into pale gold.',
  '005': 'Four vertical light columns of uneven width, warm to cool across the frame.',
  '006': 'One solid monolithic form lit from a single side, near-black with a bright rim.',
  '007': 'A long horizontal smear of light with crisp vertical boundaries, cream to cobalt.',
  '008': 'A dense field dissolving at one edge into empty black, amber core.',
  '009': 'Repeating curved slats in shallow rotation, warm peach into ice blue.',
  '010': 'A single hard-edged wedge of light entering a dark frame from the lower left.',
  '011': 'A folded plane of light, cool cyan falling into deep indigo shadow.',
  '012': 'Parallel diagonal strata, slate into warm sand, sharply cropped at the right edge.',
  '013': 'A cluster of small bright forms scattered across a large dark empty field.',
  '015': 'One continuous ribbon looping back on itself, soft lilac into mint.',
  '017': 'Two opposing light arcs meeting off-centre, deep green into warm white.',
  '018': 'A single glass vessel form dissolving into its own refraction, cool green to cream.',
  '019': 'A long shallow curve of brushed light, graphite into pale gold.',
  '020': 'Four soft lozenges of light at different depths, one sharp and three falling out of focus.',
  '021': 'Nine parallel light rods receding into defocus, cool teal to warm bone.',
  '022': 'A radial fan of tapered blades, cobalt at the base resolving to pale yellow-green tips.',
  '023': 'Stacked translucent planes seen edge-on, warm grey into soft coral.',
  '024': 'A single sheet of rippled glass catching a cool light, deep blue falling to pale cream.',
  '026': 'Vertical slit-scan light bands, cream through amber into deep navy, one warm mass dissolving at the centre.',
  '030': 'Five nested translucent ribbons curving through a shallow arc, iridescent mint into periwinkle.',
  '031': 'Two tall soft-edged light columns glowing orange to white on a near-black field, heavy grain.',
};

const QUALITY = process.env.PLATE_QUALITY || 'high';

async function generate(issue) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt: SUBJECTS[issue] + STYLE,
      size: '1536x1024',
      quality: QUALITY,
      n: 1,
    }),
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 400)}`);
  const json = await res.json();
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error('no image in response: ' + JSON.stringify(json).slice(0, 300));
  const out = join(SRC, `${issue}.png`);
  writeFileSync(out, Buffer.from(b64, 'base64'));
  return { out, usage: json.usage };
}

const args = process.argv.slice(2);
const force = args.includes('--force');
let issues = args.filter((a) => !a.startsWith('--'));

if (args.includes('--all')) {
  const have = new Set();
  if (existsSync(SRC)) for (const f of readdirSync(SRC)) {
    const m = f.match(/(\d{3})/); if (m) have.add(m[1]);
  }
  issues = Object.keys(SUBJECTS).filter((i) => force || !have.has(i));
}
if (!issues.length) { console.log('Nothing to generate.'); process.exit(0); }

const unknown = issues.filter((i) => !SUBJECTS[i]);
if (unknown.length) { console.error('Unknown issue(s):', unknown.join(', ')); process.exit(1); }

mkdirSync(SRC, { recursive: true });
console.log(`Generating ${issues.length} plate(s) at 1536x1024, quality=${QUALITY}\n`);

let done = 0, failed = [];
for (const issue of issues) {
  process.stdout.write(`  ${issue} ... `);
  try {
    const { usage } = await generate(issue);
    const t = usage?.total_tokens ?? '?';
    const o = usage?.output_tokens ?? '?';
    console.log(`ok  (output ${o} tok, total ${t})`);
    done++;
  } catch (e) {
    console.log(`FAILED — ${e.message}`);
    failed.push(issue);
  }
}

console.log(`\n${done} written to plates-src/.`);
if (failed.length) console.log(`Failed: ${failed.join(', ')} — rerun with those issue numbers.`);
console.log('Next: node ingest-plates.mjs');
