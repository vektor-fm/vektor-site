// node --test scripts/turnstile.test.mjs   (Turnstile on the signup forms, 2026-10-31)
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { injectTurnstile, checkTurnstile, checkAll, applyAll, PLACEHOLDER, API_SRC, ROOT } from './turnstile.mjs';
import { validateKey, writeKey } from './set-turnstile-key.mjs';

const KEY = '0x4AAAAAAAtestkey_123';
const FORM = (extra = '') => `<form class="sticky-form" method="post" action="https://vektor-ig-dm.vektor-fm.workers.dev/signup" data-capture="sticky">
      <input type="hidden" name="tag" value="x">
      <input type="email" name="email" required>
      <button class="btn" type="submit">Go</button>${extra}
    </form>`;
const PAGE = (body) => `<!doctype html><html><head><style>a{}</style>\n<body>${body}\n<script src="./js/x.js"></script>\n</body></html>`;

test('one widget per signup form, after the email field and button, script + CSS once', () => {
  const out = injectTurnstile(PAGE(FORM() + FORM() + '<form action="/elsewhere"><input name="q"></form>'), PLACEHOLDER);
  assert.equal(out.match(/class="cf-turnstile"/g).length, 2, 'only the /signup forms');
  assert.equal(out.split(API_SRC).length - 1, 1);
  assert.equal(out.split('id="cf-turnstile-css"').length - 1, 1);
  assert.match(out, /<button class="btn" type="submit">Go<\/button>\n\s+<div class="cf-turnstile" data-sitekey="__TURNSTILE_SITEKEY__" data-theme="auto"[^>]*><\/div>\n\s+<\/form>/);
  assert.match(out, /async defer><\/script>\n<\/body>/, 'no </head>: tags go before </body>');
  assert.deepEqual(checkTurnstile(out), []);
});

test('idempotent, and a key change only rewrites data-sitekey', () => {
  const once = injectTurnstile(PAGE(FORM()), PLACEHOLDER);
  assert.equal(injectTurnstile(once, PLACEHOLDER), once);
  const keyed = injectTurnstile(once, KEY);
  assert.equal(keyed, once.replace(PLACEHOLDER, KEY));
  assert.ok(!keyed.includes(PLACEHOLDER));
});

test('CRLF pages get no blank line', () => {
  const crlf = PAGE(FORM()).replace(/\n/g, '\r\n');
  assert.doesNotMatch(injectTurnstile(crlf, KEY), /\n\r?\n\s*<div class="cf-turnstile"/);
});

test('check: a form without the widget fails; --publish fails on the placeholder', () => {
  assert.match(checkTurnstile(PAGE(FORM())).join(), /has 0 Turnstile widgets/);
  const ph = injectTurnstile(PAGE(FORM()), PLACEHOLDER);
  assert.deepEqual(checkTurnstile(ph), []);
  assert.match(checkTurnstile(ph, { publish: true }).join(), /placeholder/);
  assert.deepEqual(checkTurnstile(injectTurnstile(PAGE(FORM()), KEY), { publish: true }), []);
  assert.deepEqual(checkTurnstile(PAGE('<p>no form</p>'), { publish: true }), [], 'pages without a signup form need nothing');
});

test('validateKey refuses empty, the placeholder and non-site-key strings', () => {
  assert.throws(() => validateKey(''), /usage/);
  assert.throws(() => validateKey(undefined), /usage/);
  assert.throws(() => validateKey(PLACEHOLDER), /placeholder/);
  assert.throws(() => validateKey('1x0000000000000000000000000000000AA'), /does not look like a Turnstile site key/);
  assert.throws(() => validateKey('0x4AAAA<script>'), /does not look like/);
  assert.equal(validateKey(` ${KEY} `), KEY);
});

test('writeKey + applyAll on a scratch site: placeholder gone everywhere, publish check passes', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ts-site-'));
  writeFileSync(join(dir, 'site.json'), '{\n  "turnstile_sitekey": "__TURNSTILE_SITEKEY__",\n  "index": {}\n}\n');
  writeFileSync(join(dir, 'a.html'), injectTurnstile(PAGE(FORM()), PLACEHOLDER));
  writeFileSync(join(dir, 'b.html'), PAGE(FORM()));
  assert.ok(checkAll({ publish: true, root: dir }).length >= 2);
  writeKey(KEY, dir);
  assert.equal(JSON.parse(readFileSync(join(dir, 'site.json'), 'utf8')).turnstile_sitekey, KEY);
  applyAll(KEY, dir);
  assert.deepEqual(checkAll({ publish: true, root: dir }), []);
});

test('this checkout: every signup form carries the widget', () => {
  assert.deepEqual(checkAll({ root: ROOT }), []);
});
