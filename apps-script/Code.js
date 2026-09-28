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
 * The `sources` tab totals sign-ups per link (src) and app (via). See buildSources_().
 * Visits are counted in PostHog, never here.
 *
 * POST { kind: "stats", password } feeds the team dashboard (/admin on the site): totals
 * only, never a name, an answer or a handle. The password comes from the ADMIN_PASSWORD
 * secret in GitHub, which the deploy writes into secret.js. See stats_().
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

// Formulas only: sign-ups totalled per link and per app. See buildSources_().
const SOURCES_SHEET = "sources";

// A dashboard password shorter than this never opens anything. See adminPassword_().
const ADMIN_MIN_LENGTH = 8;

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
  // google ... or "none"), next to `src`, which says which of our links it was. Both come from
  // the last of our links the browser clicked, not the visit the form was sent on. Older rows stay blank.
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
  // the /admin dashboard asking for totals: read-only, so it never waits on the sign-up lock
  const ask = statsAsk_(e && e.postData && e.postData.contents);
  if (ask) return json_(stats_(ask));

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
    if (sheet.getName() === SHEET) ensureSources_(sheet.getParent());

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

/** builds the `sources` tab when it's missing, without ever letting it fail a sign-up */
function ensureSources_(ss) {
  try {
    if (!ss.getSheetByName(SOURCES_SHEET)) buildSources_(ss);
  } catch (err) {
    console.error("sources tab: " + err);
  }
}

/**
 * The `sources` tab: sign-ups totalled three ways, most rsvps first.
 *   A:C  per link (src), all platforms together
 *   E:H  per link and app (src + via): @maya on tiktok and @maya on instagram as two rows.
 *        Sign-ups from before `via` existed have none, so they only count in A:C.
 *   J:L  per app (via)
 * Formulas and totals only, never a name or an answer. Delete the tab and the next sign-up
 * rebuilds it.
 */
