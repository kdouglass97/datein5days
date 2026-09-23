/**
 * datein5days: lead + questionnaire collector
 * Deploy: Deploy > New deployment > Web app
 *   Execute as:  Me
 *   Who has access:  Anyone
 *
 * This script is deployed from GitHub via .github/workflows/apps-script.yml.
 * Edits made directly in the Apps Script editor will be overwritten.
 *
 * Poll answers are mapped by the `key` each question sends, NOT by position,
 * so reordering CONFIG.poll in index.html can never scramble the columns again.
 *
 * Sign-ups whose first name starts with "test" write to the `test` tab instead of
 * `leads`, so QA runs never mix into real sign-up data. See targetSheetName_().
 */

const SHEET_ID = "1Jy7SUieIe0czsjNdIalHDSnUQ9BcJ-_izSGoxn1d2sw";
const SHEET = "leads";
// Anyone whose first name starts with "test" (e.g. "test", "testing test") gets routed
// here instead of `leads`, so QA runs never mix into real sign-ups.
const TEST_SHEET = "test";
const PHOTO_FOLDER = "datein5days / verification photos";

const COLUMNS = [
  "id", "created", "updated", "stage", "src", "cohort",
  "name", "email", "cities", "looking",
  "verify", "instagram", "photo", "photo_check", "verified_by_us",
  "age", "meet", "price", "consent",
  "adds_most", "adds_also",
  "q1_relationship_adds", "q2_wednesday", "q3_friendships", "q4_sharing_life",
  "q5_cared_for", "q6_not_done_yet", "q7_spoke_up_sooner",
  // Added 2026-09-19 for the split consent checkboxes (18+, sensitive-data, marketing).
  // Appended at the end on purpose: getSheet_() only rewrites the header row when COLUMNS
  // changes, not the data beneath it, so inserting these anywhere but the end would
  // misalign every existing row's data under the wrong headers.
  // Rows from before this date have only `consent` filled in; that's expected, not a bug -
  // they never had the chance to grant these, so leave them blank rather than backfilling.
  "sensitive_consent", "marketing_consent",
  // Added 2026-09-20 when relationship_adds became a two-step most/least picker (5 options)
  // instead of choose-up-to-2-then-pick-top-one. adds_most/adds_also above are now frozen:
  // the page no longer sends them, but existing rows keep their data. Appended at the end
  // for the same reason as sensitive_consent/marketing_consent - inserting mid-row would
  // misalign every existing row under the wrong headers.
  "want_most", "could_skip",
  // Added 2026-09-23: the full drag-to-rank order for relationship_adds, not just its two ends.
  // want_ranking is the whole list, most wanted first. rank_<option> is that option's
  // position (1 = want most, 5 = could skip) so the cohort can be sorted/averaged per option.
  // Appended at the end for the same header-alignment reason as above. Older rows stay blank.
  "want_ranking",
  "rank_chemistry", "rank_ease", "rank_play", "rank_ambition", "rank_building",
  // Added 2026-09-23: a contact channel for everyone, not just the photo path.
  // phone is E.164 ("+12125550100"); reach_on is where they'd rather get it:
  // imessage | whatsapp | sms. Appended at the end for the same header-alignment reason.
  "phone", "reach_on",
];

/** columns Sheets must keep as text: "+1212..." would otherwise be coerced to a number */
const TEXT_COLUMNS = ["phone"];

/** option keys for the relationship_adds ranking, one rank_<key> column each */
const RANK_OPTIONS = ["chemistry", "ease", "play", "ambition", "building"];

/** question key (sent by the page) -> column name. Add a row here when you add a question. */
const POLL_MAP = {
  relationship_adds: "q1_relationship_adds",
  wednesday:         "q2_wednesday",
  friendships:       "q3_friendships",
  sharing_life:      "q4_sharing_life",
  cared_for:         "q5_cared_for",
  not_done_yet:      "q6_not_done_yet",
  spoke_up_sooner:   "q7_spoke_up_sooner",
};

/* ------------------------------------------------------------------ */

