# The Claude Code starter team — 3 drop-in subagents

Three specialist agents that keep the junk out of your main context window:
a **reviewer** that only reviews, a **researcher** that only digs, and a
**planner** that only plans. Each one runs in its own separate context window
and reports back with just the answer — so your main thread stops filling up
with file dumps, and 'compacting conversation' stops eating your decisions.

## Install (30 seconds)

1. In your repo, create the folder `.claude/agents/`
2. Drop the three `.md` files in it
3. That's it. Claude Code reads each file's `description` and delegates on its
   own — or ask directly: "use the researcher to find where auth tokens are
   validated".

Works in any repo, any language. Edit the descriptions to match how you work —
the description is what tells Claude when to hand work to the specialist.

## Why this fixes the amnesia

Everything a subagent reads — the greps, the 500-line files, the test output —
stays in ITS context and dies with it. Only the final answer comes back to your
main thread. Three specialists can run in parallel while your main session
stays small, sharp, and un-compacted.

— vektor · @vektor.fm · The AI frontier, cut to what ships
