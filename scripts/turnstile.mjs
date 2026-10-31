#!/usr/bin/env node
// Cloudflare Turnstile on every newsletter signup form (2026-10-31).
//
// WHY. The signup Worker (vektor repo, funnel/ig-dm-webhook, branch
// feature/newsletter-harden-worker) now requires a Turnstile token on web /signup
// (form field `cf-turnstile-response`) and FAILS CLOSED without one. So every form
// that posts to /signup must carry the widget, or signups on that page stop.
//
// ONE MECHANISM FOR ALL PAGES. Built pages (build.mjs outputs) get the widget from
// build.mjs, which runs injectTurnstile() over every output. Hand-authored pages
// (landing pages, c1-c4, thanks, pack ...) get it from `--apply`, which runs the SAME
// function over every root .html. It is idempotent: a form that already has the
// widget only has its data-sitekey brought up to date, and the script + CSS go in
// once per page. `build.mjs --check` fails when any signup form lacks the widget.
//
// THE KEY. The site key is a PUBLIC value (it is in the page source by design). It
// lives in ONE place, site.json `turnstile_sitekey`, and starts as the placeholder
// __TURNSTILE_SITEKEY__ until the founder pastes the real one with
// `node scripts/set-turnstile-key.mjs <sitekey>`. A placeholder must never be served:
// `--check --publish` fails on it, and the Pages workflow runs that before deploying.
//
// NO JS-BLOCKING SURPRISES. The widget is a plain <div> inside the form, the API
// script loads async/defer, and nothing intercepts submit: a form posted before the
// widget has produced a token still posts, and the Worker answers with its captcha
// redirect. `data-appearance="interaction-only"` keeps the widget invisible unless
// Cloudflare actually needs the visitor to click something.
//
//   node scripts/turnstile.mjs --apply              inject/refresh on every root .html
//   node scripts/turnstile.mjs --check [--publish]  exit 1 on a form without the widget
//                                                   (--publish: also on the placeholder)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const PLACEHOLDER = '__TURNSTILE_SITEKEY__';
export const API_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
export const SCRIPT_TAG = `<script src="${API_SRC}" async defer></script>`;
// The widget row wraps below the form's email + button row, full width. An invisible
// (interaction-only) widget is a zero-height flex line that still costs one row gap, and a
// flex line cannot shrink below 0, so the FORM gives that gap back with a negative bottom margin
// (every signup form is a flex box with gap:var(--p-s); an unknown --p-s makes it 0, never worse).
export const STYLE_TAG = '<style id="cf-turnstile-css">form:has(> .cf-turnstile){flex-wrap:wrap;margin-bottom:calc(-1 * var(--p-s));}.cf-turnstile{flex:1 1 100%;min-width:0;line-height:0;}</style>';
export const KEY_RE = /^0x4AAAA[0-9A-Za-z_-]{6,}$/;
const SIGNUP_FORM_RE = /<form\b[^>]*\baction="https:\/\/vektor-ig-dm\.vektor-fm\.workers\.dev\/signup"[^>]*>[\s\S]*?<\/form>/g;
const WIDGET_RE = /<div class="cf-turnstile"[^>]*><\/div>/g;

export const widget = (key) => `<div class="cf-turnstile" data-sitekey="${key}" data-theme="auto" data-appearance="interaction-only"></div>`;

export function siteKey(root = ROOT) {
  const site = JSON.parse(readFileSync(join(root, 'site.json'), 'utf8'));
  return site.turnstile_sitekey || PLACEHOLDER;
}

// Most pages omit </head> (the partials go straight from <style> into content), so the tags go
// before </head> when there is one, else before </body>, else at the end.
function beforeClose(html, tag) {
  if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, `${tag}\n</head>`);
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${tag}\n</body>`);
  return `${html}\n${tag}\n`;
}

// html -> html with the widget in every signup form and the script + CSS once per page.
export function injectTurnstile(html, key) {
  let forms = 0;
  let out = html.replace(SIGNUP_FORM_RE, (form) => {
    forms++;
    if (/<div class="cf-turnstile"/.test(form)) return form.replace(WIDGET_RE, widget(key));
    // Last thing in the form: below the email field and the button, never between them.
    return form.replace(/(\s*)<\/form>$/, (m, ws) => `${/^\r?\n/.test(ws) ? ws : `\n${ws}`}  ${widget(key)}${ws}</form>`);
  });
  if (!forms) return out;
  if (!out.includes('id="cf-turnstile-css"')) out = beforeClose(out, STYLE_TAG);
  else out = out.replace(/<style id="cf-turnstile-css">[^<]*<\/style>/, STYLE_TAG);
  if (!out.includes(API_SRC)) out = beforeClose(out, SCRIPT_TAG);
  return out;
}

// -> list of problems (empty = fine).
export function checkTurnstile(html, { publish = false, label = 'page' } = {}) {
  const problems = [];
  const forms = html.match(SIGNUP_FORM_RE) ?? [];
  forms.forEach((f, i) => {
    const n = (f.match(/<div class="cf-turnstile"/g) ?? []).length;
    if (n !== 1) problems.push(`${label}: signup form ${i + 1} has ${n} Turnstile widgets (needs exactly 1; run node scripts/turnstile.mjs --apply)`);
  });
  if (forms.length) {
    const scripts = html.split(API_SRC).length - 1;
    if (scripts !== 1) problems.push(`${label}: Turnstile script appears ${scripts} times (needs exactly 1)`);
  }
  if (publish && html.includes(PLACEHOLDER)) problems.push(`${label}: still carries the ${PLACEHOLDER} placeholder (run node scripts/set-turnstile-key.mjs <sitekey>)`);
  return problems;
}

export const rootPages = (root = ROOT) => readdirSync(root).filter((f) => f.endsWith('.html'));

export function applyAll(key, root = ROOT) {
  let changed = 0;
  for (const f of rootPages(root)) {
    const cur = readFileSync(join(root, f), 'utf8');
    const next = injectTurnstile(cur, key);
    if (next !== cur) { writeFileSync(join(root, f), next); changed++; }
  }
  return changed;
}

export function checkAll({ publish = false, root = ROOT } = {}) {
  const problems = [];
  for (const f of rootPages(root)) problems.push(...checkTurnstile(readFileSync(join(root, f), 'utf8'), { publish, label: f }));
  if (publish && siteKey(root) === PLACEHOLDER) problems.push(`site.json: turnstile_sitekey is still ${PLACEHOLDER}`);
  return problems;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const argv = process.argv.slice(2);
  if (argv.includes('--apply')) {
    const n = applyAll(siteKey());
    console.log(`turnstile: ${n} page(s) changed`);
  } else if (argv.includes('--check')) {
    const problems = checkAll({ publish: argv.includes('--publish') });
    for (const p of problems) console.error(`TURNSTILE: ${p}`);
    if (problems.length) process.exit(1);
    console.log(`turnstile check OK${argv.includes('--publish') ? ' (publish: no placeholder)' : ''}`);
  } else {
    console.error('usage: node scripts/turnstile.mjs --apply | --check [--publish]');
    process.exit(2);
  }
}
