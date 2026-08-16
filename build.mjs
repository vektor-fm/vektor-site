#!/usr/bin/env node
// vektor-site builder — one source of truth for the issue landing pages.
//
// Issue pages (site.json issues[] with built:true) are assembled from shared
// partials/ + a per-issue manifest/ + the page's bespoke src/<slug>.body.html.
// index.html + sitemap.xml are generated from site.json. OG share-card sources
// (og-src-no-<num>.html) are generated from partials/og-card.html + the
// manifest's og_card block. The served root .html files are BUILD OUTPUTS —
// edit partials/ + manifest/ + src/, never the output.
//
// og/no-<num>.png is NOT rebuilt here (needs a browser) — after changing an
// og_card, re-render with: npm run og:render -- <num> (see render-og.mjs).
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

// The nav is one component shared by the landing page and all 20 issue pages.
// It lives in partials/nav.html + partials/nav-css.html and is injected into
// both via {{NAV}} / {{NAV_CSS}}. Keeping two copies is how they drift.
const NAV = read('partials/nav.html');
const NAV_CSS = read('partials/nav-css.html');
const BUILT = site.issues.filter((i) => i.built);
// Newsletter issues. Separate from site.issues[] because a Teardown is not a
// reel landing page: it has no keyword, no funnel, and no OG plate art.
const TEARDOWNS = site.teardowns ?? [];

// ---- template fill: {{TOKEN}} -> value (uppercase tokens only) ----
function fill(tpl, map) {
  return tpl.replace(/\{\{([A-Z0-9_]+)\}\}/g, (m, k) => (k in map ? map[k] : m));
}
function assertNoTokens(html, label) {
  const left = html.match(/\{\{[A-Z0-9_]+\}\}/g);
  if (left) throw new Error(`${label}: unfilled tokens ${[...new Set(left)].join(', ')}`);
}

