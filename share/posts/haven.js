// Haven, drawn from note.js's pigeon: the same lines, the carousel's poses. One drawing, never redrawn.
// Any <g class="hv" data-o="walk letter"> gets Haven in that pose. Moods: wave walk letter tilt tilt-up bow hearts.
const BODY = "M99 30C105 37 105 49 97 57C89 65 71 67 59 63C49 60 41 58 31 59L14 61L17 55L29 52C35 48 43 45 53 42C67 38 80 35 86 29";
const WING = "M54 45C66 41 80 43 87 51C79 57 65 57 51 53M62 48L70 53M69 46L77 52";
const WAVE = "M76 39C72 26 62 14 46 6C49 11 47 15 42 17C47 20 48 24 44 28C50 29 52 33 49 37C54 38 57 41 56 45M62 27L51 23M67 35L55 32";
const WAVE_MOTION = "M36 6C32 10 31 16 33 21M28 1C22 8 21 18 25 25";
const LEGS = "M65 64L64 72M61 72H68M75 63L76 72M73 72H80";
const LEGS_WALK = "M65 64L60 72M57 72H64M75 63L80 71M77 71H84";
const HEAD = "M86 29C83 21 88 15 94 15C99 15 102 19 101 25C101 27 100 29 99 30";
const NECK = "M88 32C92 35 97 35 100 32";
const BEAK = "M101 22L107 25L101 27";
const LETTER = "M106 25L117 21L120 30L109 34ZM106 25L114 28L117 21";
const heart = (x, y, s) => `<path class="heart" transform="translate(${x} ${y}) scale(${s})" d="M0 0c0-3 4-3 4 0c0-3 4-3 4 0c0 3-4 5-4 7c0-2-4-4-4-7z"/>`;
const pose = o => {
  const has = k => o.split(" ").includes(k);
  const tilt = has("tilt") ? -16 : has("tilt-up") ? -12 : has("bow") ? 24 : 0;
  const lean = has("bow") ? 8 : 0;
  return `${has("hearts") ? heart(98, -6, 1.6) + heart(116, -18, 1.3) + heart(80, -16, 1.1) : ""}
<g filter="url(#pen)" transform="rotate(${lean} 70 72)">
<path class="b" d="${BODY}"/>
<path class="thin" d="${has("wave") ? WAVE : WING}"/>
${has("wave") ? `<path class="thin" d="${WAVE_MOTION}" style="stroke:var(--peach)"/>` : ""}
<path class="thin legs" d="${has("walk") ? LEGS_WALK : LEGS}"/>
<g class="head" transform="rotate(${tilt - lean} 92 31)">
<path class="b" d="${HEAD}"/><path class="thin" d="${NECK}"/><path class="thin" d="${BEAK}"/>
<circle class="eye" cx="95" cy="21" r="1.8"/>
${has("letter") ? `<path class="thin" d="${LETTER}" style="fill:var(--paper)"/>` : ""}
</g></g>`;
};
const drawHaven = (root = document) => root.querySelectorAll(".hv").forEach(g => { g.innerHTML = pose(g.dataset.o || ""); });

// The pen's wobble, sized in screen pixels, so every drawing shakes the same at any scale. Same filter as the site's #pen.
const pens = {};
const inkPen = (root = document) => {
  let defs = document.querySelector("#pens");
  if (!defs) { document.body.insertAdjacentHTML("afterbegin", '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs id="pens"></defs></svg>'); defs = document.querySelector("#pens"); }
  root.querySelectorAll('[filter="url(#pen)"]').forEach(el => {
    const m = el.getScreenCTM();
    const k = (m && Math.sqrt(Math.abs(m.a * m.d - m.b * m.c))) || 1;
    const id = "pen" + Math.round(k * 100);
    if (!pens[id]) {
      pens[id] = 1;
      defs.insertAdjacentHTML("beforeend", `<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="${(k / 110).toFixed(4)}" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="${(6.5 / k).toFixed(3)}"/></filter>`);
    }
    el.setAttribute("filter", `url(#${id})`);
  });
};
// Watercolour wash, the carousel's #wash
document.addEventListener("DOMContentLoaded", () => {
  document.body.insertAdjacentHTML("afterbegin", '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><filter id="wash" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="3" seed="9"/><feDisplacementMap in="SourceGraphic" scale="18"/><feGaussianBlur stdDeviation="3"/></filter></defs></svg>');
  drawHaven();
  inkPen();
  if (location.search.includes("sheet")) document.querySelector(".deck")?.classList.add("sheet");
});
