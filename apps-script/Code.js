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
 *
 * Every arrival on the live site also posts { kind: "visit" } (see /attr.js), one anonymous
 * row on the `visits` tab. The `sources` tab adds them up against sign-ups per link and app.
 */

const SHEET_ID = "1Jy7SUieIe0czsjNdIalHDSnUQ9BcJ-_izSGoxn1d2sw";
const SHEET = "leads";
// Anyone whose first name starts with "test" (e.g. "test", "testing test") gets routed
// here instead of `leads`, so QA runs never mix into real sign-ups.
const TEST_SHEET = "test";
const PHOTO_FOLDER = "datein5days / verification photos";

// "leave us a note" submissions ({ kind: "note" }) go to their own tab, one row per note.
// Notes starting with "test" go to NOTES_TEST_SHEET, same QA convention as sign-ups.
const NOTES_SHEET = "notes";
const NOTES_TEST_SHEET = "notes_test";
const NOTE_COLUMNS = ["created", "note", "contact", "page", "src", "note_id"];

// One row per arrival: which link (src), which app (via), which page. No id and no time of
// day, so a visit can't be tied back to a person. src starting with "test" or "claude-test"
// goes to VISITS_TEST_SHEET. SOURCES_SHEET is formulas only, totals per link and per app.
const VISITS_SHEET = "visits";
const VISITS_TEST_SHEET = "visits_test";
const VISIT_COLUMNS = ["day", "src", "via", "page"];
const SOURCES_SHEET = "sources";

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
  // Added 2026-09-25: the app or site the click came from (instagram, tiktok, whatsapp,
  // google ... or "none"), next to `src`, which says which of our links it was. Both are the
  // browser's first tagged visit, not the visit the form was sent on. Older rows stay blank.
  "via",
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
  // Visits skip the lock: they only ever append a row, and a burst of them (a story going up)
  // must never make a sign-up wait behind it, or time out.
  const visit = parseVisit_(e);
  if (visit) return json_(saveVisit_(visit));

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
    if (data.kind === "note") return json_(saveNote_(data));
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

/** append one "leave us a note" submission to the notes tab */
function saveNote_(d) {
  const note = String(d.note || "").trim().slice(0, 4000);
  if (!note) return { ok: false, error: "empty note" };
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const name = /^test\b/i.test(note) ? NOTES_TEST_SHEET : NOTES_SHEET;
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  const width = NOTE_COLUMNS.length;
  const header = sheet.getRange(1, 1, 1, width).getValues()[0];
  if (!NOTE_COLUMNS.every(function (c, i) { return header[i] === c; })) {
    sheet.getRange(1, 1, 1, width).setValues([NOTE_COLUMNS]).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  const row = {
    created: d.at || new Date().toISOString(),
    note: note,
    contact: String(d.contact || "").slice(0, 200),
    page: String(d.page || "").slice(0, 100),
    src: String(d.src || "").slice(0, 100),
    note_id: String(d.note_id || ""),
  };
  // free text from strangers: a leading = + - @ would otherwise run as a formula
  sheet.appendRow(NOTE_COLUMNS.map(function (c) { return /^[=+\-@]/.test(row[c]) ? "'" + row[c] : row[c]; }));
  return { ok: true, kind: "note" };
}

/** the body as a visit, or null for anything else (sign-ups and notes take the locked path) */
function parseVisit_(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    return data && data.kind === "visit" ? data : null;
  } catch (err) {
    return null;
  }
}

