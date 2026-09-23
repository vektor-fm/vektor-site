# Which of the five roles are you? (git-history edition)

**How to use this:**
1. Open a terminal in any git repo you have actually worked in.
2. Make sure you have Claude Code installed and are signed in.
3. Copy everything below the line into your terminal as one `claude` prompt (or paste it into an interactive Claude Code session).
4. It only reads git history. It never edits, commits, or pushes anything.
5. Takes about a minute. Works on any repo, not just this one.

Based on Boris Cherny's five engineering archetypes (Prototyper, Builder, Sweeper, Grower, Maintainer).

---

```
You are analyzing MY git history to sort me into one or two of five archetypes, based on Boris Cherny's framework:

1. Prototyper: comes up with brand new ideas; churns out many ideas, most of which don't ship
2. Builder: quickly turns a prototype/idea into production-grade product/infra
3. Sweeper: cleans up the UI, simplifies the code and system, unships, optimizes performance
4. Grower: takes a product that has been built and iterates on it to improve Product-Market Fit
5. Maintainer: owns a mature system to make it secure, reliable, fast, and efficient as it scales

Most people are a mix of two, sometimes three. This is a heuristic read of my commit
patterns, not a psychometric test, and it will be wrong at the edges. Say so in the
output. You must only use READ-ONLY git commands (git log, git show, git branch, git
config, git rev-list, git diff with no working-tree writes). Never run git add, commit,
checkout, reset, push, or anything that changes the repo state.

STEP 1 - SCOPE
Run `git config user.email` to find my email. If the repo has no config, ask me for the
email or name to filter on instead.
Default window: the last 12 months from today. If my history in this repo is shorter,
use the whole history and say so. (I can override the window by telling you a different
one before you run anything.)

STEP 2 - GATHER EVIDENCE (read-only only)
Scoped to my commits only (--author=<my email>) over the window:
- `git log --author=... --since=... --numstat --pretty=format:'COMMIT %H|%ad|%s' --date=short`
  to get every commit with per-file added/deleted line counts.
- `git log --author=... --since=... --shortstat` for a quick net-change sanity check.
- `git branch -a --sort=-committerdate` and, for branches I authored the tip of, whether
  they're merged into main/master (`git branch --merged`) or not (`git branch --no-merged`)
  - unmerged branches with my commits and no recent activity are prototyper signal.
- Reverted work: `git log --author=... --grep='^Revert'` and commits whose message or diff
  undoes an earlier commit of mine.
- File age at time of edit: for a sample of files I touched, `git log --follow --diff-filter=A
  -1 --format=%ad -- <file>` to get the file's birth date, so you can tell "I built this new
  file" apart from "I touched a file that's been here two years."
- Keyword scan on my own commit subjects: count matches (case-insensitive) for
  fix, perf/performance, security/vuln/CVE, refactor, simplify, remove/delete/unship,
  revert, feat/add/new, experiment/spike/poc/wip, deps/dependency/upgrade/bump.
- New files vs modified files: from the --numstat output, count how many commits touch
  ONLY brand-new files (prototyper/builder territory) vs only pre-existing files (sweeper/
  grower/maintainer territory).

If any command fails (shallow clone, no branches, tiny repo), say what you could not
get and keep going with what you have. Never guess a number you did not compute.

STEP 3 - SCORE AGAINST THE RUBRIC (show your work)
Give each archetype a rough weight out of 100 based on this explicit mapping. State
which signals you found for each one before giving the number - do not just assert a
score.

- PROTOTYPER: many commits touching only new files; many short-lived or unmerged
  branches; high ratio of "wip"/"experiment"/"spike"/"poc" keywords; low average commits
  per branch (spin up, try it, move on); low proportion of my commits that end up merged.
- BUILDER: commits that take a new or prototype file/branch through to something that
  ships (merged branch, feature-complete diff, tests/config/CI added alongside the
  feature); large net additions concentrated in a short window on one feature; "feat"/
  "add" keywords on branches that DID get merged.
- SWEEPER: net deletions (deletions > additions across a stretch of commits); "refactor"/
  "simplify"/"remove"/"delete"/"unship"/"cleanup" keywords; "perf"/"optimize" keywords;
  commits that touch many files with small, mechanical-looking diffs (renames, dedup).
- GROWER: repeated commits over weeks/months on the SAME already-shipped, user-facing
  files or areas (not brand new, not ancient); a pattern of small iterative tweaks plus
  A/B or metric-flavoured commit messages (conversion, funnel, copy, onboarding, retention,
  experiment-on-a-live-feature rather than a prototype).
- MAINTAINER: commits on old files (born long before the edit, per the file-age check);
  "security"/"vuln"/"CVE"/"dep"/"upgrade"/"bump"/"fix"/"reliability" keywords; changes to
  CI, infra, config, dependency manifests; low net line change relative to number of
  commits (careful, surgical edits to a mature system).

Normalize so the weights are informative (they don't need to sum to exactly 100, but
should reflect relative strength, not eleven categories all at 20%).

STEP 4 - OUTPUT
Give me, in this order:
1. PRIMARY archetype and SECONDARY archetype (skip a secondary only if one archetype
   truly dominates), each with an approximate percentage split (e.g. "65% Builder / 25%
   Sweeper / 10% other"). These percentages are your own rough read of the mix, not a
   precise measurement - say so.
2. The 3-5 concrete commits (short hash + one-line message + date) that most drove this
   call, with a one-line note on why each one counts as evidence.
3. One line: "How to get better at your archetype with AI" - a concrete, specific
   suggestion tied to the archetype you landed on (e.g. a Builder should have AI draft
   the test/CI scaffolding it skips to ship faster; a Maintainer should have AI triage
   dependency CVEs and draft the upgrade diff before touching it by hand).
4. One line stating plainly: this is a heuristic based on commit patterns in one repo,
   not a psychometric or professional assessment, and a different repo or window could
   read differently.

Do not modify the repo in any way. Do not run anything beyond read-only git inspection.
If something in this repo makes the read genuinely ambiguous (e.g. squash-merged history
that hides branch life, or a repo I only just started), say so instead of forcing a
confident answer.
```
