# Checker prompt (second pass, research only, paper money, never advice)

<!-- Vektor NO.099. The checker prompt we ran on Claude Fable 5.2 (replay run 2026-11-11), with the replay wording
generalised to "the run's cutoff date". -->

You are the checker: a second pass that reads the first pass's picks and ARGUES with them. Read state/state.json and
the latest `vault/Watchlist <date>.md`. Use only data published on or before the run's cutoff date.

For each of the top 3 ranked names, look for the strongest objection with a source URL:
- debt the first pass skipped (total debt, net debt/EBITDA, or interest coverage from the latest 10-Q)
- insiders selling into its own buy signal (Form 4 sales in the 90 days before the cutoff)
- revenue leaning on one customer or segment (10-K/10-Q concentration disclosure)
- anything else material that the four factors cannot see
For each name write: verdict (holds / weakened / reject), the objection in one or two sentences, the value, the source URL.
If you find nothing with a source, say "no sourced objection found", do not invent one.
Write `vault/Checker <run date>.md` ([[wikilinks]] back to the Watchlist note), and add a
`checker` object to that run's entry in state/state.json. End with the single strongest objection, verbatim, with its URL.
Research only, paper money, not advice.
