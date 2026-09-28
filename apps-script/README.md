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

## Dashboard

`/count` on the site (`count.html`) is the founders' dashboard. It reads
`GET <exec url>?view=stats&key=…`, which returns totals only: counts per answer, split into
everyone and those who answered all seven, plus medians and hourly sign-up counts. Never a
name, an answer, a handle or a row. See `stats_()` and `tally_()`.

- The key is cell **A2 of the `key` tab**. The tab and a random key appear the first time
  anything asks for stats (or when `setup()` runs). Whoever can open the Sheet can open the
  dashboard: paste A2 into `/count` once per device.
- To change it, clear A2 (a new key appears on the next ask) or type your own, 12 characters
  or more. Every device then has to paste the new one.
- `&tab=test` counts the `test` tab instead, so a QA sign-up can be watched end to end.
- Skipped, same as everywhere: `src=claude-test`, first names starting with the word "test",
  and rows without a readable `created`.
- Reading only. The one write is the key, into the `key` tab. No new OAuth scopes: it uses
  SpreadsheetApp and Utilities, which the script already had.