function buildSources_(ss) {
  const sheet = ss.insertSheet(SOURCES_SHEET);
  const col = function (name) { const c = colLetter_(COLUMNS.indexOf(name) + 1); return SHEET + "!" + c + "2:" + c; };
  const src = col("src"), via = col("via"), finished = col("stage") + ", \"poll_done\"";
  // one key column: each distinct value, then its rsvps and finished
  const byOne = function (r) {
    return "=IFERROR(LET(keys, UNIQUE(FILTER(" + r + ", LEN(" + r + "))), " +
      "SORT(HSTACK(keys, MAP(keys, LAMBDA(key, COUNTIF(" + r + ", key))), " +
      "MAP(keys, LAMBDA(key, COUNTIFS(" + r + ", key, " + finished + ")))), 2, FALSE, 3, FALSE)), \"\")";
  };
  // two key columns: each distinct (src, via) pair
  const byPair = "=IFERROR(LET(pairs, UNIQUE(FILTER(HSTACK(" + src + ", " + via + "), LEN(" + src + ") * LEN(" + via + "))), " +
    "links, CHOOSECOLS(pairs, 1), apps, CHOOSECOLS(pairs, 2), " +
    "SORT(HSTACK(pairs, MAP(links, apps, LAMBDA(link, app, COUNTIFS(" + src + ", link, " + via + ", app))), " +
    "MAP(links, apps, LAMBDA(link, app, COUNTIFS(" + src + ", link, " + via + ", app, " + finished + ")))), 3, FALSE, 4, FALSE)), \"\")";
  sheet.getRange("A1:C1").setValues([["src", "rsvps", "finished"]]);
  sheet.getRange("E1:H1").setValues([["src", "via", "rsvps", "finished"]]);
  sheet.getRange("J1:L1").setValues([["via", "rsvps", "finished"]]);
  sheet.getRange("A1:L1").setFontWeight("bold");
  sheet.setFrozenRows(1);
  sheet.getRange("A2").setFormula(byOne(src));
  sheet.getRange("E2").setFormula(byPair);
  sheet.getRange("J2").setFormula(byOne(via));
  sheet.getRange("A1").setNote("src: which of our links they used (/ig, /tt, /qr, /invite, /@maya). direct = found us on their own.\n" +
    "via: the app the click came from. none = a text, a QR scan or a typed address.\n" +
    "A:C per link. E:H per link and app, so @maya on tiktok and on instagram. J:L per app.\n" +
    "rsvps counts sign-ups, finished the ones who answered all seven. Visits live in PostHog.");
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
/* The dashboard: totals only.                                          */

/** stage -> how far in: 0 rsvp, 1 details, 2..7 answered q1..q6, 8 answered all seven */
const STAGE_LEVEL = { rsvp: 0, details: 1, q1: 2, q2: 3, q3: 4, q4: 5, q5: 6, q6: 7, poll_done: 8 };

/** the order both ranked lists start in on the page. A ranking that still reads this way may never have been dragged. */
const LOOKING_START = ["date", "relationship", "friends", "community"];

/** the written answers, summed into "words written" */
const TEXT_ANSWERS = ["q2_wednesday", "q3_friendships", "q5_cared_for", "q6_not_done_yet", "q7_spoke_up_sooner"];

/** word-count buckets: under 50, 50-99, 100-149, 150-199, 200-299, 300-499, 500+ */
const WORD_EDGES = [50, 100, 150, 200, 300, 500];

/** the dashboard's { kind: "stats", password | token, tab } from a POST body, null for anything else */
function statsAsk_(body) {
  if (!body) return null;
  try {
    const d = JSON.parse(body);
    return d && d.kind === "stats" ? d : null;
  } catch (err) {
    return null; // not ours: the sign-up path below reports it as it always has
  }
}

/**
 * What /admin shows. It opens with the password (typed once per device) or the token the
 * page keeps instead of it; anything else gets "locked" and nothing more. A new password
 * retires every token. Reading only: it never writes to the Sheet.
 */
function stats_(ask) {
  try {
    const real = adminPassword_();
    const token = adminToken_(real);
    const password = String(ask.password || "").trim();
    const opened = real.length >= ADMIN_MIN_LENGTH && (password ? password === real : String(ask.token || "") === token);
    if (!opened) return { ok: false, error: "locked" };
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const tab = ask.tab === "test" ? TEST_SHEET : SHEET;
    const sheet = ss.getSheetByName(tab);
    const values = sheet && sheet.getLastRow() > 1 ? sheet.getDataRange().getValues() : [];
    const notes = ss.getSheetByName(tab === TEST_SHEET ? NOTES_TEST_SHEET : NOTES_SHEET);
    const out = tally_(values, new Date());
    out.tab = tab;
    out.token = token;
    out.notes = notes ? Math.max(0, notes.getLastRow() - 1) : 0;
    return out;
  } catch (err) {
    console.error("stats: " + err);
    return { ok: false, error: "unavailable" };
  }
}

/**
 * The password: ADMIN_PASSWORD_SECRET, which only exists in secret.js, a file the deploy
 * writes from the ADMIN_PASSWORD secret in GitHub (.github/workflows/apps-script.yml). It is
 * never in the repo. Unset or under ADMIN_MIN_LENGTH, /admin stays locked.
 */
function adminPassword_() {
  return typeof ADMIN_PASSWORD_SECRET === "string" ? ADMIN_PASSWORD_SECRET.trim() : "";
}

/** what a device keeps instead of the password: an HMAC of it, so the password itself is never stored */
function adminToken_(password) {
  return Utilities.computeHmacSha256Signature("five days admin", password)
    .map(function (b) { return ((b + 256) % 256).toString(16).padStart(2, "0"); }).join("");
}

/**
 * Totals from a tab's values (header row first). Counts, shares and medians only: nothing
 * returned is a name, an answer, a handle or a row. Skips claude-test rows, "test…" names
 * and rows without a readable `created` (the one corrupted row).
 */
function tally_(values, now) {
  const head = values[0] || [];
  const col = {};
  COLUMNS.forEach(function (c) { col[c] = head.indexOf(c); });
  const out = {
    ok: true, v: 1, at: now.toISOString(), rows: 0, skipped: 0,
    reached: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    hours: {}, last: { rsvp: "", done: "" },
    // every breakdown is { value: [everyone, finished all seven] }
    age: {}, meet: {}, price: {}, cities: {}, src: {}, via: {}, verify: {}, reach: {},
    looking: { first: {}, rank: {}, n: 0, untouched: 0 },
    want: { first: {}, last: {}, rank: {}, n: 0, untouched: 0 },
    sharing: { bins: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], n: 0, at50: 0, median: null },
    words: { bins: [0, 0, 0, 0, 0, 0, 0], n: 0, median: null },
  };
  const lookSum = {}, wantSum = {}, shares = [], words = [], people = [];

  for (let r = 1; r < values.length; r++) {
    const row = values[r];
    const cell = function (c) { return col[c] < 0 ? "" : row[col[c]]; };
    const text = function (c) { return String(cell(c) === null ? "" : cell(c)).trim(); };
    if (!text("id")) continue;
    const created = toDate_(cell("created"));
    if (!created || text("src") === "claude-test" || isTestName_(text("name"))) { out.skipped++; continue; }
    out.rows++;

    const level = STAGE_LEVEL[text("stage")] || 0;
    const done = level === 8;
    for (let k = 0; k <= level; k++) out.reached[k]++;

    bump_(out.hours, hourKey_(created), 0);
    if (created.toISOString() > out.last.rsvp) out.last.rsvp = created.toISOString();
    if (done) {
      const finished = toDate_(cell("updated")) || created;
      bump_(out.hours, hourKey_(finished), 1);
      if (finished.toISOString() > out.last.done) out.last.done = finished.toISOString();
    }

    count_(out.age, text("age"), done);
    count_(out.meet, text("meet"), done);
    count_(out.price, text("price"), done);
    count_(out.src, text("src") || "unknown", done);
    count_(out.via, text("via"), done);
    count_(out.verify, text("verify"), done);
    count_(out.reach, text("reach_on"), done);

    // `looking`: only full rankings of all four count, never an older partial pick
    const looking = text("looking").split(",").map(function (s) { return s.trim(); }).filter(String);
    if (looking.length === LOOKING_START.length && LOOKING_START.every(function (k) { return looking.indexOf(k) > -1; })) {
      out.looking.n++;
      count_(out.looking.first, looking[0], done);
      looking.forEach(function (k, i) { lookSum[k] = (lookSum[k] || 0) + i + 1; });
      if (looking.join() === LOOKING_START.join()) out.looking.untouched++;
    }

    // question 1: first and last from want_most/could_skip, averages only from full rank_ rows
    count_(out.want.first, text("want_most"), done);
    count_(out.want.last, text("could_skip"), done);
    const ranks = RANK_OPTIONS.map(function (k) { return Number(cell("rank_" + k)); });
    if (ranks.every(function (n) { return n >= 1 && n <= RANK_OPTIONS.length && Math.floor(n) === n; })) {
      out.want.n++;
      RANK_OPTIONS.forEach(function (k, i) { wantSum[k] = (wantSum[k] || 0) + ranks[i]; });
      if (ranks.every(function (n, i) { return n === i + 1; })) out.want.untouched++;
    }

    // question 4: "70%" or "70% — why", which Sheets may already have turned into 0.7
    const share = sharePercent_(cell("q4_sharing_life"));
    if (share !== null) {
      out.sharing.n++;
      const bin = out.sharing.bins[Math.min(9, Math.floor(share / 10))];
      bin[0]++;
      if (done) bin[1]++;
      if (share === 50) out.sharing.at50++;
      shares.push(share);
    }

    if (done) {
      const n = TEXT_ANSWERS.reduce(function (sum, c) { return sum + wordCount_(text(c)); }, 0);
      out.words.n++;
      out.words.bins[WORD_EDGES.filter(function (edge) { return n >= edge; }).length]++;
      words.push(n);
    }

    const cities = text("cities").split(",").map(function (c) { return c.trim(); }).filter(String);
    cities.forEach(function (c) { count_(out.cities, c, done); });
    // for the cross tables, and only ever counted there: never returned as a row
    people.push({ cities: cities, age: text("age"), meet: text("meet"), done: done });
  }

  Object.keys(lookSum).forEach(function (k) { out.looking.rank[k] = round2_(lookSum[k] / out.looking.n); });
  Object.keys(wantSum).forEach(function (k) { out.want.rank[k] = round2_(wantSum[k] / out.want.n); });
  out.sharing.median = median_(shares);
  out.words.median = median_(words);
  out.cross = crosses_(people);
  return out;
}

