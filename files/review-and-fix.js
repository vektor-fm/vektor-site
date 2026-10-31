export const meta = {
  name: 'review-and-fix',
  description: 'Find bugs in a target, verify each one, fix the confirmed ones until the check passes, report back',
  whenToUse: 'Review a file or folder, fix only what survives verification, stop when the check passes or two rounds make no progress',
  phases: [
    { title: 'Find', detail: 'two reviewers, different lenses' },
    { title: 'Verify', detail: 'a skeptic tries to refute every finding' },
    { title: 'Fix', detail: 'fix confirmed findings, run the check, max 2 rounds' },
    { title: 'Report', detail: 'hand the result back to you' },
  ],
}

// args: { target: 'path/to/file-or-folder', check: 'command that must pass' }
const target = (args && args.target) || '.'
const check = (args && args.check) || 'npm test'

const FINDINGS = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          file: { type: 'string' },
          line: { type: 'number' },
          bug: { type: 'string' },
          evidence: { type: 'string' },
        },
        required: ['file', 'line', 'bug', 'evidence'],
      },
    },
  },
  required: ['findings'],
}

const VERDICTS = {
  type: 'object',
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          index: { type: 'number' },
          real: { type: 'boolean' },
          reason: { type: 'string' },
        },
        required: ['index', 'real', 'reason'],
      },
    },
  },
  required: ['verdicts'],
}

const FIX = {
  type: 'object',
  properties: {
    fixed: { type: 'array', items: { type: 'string' } },
    checkPassed: { type: 'boolean' },
    checkOutput: { type: 'string' },
    filesChanged: { type: 'array', items: { type: 'string' } },
  },
  required: ['fixed', 'checkPassed', 'checkOutput', 'filesChanged'],
}

// Find: two reviewers, each blind to the other
phase('Find')
const lenses = [
  'correctness: wrong results, off-by-one, wrong conditions, broken edge cases (empty input, missing fields, bad dates)',
  'failure handling: unhandled errors, crashes on bad input, silent wrong output, resources left open',
]
const found = await parallel(lenses.map((lens, i) => () =>
  agent(
    `Review ${target} for real bugs through this lens only: ${lens}. Read the code; do not edit anything. ` +
    `Report only bugs you can point to with a line and concrete evidence (an input that breaks it). No style notes. ` +
    `Return an empty list if you find nothing real.`,
    { label: `find:${i + 1}`, phase: 'Find', schema: FINDINGS },
  )))
const all = found.filter(Boolean).flatMap(r => r.findings)
log(`${all.length} candidate findings`)
if (!all.length) return { target, check, confirmed: [], rounds: [], report: 'No findings. Nothing to fix.' }

// Verify: one skeptic tries to refute each finding
phase('Verify')
const list = all.map((f, i) => `${i}. ${f.file}:${f.line} ${f.bug} (evidence: ${f.evidence})`).join('\n')
const judged = await agent(
  `Try to REFUTE each finding below against the code in ${target}. Do not edit anything. ` +
  `Mark real=true only if you can confirm the bug yourself; when unsure, real=false.\n\n${list}`,
  { label: 'verify', phase: 'Verify', schema: VERDICTS },
)
const confirmed = ((judged && judged.verdicts) || []).filter(v => v.real).map(v => all[v.index]).filter(Boolean)
log(`${confirmed.length} of ${all.length} confirmed`)
if (!confirmed.length) return { target, check, candidates: all, confirmed: [], rounds: [], report: 'Every finding was refuted. Nothing to fix.' }

// Fix: rule on the arrow - retry until the check passes, stop after 2 rounds or a round with no progress
phase('Fix')
const rounds = []
let remaining = confirmed
for (let round = 1; round <= 2 && remaining.length; round++) {
  const todo = remaining.map((f, i) => `${i}. ${f.file}:${f.line} ${f.bug}`).join('\n')
  const r = await agent(
    `Fix these confirmed bugs in ${target}, with the smallest change that fixes each one, and add a test for each where a test file exists:\n${todo}\n\n` +
    `Then run \`${check}\` and report whether it passed. Touch no files outside ${target} and its tests. ` +
    `List in "fixed" the exact bug text of each one you fixed.`,
    { label: `fix:round-${round}`, phase: 'Fix', schema: FIX },
  )
  if (!r) break
  rounds.push({ round, ...r })
  const before = remaining.length
  remaining = remaining.filter(f => !r.fixed.some(x => x.includes(f.bug.slice(0, 40))))
  if (r.checkPassed && !remaining.length) break
  if (remaining.length === before) { log('no progress this round, stopping'); break }
}

// Report: hand it back
phase('Report')
const last = rounds[rounds.length - 1]
return {
  target,
  check,
  candidates: all.length,
  confirmed,
  rounds,
  unfixed: remaining,
  report: last && last.checkPassed && !remaining.length
    ? `Fixed ${confirmed.length} confirmed bug(s); ${check} passes.`
    : `Stopped with ${remaining.length} unfixed; last check ${last && last.checkPassed ? 'passed' : 'failed'}. Over to you.`,
}