// ---- issue page ----
function renderIssue(num) {
  const man = JSON.parse(read(`manifest/no-${num}.json`));
  for (const k of ['tw_title', 'tw_description']) {
    if (man[k] == null) throw new Error(`no-${num}: missing ${k} (issue pages require twitter tags)`);
  }
  const body = read(`src/no-${num}.body.html`);

  // Per-issue lead magnet. The packs stay FREE and ungated — the site says so
  // in writing ("the files behind the films. Free, no signup wall.") — so the
  // email ask is framed as "this pack plus one a week", not as a paywall.
  // Contextual relevance without breaking the promise.
  const meta = site.issues.find((i) => i.number === num) || {};
  const hasPayload = /(?:href|src)="\.\/files\//.test(body);
  const magnet = hasPayload
    ? `the ${meta.section} pack`
    : `the ${meta.section} setup`;

  const map = {
    NAV, NAV_CSS,
    MAGNET: magnet,
    MAGNET_TITLE: hasPayload
      ? `Take ${meta.section} with you.`
      : `Keep the whole toolkit.`,
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

// ---- OG share-card source (og-src-no-<num>.html, rendered to og/no-<num>.png) ----
function renderOgCard(num, card) {
  const map = {
    OG_ACCENT: card.accent,
    OG_HEADLINE_SIZE: String(card.h1_size),
    OG_HEADLINE_MT: String(card.h1_mt ?? 18),
    OG_SUB_MT: String(card.sub_mt ?? 26),
    OG_SUB_MAX: String(card.sub_max ?? 48),
    OG_KICK: card.kick,
    OG_HEADLINE: card.h1_html,
    OG_SUB: card.sub_html,
    OG_META: card.meta_html,
  };
  const out = fill(read('partials/og-card.html'), map);
  assertNoTokens(out, `og-src-no-${num}`);
  return out;
}

// ---- index.html ----
// The landing page is the sprind-structure redesign. Its two card grids are
// generated from site.json + the per-issue manifests rather than hand-written,
// so adding an issue to site.json is the only edit needed to publish it.
//
// Card art: og/plate-no-<num>-card.webp, built by ingest-plates.mjs. An issue
// with no plate yet renders an empty cell rather than a broken image — the gap
// should be visible as a gap, not as a 404.

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function plateHtml(num) {
  const card = `og/plate-no-${num}-card.webp`;
  return exists(card)
    ? `<div class="img"><img loading="lazy" decoding="async" width="700" height="467" src="${card}" alt=""></div>`
    : `<div class="img noplate" aria-hidden="true"></div>`;
}

// teaser copy comes from the manifest's og_description — the same sentence the
// share card uses, so the grid and the social preview never drift apart
function teaserText(num) {
  const man = JSON.parse(read(`manifest/no-${num}.json`));
  return (man.og_description || '').replace(/\s+/g, ' ').trim();
}

function teaserCard(i) {
  return `      <a class="teaser" href="./no-${i.number}.html">\n`
    + `        ${plateHtml(i.number)}\n`
    + `        <div class="body">\n`
    + `          <div class="date meta">${esc(i.date)} &middot; ${esc(i.section)}</div>\n`
    + `          <h3>${esc(i.title_short)}</h3>\n`
    + `          <p>${esc(teaserText(i.number))}</p>\n`
    + `          <span class="more defaultS">Open the pack</span>\n`
    + `        </div>\n`
    + `      </a>`;
}

// the magazine grid's first cell spans 2x2 as a feature and is the only one
// that carries body copy — the rest are date + title, as sprind's are
function magCard(i, idx) {
  return `      <a class="mag" href="./no-${i.number}.html">\n`
    + `        ${plateHtml(i.number)}\n`
    + `        <div class="body">\n`
    + `          <div class="date meta">${esc(i.date)} &middot; ${esc(i.section)}</div>\n`
    + `          <h3>${esc(i.title_short)}</h3>\n`
    + (idx === 0 ? `          <p>${esc(teaserText(i.number))}</p>\n` : '')
    + `          <span class="defaultS">Open the pack</span>\n`
    + `        </div>\n`
    + `      </a>`;
}

function renderIndex() {
  const latest = BUILT[0];
  const inLatest = BUILT.slice(0, 4);
  const inArchive = BUILT.slice(4);
  const map = {
    NAV, NAV_CSS,
    LATEST_CARDS: inLatest.map(teaserCard).join('\n'),
    ARCHIVE_CARDS: inArchive.map(magCard).join('\n'),
    ARCHIVE_COUNT: String(inArchive.length),
    TOTAL_COUNT: String(BUILT.length),
    LATEST_NUM: latest.number,
    LATEST_TITLE: esc(latest.title_short),
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

// ---- newsletter issue page (the web version of an emailed Teardown) ----
// Same partials as an issue page, so it inherits the design system rather than
// drifting the way thanks.html and pack.html did. Flat at the repo root
// (teardown-001.html, not teardown/001.html) because head.html loads fonts by
// relative path — a subdirectory silently breaks every @font-face.
//
// The email carries one PNG and ~500 words; the full piece, with footnotes and
// sources, lives here. That split exists because email will not render SVG and
// punishes link-heavy first sends, while a web page has neither limit.
function renderTeardown(num) {
  const man = JSON.parse(read(`manifest/teardown-${num}.json`));
  for (const k of ['tw_title', 'tw_description']) {
    if (man[k] == null) throw new Error(`teardown-${num}: missing ${k}`);
  }
  const map = {
    NAV, NAV_CSS,
    MAGNET: 'the config pack',
    MAGNET_TITLE: 'Keep the whole toolkit.',
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
    + read(`src/teardown-${num}.body.html`)
    + fill(read('partials/footer.html'), map)
    + fill(read('partials/scripts.html'), map);
  assertNoTokens(out, `teardown-${num}`);
  return out;
}

// ---- outputs map ----
function outputs() {
  const o = {};
  for (const i of BUILT) {
    o[`no-${i.number}.html`] = renderIssue(i.number);
    const man = JSON.parse(read(`manifest/no-${i.number}.json`));
    if (man.og_card) o[`og-src-no-${i.number}.html`] = renderOgCard(i.number, man.og_card);
  }
  for (const t of TEARDOWNS) o[`teardown-${t.number}.html`] = renderTeardown(t.number);
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
  // Teardowns: the diagram and any local asset must exist, and every footnote
  // marker must point at a source entry that is actually on the page. A dangling
  // [3] is worse than no citation — it looks sourced and is not.
  for (const t of TEARDOWNS) {
    const man = JSON.parse(read(`manifest/teardown-${t.number}.json`));
    const og = man.og_image.replace(/^https?:\/\/[^/]+\/[^/]+\//, '');
    if (!exists(og)) errs.push(`teardown-${t.number}: og:image -> missing ${og}`);
    const body = read(`src/teardown-${t.number}.body.html`);
    for (const m of body.matchAll(/(?:href|src)="\.\/((?:files|diagrams)\/[^"?#]+)"/g)) {
      if (!exists(m[1])) errs.push(`teardown-${t.number}: asset -> missing ${m[1]}`);
    }
    const anchors = new Set([...body.matchAll(/id="(s\d+)"/g)].map((m) => m[1]));
    for (const m of body.matchAll(/href="#(s\d+)"/g)) {
      if (!anchors.has(m[1])) errs.push(`teardown-${t.number}: footnote -> no source entry #${m[1]}`);
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
  let wrote = 0;
  for (const [name, content] of Object.entries(out)) {
    // write-if-different (normalised compare) so unchanged outputs don't churn line endings
    if (!exists(name) || read(name) !== content) { writeFileSync(join(ROOT, name), content); wrote++; }
  }
  const cards = Object.keys(out).filter((n) => n.startsWith('og-src-')).length;
  console.log(`built ${Object.keys(out).length} outputs, ${wrote} changed (${BUILT.length} issue pages + ${cards} og cards + index.html + sitemap.xml)`);
}
