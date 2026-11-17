# The three leaks after signup: a checklist

From the Vektor film "A thousand signups, two paying customers" (@vektor.fm). For a solo builder with a vibe coded app that gets signups and very few paying customers. Each fix is something you can do today.

Before you start, write down two numbers for the last 30 days: how many people signed up, and how many of them pay. You will want them again in a month.

## Leak 1: the empty first screen

A new user signs up and lands on a blank page. That is homework, and most people do not do homework for an app they met a minute ago.

- [ ] Sign up to your own app with a fresh email address, in a private window. Screenshot the first screen you land on.
- [ ] If that screen is empty (no project, no document, no data), decide what ONE finished example of your app's output looks like: a filled-in proposal, a finished report, a sample board.
- [ ] Create that example once, at signup, for every new account, so it is on the first screen the moment they arrive. Use realistic content, not "Lorem ipsum" and not "Test 1".
- [ ] Do not create it again at login. If a user deletes the sample, it stays deleted.
- [ ] Label it clearly as a sample, and let the user delete it in one click.
- [ ] Put one button next to it that starts their own version from the sample ("Make this yours" or "Start from this one").
- [ ] Decide separately what accounts that already exist get. The simplest answer is nothing: they already have their own work.
- [ ] Sign up again with another fresh address and check: can you see what the app does within ten seconds, without typing anything?

## Leak 2: the trial that is too long

Nobody feels any urgency on day three of thirty.

- [ ] Look up how long your free trial is today, and whether anything at all is sent before it ends.
- [ ] Before you change the number, store the trial length on each user. If your code works the end date out as "signup date plus 30", changing that 30 moves every existing trial too. Save 30 on the existing users first.
- [ ] Set the trial to 7 days for new signups only. People already in a trial keep the terms they signed up under.
- [ ] Decide what happens to a user's work when the trial ends without a subscription (for example: it stays, read only). You need the answer for the next two steps.
- [ ] Show the deadline inside the app from day one: "Your trial ends on Friday 27 November", a date, not a countdown they have to work out. Use one time zone for that date and stick to it.
- [ ] Schedule one reminder email before the trial ends (two days before is a sensible start). Say the end date, what they keep if they subscribe, and what happens to their work if they do not.
- [ ] Make sure something actually runs that reminder: a daily scheduled job, not code that only runs when someone happens to open the app.
- [ ] Put the subscribe button on the same screen as the deadline.
- [ ] Note the date you made the change, so you can compare the signups before it with the signups after it.

## Leak 3: the one missing email

Ask when they are happiest, not when the timer is running out.

- [ ] Define the "first result" in your app in one sentence: the first moment the app has clearly done its job for the user (the first proposal exported, the first report generated, the first invoice sent).
- [ ] Find the place in your code where that happens, and send one email from there, the first time only.
- [ ] Keep a "sent" mark on the user and set it before you send, so a retry or a double click can never send the email twice.
- [ ] Skip anyone who already pays.
- [ ] Say in the email what they just got, in their terms (time saved, a thing finished), then ask for the subscription with the price and one link.
- [ ] Use a number only if it is true for that user. If your app cannot measure the time saved, name the thing they finished instead.
- [ ] Send it right away, while they are still looking at the result. An email the next morning is a different email.
- [ ] Make the link survive a login: someone who clicks it while logged out should land on the checkout after logging in, not on their dashboard.
- [ ] Trigger your own first result with a test account and check the email arrives, reads well on a phone, and the link opens the checkout.

### The first-result email, ready to copy

Replace everything in [square brackets]. Keep it this short. If you do not collect a first name, drop the greeting line.

```
Subject: You just [finished your first proposal] with [App name]

Hi [first name],

You just [saved about two hours / sent your first proposal / finished your first report] with [App name].

If you want to keep it, it is [$19] a month: [checkout link]

Your trial runs until [date].

[Your name]
[App name]
```

The shortest version, as it is said in the film:

```
You just saved two hours, so keep it for $19 a month. [checkout link]
```

"Two hours" and "$19" are the film's example. Put in your own true numbers.

## After you have done all three

- [ ] In 30 days, write down the same two numbers again (signups, paying) and compare.
- [ ] If nothing moved, look at where people stop: after the first screen, during the trial, or after the first result. That tells you which fix needs another pass.

Fix the first screen and they get started, shorten the trial and they decide, then send that email and they pay.
