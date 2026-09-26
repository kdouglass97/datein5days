// Where someone came from, recorded two ways, because no single signal can say it all.
//   src  which of our links they used: /ig, /tt, /qr, /@maya (see vercel.json). We know it
//        only because we minted the link. The bare link reads "direct".
//   via  which app or site the click came from, read off the in-app browser or the referrer.
//        iMessage, WhatsApp on an iPhone, QR scans and typed addresses all arrive carrying
//        nothing, so they read "none". That blind spot is why the links carry src.
// A sign-up is credited to this browser's first tagged visit in the last 30 days
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
["reddit", /(^|\.)reddit\.com$/], ["google", /(^|\.)google\.[a-z.]+$/]];
// Android tells Chrome which app opened the link (android-app://<package>/), so on Android
// a text or a WhatsApp message is visible even without a tag.
const ANDROID = { "com.whatsapp": "whatsapp", "com.whatsapp.w4b": "whatsapp", "com.google.android.apps.messaging": "sms", "com.samsung.android.messaging": "sms",
"org.telegram.messenger": "telegram", "com.google.android.gm": "gmail", "com.instagram.android": "instagram", "com.zhiliaoapp.musically": "tiktok",
"com.facebook.katana": "facebook", "com.facebook.orca": "facebook", "com.twitter.android": "x", "com.linkedin.android": "linkedin",
"com.snapchat.android": "snapchat", "com.slack": "slack", "com.discord": "discord", "com.google.android.googlequicksearchbox": "google" };

const ua = navigator.userAgent;
let ref = null;
try { ref = document.referrer ? new URL(document.referrer) : null; } catch {}
const bare = h => h.toLowerCase().replace(/^www\./, "");
const internal = !!ref && bare(ref.hostname) === bare(location.hostname);
const app = (APPS.find(([, re]) => re.test(ua)) || [])[0];
// "open in browser" from an in-app browser hands over nothing but the URL, so the app is
// written into it (below) and read back here
const carried = !app && tag(q.get("via"));
const fromRef = () => {
if (!ref || internal) return "";
if (ref.protocol === "android-app:") return ANDROID[ref.hostname.toLowerCase()] || tag(ref.hostname);
const h = bare(ref.hostname);
return (SITES.find(([, re]) => re.test(h)) || [])[0] || tag(h);
};
const here = { src: tag(q.get("src") || q.get("ref") || q.get("utm_source")) || "direct", via: app || carried || fromRef() || "none" };
if (app && q.get("via") !== app) {
q.set("via", app);
history.replaceState(history.state, "", location.pathname + "?" + q + location.hash);
}

// A tagged visit beats an untagged one, and among tagged visits the first one wins.
const rank = a => a.src !== "direct" ? 2 : a.via !== "none" ? 1 : 0;
let first = null;
try { first = JSON.parse(localStorage.getItem(KEY)); } catch {}
if (!first || !(Date.now() - first.t < DAYS * 864e5) || rank(here) > rank(first)) {
first = { ...here, t: Date.now() };
try { localStorage.setItem(KEY, JSON.stringify(first)); } catch {}
}
window.d5dAttr = { src: tag(first.src) || "direct", via: tag(first.via) || "none" };
})();