function doGet() {
  return json_({ ok: true, service: "datein5days", columns: COLUMNS.length });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (err) {
    return json_({ ok: false, error: "busy" });
  }
  try {
    const body = e && e.postData && e.postData.contents;
    if (!body) return json_({ ok: false, error: "empty" });

    const data = JSON.parse(body);
    if (!data.id) return json_({ ok: false, error: "no id" });

    const sheet = getSheet_(targetSheetName_(data));
    const row = buildRow_(data);
    upsert_(sheet, row);

    return json_({ ok: true, id: data.id, stage: row.stage || "" });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/* ------------------------------------------------------------------ */

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_(name) {
  const sheetName = name || SHEET;
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);

  // make sure the header row exists and matches COLUMNS exactly
  const width = COLUMNS.length;
  const header = sheet.getRange(1, 1, 1, width).getValues()[0];
  const same = header.length === width && COLUMNS.every((c, i) => header[i] === c);
  if (!same) {
    sheet.getRange(1, 1, 1, width).setValues([COLUMNS]);
    sheet.getRange(1, 1, 1, width).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** true when the submitted first name marks this as test traffic, e.g. "test" or "testing test" */
function isTestName_(name) {
  return /^test\b/i.test(String(name || "").trim());
}

/**
 * Which tab a row belongs on. An id already seen on one tab stays there for every later
 * stage update, even if that update doesn't resend `name` - otherwise a partial upsert
 * could split one person's answers across both sheets.
 */
function targetSheetName_(data) {
  return findExistingSheet_(data.id) || (isTestName_(data.name) ? TEST_SHEET : SHEET);
}

function findExistingSheet_(id) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const names = [SHEET, TEST_SHEET];
  for (let n = 0; n < names.length; n++) {
    const sheet = ss.getSheetByName(names[n]);
    if (!sheet) continue;
    const last = sheet.getLastRow();
    if (last < 2) continue;
    const ids = sheet.getRange(2, 1, last - 1, 1).getValues();
    for (let i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) === String(id)) return names[n];
    }
  }
  return null;
}

/** flatten whatever the page sent into a { columnName: value } object */
function buildRow_(d) {
  const out = {};

  out.id = String(d.id);
  out.updated = d.at || new Date().toISOString();
  out.stage = d.stage || "";
  out.src = d.src || "";
  out.cohort = d.cohort || "";

  if (d.name) out.name = d.name;
  if (d.email) out.email = d.email;
  if (d.cities) out.cities = join_(d.cities);
  // `looking` is a rank-ordered list (most wanted first), not a subset of picks.
  // join_ preserves the order the page sends it in.
  if (d.looking) out.looking = join_(d.looking);

  if (d.verify) out.verify = d.verify;
  if (d.instagram) out.instagram = d.instagram;
  if (d.photo_check) out.photo_check = d.photo_check;

  if (d.age) out.age = d.age;
  if (d.meet) out.meet = d.meet;
  if (d.price !== undefined && d.price !== "") out.price = String(d.price);
  if (d.consent !== undefined && d.consent !== "") out.consent = d.consent ? "yes" : "";
  if (d.sensitive_consent !== undefined && d.sensitive_consent !== "") out.sensitive_consent = d.sensitive_consent ? "yes" : "";
  if (d.marketing_consent !== undefined && d.marketing_consent !== "") out.marketing_consent = d.marketing_consent ? "yes" : "no";

  // adds_most/adds_also are frozen (see COLUMNS comment) - the page stops sending them,
  // this stays only so a stray older payload can't write into the wrong column.
  if (d.phone) out.phone = String(d.phone);
  if (d.reach_on) out.reach_on = d.reach_on;

  if (d.want_most) out.want_most = d.want_most;
  if (d.could_skip) out.could_skip = d.could_skip;
  if (Array.isArray(d.want_ranking) && d.want_ranking.length) {
    out.want_ranking = join_(d.want_ranking);
    RANK_OPTIONS.forEach(function (k) {
      const pos = d.want_ranking.indexOf(k);
      if (pos > -1) out["rank_" + k] = pos + 1;
    });
  }

  // photo: base64 data URL -> Drive file, store the link only
  if (d.photo && String(d.photo).indexOf("data:image/") === 0) {
    const url = savePhoto_(d.photo, d.name, d.id);
    if (url) out.photo = url;
  } else if (d.photo) {
    out.photo = d.photo; // already a link
  }

  // poll answers, mapped by key.
  // Falls back to position for older page versions that send no `key`,
  // so an out-of-sync page can never silently drop answers.
  if (Array.isArray(d.poll)) {
    const ordered = COLUMNS.filter(function (c) { return /^q\d_/.test(c); });
    d.poll.forEach(function (item, i) {
      if (!item || !item.a) return;
      const col = (item.key && POLL_MAP[item.key]) || ordered[i];
      if (col) out[col] = item.a;
    });
  }

  return out;
}

