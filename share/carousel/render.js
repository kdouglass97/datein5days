// Renders each .slide in share/carousel/<name>/slides.html to <name>/NN.jpg at 1080x1350
// (Instagram's 4:5), plus sheet.jpg, every slide on one page for a quick look.
// Run from repo root: node share/carousel/render.js haven
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const name = process.argv[2] || "haven";
const dir = path.join(__dirname, name);
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, proxy });
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await p.goto("file://" + path.join(dir, "slides.html"));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  const slides = await p.locator(".slide").all();
  for (const [i, s] of slides.entries()) {
    await s.screenshot({ path: path.join(dir, String(i + 1).padStart(2, "0") + ".jpg"), type: "jpeg", quality: 92 });
  }
  await p.goto("file://" + path.join(dir, "slides.html") + "?sheet");
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  await p.locator(".sheet").screenshot({ path: path.join(dir, "sheet.jpg"), type: "jpeg", quality: 82 });
  await b.close();
})();
