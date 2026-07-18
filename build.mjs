#!/usr/bin/env node
// vektor-site builder — one source of truth for the issue landing pages.
//
// Issue pages (site.json issues[] with built:true) are assembled from shared
// partials/ + a per-issue manifest/ + the page's bespoke src/<slug>.body.html.
// index.html + sitemap.xml are generated from site.json. The served root .html
// files are BUILD OUTPUTS — edit partials/ + manifest/ + src/, never the output.
//
//   node build.mjs           build all outputs
//   node build.mjs --check    verify outputs are in sync + all links/assets resolve (CI/pre-merge gate)
//
// All I/O is normalised to LF (the repo stores LF via core.autocrlf); outputs are LF.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const norm = (s) => s.replace(/\r\n/g, '\n');
const read = (p) => norm(readFileSync(join(ROOT, p), 'utf8'));
const exists = (p) => existsSync(join(ROOT, p));

const site = JSON.parse(read('site.json'));
const BUILT = site.issues.filter((i) => i.built);

// ---- template fill: {{TOKEN}} -> value (uppercase tokens only) ----
function fill(tpl, map) {
  return tpl.replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => (k in map ? map[k] : m));
}
function assertNoTokens(html, label) {
  const left = html.match(/\{\{[A-Z_]+\}\}/g);
  if (left) throw new Error(`${label}: unfilled tokens ${[...new Set(left)].join(', ')}`);
}

// ---- issue page ----
function renderIssue(num) {
  const man = JSON.parse(read(`manifest/no-${num}.json`));
  for (const k of ['tw_title', 'tw_description']) {
    if (man[k] == null) throw new Error(`no-${num}: missing ${k} (issue pages require twitter tags)`);
  }
  const body = read(`src/no-${num}.body.html`);
  const map = {
    TITLE: man.title, DESCRIPTION: man.description,
    OG_TITLE: man.og_title, OG_DESCRIPTION: man.og_description, OG_IMAGE: man.og_image,
    OG_ALT: man.og_alt, OG_URL: man.og_url, CANONICAL: man.canonical,
    TW_TITLE: man.tw_title, TW_DESCRIPTION: man.tw_description, TW_IMAGE: man.tw_image,
    MARKER: man.marker, STICKY_TEXT: man.sticky_text, SLUG: man.slug,
    BACKREF_HTML: man.backref_html, FOOTER_META: man.footer_meta,
    COPY_EVENT_JS: man.copy_event ? `'${man.copy_event}'` : 'null',
    SUBSCRIBE_BLOCK: man.subscribe_track
      ? `\n  document.querySelectorAll('form').forEach(function(f){ f.addEventListener('submit', function(){ gcEvent('${man.slug}-subscribe-submit'); }); });`
      : '',
  };
  const out = fill(read('partials/head.html'), map)
    + fill(read('partials/masthead.html'), map)
    + body
    + fill(read('partials/footer.html'), map)
    + fill(read('partials/scripts.html'), map);
  assertNoTokens(out, `no-${num}`);
  return out;
}

// ---- index.html ----
function rowHtml(i) {
  return `  <a class="row" href="./no-${i.number}.html">\n`
    + `    <span class="no">${i.number}</span>\n`
    + `    <span class="mid">\n`
    + `      <span class="t">${i.title_short}</span>\n`
    + `      <span class="k">${i.section} · ${i.date}</span>\n`
    + `    </span>\n`
    + `    <span class="k-chip">Keyword: ${i.keyword}</span>\n`
    + `    <span class="go">Open →</span>\n`
    + `  </a>`;
}
function renderIndex() {
  const latest = BUILT[0];
  const map = {
    ARCHIVE_ROWS: site.issues.map(rowHtml).join('\n'),
    LATEST_NUM: latest.number,
    LATEST_TAG: `Latest · No. ${latest.number} / ${latest.section} / ${latest.date}`,
    LATEST_TITLE: latest.title_short,
    LATEST_CTA: site.index.latest_cta,
  };
  const out = fill(read('src/index.body.html'), map);
  assertNoTokens(out, 'index');
  return out;
}

// ---- sitemap.xml (ascending by number, index first) ----
function renderSitemap() {
  const asc = [...site.issues].sort((a, b) => a.number.localeCompare(b.number));
  const urls = [`  <url>\n    <loc>https://vektor-fm.github.io/vektor-site/</loc>\n    <lastmod>${site.index.lastmod}</lastmod>\n  </url>`]
    .concat(asc.map((i) =>
      `  <url>\n    <loc>https://vektor-fm.github.io/vektor-site/no-${i.number}.html</loc>\n    <lastmod>${i.lastmod}</lastmod>\n  </url>`));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

// ---- outputs map ----
function outputs() {
  const o = {};
  for (const i of BUILT) o[`no-${i.number}.html`] = renderIssue(i.number);
  o['index.html'] = renderIndex();
  o['sitemap.xml'] = renderSitemap();
  return o;
}

// ---- guardrail: link + asset resolution ----
function guardrail() {
  const errs = [];
  // every archive-row / issues[] target page exists on disk
  for (const i of site.issues) {
    if (!exists(`no-${i.number}.html`)) errs.push(`archive row -> missing page no-${i.number}.html`);
  }
  // every built issue: OG image resolves + local ./files payloads resolve
  for (const i of BUILT) {
    const man = JSON.parse(read(`manifest/no-${i.number}.json`));
    const og = `og/${basename(man.og_image)}`;
    if (!exists(og)) errs.push(`no-${i.number}: og:image -> missing ${og}`);
    const body = read(`src/no-${i.number}.body.html`);
    for (const m of body.matchAll(/(?:href|src)="\.\/(files\/[^"?#]+)"/g)) {
      if (!exists(m[1])) errs.push(`no-${i.number}: payload -> missing ${m[1]}`);
    }
  }
  return errs;
}

// ---- run ----
const check = process.argv.includes('--check');
const out = outputs();
if (check) {
  let bad = 0;
  for (const [name, content] of Object.entries(out)) {
    const cur = exists(name) ? read(name) : null;
    if (cur !== content) { console.error(`OUT OF SYNC: ${name} (run: node build.mjs)`); bad++; }
  }
  const errs = guardrail();
  for (const e of errs) console.error(`BROKEN LINK: ${e}`);
  if (bad || errs.length) { console.error(`\ncheck FAILED: ${bad} out-of-sync, ${errs.length} broken link(s).`); process.exit(1); }
  console.log(`check OK: ${Object.keys(out).length} outputs in sync, all links/assets resolve.`);
} else {
  for (const [name, content] of Object.entries(out)) writeFileSync(join(ROOT, name), content);
  console.log(`built ${Object.keys(out).length} files: ${BUILT.length} issue pages + index.html + sitemap.xml`);
}