/** append one anonymous arrival to the visits tab */
function saveVisit_(d) {
  try {
    const src = cleanTag_(d.src) || "direct";
    const via = cleanTag_(d.via) || "none";
    const page = String(d.page || "").replace(/[^\w\/.-]/g, "").slice(0, 60);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const test = /^(claude-)?test/.test(src);
    const sheet = tab_(ss, test ? VISITS_TEST_SHEET : VISITS_SHEET, VISIT_COLUMNS);
    const day = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "yyyy-MM-dd");
    sheet.appendRow([day, src, via, page]);
    if (!test && !ss.getSheetByName(SOURCES_SHEET)) buildSources_(ss);
    return { ok: true, kind: "visit" };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

/** a tab with the given header row, created on first use */
function tab_(ss, name, columns) {
  const sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  const header = sheet.getRange(1, 1, 1, columns.length).getValues()[0];
  if (!columns.every(function (c, i) { return header[i] === c; })) {
    sheet.getRange(1, 1, 1, columns.length).setValues([columns]).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * The `sources` tab: three self-updating tables, each counting arrivals from `visits`, and
 * rsvps and finished questionnaires from `leads`, most rsvps first.
 *   A:D  per link (src), all platforms together
 *   F:J  per link and app (src + via): @maya on tiktok and @maya on instagram as two rows.
 *        Sign-ups from before `via` existed have none, so they only count in A:D.
 *   L:O  per app (via)
 * Formulas and totals only, never a name or an answer. Delete the tab and the next visit
 * rebuilds it.
 */
function buildSources_(ss) {
  tab_(ss, VISITS_SHEET, VISIT_COLUMNS);
  const sheet = ss.insertSheet(SOURCES_SHEET);
  const col = function (tab, columns, name) { const c = colLetter_(columns.indexOf(name) + 1); return tab + "!" + c + "2:" + c; };
  const vs = col(VISITS_SHEET, VISIT_COLUMNS, "src"), vv = col(VISITS_SHEET, VISIT_COLUMNS, "via");
  const ls = col(SHEET, COLUMNS, "src"), lv = col(SHEET, COLUMNS, "via"), stage = col(SHEET, COLUMNS, "stage");
  const finished = stage + ", \"poll_done\"";
  // one key column: each distinct value, then its visits, rsvps and finished
  const byOne = function (v, l) {
    return "=IFERROR(LET(keys, UNIQUE(FILTER(VSTACK(" + v + ", " + l + "), LEN(VSTACK(" + v + ", " + l + ")))), " +
      "SORT(HSTACK(keys, MAP(keys, LAMBDA(key, COUNTIF(" + v + ", key))), MAP(keys, LAMBDA(key, COUNTIF(" + l + ", key))), " +
      "MAP(keys, LAMBDA(key, COUNTIFS(" + l + ", key, " + finished + ")))), 3, FALSE, 2, FALSE)), \"\")";
  };
  // two key columns: each distinct (src, via) pair
  const byPair = "=IFERROR(LET(pairs, UNIQUE(FILTER(VSTACK(HSTACK(" + vs + ", " + vv + "), HSTACK(" + ls + ", " + lv + ")), " +
    "LEN(VSTACK(" + vs + ", " + ls + ")) * LEN(VSTACK(" + vv + ", " + lv + ")))), " +
    "links, CHOOSECOLS(pairs, 1), apps, CHOOSECOLS(pairs, 2), " +
    "SORT(HSTACK(pairs, MAP(links, apps, LAMBDA(link, app, COUNTIFS(" + vs + ", link, " + vv + ", app))), " +
    "MAP(links, apps, LAMBDA(link, app, COUNTIFS(" + ls + ", link, " + lv + ", app))), " +
    "MAP(links, apps, LAMBDA(link, app, COUNTIFS(" + ls + ", link, " + lv + ", app, " + finished + ")))), 4, FALSE, 3, FALSE)), \"\")";
  sheet.getRange("A1:D1").setValues([["src", "visits", "rsvps", "finished"]]);
  sheet.getRange("F1:J1").setValues([["src", "via", "visits", "rsvps", "finished"]]);
  sheet.getRange("L1:O1").setValues([["via", "visits", "rsvps", "finished"]]);
  sheet.getRange("A1:O1").setFontWeight("bold");
  sheet.setFrozenRows(1);
  sheet.getRange("A2").setFormula(byOne(vs, ls));
  sheet.getRange("F2").setFormula(byPair);
  sheet.getRange("L2").setFormula(byOne(vv, lv));
  sheet.getRange("A1").setNote("src: which of our links they used (/ig, /tt, /qr, /@maya). direct = the bare link.\n" +
    "via: the app the click came from. none = a text, a QR scan or a typed address.\n" +
    "A:D per link. F:J per link and app, so @maya on tiktok and on instagram. L:O per app.\n" +
    "visits counts arrivals, rsvps sign-ups, finished the ones who answered all seven.");
}

/** 1 -> A, 27 -> AA */
function colLetter_(n) {
  let s = "";
  for (; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + (n - 1) % 26) + s;
  return s;
}

/** a link tag or app name, same rule as attr.js: lowercase a-z 0-9 . _ - and one leading @ */
function cleanTag_(v) {
  return String(v || "").toLowerCase().replace(/[^a-z0-9@._-]/g, "").replace(/^[._-]+/, "").replace(/(?!^)@/g, "").slice(0, 40);
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
  out.src = cleanTag_(d.src);
  if (d.via) out.via = cleanTag_(d.via);
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
  const ss = SpreadsheetApp.openById(SHEET_ID);
  if (!ss.getSheetByName(SOURCES_SHEET)) buildSources_(ss);
  Logger.log("Ready. Tabs: " + sheet.getName() + ", " + test.getName() + ", " + VISITS_SHEET + ", " + SOURCES_SHEET + " (columns: " + COLUMNS.length + ")");
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