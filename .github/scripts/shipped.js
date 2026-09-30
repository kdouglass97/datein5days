// Tells /admin what shipped: the last two weeks of main, one item per merge, posted to the
// Apps Script, which hands it back to the dashboard behind the password (saveShipped_() in
// apps-script/Code.js). Run by apps-script.yml after every deploy, skipped or not.
//
//   ADMIN_PASSWORD=… ENDPOINT=https://script.google.com/macros/s/…/exec node .github/scripts/shipped.js
//   DRY=1 node .github/scripts/shipped.js     prints the items, posts nothing
//
// Each item is [merged, PR title, [areas], PR number]. The areas come from the files a merge
// touched, so the card can say "admin 4, landing 2" without anyone tagging anything.
const { execFileSync } = require("child_process");
const crypto = require("crypto");

// first match per file wins. The notes, and the config that rides along with most page changes
// (a rewrite, a sitemap line), only count when a merge touched nothing else
const AREAS = [
  [/^index\.html$/, "landing"],
  [/^faq\.html$/, "faq"],
  [/^involved\.html$/, "get involved"],
  [/^privacy\.html$/, "privacy"],
  [/^admin\.html$/, "admin"],
  [/^apps-script\//, "sheet"],
  [/^\.github\//, "guards"],
  [/(^|\/)(context|CLAUDE|README)\.md$|^\.gitignore$/, "notes", true],
  [/^(vercel\.json|\.vercelignore|robots\.txt|sitemap\.xml)$/, "site", true],
  [/./, "site"],
];
const ORDER = ["landing", "faq", "get involved", "privacy", "admin", "sheet", "site", "guards", "notes"];

const log = execFileSync("git", ["log", "--first-parent", "--diff-merges=first-parent", "--since=15 days ago", "--format=%x1e%cI%x1f%s", "--name-only", "HEAD"], { encoding: "utf8" });
const items = log.split("\x1e").filter(s => s.trim()).map(rec => {
  const [head, ...files] = rec.trim().split("\n").filter(Boolean);
  const [at, subject] = head.split("\x1f");
  const pr = (subject.match(/\(#(\d+)\)\s*$/) || [])[1];
  const title = subject.replace(/\s*\(#\d+\)\s*$/, "").trim();
  const found = files.map(f => AREAS.find(([re]) => re.test(f)));
  const main = new Set(found.filter(a => !a[2]).map(a => a[1]));
  const hit = main.size ? main : new Set(found.map(a => a[1]));
  return [at, title, ORDER.filter(a => hit.has(a)), pr ? Number(pr) : 0];
});

if (process.env.DRY) {
  for (const it of items) console.log(it[0], it[3] ? "#" + it[3] : "", it[1], "·", it[2].join(", "));
  process.exit(0);
}

const password = (process.env.ADMIN_PASSWORD || "").trim();
if (password.length < 8) {
  console.log("::notice::ADMIN_PASSWORD isn't set, so /admin is locked and there's no one to tell what shipped.");
  process.exit(0);
}
// the same HMAC as shippedKey_() in Code.js: the password under its own label
const key = crypto.createHmac("sha256", password).update("five days shipped").digest("hex");

(async () => {
  // Apps Script answers a POST with a redirect to the reply, which fetch follows as a GET
  const r = await fetch(process.env.ENDPOINT, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ kind: "shipped", key, items }) });
  const text = await r.text();
  let reply = null;
  try { reply = JSON.parse(text); } catch {}
  if (!reply || !reply.ok) {
    console.log(`::error::The Apps Script didn't take the ship log (${reply ? reply.error : "HTTP " + r.status}).`);
    process.exit(1);
  }
  console.log(`Told /admin about ${reply.items} merges from the last two weeks.`);
})();
