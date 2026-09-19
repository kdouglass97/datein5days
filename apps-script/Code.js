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
 */

const SHEET_ID = "1Jy7SUieIe0czsjNdIalHDSnUQ9BcJ-_izSGoxn1d2sw";
const SHEET = "leads";
const PHOTO_FOLDER = "datein5days / verification photos";

const COLUMNS = [
  "id", "created", "updated", "stage", "src", "cohort",
  "name", "email", "cities", "looking",
  "verify", "instagram", "photo", "photo_check", "verified_by_us",
  "age", "meet", "price", "consent",
  "adds_most", "adds_also",
  "q1_relationship_adds", "q2_wednesday", "q3_friendships", "q4_sharing_life",
  "q5_cared_for", "q6_not_done_yet", "q7_spoke_up_sooner",
];

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

    const sheet = getSheet_();
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

function getSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET);
  if (!sheet) sheet = ss.insertSheet(SHEET);

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

  if (d.adds_most) out.adds_most = d.adds_most;
  if (d.adds_also) out.adds_also = d.adds_also;

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
      if (incoming === undefined || incoming === "") return existing[i];
      return incoming;
    });
    sheet.getRange(target, 1, 1, width).setValues([merged]);
  } else {
    row.created = row.updated;
    const fresh = COLUMNS.map(function (col) {
      return row[col] === undefined ? "" : row[col];
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
  const sheet = getSheet_();
  Logger.log("Ready. Tab: " + sheet.getName() + ", columns: " + COLUMNS.length);
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