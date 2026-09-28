# apps-script

The Google Apps Script bound to the `cohort1-data` Sheet. It receives RSVPs from the landing page.

- **Edit here, not in the Apps Script editor.** Every merge to `main` that touches this folder
  runs `.github/workflows/apps-script.yml`. The workflow pushes the code and moves the live web app to the new version.
  The `/exec` URL stays the same.
- Edits made directly in the browser editor get **overwritten** on the next deploy.
- Credentials are stored in the repo secret `CLASPRC_JSON` (clasp login, ktd283@nyu.edu).
- To redeploy without a code change: Actions → Deploy Apps Script → Run workflow.

## Notes tab

"leave us a note" (`note.js`, footer and FAQ on the site) posts `{ kind: "note", ... }` to the same
web app. Each note is appended as its own row on the `notes` tab: `created, note, contact, page, src,
note_id`. Notes starting with "test" go to `notes_test`. The tab is created on the first note.
Notes carry no `id`, so a script version from before this change rejects them rather than writing
them into `leads`.

## Sources tab

The first real sign-up builds the `sources` tab: three self-updating tables counting rsvps and
finished questionnaires per link (`src`), per link and app (`@maya` on `tiktok` and on
`instagram` as two rows), and per app (`via`). It's formulas only. Delete it and the next
sign-up rebuilds it. Visits aren't counted in the sheet; that's PostHog's job.

## Dashboard (/admin)

`/admin` on the site (`admin.html`) is the team dashboard. It isn't linked from anywhere and
isn't indexed. It asks this script for totals with a POST, `{ kind: "stats", password }`, and
gets counts only: every answer split into everyone and those who answered all seven, medians,
and sign-ups per hour. Never a name, an answer, a handle or a row. See `stats_()` and `tally_()`.
It also crosses answers (city × age, city × who they'd like to meet, age × who they'd like to
meet, and that last one for New York alone), worked out separately for everyone and for those
who answered all seven. A city needs 3 people in a view for its own row; smaller ones share
"elsewhere", which also waits for 3. See `crosses_()`.

- The password is the **`ADMIN_PASSWORD` repo secret** (GitHub: Settings → Secrets and
  variables → Actions). The deploy writes it into `secret.js` just before `clasp push`, so it
  lives in the Apps Script project and GitHub's secret store, never in the repo or the Sheet.
  `secret.js` is in `.gitignore`. 8 characters or more; unset or shorter, `/admin` stays locked.
- To change it: update the secret, then Actions → Deploy Apps Script → Run workflow. The
  automatic runs skip when `apps-script/` hasn't changed, and a secret change doesn't change it.
- A device types the password once and keeps a token derived from it (an HMAC), never the
  password. A new password signs every device out.
- The ask is a POST so the password never sits in a URL. It's answered before the sign-up
  lock, checks the password before it opens the Sheet, and writes nothing, so it can't slow
  an rsvp down. GET still only answers the health check.
- `tab: "test"` (`/admin?tab=test`) counts the `test` tab, so a QA sign-up can be watched end
  to end.
- Skipped, same as everywhere: `src=claude-test`, first names starting with the word "test",
  and rows without a readable `created`.
- No new OAuth scopes: SpreadsheetApp and Utilities, which the script already used.
