# The first prompt to run on every new Claude model

Vektor no. 100 · https://vektor-fm.github.io/vektor-site/no-100.html

## The prompt

Paste it into Claude Code, in the project you want checked:

```
Read this entire project and find everything that's broken, inconsistent, inefficient, or no longer needed. Fix what you're sure about and list the rest for me to review.
```

Source: Alex Albert (Research, Anthropic), post on X dated 2026-11-10, as shown in the screenshot in the source reel. We could not open the post itself (X answered HTTP 402), so the wording is as that screenshot shows it.

## How to run it

1. Commit or branch first, so every fix is a diff you can read and undo.
2. Start `claude` in the project and type `/model` to switch to the new model. It switches in the same session: the conversation, the files and the skills stay (Claude Code model configuration docs, code.claude.com/docs/en/model-config, read 2026-11-15).
3. Paste the prompt. It fixes what it is sure about and lists the rest.
4. Run your tests before and after. Keep what holds, revert what doesn't.
5. Run the same prompt again at the next release, to see what the new model picks up that the last one missed.

## What it found on our repo (our run)

The prompt above, word for word, on a throwaway copy of our own Instagram DM funnel (a Cloudflare Worker), Claude Fable 5.2 in Claude Code, 2026-11-16, 04:20 to 04:27 UTC. Nothing from the copy was deployed.

- 37 findings: 13 fixed by the model, 24 listed for review.
- By kind: broken 12, inconsistent 15, inefficient 5, no longer needed 5.
- The same test files passed and failed before and after its fixes.
- One run on one repo, not a benchmark.

## Fable plans, Opus does the work (optional)

- Claude Fable 5.2: $8 / $40 per million input / output tokens. Claude Opus 5.5: $4 / $20 (Anthropic pricing page, read 2026-11-15). Twice the price per token; Anthropic's launch page says Fable 5.2 at High effort scores about level with Opus 5.5 at Max for roughly half the cost per task.
- Keep the main session on Fable 5.2 as the orchestrator. In each sub-agent file under `.claude/agents/`, set `model: opus` in its front matter, or set `CLAUDE_CODE_SUBAGENT_MODEL` for every sub-agent.
- This is the source creator's own setup for bigger projects; nobody has measured the saving.
