// "leave us a note": a small sheet any page can open.
// Open it from any element with [data-note]; data-note="<prompt key>" preselects a prompt.
// Notes post to the same Apps Script web app as RSVPs, as { kind: "note" }, and land on
// the `notes` tab. They carry no `id`, so an older script rejects them instead of
// writing them into `leads`.
(() => {
const ENDPOINT = "https://script.google.com/macros/s/AKfycbwzPjNII26q7AdawsfeSSjkhjkXw7ZGKouEnx8mWh8N8LmGt5Y-sjEIBtCbV3STk7VU/exec";
const PROMPTS = [
{ key: "almost_left", q: "Where did you almost close the tab?", ph: "The exact moment, and what made you hesitate." },
{ key: "not_yet", q: "What's stopping you from RSVPing?", ph: "Be blunt. It's the most useful thing you can tell us." },
{ key: "my_city", q: "Why aren't you in my city yet?", ph: "Which city, and what a good first date there looks like." },
{ key: "considered", q: "Have you considered…", ph: "An idea, a worry, something we've missed." },
{ key: "trust", q: "What would make you trust us with a date?", ph: "What you'd need to see or know first." },
{ key: "involved", q: "How can I get involved?", ph: "What you're good at, and where you are." },
];
const OPEN = { q: "", ph: "Say it plainly. We read every one." };

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
.nt-x{position:absolute;top:10px;right:10px;width:44px;height:44px;border:0;background:none;font:400 30px/1 var(--serif);color:var(--ink);cursor:pointer}
.nt-k{margin:16px 0 8px!important;font-size:12px!important;text-transform:uppercase;letter-spacing:.08em;opacity:.7}
.nt-chips{display:flex;flex-wrap:wrap;gap:7px}
.nt-chips button{font:13px/1.25 var(--type);color:var(--ink);background:var(--paper);border:1.5px solid var(--tag);padding:7px 10px;cursor:pointer;text-align:left;transition:background .15s,color .15s}
.nt-chips button[aria-pressed="true"]{background:var(--tag);color:var(--line)}
.nt label{display:block;margin:18px 0 8px;font-family:var(--serif);font-size:22px;line-height:1.15}
.nt label small{display:block;font:13px/1.4 var(--type);opacity:.7;margin-top:2px}
.nt textarea,.nt input{display:block;width:100%;font:16px/1.5 var(--type);color:var(--ink);background:#fff;border:1.5px solid rgba(70,85,58,.45);padding:12px 14px;border-radius:0}
.nt textarea{min-height:112px;resize:vertical}
.nt textarea:focus,.nt input:focus{outline:none;border-color:var(--tag);box-shadow:3px 3px 0 var(--tag)}
.nt-send{display:block;width:100%;margin-top:22px;font:700 16px/1 var(--type);letter-spacing:.02em;color:var(--ink);background:var(--paper);border:2px solid var(--tag);padding:16px 20px;box-shadow:5px 5px 0 var(--tag);cursor:pointer;transition:transform .12s,box-shadow .12s}
.nt-send:active{transform:translate(5px,5px);box-shadow:0 0 0 var(--tag)}
.nt-send:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:2px 2px 0 var(--tag)}
.nt-done{text-align:center;padding:24px 0 8px}
.nt-done h2{margin:0 0 8px}
@media (hover:hover){.nt-send:not(:disabled):hover{transform:translate(2px,2px);box-shadow:3px 3px 0 var(--tag)}.nt-chips button:hover{background:rgba(31,77,27,.08)}.nt-chips button[aria-pressed="true"]:hover{background:var(--tag)}}
@media (min-width:640px){.nt{inset:0;margin:auto;width:calc(100% - 48px);max-width:520px;height:fit-content;border:2px solid var(--tag);box-shadow:8px 8px 0 var(--tag)}.nt[open]{animation:nt-in .22s ease-out}}
@media (prefers-reduced-motion:reduce){.nt[open]{animation:none}}
`;

let dlg, form, chips, label, hint, text, contact, send, picked = null;
const track = (e, p) => window.posthog?.capture?.(e, p);

function build() {
const style = document.createElement("style");
style.textContent = css;
document.head.append(style);
dlg = document.createElement("dialog");
dlg.className = "nt";
dlg.setAttribute("aria-labelledby", "nt-h");
dlg.innerHTML = `<div class="nt-in">
<button type="button" class="nt-x" aria-label="Close">&times;</button>
<form novalidate>
<h2 id="nt-h">leave us a note</h2>
<p>Anything at all. The honest ones help most, and it's the two of us reading.</p>
<p class="nt-k">start from a question, or don't</p>
<div class="nt-chips">${PROMPTS.map(p => `<button type="button" data-k="${p.key}" aria-pressed="false">${p.q}</button>`).join("")}</div>
<label for="nt-text"><span data-q>your note</span></label>
<textarea id="nt-text" name="note" maxlength="4000" required></textarea>
<label for="nt-contact">want a reply?<small>Email, number or @handle. Optional.</small></label>
<input id="nt-contact" name="contact" maxlength="200" autocomplete="email">
<button class="nt-send" type="submit" disabled>send note</button>
</form>
</div>`;
document.body.append(dlg);
form = dlg.querySelector("form");
chips = [...dlg.querySelectorAll(".nt-chips button")];
label = dlg.querySelector("[data-q]");
text = dlg.querySelector("#nt-text");
contact = dlg.querySelector("#nt-contact");
send = dlg.querySelector(".nt-send");
dlg.querySelector(".nt-x").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
chips.forEach(b => b.addEventListener("click", () => pick(picked === b.dataset.k ? null : b.dataset.k, true)));
text.addEventListener("input", () => { send.disabled = text.value.trim().length < 3; });
form.addEventListener("submit", submit);
}

function pick(key, focus) {
picked = key;
const p = PROMPTS.find(x => x.key === key) || OPEN;
chips.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.k === key)));
label.textContent = p.q || "your note";
text.placeholder = p.ph;
if (focus) text.focus();
}

async function submit(e) {
e.preventDefault();
const note = text.value.trim();
if (note.length < 3) return;
const p = PROMPTS.find(x => x.key === picked);
const payload = {
kind: "note",
note_id: crypto.randomUUID?.() || String(Date.now()) + Math.random().toString(16).slice(2),
at: new Date().toISOString(),
prompt: p ? p.q : "",
note,
contact: contact.value.trim(),
page: location.pathname,
src: new URLSearchParams(location.search).get("src") || "direct",
};
send.disabled = true;
send.textContent = "sending…";
try {
await fetch(ENDPOINT, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload), keepalive: true });
} catch (err) { console.warn("Note not sent", err); }
track("note_sent", { prompt: p ? p.key : "open", has_contact: !!payload.contact, page: payload.page });
form.hidden = true;
const done = document.createElement("div");
done.className = "nt-done";
done.innerHTML = `<h2>got it. thank you.</h2><p>${payload.contact ? "We'll write back." : "We read every one."}</p><button type="button" class="nt-send">close</button>`;
done.querySelector("button").addEventListener("click", () => dlg.close());
form.after(done);
done.querySelector("button").focus();
}

function open(key) {
if (!dlg) build();
dlg.querySelector(".nt-done")?.remove();
form.hidden = false;
form.reset();
send.disabled = true;
send.textContent = "send note";
pick(PROMPTS.some(p => p.key === key) ? key : null, false);
if (!dlg.showModal) { location.href = "mailto:datein5days@gmail.com"; return; }
dlg.showModal();
track("note_open", { prompt: key || "open", page: location.pathname });
}

document.addEventListener("click", e => {
const t = e.target.closest("[data-note]");
if (!t) return;
e.preventDefault();
open(t.dataset.note);
});
})();
