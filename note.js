// "leave us a note": a small sheet any page can open.
// Open it from any element with [data-leave-note].
// Notes post to the same Apps Script web app as RSVPs, as { kind: "note" }, and land on
// the `notes` tab. They carry no `id`, so an older script rejects them instead of
// writing them into `leads`.
(() => {
const ENDPOINT = "https://script.google.com/macros/s/AKfycbwzPjNII26q7AdawsfeSSjkhjkXw7ZGKouEnx8mWh8N8LmGt5Y-sjEIBtCbV3STk7VU/exec";

// One pigeon, three moods: "draw" inks itself in (the panel), "walk" carries the letter
// across while the note sends, "happy" is back without it (delivered) and hops.
const pigeon = mood => {
const ink = mood === "draw" ? ' pathLength="1" class="ink' : ' class="';
const legs = mood === "walk"
? `<g class="nt-leg nt-l1"><path${ink} thin" style="--d:.55s" d="M65 64L64 72M61 72H68"/></g><g class="nt-leg nt-l2"><path${ink} thin" style="--d:.55s" d="M75 63L76 72M73 72H80"/></g>`
: `<path${ink} thin" style="--d:.55s" d="M65 64L64 72M61 72H68M75 63L76 72M73 72H80"/>`;
const letter = mood === "happy" ? "" : `<path${ink}" style="--d:.7s" d="M106 25L117 21L120 30L109 34ZM106 25L114 28L117 21"/>`;
const hearts = mood === "happy" ? `<g class="nt-hearts">${[[98, 12], [112, 4], [84, 6]].map(([x, y], i) => `<path class="nt-heart" style="--i:${i}" d="M${x} ${y}c0-3 4-3 4 0c0-3 4-3 4 0c0 3-4 5-4 7c0-2-4-4-4-7z"/>`).join("")}</g>` : "";
return `<svg class="nt-sk nt-${mood}" viewBox="0 0 130 80" aria-hidden="true">${hearts}<g class="nt-bod" filter="url(#pen)">
<path${ink}" d="M99 30C105 37 105 49 97 57C89 65 71 67 59 63C49 60 41 58 31 59L14 61L17 55L29 52C35 48 43 45 53 42C67 38 80 35 86 29"/>
<path${ink} thin" style="--d:.3s" d="M54 45C66 41 80 43 87 51C79 57 65 57 51 53M62 48L70 53M69 46L77 52"/>
${legs}
<g class="nt-head">
<path${ink}" style="--d:.15s" d="M86 29C83 21 88 15 94 15C99 15 102 19 101 25C101 27 100 29 99 30"/>
<path${ink} thin" style="--d:.4s" d="M88 32C92 35 97 35 100 32"/>
<path${ink} thin" style="--d:.45s" d="M101 22L107 25L101 27"/>
<circle class="nt-eye" cx="95" cy="21" r="1.5"/>
${letter}
</g>
</g></svg>`;
};
const PIGEON = pigeon("draw");
const css = `
.nt{inset:auto 0 0 0;margin:0;width:100%;max-width:100%;max-height:calc(100% - 24px);border:0;padding:0;background:var(--paper);color:var(--ink);box-shadow:0 -20px 40px -20px rgba(0,0,0,.5);font:16px/1.5 var(--type);overflow:auto}
.nt::backdrop{background:rgba(31,40,26,.5)}
.nt[open]{animation:nt-up .3s cubic-bezier(.2,.8,.2,1)}
@keyframes nt-up{from{transform:translateY(100%)}}
@keyframes nt-in{from{opacity:0;transform:translateY(12px)}}
html:has(.nt[open]){overflow:hidden}
.nt-in{position:relative;padding:28px clamp(20px,6vw,32px) calc(24px + env(safe-area-inset-bottom))}
.nt h2{font-family:var(--serif);font-weight:400;font-size:30px;letter-spacing:-.02em;line-height:1.05;margin:0 44px 6px 0;color:var(--ink)}
.nt p{margin:0;font-size:15px}
.nt-x{position:absolute;top:12px;right:12px;width:44px;height:44px;display:grid;place-items:center;border:0;background:none;color:var(--tag);cursor:pointer}
.nt-x svg{width:22px;height:22px}
.nt label{display:block;margin:18px 0 8px;font-family:var(--serif);font-size:22px;line-height:1.15}
.nt label small{display:block;font:13px/1.4 var(--type);opacity:.7;margin-top:2px}
.nt textarea,.nt input{display:block;width:100%;font:16px/1.5 var(--type);color:var(--ink);background:#fff;border:1.5px solid rgba(70,85,58,.45);padding:12px 14px;border-radius:0}
.nt textarea{min-height:112px;resize:vertical}
.nt textarea:focus,.nt input:focus{outline:none;border-color:var(--tag);box-shadow:3px 3px 0 var(--tag)}
.nt-send{display:block;width:100%;margin-top:22px;font:700 16px/1 var(--type);letter-spacing:.02em;color:var(--ink);background:var(--paper);border:2px solid var(--tag);padding:16px 20px;box-shadow:5px 5px 0 var(--tag);cursor:pointer;transition:transform .12s,box-shadow .12s}
.nt-send:active{transform:translate(5px,5px);box-shadow:0 0 0 var(--tag)}
.nt-send:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:2px 2px 0 var(--tag)}
.nt-sk{display:block;width:112px;height:auto;margin:-4px 0 6px -6px;overflow:visible}
.nt-done .nt-sk{margin:0 auto 10px;width:128px}
.nt-sk path{fill:none;stroke:var(--ink);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.nt-sk .thin{stroke-width:1.2}
.nt-eye{fill:var(--ink)}
.nt-sk .ink{stroke-dasharray:1;stroke-dashoffset:1}
.nt-sk.go .ink{animation:nt-ink 1s var(--d,0s) cubic-bezier(.5,.1,.3,1) forwards}
.nt-sk .nt-head{transform-box:view-box;transform-origin:92px 31px}
.nt-sk.go .nt-head{animation:nt-bob 2.6s 1.4s ease-in-out infinite}
@keyframes nt-ink{to{stroke-dashoffset:0}}
@keyframes nt-bob{0%,60%,100%{transform:rotate(0)}68%{transform:rotate(-7deg) translateY(1px)}76%{transform:rotate(3deg)}84%{transform:rotate(0)}}
.nt-done{text-align:center;padding:16px 0 8px}
.nt-walk{position:relative;height:124px;overflow:hidden;margin:6px 0 0}
.nt-walk::after{content:"";position:absolute;left:0;right:0;bottom:30px;border-top:1.5px dashed rgba(70,85,58,.45)}
.nt-walk p{position:absolute;left:0;right:0;bottom:0;text-align:center;font-size:14px!important;opacity:.75}
.nt-walk .nt-sk{position:absolute;bottom:23px;left:-130px;width:120px;height:74px;margin:0;animation:nt-cross 2s linear forwards}
.nt-sk .nt-bod,.nt-sk .nt-leg{transform-box:view-box}
.nt-walk .nt-bod{transform-origin:70px 72px;animation:nt-waddle .32s ease-in-out infinite alternate}
.nt-walk .nt-head{animation:nt-peck .32s ease-in-out infinite alternate}
.nt-l1{transform-origin:65px 63px;animation:nt-step .32s ease-in-out infinite alternate}
.nt-l2{transform-origin:75px 63px;animation:nt-step .32s ease-in-out infinite alternate-reverse}
.nt-happy{animation:nt-hop 1.3s .15s cubic-bezier(.3,.7,.4,1) 2 both}
.nt-sk .nt-heart{fill:#C0563E;stroke:none;opacity:0;transform-box:fill-box;transform-origin:center;animation:nt-float 2.2s calc(.5s + var(--i) * .35s) ease-out infinite}
@keyframes nt-cross{to{left:calc(100% + 10px)}}
@keyframes nt-waddle{from{transform:rotate(-4deg)}to{transform:rotate(4deg) translateY(-2px)}}
@keyframes nt-peck{from{transform:translateX(-2px)}to{transform:translateX(3px)}}
@keyframes nt-step{from{transform:rotate(-20deg)}to{transform:rotate(20deg)}}
@keyframes nt-hop{0%,45%,100%{transform:translateY(0)}12%{transform:translateY(-14px) rotate(-4deg)}24%{transform:translateY(0)}32%{transform:translateY(-7px) rotate(2deg)}}
@keyframes nt-float{0%{opacity:0;transform:translateY(10px) scale(.6)}25%{opacity:1}100%{opacity:0;transform:translateY(-14px) scale(1.1)}}
.nt-done h2{margin:0 0 8px}
@media (hover:hover){.nt-send:not(:disabled):hover{transform:translate(2px,2px);box-shadow:3px 3px 0 var(--tag)}}
@media (min-width:640px){.nt{inset:0;margin:auto;width:calc(100% - 48px);max-width:520px;height:fit-content;border:2px solid var(--tag);box-shadow:8px 8px 0 var(--tag)}.nt[open]{animation:nt-in .22s ease-out}}
@media (prefers-reduced-motion:reduce){.nt[open],.nt-sk.go .ink,.nt-sk.go .nt-head,.nt-happy,.nt-heart{animation:none}.nt-sk .ink{stroke-dashoffset:0}.nt-sk .nt-heart{opacity:1}}
`;

let dlg, form, text, contact, send;
const track = (e, p) => window.posthog?.capture?.(e, p);

function build() {
const style = document.createElement("style");
style.textContent = css;
document.head.append(style);
dlg = document.createElement("dialog");
dlg.className = "nt";
dlg.setAttribute("aria-labelledby", "nt-h");
dlg.innerHTML = `<div class="nt-in">
<button type="button" class="nt-x" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5L19 19M19 5L5 19" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></button>
<form novalidate>
${PIGEON}
<h2 id="nt-h">leave us a note</h2>
<p>Anything at all: a question, an idea, the thing that made you hesitate. It's the two of us reading.</p>
<label for="nt-text">your note</label>
<textarea id="nt-text" name="note" maxlength="4000" required placeholder="Say it plainly."></textarea>
<label for="nt-contact">want a reply?<small>Email, number or @handle. Optional.</small></label>
<input id="nt-contact" name="contact" maxlength="200" autocomplete="email">
<button class="nt-send" type="submit" disabled>send note</button>
</form>
</div>`;
document.body.append(dlg);
form = dlg.querySelector("form");
text = dlg.querySelector("#nt-text");
contact = dlg.querySelector("#nt-contact");
send = dlg.querySelector(".nt-send");
dlg.querySelector(".nt-x").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
text.addEventListener("input", () => { send.disabled = text.value.trim().length < 3; });
form.addEventListener("submit", submit);
}

async function submit(e) {
e.preventDefault();
const note = text.value.trim();
if (note.length < 3) return;
const payload = {
kind: "note",
note_id: crypto.randomUUID?.() || String(Date.now()) + Math.random().toString(16).slice(2),
at: new Date().toISOString(),
note,
contact: contact.value.trim(),
page: location.pathname,
src: new URLSearchParams(location.search).get("src") || "direct",
};
send.disabled = true;
form.hidden = true;
const walk = document.createElement("div");
walk.className = "nt-walk";
walk.setAttribute("role", "status");
walk.innerHTML = `${pigeon("walk")}<p>delivering your note…</p>`;
form.after(walk);
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
const post = fetch(ENDPOINT, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload), keepalive: true })
.catch(err => console.warn("Note not sent", err));
await Promise.all([post, new Promise(r => setTimeout(r, still ? 300 : 2000))]);
track("note_sent", { has_contact: !!payload.contact, page: payload.page });
walk.remove();
const done = document.createElement("div");
done.className = "nt-done";
done.innerHTML = `${pigeon("happy")}<h2>you're a gem.</h2><p>${payload.contact ? "We'll read it tonight, probably twice, and write back soon." : "We'll read it tonight, probably twice."}</p><button type="button" class="nt-send">back to the page</button>`;
done.querySelector("button").addEventListener("click", () => dlg.close());
form.after(done);
done.querySelector("button").focus();
}

function open() {
if (!dlg) build();
dlg.querySelectorAll(".nt-done,.nt-walk").forEach(el => el.remove());
form.hidden = false;
form.reset();
send.disabled = true;
send.textContent = "send note";
if (!dlg.showModal) { location.href = "mailto:datein5days@gmail.com"; return; }
dlg.showModal();
const sk = form.querySelector(".nt-sk");
sk.classList.remove("go");
requestAnimationFrame(() => sk.classList.add("go"));
track("note_open", { page: location.pathname });
}

document.addEventListener("click", e => {
const t = e.target.closest("[data-leave-note]");
if (!t) return;
e.preventDefault();
open();
});
})();
