# Test run of `copilot-or-autopilot.md` (2026-10-30, one run, no revision needed)

Command (from a scratch folder outside the repo, so no CLAUDE.md context loaded; prompt piped on stdin):
`claude -p --model sonnet --strict-mcp-config --max-turns 1 --disallowedTools "Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch,Task,NotebookEdit"`
Claude Code 2.1.308. Exit 0.

Input (`<IDEA>` line): "An AI tool that drafts replies to customer support tickets for Shopify stores, so the support person only reviews and hits send."

Output, verbatim:

---

**The job.** The product sits next to the customer support desk: the person or team answering "where is my order", returns and sizing questions. Small and mid-sized stores usually do this with an in-house support hire, a part-time freelancer, or an outsourced support agency or offshore call-centre firm. As a rough estimate, a human agent costs about $2,000 to $5,000 a month, or roughly $3 to $6 per ticket when outsourced. The helpdesk and AI tools around that job run about $50 to $500 a month for a small store. Labor is probably ten times the software spend or more.

**The line.** Split, leaning toward intelligence. Order status, tracking, return eligibility, policy lookups and product questions are routine, well defined and often already outsourced, so that is intelligence work. Refunds beyond policy, furious or at-risk customers, chargebacks, and anything touching safety or legal exposure are judgement. A human stays accountable for those.

**The verdict.** As stated, this is a copilot: you sell a drafting tool, and a person still reviews and sends every reply. The autopilot version answers and closes routine tickets on its own, including issuing refunds and return labels within the store's written policy. It escalates only the exceptions, with a summary already written.

**The offer.** "We resolve your routine Shopify support tickets every month for a small per-resolved-ticket fee, roughly $0.50 to $2 each, with a modest monthly minimum, and you pay nothing for tickets we escalate to your team."

---

Read of the result: all four parts present, the budget figures are stated as rough estimates with ranges (the prompt forbids precise statistics; the model's own ranges are not verified by us and the payload says so), the intelligence-vs-judgement split names which parts are which, the verdict is one sentence plus the autopilot version, and the offer line promises the customer an outcome, not the builder a return. Good enough on run one; no second run.
