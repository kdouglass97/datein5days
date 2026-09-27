// Where someone came from, recorded two ways, because no single signal can say it all.
//   src  which of our links they used: /ig, /tt, /qr, /invite, /@maya (see vercel.json). We
//        know it only because we minted the link. The bare link reads "direct".
//   via  which app or site the click came from, read off the in-app browser or the referrer.
//        iMessage, WhatsApp on an iPhone, QR scans and typed addresses all arrive carrying
//        nothing, so they read "none". That blind spot is why the links carry src.
// A sign-up is credited to the last of our links this browser clicked in the past 30 days
// (window.d5dAttr), so someone who scans the QR code and comes back two days later by typing
// the address still counts for the QR code. Counting visits is PostHog's job, not the sheet's:
// every event there carries src and via (track() in index.html).
(() => {
const KEY = "d5d_attr", DAYS = 30;
const q = new URLSearchParams(location.search);
// lowercase letters, digits, . _ - and one leading @: nothing a spreadsheet would try to run
const tag = v => String(v || "").toLowerCase().replace(/[^a-z0-9@._-]/g, "").replace(/^[._-]+/, "").replace(/(?!^)@/g, "").slice(0, 40);

// In-app browsers name themselves in the user agent. Instagram goes before Facebook,
// since Meta's apps share tokens.
const APPS = [["instagram", /Instagram/], ["threads", /Barcelona/], ["facebook", /FBAN|FBAV|FB_IAB/], ["tiktok", /musical_ly|BytedanceWebview|TikTok/],
["snapchat", /Snapchat/], ["linkedin", /LinkedInApp/], ["pinterest", /Pinterest/], ["wechat", /MicroMessenger/], ["line", / Line\//], ["telegram", /Telegram/], ["x", /Twitter/]];
const SITES = [["instagram", /(^|\.)instagram\.com$/], ["threads", /(^|\.)threads\.(net|com)$/], ["facebook", /(^|\.)(facebook\.com|fb\.me|messenger\.com)$/],
["tiktok", /(^|\.)tiktok\.com$/], ["x", /^t\.co$|(^|\.)(twitter|x)\.com$/], ["linkedin", /(^|\.)linkedin\.com$|^lnkd\.in$/], ["youtube", /(^|\.)youtube\.com$|^youtu\.be$/],
["reddit", /(^|\.)reddit\.com$/], ["google", /(^|\.)google\.[a-z.]+$/], ["bing", /(^|\.)bing\.com$/], ["duckduckgo", /(^|\.)duckduckgo\.com$/],
["yahoo", /(^|\.)yahoo\.[a-z.]+$/], ["ecosia", /(^|\.)ecosia\.org$/], ["brave", /^search\.brave\.com$/]];
// AI assistants on the web, all tagged ai-… so they sort and filter together. Checked before
// SITES, since Gemini lives on google.com. A bare name matches too, for the tag some of them
// put on links (ChatGPT adds utm_source=chatgpt.com).
const AI = [["ai-chatgpt", /(^|\.)chatgpt(\.com)?$|^chat\.openai\.com$/], ["ai-claude", /(^|\.)claude(\.ai|\.com)?$/], ["ai-gemini", /^(gemini|bard)(\.google\.com)?$/],
["ai-copilot", /^copilot(\.microsoft\.com|\.cloud\.microsoft)?$/], ["ai-meta", /(^|\.)meta\.ai$/], ["ai-perplexity", /(^|\.)perplexity(\.ai)?$/], ["ai-grok", /(^|\.)grok(\.com)?$/],
["ai-deepseek", /(^|\.)deepseek(\.com)?$/], ["ai-mistral", /(^|\.)mistral(\.ai)?$/], ["ai-poe", /(^|\.)poe(\.com)?$/], ["ai-doubao", /(^|\.)doubao(\.com)?$/],
["ai-kimi", /(^|\.)kimi(\.com)?$|^kimi\.moonshot\.cn$/], ["ai-qwen", /(^|\.)qwen(\.ai)?$|^(tongyi|qianwen)\.aliyun\.com$/], ["ai-yuanbao", /^yuanbao(\.tencent\.com)?$/],
["ai-ernie", /^yiyan\.baidu\.com$/]];
// Android tells Chrome which app opened the link (android-app://<package>/), so on Android
// a text or a WhatsApp message is visible even without a tag.
const ANDROID = { "com.whatsapp": "whatsapp", "com.whatsapp.w4b": "whatsapp", "com.google.android.apps.messaging": "sms", "com.samsung.android.messaging": "sms",
"org.telegram.messenger": "telegram", "com.google.android.gm": "gmail", "com.instagram.android": "instagram", "com.zhiliaoapp.musically": "tiktok",
"com.facebook.katana": "facebook", "com.facebook.orca": "facebook", "com.twitter.android": "x", "com.linkedin.android": "linkedin",
"com.snapchat.android": "snapchat", "com.slack": "slack", "com.discord": "discord", "com.google.android.googlequicksearchbox": "google",
"com.openai.chatgpt": "ai-chatgpt", "com.anthropic.claude": "ai-claude", "com.google.android.apps.bard": "ai-gemini", "ai.perplexity.app.android": "ai-perplexity",
"com.microsoft.copilot": "ai-copilot", "ai.x.grok": "ai-grok", "com.deepseek.chat": "ai-deepseek" };

const ua = navigator.userAgent;
let ref = null;
try { ref = document.referrer ? new URL(document.referrer) : null; } catch {}
const bare = h => h.toLowerCase().replace(/^www\./, "");
const internal = !!ref && bare(ref.hostname) === bare(location.hostname);
const app = (APPS.find(([, re]) => re.test(ua)) || [])[0];
// "open in browser" from an in-app browser hands over nothing but the URL, so the app is
// written into it (below) and read back here
const carried = !app && tag(q.get("via"));
// a site or another site's tag by name: an AI assistant, a known site, or else the bare host
const named = h => { h = bare(h); return ([...AI, ...SITES].find(([, re]) => re.test(h)) || [])[0] || tag(h); };
const fromRef = () => {
if (!ref || internal) return "";
if (ref.protocol === "android-app:") return ANDROID[ref.hostname.toLowerCase()] || tag(ref.hostname);
return named(ref.hostname);
};
// src only ever names one of our links. Other people's tags (ChatGPT adds utm_source to every
// link it gives out) say where the click came from, so they count as via.
const theirs = q.get("utm_source") || q.get("ref");
const here = { src: tag(q.get("src")) || "direct", via: app || carried || fromRef() || (theirs ? named(theirs) : "") || "none" };
if (app && q.get("via") !== app) {
q.set("via", app);
history.replaceState(history.state, "", location.pathname + "?" + q + location.hash);
}

// The latest link clicked wins: Maya's link and then another creator's credits the other
// creator. A visit that says less (no tag, then no app) never replaces one that says more,
// and only a real arrival counts: not a reload, the back button, or a move between our pages.
const rank = a => a.src !== "direct" ? 2 : a.via !== "none" ? 1 : 0;
const nav = performance.getEntriesByType?.("navigation")[0]?.type;
const arrived = !internal && nav !== "reload" && nav !== "back_forward";
let last = null;
try { last = JSON.parse(localStorage.getItem(KEY)); } catch {}
if (!last || !(Date.now() - last.t < DAYS * 864e5) || (arrived && rank(here) >= rank(last))) {
last = { ...here, t: Date.now() };
try { localStorage.setItem(KEY, JSON.stringify(last)); } catch {}
}
window.d5dAttr = { src: tag(last.src) || "direct", via: tag(last.via) || "none" };
})();