/** a leading apostrophe makes Sheets store the value as text instead of parsing it */
function asText_(col, v) {
  if (TEXT_COLUMNS.indexOf(col) === -1 || v === "" || v === undefined) return v;
  return "'" + String(v).replace(/^'/, "");
}

function join_(v) {
  return Array.isArray(v) ? v.filter(String).join(", ") : String(v);
}

/** write the row, merging into an existing one when the id is already present */
function upsert_(sheet, row) {
  const width = COLUMNS.length;
  const last = sheet.getLastRow();
  let target = 0;

  if (last > 1) {
    const ids = sheet.getRange(2, 1, last - 1, 1).getValues();
    for (let i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) === row.id) { target = i + 2; break; }
    }
  }

  if (target) {
    const existing = sheet.getRange(target, 1, 1, width).getValues()[0];
    const merged = COLUMNS.map(function (col, i) {
      const incoming = row[col];
      // never blank out something we already have
      // existing values are re-written too, so text columns need re-protecting every time
      if (incoming === undefined || incoming === "") return asText_(col, existing[i]);
      return asText_(col, incoming);
    });
    sheet.getRange(target, 1, 1, width).setValues([merged]);
  } else {
    row.created = row.updated;
    const fresh = COLUMNS.map(function (col) {
      return row[col] === undefined ? "" : asText_(col, row[col]);
    });
    sheet.appendRow(fresh);
  }
}

function savePhoto_(dataUrl, name, id) {
  try {
    const match = /^data:(image\/[a-z]+);base64,(.+)$/.exec(dataUrl);
    if (!match) return "";
    const folders = DriveApp.getFoldersByName(PHOTO_FOLDER);
    const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(PHOTO_FOLDER);
    const safe = String(name || "guest").replace(/[^a-zA-Z0-9]/g, "") || "guest";
    const blob = Utilities.newBlob(
      Utilities.base64Decode(match[2]),
      match[1],
      safe + "-" + id + ".jpg"
    );
    return folder.createFile(blob).getUrl();
  } catch (err) {
    return "error: " + String(err);
  }
}

/* ------------------------------------------------------------------ */
/* Run this once from the editor after pasting, to create/fix the tab.  */

function setup() {
  const sheet = getSheet_(SHEET);
  const test = getSheet_(TEST_SHEET);
  Logger.log("Ready. Tabs: " + sheet.getName() + ", " + test.getName() + " (columns: " + COLUMNS.length + ")");
}

/**
 * Deletes ONLY rows whose `src` column is exactly "claude-test".
 * Real sign-ups are never touched. There is deliberately no bulk-wipe function
 * in this file: the leads tab contains live data.
 */
function deleteTestRowsOnly() {
  const sheet = getSheet_();
  const last = sheet.getLastRow();
  if (last < 2) return;
  const srcCol = COLUMNS.indexOf("src") + 1;
  const vals = sheet.getRange(2, srcCol, last - 1, 1).getValues();
  let removed = 0;
  for (let i = vals.length - 1; i >= 0; i--) {
    if (String(vals[i][0]).trim() === "claude-test") {
      sheet.deleteRow(i + 2);
      removed++;
    }
  }
  Logger.log("Removed " + removed + " test row(s). Real sign-ups untouched.");
}