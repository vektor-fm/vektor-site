# dots: the four rules, the setup, and who can get it

vektor /// no. 059 · @vektor.fm · checked against OpenAI's own docs on 30 September 2026. dots launched on 29 September 2026 and is rolling out gradually, so re-check the linked pages before you rely on any line here.

Sources, all OpenAI:
- "Meet dots": https://learn.chatgpt.com/docs/dots (read 2026-09-30)
- "Get started with your dot": https://learn.chatgpt.com/docs/dots/getting-started (read 2026-09-30)
- "Control your dot": https://learn.chatgpt.com/docs/dots/controls (read 2026-09-30)
- Help Center, "Getting started with your dot" and "Dots privacy, security, and safety FAQs" (help.openai.com, read 2026-09-30)
- "Introducing dots": https://openai.com/index/introducing-dots/ (dated 2026-09-29, read 2026-09-30)

---

## 1. Can you get it? Check this first

From "Meet dots", section Access (OpenAI, read 2026-09-30):

| Plan | Who gets dots |
|---|---|
| Pro | Users over 18 **outside** the European Economic Area, the United Kingdom and Switzerland |
| Business Premium | Rolling out worldwide |
| Enterprise | Rolling out worldwide. Off by default: a workspace administrator must enable it. OpenAI's launch post calls the Enterprise route a beta |

So if you are in the EU, Norway, Iceland, Liechtenstein, Switzerland or the UK on Pro, you will not see it for now. Business Premium, or an Enterprise workspace whose admin switched it on, is the route there.

"Rolling out gradually" also means you may not see dots yet even on an eligible plan.

Usage (same page): conversations with your dot don't count toward your ChatGPT usage limits; tasks it starts in Work or Codex count toward those products' limits as usual.

## 2. Set it up

From "Get started with your dot" (OpenAI, read 2026-09-30):

1. **Use a desktop.** Create your dot in the ChatGPT desktop app or in ChatGPT on a desktop browser. Mobile web is not supported; the mobile app can open the same dot later, once the supporting update is out.
2. **Open dots in ChatGPT and follow the introduction.**
3. **Connect apps** such as email, calendar and files, or skip this and add them later. Each plugin must be connected and permitted for the actions you ask for.
4. **In the desktop app, choose whether to connect your computer.** This makes local files, code and apps available. The computer has to stay online with the ChatGPT app open while your dot uses it.
5. **Name it.** It starts with a default name and look; change the name, shape, colour, eyes, glasses and accessories any time. Naming it updates its handle (OpenAI's example: a dot named Alfred becomes @tibo-alfred).
6. **Optional: add a contact method.** Open your dot's profile → Add, e.g. Slack. Connecting a messaging channel does not give it your inbox or other apps.

## 3. Set its four rules

Where (from "Control your dot"): after setup, open **Settings → Personalization**, and under **Permissions** select **Custom rules**. Select **Add**, describe the action, choose how your dot should handle it, then **Add rule**.

The four choices, in OpenAI's wording, with OpenAI's own one-line meaning:

| Rule | What it does |
|---|---|
| **Take action without asking** | Take the specified action without asking for approval. |
| **Take action when you say so** | Proceed when you explicitly request the action; otherwise ask immediately before acting. |
| **Ask before taking action** | Ask for approval before taking the specified action. |
| **Hand off to you** | Ask you to take the action instead. |

Note on rule 2: OpenAI's Help Center words the same tier as **"Take action if pre-approved"**, where "pre-approved" means you explicitly requested the action in your prompt. Same tier, two wordings.

OpenAI's own examples: **Ask before taking action** for sending messages to customers; **Hand off to you** for deleting shared project files.

Things worth knowing before you rely on them ("Control your dot"):
- Custom rules are optional. Start with clear instructions in the conversation; you don't need a rule for every approval.
- Asking your dot to draft replies does not give it permission to send them.
- Rules are "instructions your dot tries to follow, and it can make mistakes". They don't grant access to an app, don't override built-in safety requirements, and don't remove required confirmations such as using a saved login.
- Plugin permissions are separate from custom rules (a rule's menu → Open Plugins).
- If your workspace disables custom rules, saved rules don't apply.

## 4. What always stays with you

No rule can switch these off:
- **Changing a password.** "For example, you must change a password yourself." ("Control your dot")
- **Transferring money.** "The most sensitive actions like changing a password or transferring money require you to take over so you can complete them yourself." (Help Center, "Dots privacy, security, and safety FAQs")

When your dot hands a step to you, open its computer and select **Take over**; select **Return control** when you're done.

## 5. Stop it, or take it back

- **Pause** stops the current main task. It does not stop every delegated task or cancel scheduled runs.
- Stop a delegated task from **Activity**; disable or delete recurring work from **Scheduled**.
- Stopping work doesn't undo actions already completed. Deleting your dot doesn't undo changes in connected apps or recall messages already sent.

## 6. A first job

OpenAI's advice is to start with work you want it to keep track of, not a one-off request: describe what matters, share the sources, and say which decisions need you. A shape that follows that advice:

> Keep track of [the thing that keeps slipping]. Use [the emails / channel / files I connected]. Tell me when something needs my decision, and draft replies for my review, but don't send them.

Then close the chat and check tomorrow.

---

What the film shows, and what it doesn't: the Todd and Alfred scenes are OpenAI's own launch demos, not our use. Vektor is in Spain on Pro, where dots is not available (checked 2026-09-30).

the AI frontier, cut to what ships → @vektor.fm
