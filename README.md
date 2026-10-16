# five days / datein5days

A dating experiment, not a dating app. Kai and Ruby hand-match people in small cohorts and plan the date for them, start to finish, within five days. No algorithm: the humans do the matching.

This repo is the website: a landing page with the RSVP form and seven-question questionnaire, plus a few supporting pages and a team dashboard.

**Read `context.md` before changing anything.** It explains what the product is, who it's for, the voice, the design language, and the landmines. `CLAUDE.md` has the shipping workflow.

## Stack

- Static HTML, CSS and JS. No build step, no framework, no bundler, on purpose.
- Hosted on Vercel. Every push to a `claude/` branch gets a preview; merging to `main` deploys to production.
- The form posts to a Google Apps Script web app, which writes to a Google Sheet.
- PostHog for analytics.

## What's where

| Path | What it is |
| --- | --- |
| `index.html` | The landing page, form and questionnaire. Site settings live in its `CONFIG` object. |
| `why.html`, `faq.html`, `involved.html`, `privacy.html`, `404.html` | Supporting pages |
| `admin.html` | Team dashboard over the sign-ups (password only) |
| `attr.js` | Records where each visitor came from |
| `note.js` | The "leave us a note" sheet |
| `vercel.json` | Redirects, rewrites and security headers |
| `.vercelignore` | Deploy allowlist: only files listed here reach the site |
| `apps-script/` | The form backend (Google Apps Script), deployed by a workflow |
| `share/` | Source for the share card and icon images; `share/posts/` holds the Haven posts |
| `.claude/skills/haven-post/` | How a Haven post gets made, for whichever tool is making it |
| `.github/workflows/` | Auto-ship, Apps Script deploy, and leak check |

## URLs

- `/` and the printed QR code redirect to `/c/01`, the current cohort's page.
- `/why`, `/faq`, `/involved`, `/privacy` and `/admin` are the other pages.
- `/ig`, `/tt`, `/qr`, `/invite` and `/@name` are tracking links that land on `/c/01`.

Redirects are temporary (307) on purpose, so the printed QR code can point at a future cohort.

## Working on it

1. Branch off `main` onto your own `claude/` branch. Never push to `main`.
2. Edit the files directly. Prefer changing `CONFIG` over changing markup.
3. If you add a file the site serves, add it to `.vercelignore` or it will 404 in production.
4. Push and check the preview. After any form change, walk the whole flow, with the Apps Script and PostHog calls stubbed so no test rows get written.
5. To ship, open a PR to `main`. The auto-ship Action merges it.

After a deploy, check that `/c/01` returns 200 and `/context.md` returns 404.

## Data

The form is live and the sign-up sheet holds real people's answers. Never bulk-delete from it, and don't test against the live backend.
