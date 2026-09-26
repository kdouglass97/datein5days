// Renders share/card.html to og.jpg (1200x630) and share/icon.html to the favicons.
// Run from repo root: node share/render.js
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const root = path.join(__dirname, "..");
// An .ico is a small directory of images; every current browser accepts PNG entries.
const ico = pngs => {
  const head = Buffer.alloc(6 + 16 * pngs.length);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(pngs.length, 4);
  let offset = head.length;
  pngs.forEach(({ size, png }, i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(size, e);
    head.writeUInt8(size, e + 1);
    head.writeUInt16LE(1, e + 4);
    head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(png.length, e + 8);
    head.writeUInt32LE(offset, e + 12);
    offset += png.length;
  });
  return Buffer.concat([head, ...pngs.map(p => p.png)]);
};
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto("file://" + path.join(__dirname, "card.html"));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(root, "og.jpg"), type: "jpeg", quality: 86 });
  const icon = async (size, tile) => {
    await p.setViewportSize({ width: size, height: size });
    await p.goto("file://" + path.join(__dirname, "icon.html") + `?px=${size}` + (tile ? "&tile" : ""));
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(200);
    return p.screenshot({ type: "png", omitBackground: !tile });
  };
  const small = [];
  for (const size of [16, 32, 48]) small.push({ size, png: await icon(size) });
  fs.writeFileSync(path.join(root, "favicon.ico"), ico(small));
  fs.writeFileSync(path.join(root, "icon.png"), await icon(192));
  fs.writeFileSync(path.join(root, "apple-touch-icon.png"), await icon(180, true));
  await b.close();
})();
