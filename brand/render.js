// Renders the pigeon kit (brand/pigeons.html) into brand/pigeon/: a folder per cut (ink, light, filled),
// each with png/ and svg/ inside, plus a contact sheet. Run from repo root: node brand/render.js
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const OUT = path.join(__dirname, "pigeon");
const PX = 16; // PNG pixels per drawing unit: the pigeon from the note (130 units wide) comes out about 2000px
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
  await p.goto("file://" + path.join(__dirname, "pigeons.html"));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForFunction(() => window.pigeons && window.pigeons.ready);
  fs.mkdirSync(OUT, { recursive: true });
  const shot = await b.newPage({ viewport: { width: 4000, height: 3000 } });
  for (const pose of await p.evaluate(() => pigeons.poses)) {
    for (const cut of ["ink", "light", "filled"]) {
      // the cut stays in the file name too, so a file dragged out of its folder still says which one it is
      const file = ext => path.join(OUT, cut, ext, `pigeon-${pose}-${cut}.${ext}`);
      for (const ext of ["png", "svg"]) fs.mkdirSync(path.join(OUT, cut, ext), { recursive: true });
      fs.writeFileSync(file("svg"), await p.evaluate(([x, c]) => pigeons.svg(x, c, 4), [pose, cut]) + "\n");
      await shot.setContent(`<body style="margin:0">${await p.evaluate(([x, c, s]) => pigeons.svg(x, c, s), [pose, cut, PX])}</body>`);
      await (await shot.$("svg")).screenshot({ path: file("png"), omitBackground: true });
    }
  }
  await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(OUT, "contact-sheet.jpg"), type: "jpeg", quality: 86, fullPage: true });
  await b.close();
})();
