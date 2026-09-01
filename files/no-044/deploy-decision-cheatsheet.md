# The deploy-platform cheat sheet

Six terms that get used interchangeably and mean different things. What each one
actually is, when it applies, and what it costs you to get it wrong.

From **vektor /// no. 044**.

---

## 1. Vercel vs Netlify

Not "which is better" — they optimise for different things.

| | Vercel | Netlify |
|---|---|---|
| Built around | Next.js | any framework |
| You get | server components, edge functions, incremental static regeneration | React, Vue, Svelte, plain static — plus a build-plugin ecosystem |
| Best when | your app *is* a Next.js app | your stack is mixed, or you want build-time plugins |

**The trap:** picking Vercel for a non-Next app means paying for integration you
never use. Picking Netlify for a Next app means re-implementing things Vercel
gives you for free.

---

## 2. Static hosting vs edge functions

| | Static hosting | Edge functions |
|---|---|---|
| What runs | nothing — files are pre-built | your code, at a data centre near the user |
| Every visitor gets | the same bytes | a response computed for them |
| Use it for | marketing pages, docs, anything identical for everyone | personalisation, redirects, auth checks, fetching per-request data |

**The trap:** reaching for edge functions when the page is the same for everyone.
You pay per invocation for output a CDN would have served free.

**The opposite trap:** static-generating something that needs to differ per user,
then patching it with client-side JavaScript that flashes the wrong content first.

---

## 3. Preview vs production deployment

| | Preview | Production |
|---|---|---|
| Created from | every branch or pull request | the main branch, after review |
| Who sees it | your team, via a shareable URL | your actual users |
| Lifetime | temporary, expires | until the next deploy |

**The trap:** reviewing changes on a local dev server instead of the preview URL.
Local hides environment differences — env vars, build flags, edge behaviour —
and those are exactly what breaks in production.

---

## The one-line version

Static when everyone gets the same thing. Edge when they don't. Preview before
production, always. And pick the platform your framework actually is.

---

vektor /// the AI frontier, cut to what ships
@vektor.fm
