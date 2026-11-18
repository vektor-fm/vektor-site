# The three leaks after signup: the checklist

From the Vektor film "A thousand signups, two paying customers" (@vektor.fm). This is the by-hand version of the three fixes. If your app's code is in a folder you can open with Claude Code, the audit prompt in the same pack (`leak-audit.md`) does most of this for you and shows its work.

## Before you start

Two numbers decide whether any of this worked, so write them down first.

- [ ] Write down, for the last 30 days: how many people signed up, and how many of those pay.
- [ ] Put a date in your calendar 30 days after you finish, to count the same two numbers again.

## Leak 1: the empty first screen

A new user signs up and lands on a blank page. That is homework, and most people do not do homework for an app they met a minute ago.

- [ ] Sign up to your own app with a fresh email address in a private window, and screenshot the first screen you land on.
- [ ] If that screen is empty, decide what ONE finished example of your app's output looks like: a filled-in proposal, a cleaned list, a finished report.
- [ ] Create that example automatically for every new account, with realistic content. No "Lorem ipsum", no "Test 1".
- [ ] Label it as a sample and let the user remove it in one click.
- [ ] Make sure the sample cannot do anything real: it emails nobody, and it is left out of limits, billing and statistics.
- [ ] Put one button next to it that starts the user's own from the sample.
- [ ] Sign up again with another fresh address: can you see what the app does within ten seconds, without typing anything?

## Leak 2: the trial that is too long

Nobody feels any urgency on day three of thirty.

- [ ] Look up how long your free trial is today, and whether anything at all is sent before it ends.
- [ ] Set the trial to 7 days for new signups only. People already in a trial keep the end date they were given.
- [ ] Check how your app stores the trial. If it stores a start date and works out the end from a setting, changing the setting shortens everyone's trial at once: store the end date per user first.
- [ ] Show the deadline in the app from day one as a date ("Your trial ends on Friday 27 November"), next to the button to subscribe.
- [ ] Send one reminder email two days before the end. Say the end date, what they keep if they subscribe, and what really happens to their work if they do not.
- [ ] Find every other place the old length is written (landing page, signup page, welcome email, tests) and change it.
- [ ] Note the date you made the change, so you can compare signups before it with signups after it.

Source: in one randomised experiment at one large software company (337,724 new users), a 7-day trial produced 5.59% more subscriptions than a 30-day one (Yoganarasimhan, Barzegary and Pani, arXiv 2006.13420, 2020, read 2026-11-17). RevenueCat's 2026 report on more than 115,000 mobile apps finds the opposite pattern for app trials (read 2026-11-17), so compare your own numbers before and after.

## Leak 3: the one missing email

Ask when they are happiest, not when the timer is running out.

- [ ] Write down the "first result" in your app in one sentence: the first moment the app has clearly done its job for a user.
- [ ] Find the place in your code where that happens and send one email to the user from there, the first time only.
- [ ] Store that it was sent, so a retry or a second result cannot send it twice.
- [ ] Say what they just got, in their terms, then the price and one link to the checkout.
- [ ] Use a number only if it is true for that user. If your app cannot measure it, name the thing they finished instead.
- [ ] Do not send it to people who already pay. Check that your app actually records who pays: in both sample apps I tested, nothing did.
- [ ] Trigger your own first result with a test account and check that the email arrives, reads well on a phone, and the link opens the checkout.

The five emails in `emails.md` are ready to copy.

## After you have done all three

- [ ] In 30 days, count the same two numbers again (signups, paying) and compare.
- [ ] If nothing moved, look at where people stop: after the first screen, during the trial, or after the first result. That tells you which fix needs another pass.
