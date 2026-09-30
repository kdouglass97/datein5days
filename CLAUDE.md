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