/** obj[key] = [everyone, finished all seven] */
function count_(obj, key, done) {
  if (key === "") return;
  if (!obj[key]) obj[key] = [0, 0];
  obj[key][0]++;
  if (done) obj[key][1]++;
}

/** a row in the cross tables needs this many people: smaller cities fold into "elsewhere" */
const CROSS_MIN = 3;

/**
 * Two answers crossed: city × age, city × who they'd like to meet, and age × who they'd like
 * to meet (everyone, and New York alone). Worked out twice, for everyone and for those who
 * answered all seven, so each view keeps its own rows. Only people who gave their age and who
 * they'd like to meet count. Someone who lists two cities counts in both rows. A city with
 * fewer than CROSS_MIN people in the view folds into "elsewhere", and "elsewhere" itself only
 * shows once it has CROSS_MIN, so a city row never points at one or two people.
 */
function crosses_(people) {
  return { all: crossOf_(people), done: crossOf_(people.filter(function (p) { return p.done; })) };
}

function crossOf_(people) {
  const ppl = people.filter(function (p) { return p.age && p.meet; });
  const size = {};
  ppl.forEach(function (p) { p.cities.forEach(function (c) { size[c] = (size[c] || 0) + 1; }); });
  const shown = Object.keys(size).filter(function (c) { return size[c] >= CROSS_MIN; })
    .sort(function (a, b) { return size[b] - size[a] || (a < b ? -1 : 1); });
  const rowsOf = function (p) {
    const rows = [];
    p.cities.forEach(function (c) { const row = shown.indexOf(c) > -1 ? c : "elsewhere"; if (rows.indexOf(row) === -1) rows.push(row); });
    return rows;
  };
  const elsewhere = ppl.filter(function (p) { return rowsOf(p).indexOf("elsewhere") > -1; }).length;
  const out = { cities: shown.slice(), city_age: {}, city_meet: {}, age_meet: {}, ny_age_meet: {}, unshown: 0 };
  ppl.forEach(function (p) {
    rowsOf(p).forEach(function (row) {
      if (row === "elsewhere" && elsewhere < CROSS_MIN) return;
      cell_(out.city_age, row, p.age);
      cell_(out.city_meet, row, p.meet);
    });
    cell_(out.age_meet, p.age, p.meet);
    if (p.cities.indexOf("New York") > -1) cell_(out.ny_age_meet, p.age, p.meet);
  });
  if (elsewhere >= CROSS_MIN) out.cities.push("elsewhere");
  else out.unshown = elsewhere;
  return out;
}

