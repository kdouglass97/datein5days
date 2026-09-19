# apps-script

The Google Apps Script bound to the `cohort1-data` Sheet. It receives RSVPs from the landing page.

- **Edit here, not in the Apps Script editor.** Every merge to `main` that touches this folder
  runs `.github/workflows/apps-script.yml`. The workflow pushes the code and moves the live web app to the new version.
  The `/exec` URL stays the same.
- Edits made directly in the browser editor get **overwritten** on the next deploy.
- Credentials are stored in the repo secret `CLASPRC_JSON` (clasp login, ktd283@nyu.edu).
- To redeploy without a code change: Actions → Deploy Apps Script → Run workflow.
