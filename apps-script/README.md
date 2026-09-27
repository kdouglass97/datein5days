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