/** table[row][col] += 1 */
function cell_(table, row, col) {
  if (!table[row]) table[row] = {};
  table[row][col] = (table[row][col] || 0) + 1;
}

/** hours["2026-09-28T14"] = [rsvps, finished] in that UTC hour */
function bump_(hours, key, i) {
  if (!hours[key]) hours[key] = [0, 0];
  hours[key][i]++;
}

function hourKey_(d) {
  return d.toISOString().slice(0, 13);
}

/** a Date from a Date cell or an ISO string, null for anything else */
function toDate_(v) {
  if (v && typeof v.getTime === "function") return isNaN(v.getTime()) ? null : new Date(v.getTime());
  const s = String(v || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}/.test(s)) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

/** 0-100 from "70%", "70% — why" or a percent cell (0.7), null when it isn't one */
function sharePercent_(v) {
  if (typeof v === "number") return Math.max(0, Math.min(100, Math.round(v <= 1 ? v * 100 : v)));
  const m = /^\s*(\d{1,3})\s*%/.exec(String(v || ""));
  return m ? Math.min(100, Number(m[1])) : null;
}

function wordCount_(s) {
  return s ? s.split(/\s+/).filter(String).length : 0;
}

function median_(list) {
  if (!list.length) return null;
  const s = list.slice().sort(function (a, b) { return a - b; });
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : round2_((s[mid - 1] + s[mid]) / 2);
}

function round2_(n) {
  return Math.round(n * 100) / 100;
}

/* ------------------------------------------------------------------ */
/* Run this once from the editor after pasting, to create/fix the tab.  */

function setup() {
  const sheet = getSheet_(SHEET);
  const test = getSheet_(TEST_SHEET);
  ensureSources_(sheet.getParent());
  Logger.log("Ready. Tabs: " + sheet.getName() + ", " + test.getName() + ", " + SOURCES_SHEET + " (columns: " + COLUMNS.length + ")");
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