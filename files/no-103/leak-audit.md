Audit this app for the three places new signups get lost before they pay, show me what you found, and then, only if I say so, fix them on a branch.

Why I am asking: plenty of people sign up for my app and very few end up paying. More signups will not fix that. The usual losses all come after the signup:

1. The first screen is empty. A new user lands on a blank page and has to do work before they can see what the app does.
2. The trial is long and silent. Nothing in the app shows a deadline and nothing reminds the user before it ends, so nobody ever has to decide.
3. Nothing is sent at the first result. The moment the app has clearly done its job for a user for the first time is when they are happiest, and that is when to ask them to pay, not when the trial timer runs out.

Work in two phases and stop between them.

## Phase 1: audit (read only, change nothing)

Read the code and answer these three questions with evidence:

1. First screen. Trace the signup flow to the screen a brand-new account lands on. What does that screen show when the account has no data yet? Is anything created for the user at signup?
2. Trial. How long is it and where is that set? Does the app show the user the end date as a date? Is any reminder sent before it ends? What happens when it ends? List every other place the length is written down (landing page, emails, tests, docs). If the app has no trial at all (free plan, or pay up front), say so and do not invent one.
3. First result. Name, in one sentence, the first moment the app has clearly done its job for a user, and say why you picked it over the nearest alternative. Find where it happens in the code. Is anything sent to the user at that moment? A message to someone else (a client, a teammate) does not count.

While you read, also note: the stack, the commands for the project's own checks (tests, typecheck, lint, build), how email is sent, whether there is any scheduler or cron, where the price and the checkout link live, and how database changes are made.

Then give me a short report. For each of the three: a verdict (leak, partly, fine, or cannot tell), the evidence as file:line with the few lines that prove it, and the fix you propose in two to four lines, including the files it would touch. If something is not a leak, say so and propose nothing. Do not pad the report.

End Phase 1 by asking me which fixes to apply (1, 2, 3, all or none) and at most three questions where a wrong guess would cost me, for example what counts as the first result, or the price to put in the email. Then stop. Do not edit, create or delete any file until I answer.

## Phase 2: fixes (only the ones I approve)

Before the first edit:
- Run git status. If there are uncommitted changes, stop and tell me.
- Create a branch named fix/signup-leaks from the current branch and do all work there. Never commit to main or master, never push, never deploy.
- Run the project's own checks once and write down the result, so we both know what was already failing before you touched anything.

Rules for every fix: follow the patterns already in this codebase (same libraries, same helpers, same style). Add no dependency unless there is no other way, and say why. Never read or change secrets or .env values, never send a real email to a real person, never touch production data. If a fix needs a database change, make it the way this project makes them, and make it safe for a database that already has users in it.

Fix 1, a finished example on the first screen:
- Every new account gets one finished example of what the app produces, created at signup, so the first screen is never empty. Existing accounts are left alone.
- Realistic content from this app's own domain. No lorem ipsum, no "Test 1".
- Clearly labelled as a sample, removable in one click, with one action that starts the user's own from it.
- The sample must never cause a real side effect: it does not email anyone, it does not count as the user's first result, and it does not count against limits, billing or statistics.

Fix 2, a 7-day trial with a visible deadline and one reminder:
- The trial is 7 days for new signups only. Anyone already in a trial keeps the end date they were given: do not rewrite stored dates.
- Keep the length in one place in the code, and update every place the copy states it.
- From day one the app shows the end as a calendar date (for example "Your trial ends on Friday 27 November"), next to the button to subscribe.
- One reminder email two days before the end, once per user, only to users still on the trial. It says the end date, what they keep if they subscribe and what happens to their work if they do not.
- For the schedule, use the scheduler this app already has. If it has none, add the smallest one that fits where the app is hosted, and tell me exactly what I have to switch on. Never say something is scheduled when it only exists as code.

Fix 3, the first-result email:
- Sent to the user from the exact place in the code where the first result happens, right away.
- Once per user, ever. Store that it was sent, so a retry, a double click or a second result cannot send it again. A failure to send must not break the user's action.
- It says what they just got, in their terms, then the price and one link to the checkout. Use a number such as time saved only if the app really measures it for that user. If it does not, name the thing they just finished.
- No fake urgency. Do not send it to users who already pay.

Tests and checks:
- Where an existing test asserts the old behaviour (for example the old trial length), update it and tell me which ones you changed and why. Never delete or weaken a test to get to green.
- Add tests for what you built: the sample exists after signup and has no side effects; the trial length; the reminder goes once, on the right day, and not to paying users; the first-result email goes once, on the first real result only, and not for the sample.
- Run all the project's checks again. Fix what you broke. If something fails that was already failing, say so and leave it.
- Commit on the branch, one commit per fix, with plain messages.

## Final report

Tell me, in plain language:
- What changed for each leak, with the files.
- The checks, before and after, with the exact commands and results.
- What I have to do by hand before this is live: environment variables, switching on the schedule, running a migration, copy I should read once.
- Anything you chose not to do, and why.
- How to undo all of it.

Do not promise me a result. These are changes to test: I will compare signups against paying customers before and after.
