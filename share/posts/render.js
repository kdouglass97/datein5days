// Renders a Haven post in share/posts/<name>/post.html.
// A carousel (every .slide) becomes NN.jpg at 1080x1350 plus sheet.jpg.
// A Reel (the page sets window.REEL = { seconds, at(t) }) becomes reel.mp4 at 1080x1920, 30fps,
// drawn frame by frame so every frame is exact, plus cover.jpg. Silent: add the sound in the app.
// Run from repo root: node share/posts/render.js bag
// How a post gets made, start to finish: .claude/skills/haven-post/SKILL.md
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("playwright");
const name = process.argv[2];
const dir = path.join(__dirname, name || "");
const FPS = 30;
if (!name || !fs.existsSync(path.join(dir, "post.html"))) {
  const posts = fs.readdirSync(__dirname).filter(d => fs.existsSync(path.join(__dirname, d, "post.html")));
  console.error(`Usage: node share/posts/render.js <post>\nPosts: ${posts.join(", ")}`);
  process.exit(1);
}
// One Haven: the lines haven.js shares with note.js must still be note.js's, or nothing renders (context.md §5).
const note = fs.readFileSync(path.join(__dirname, "..", "..", "note.js"), "utf8");
const lines = [...fs.readFileSync(path.join(__dirname, "haven.js"), "utf8").matchAll(/^const (BODY|WING|LEGS|HEAD|NECK|BEAK|LETTER) = "([^"]+)";/gm)];
const drift = lines.filter(([, , d]) => !note.includes(d)).map(([, k]) => k);
if (lines.length !== 7 || drift.length) {
  console.error(`haven.js no longer matches note.js (${drift.join(", ") || "lines missing"}). Haven is never redrawn: copy the lines back from note.js.`);
  process.exit(1);
}
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, proxy });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const open = async q => {
    await p.goto("file://" + path.join(dir, "post.html") + (q || ""));
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(600);
  };
  await open();
  const reel = await p.evaluate(() => window.REEL && window.REEL.seconds);
  if (reel) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "reel-"));
    const frame = p.locator(".slide").first();
    const n = Math.round(reel * FPS);
    for (let i = 0; i < n; i++) {
      await p.evaluate(t => window.REEL.at(t), i / FPS);
      await frame.screenshot({ path: path.join(tmp, String(i).padStart(5, "0") + ".jpg"), type: "jpeg", quality: 90 });
    }
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", path.join(tmp, "%05d.jpg"),
      "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-movflags", "+faststart", path.join(dir, "reel.mp4")]);
    const cover = await p.evaluate(() => window.REEL.cover || 1);
    await p.evaluate(t => window.REEL.at(t), cover);
    await frame.screenshot({ path: path.join(dir, "cover.jpg"), type: "jpeg", quality: 92 });
    fs.rmSync(tmp, { recursive: true, force: true });
  } else {
    await p.setViewportSize({ width: 1080, height: 1350 });
    await open();
    const slides = await p.locator(".slide").all();
    for (const [i, s] of slides.entries()) {
      await s.screenshot({ path: path.join(dir, String(i + 1).padStart(2, "0") + ".jpg"), type: "jpeg", quality: 92 });
    }
    await open("?sheet");
    await p.locator(".sheet").screenshot({ path: path.join(dir, "sheet.jpg"), type: "jpeg", quality: 82 });
  }
  await b.close();
})();
