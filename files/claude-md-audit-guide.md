# Audit your CLAUDE.md for older-model habits

vektor /// no. 070 · the guide from the film.
Commands checked 2026-10-13 against the Claude Code changelog (Claude Code 2.1.296).

**Read this first.** This guide is a short how-to, not a promise. Vektor has not run the audit on your files. The numbers in section 5 come from a source reel and are not independently verified.

---

## 1. The idea

Many CLAUDE.md files contain instructions written for older models. The source film's claim is that on Opus 5.5 those leftovers slow it down and make its answers worse. Claude Code ships a command that audits for them.

## 2. The commands

**`/doctor prompt-audit`** (also `/checkup prompt-audit`). Added in Claude Code 2.1.283. The changelog describes it as auditing "your CLAUDE.md files, skills, agents and commands for prompting patterns written for older models". A later release improved it: "stale paths, stale commands and contradicting instruction files now lead the report, and thinking keywords that Claude Code documents are kept".

Start here for your CLAUDE.md.

**`/claude-api prompt-audit`**. Added in 2.1.221 as a subcommand of the `claude-api` skill, "for auditing prompts and tool descriptions for patterns written for older models". Use it for the prompts and tool descriptions inside your own API apps, not for your CLAUDE.md.

## 3. The three habits the film names

1. **"Double-check your work" rituals.** Lines telling Claude to verify, re-verify or triple-check.
2. **Instructions in ALL CAPS.** NEVER, ALWAYS, IMPORTANT and CRITICAL used as volume.
3. **Step-by-step scripts for things the model already knows.** Numbered procedures for tasks it does unprompted.

## 4. How to run it

1. **Back up first.** Commit your CLAUDE.md, or copy it somewhere, so you can get back to today's version.
2. In Claude Code, run `/doctor prompt-audit`.
3. **Read the report.** Per the source reel, it writes a report and a proposed diff first, and you approve every cut. Nothing here is something Vektor tested; it is what the audit is designed for, per the source.
4. **Review the diff line by line.** Do not accept it in bulk.
5. **Keep rules that encode real project facts:** file paths, build and test commands, naming conventions, things the model cannot guess. The audit targets habits, not facts. If a cut removes a fact, reject that cut.
6. **Re-run after big edits**, and after you add new rules.

If a stale path or stale command is flagged, fix it rather than delete it, unless the thing no longer exists.

## 5. The numbers, as reported

From the source reel (nocodealex, https://www.instagram.com/p/Dd15NcHvlNl/), **not independently verified by Vektor**:

- one developer found about 70 fixes in their setup;
- Anthropic's test showed about 9% lower cost and about 2 points higher accuracy.

Your files will differ. Treat these as the reel's claims, not a forecast.

## 6. A quick self-check

After the audit, open your CLAUDE.md and ask of each remaining line: is this a fact about my project, or a habit I added to steer an older model? Keep the first kind.

---

## Sources

- nocodealex's reel: https://www.instagram.com/p/Dd15NcHvlNl/
- Claude Code changelog entries for `prompt-audit` (2.1.221, 2.1.283 and a later improvement), checked 2026-10-13.

The guide is Vektor's. @vektor.fm
