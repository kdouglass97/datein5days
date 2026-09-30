## Read context.md first (always)
- Before any change, read `context.md` at the repo root. It holds what the product is, who it's for, and why each piece works the way it does.
- Copy or tone change: follow §4 "Voice and copy". Visual change: follow §5 "Design language".
- If this file and `context.md` disagree, this file wins on how to ship.

## Shipping workflow (always follow)
- Work only on your own claude/ branch. Never push to main.
- Push after each meaningful change so a preview deploy builds. Share the preview link if you can find it.
- After every UI or copy change, reply with just the preview link and screenshots (desktop ~1440px and mobile ~390px) of the changed section. Keep commentary to a line or two. If the preview link can't be found, say so in one line and still send the screenshots.
- When I say "ship it":
  1. git fetch origin && git merge origin/main   (merge, not rebase, no force-push)
  2. Resolve conflicts yourself, keeping the intent of both sides
  3. Run the build if the project has one, and fix what breaks
  4. Push, then open a PR to main. A GitHub Action merges it automatically.
- If the auto-merge fails due to a conflict, repeat steps 1-4.
- Only ask me when a conflict needs a real product decision.
