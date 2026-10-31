#!/usr/bin/env node
// Put the real Cloudflare Turnstile site key on every signup form (2026-10-31).
//
//   node scripts/set-turnstile-key.mjs 0x4AAAAAAA...
//
// The site key is PUBLIC (Cloudflare dashboard > Turnstile > the widget > Site Key; it is
// meant to sit in the page source). The SECRET key is a different value and goes to the
// Worker only (wrangler secret), never here. This script:
//   1. refuses an empty argument or anything not shaped like a site key (0x4AAAA...);
//   2. writes it to site.json turnstile_sitekey (the one place it lives);
//   3. rebuilds the built pages (build.mjs) and refreshes every hand-authored page
//      (scripts/turnstile.mjs --apply), which together replace __TURNSTILE_SITEKEY__
//      everywhere;
//   4. runs the publish check (build.mjs --check --publish) and fails if anything is left.
// It does not commit or push. Pushing main publishes the site.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { ROOT, KEY_RE, PLACEHOLDER, applyAll } from './turnstile.mjs';

export function validateKey(key) {
  const k = String(key ?? '').trim();
  if (!k) throw new Error('usage: node scripts/set-turnstile-key.mjs <sitekey>   (the PUBLIC site key, 0x4AAAA...)');
  if (k === PLACEHOLDER) throw new Error('that is the placeholder, not a key');
  if (!KEY_RE.test(k)) throw new Error(`"${k}" does not look like a Turnstile site key (expected 0x4AAAA followed by letters, digits, _ or -). Is it the SECRET key? That one never goes in a page.`);
  return k;
}

export function writeKey(key, root = ROOT) {
  const file = join(root, 'site.json');
  const raw = readFileSync(file, 'utf8');
  if (!/"turnstile_sitekey":\s*"[^"]*"/.test(raw)) throw new Error('site.json has no "turnstile_sitekey" field');
  writeFileSync(file, raw.replace(/("turnstile_sitekey":\s*)"[^"]*"/, `$1"${key}"`));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  let key;
  try { key = validateKey(process.argv[2]); } catch (e) { console.error(`x ${e.message}`); process.exit(1); }
  writeKey(key);
  execFileSync(process.execPath, [join(ROOT, 'build.mjs')], { cwd: ROOT, stdio: 'inherit' });
  console.log(`turnstile: ${applyAll(key)} hand-authored page(s) updated`);
  try {
    execFileSync(process.execPath, [join(ROOT, 'build.mjs'), '--check', '--publish'], { cwd: ROOT, stdio: 'inherit' });
  } catch {
    console.error('x publish check failed (see above); nothing is published until it passes');
    process.exit(1);
  }
  console.log('key set. Review with git diff, commit, then fast-forward main to publish.');
}
