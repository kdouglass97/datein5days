## Read context.md first (always)
- Before any change, read `context.md` at the repo root. It holds what the product is, who it's for, and why each piece works the way it does.
- Copy or tone change: follow §4 "Voice and copy". Visual change: follow §5 "Design language". Haven, the pigeon: §5 "Haven".
- If this file and `context.md` disagree, this file wins on how to ship.

## Who you're working for
- Two founders push here, Kai and Ruby, each from their own sessions. "I" and "me" below mean whoever is in this session.
- Never push to, merge into or rebase someone else's open branch.

## The repo is public (always)
- Everything committed is public for good, history included: files, commit messages, PR titles.
- Never commit keys, tokens or passwords. They live in GitHub's secret store or the Apps Script project.
- Never put anything from the sheet or about a real sign-up (names, numbers, handles, answers, photos) in a file, a commit message or a PR title. Test data is made up.

## Shipping workflow (always follow)
- Work only on your own claude/ branch. Never push to main.
- Push after each meaningful change so a preview deploy builds. Share the preview link if you can find it.
- After every UI or copy change, reply with just the preview link and screenshots (desktop ~1440px and mobile ~390px) of the changed section. Keep commentary to a line or two. If the preview link can't be found, or it asks for a Vercel login, say so in one line and still send screenshots taken from a local copy.
- When I say "ship it":
  1. git fetch origin && git merge origin/main   (merge, not rebase, no force-push)
  2. Resolve conflicts yourself, keeping the intent of both sides
  3. Run the build if the project has one, and fix what breaks
  4. Check the whole diff against `context.md` before the PR: copy against §4, visuals against §5 ("the printed form or the hand?"), and nothing private in it (above). Fix what breaks them.
  5. Push, then open a PR to main. In the PR description, say who asked for the change and what step 4 checked. A GitHub Action merges it automatically.
- If the auto-merge fails due to a conflict, repeat steps 1-5.
- Only ask me when a conflict needs a real product decision.
