// Renders share/card.html to og.jpg (1200x630). Run from repo root: node share/render.js
const path = require("path");
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto("file://" + path.join(__dirname, "card.html"));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(__dirname, "..", "og.jpg"), type: "jpeg", quality: 86 });
  await b.close();
})();
