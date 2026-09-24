# Worker change needed: carry `role` through to Buttondown

Written 2026-09-24 as part of `feature/email-capture-v2` (vektor-site). **Not
implemented here** — the landing pages already send the field; the funnel
worker (a different repo: `vektor/funnel/ig-dm-webhook`) needs one small
change to stop dropping it. Per the founder's instruction, this session did
not touch the worker.

## What the pages now send

Every capture form that carries the new "what do you do?" role picker
(the issue-page sticky bar in `partials/capture.html`, and the hub popup in
`src/index.body.html`) POSTs an optional field:

```
role = "developer" | "founder-operator" | "other"   (absent if not tapped)
```

alongside the existing `email`, `tag`, and `company` (honeypot) fields, to
`POST https://vektor-ig-dm.vektor-fm.workers.dev/signup`.

## What the worker currently does with it

`vektor/funnel/ig-dm-webhook/src/signup.js`, function `handleSignup`:
`readFields(request)` parses the whole POST body into an object and
`handleSignup` destructures only the fields it knows about — `fields.tag`,
`fields.source`, `fields.company`, `fields.email`. `fields.role` is present
in that object but nothing reads it, so **it reaches the worker and is
silently discarded**. Nothing breaks; the value just never reaches
Buttondown. (Confirmed by reading `readFields` and the body of
`handleSignup` — no worker code was run to verify this, only read.)

## The exact change

In `handleSignup`, after the existing `source` line:

```js
const source = cleanTag(fields.tag ?? fields.source);
const role = ["developer", "founder-operator", "other"].includes(fields.role)
  ? fields.role
  : null;
```

(`cleanTag` already exists in the file and is the right sanitizer if you'd
rather reuse it instead of an allowlist — either is fine, the allowlist is
just tighter since the page only ever sends one of three exact values.)

Then, where `tags` and `notes` are built just above the `createSubscriber`
call:

```js
const tags = ["single-optin"];
if (source) tags.push(source);
if (role) tags.push(`role-${role}`);          // ADD

const { status, body } = await createSubscriber(env, {
  email,
  tags,
  notes: `via ${source ?? "site"} ${today()}${role ? ` · role:${role}` : ""}`,  // ADD the role suffix
  ip,
});
```

## Why it's this shape, not something else

- **Ride the existing tag-degrade ladder, don't build a new path.**
  `createSubscriber` already retries without `tags` on a `403
  feature_disabled` (the free Buttondown plan rejects tags entirely — see
  the comment block above `createSubscriber`, and
  `reports/...buttondown...` referenced there). Adding `role-${role}` to the
  same `tags` array means it automatically gets the same free-plan fallback
  behavior for free — no new conditional needed.
- **Also write it into `notes`, unconditionally.** `notes` is never
  feature-gated, so this is the one field guaranteed to land regardless of
  Buttondown plan tier. Until (if) the plan is upgraded and tags start
  working, `role` would otherwise be silently lost exactly the way real
  per-source `tags` already are today.
- **Validate against a fixed allowlist**, not free text — the page only ever
  sends one of three exact values from radio buttons, so anything else in
  `fields.role` is either a bot/bug and should be dropped, not tagged into
  Buttondown as junk segment data.
- **No change to `readFields`, the honeypot, the rate limit, or the
  redirect logic** — this is additive only inside the tag/notes assembly.

## Verifying it after the worker change ships

1. `curl -s -X POST https://vektor-ig-dm.vektor-fm.workers.dev/signup -d
   'email=test+role@example.com&tag=no-045-sticky&role=developer'` (or the
   funnel's own staging equivalent) and check the resulting Buttondown
   subscriber has tag `role-developer` and a notes field containing
   `role:developer`.
2. Confirm `/report`'s existing `count:email:<source>:<day>` counters are
   unaffected (this change touches Buttondown's `tags`/`notes` params only,
   not the KV counters in `stats.js`).
