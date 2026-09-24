# five days / datein5days — project context

> Read this before touching the repo. It exists so that any tool or collaborator arriving
> cold can make a change that **fits** rather than a change that merely works. Most of what
> follows cannot be inferred from reading `index.html`. That is the point of the file.

Cohort 01: **New York, private beta** (the fixed Sep 21 date was retired 2026-09-23) · Last updated 2026-09-24
> ⚠️ **Status: the form is LIVE and collecting real sign-ups.** The `leads` tab holds real
> people with real answers, not test data. Nothing in that sheet may be bulk-deleted.

---

## 1. What this is

A dating experiment, not a dating app. Two founders, **Kai** and **Ruby**, hand-match 50
people per cohort and **plan the date for them**, start to finish, within five days. The
product today is a single landing page: an RSVP form plus a seven-question questionnaire.

There is no matching software. There is no algorithm. The humans do the matching, and
that is the entire proposition, not a temporary stage before automation.

**The thesis everything rests on:**

Dating apps match on overlapping *interests*. Two people can share every checkbox, every
tag, every declared hobby, and still want structurally different lives. A 96% match on
attributes tells you nothing about whether one person wants a household by 30 and the
other wants a decade of movement. So the match is a category error, dressed in a
percentage.

This project matches on what a person wants a relationship to **add to their life**.

The page states it once, plainly: *"Because matching interests isn't the same as matching
lives."* If you are writing new copy or building a new section, that sentence is the spine.
Everything should ladder back to it.

**Where it's dramatized:** the `.paper-match` section, "on paper, they're perfect." A 96%
match score with an ink stroke struck through it, then the same two people's actual wants
forking apart on two separate cards. Same checklist, different relationship.

It opens the page, directly after the hero, and carries the `#idea` anchor. A grievance
card used to sit in front of it ("the apps turned dating into homework."), cut 2026-09-24:
app fatigue is the whole category's stock opener, and calling effort the enemy argues
against the seven questions, which are homework by design (§3). The complaint is the
wrong effort, volume instead of depth, not effort itself. Don't put a grievance back in
front of the thesis. The card's one keeper, "One good date, not forty okay chats.", is
now the subline under *your next 5 days*.

---

## 2. Who this is for

Not a demographic. A disposition.

**The person we want** is somewhere between 25 and 35, lives in or moves between
Tbilisi, New York, London, Hong Kong, or Shanghai, and has the kind of life where those
cities are interchangeable. Third-culture, or expat, or simply mobile. They have good
taste and they exercise it, in what they read and cook and wear, and they find it slightly
humiliating that the most important search of their life is conducted through an interface
designed to waste their time.

**The defining trait is not loneliness. It is app fatigue combined with undiminished
appetite.** They still want this. They have simply stopped believing the existing tools
are a serious way to get it. They will happily spend seven minutes writing real answers
to real questions, because effort has been absent from the category for a decade and its
return reads as respect.

**They are slightly embarrassed to be looking.** This is the single most important thing
to hold in mind when writing copy. It means:

- 🚫 no cheerleading, because cheerleading implies they need encouragement to want love
- 🚫 no pity, because they are not sad, they are discerning
- 🚫 no irony about wanting connection, because the irony is what they are escaping
- ✅ treat the wanting as obvious and unremarkable, and put the attention on the craft of the thing

**Who it is not for:** anyone optimizing for volume. The cohort is 50 and that is the
ceiling by design. Copy should never apologize for the size or frame it as a limitation
we are working to overcome.

**Launch is one city at a time, and New York is first** (decided 2026-09-23). Cohort 01
is small enough that founder presence in a city is an operational input, not a
coincidence: we plan every date ourselves, so we only open where we can. The page does
**not** name the next cities. "Somewhere else? RSVP anyway" routes everyone else into the
`other` city field, and those replies are the demand signal for which city opens next.
Copy must never imply a date or a promise for any other city.
The city chips still list major cities (New York, London, Paris, Tokyo, Hong Kong, Tbilisi
+ other). Walkable cities only, no car cities. Tbilisi is honorary: it's where we build, framed as "where you live or keep ties." Up to three. That's matching data, not a
launch list: two people who don't share a base but share a second city are a good match for
this ICP.
The page frames this as a **private beta you found early**: no launch date anywhere, since a
printed date goes stale the day after it passes. Out-of-town RSVPs are told the RSVPs decide
which city opens next and that the people who asked first go first. That second line is a
real commitment: honor it by `created` order when a city opens.

---

## 3. Incentives, or why every mechanic exists

This is the section most likely to be violated by well-meaning changes. Read it before
"improving" anything in the funnel.

### Why seven hard questions, for free

The questionnaire is a **costly signal**, and cost is the whole function. Anyone can tap
through a free sign-up. Almost nobody will write three paragraphs about a time someone made
them feel cared for unless they actually want what is on offer.

The effort *is* the filter. It sorts for intent more reliably than any question about
intent could, because it sorts by behavior rather than self-report.

> ⚠️ **The funnel is designed to lose people.** Drop-off between question one and question
> seven is the mechanism working, not a leak to be plugged. The PostHog "where people stop"
> insight measures the strength of the filter. Do not treat it as a conversion problem. Do
> not shorten the questionnaire, add a skip button, prefill answers, or reduce the minimum
> length to raise completion rate. Completion rate is not the metric. **Quality of completed
> answers is the metric**, and it moves in the opposite direction from completion rate.

### Why "the thoughtful ones get a call"

It makes the effort legible and rewarded. Without it, seven open-text questions read as an
unexplained tax. With it, they read as an audition the person can win. It also sets an
honest expectation: not everyone gets matched, and being chosen means something.

### Why we ask what a planned date is *worth* but charge nothing

Two jobs at once. It is willingness-to-pay research for the eventual business model, and
it primes perceived value before the free offer lands. Someone who has just typed "$50"
receives "free while we test it" as generosity rather than as evidence the thing is cheap.

The `paywall` toggle exists in `CONFIG` and is **off**. There is a `$20 deposit` block in
the markup, currently hidden, from an earlier version of the idea.

### Why Instagram, required

It is the cheapest identity check that costs an honest person nothing and costs a bad actor
real effort at scale. A profile with years of history and mutual friends is expensive to
fake fifty times over; an email address is free.

**We look at the profile. That is all we do with it.** We do not follow, message, comment,
or post. The copy says this explicitly, because handing a stranger your Instagram is the
highest-friction moment on the page, and naming the limit removes more objection than
silence does.

### Why a phone number, and why we ask which app

As of 2026-09-23 step 2 asks everyone for a **phone number** (required, stored E.164) and
**"text me on"**: iMessage, WhatsApp, or regular text. The number field has a country-code picker
(all regions, dial codes from libphonenumber, default guessed from the browser locale). The number is the one key that
reaches people on every channel. The app is their preference, because the people we
want split by geography: the US lives in iMessage, most of the world lives in WhatsApp,
and a mobile ICP may use both. Email was rejected: the follow-ups (your city opened, the
logistics "details card", the date itself) are time-sensitive, and email is where a
five-day plan goes to die.

Copy promises: "We text when your city opens, and to set up your date. Nothing else."
The privacy notice adds that the number is never shared with the match. Hold to both.

Rows from before 2026-09-23 have no `phone`. Instagram-path leads from that period are
still reachable only by DM.

### Why 50, and why free

The cohort size is hand-matching capacity, not a marketing number. Two people planning
dates end to end cannot serve more. This makes the scarcity real, which is why the page can
afford to never mention scarcity.

Free for cohort 01 buys data and testimonials rather than revenue. The business question
is not "will people pay" yet. It is "does hand-matching on life-shape beat interest-matching."

### The founders' actual incentive

This is an experiment with a hypothesis, run once, at a size where it can be observed
closely. If the matches land, there is a business. If they don't, the thesis was wrong and
that is worth knowing in six weeks rather than two years.

---

## 4. Voice and copy

**Register:** warm and dry in the same breath. Literate without being writerly. Confident
without selling. The voice of someone hosting a dinner who has thought carefully about the
seating and would never say so.

### Mechanics

| rule | value |
|---|---|
| headings | lowercase, always (`kindly reply`, `the questions`, `on paper, they're perfect`) |
| body | sentence case |
| person | second person. "you", "we". Never "users", "members", "singles", "daters" |
| exclamation marks | zero |
| em dashes | zero. Commas, colons, periods |
| sentence length | short sentences that carry content, never short sentences as rhythm |
| banned verbs | unlock, elevate, supercharge, transform, curate, journey |
| banned claims | algorithm, proprietary, AI-powered, thousands of, perfect match (except ironically, in the struck-through section) |
| scarcity | forbidden. A "19 of 50 spots left" counter was removed deliberately and replaced with the launch date |

### The two moves that define the voice

**1. Say the awkward thing plainly.** The page collects face photos and asks about regret.
Euphemism here reads as evasion, and evasion is exactly what people distrust about the
category. So: *"No Instagram? A clear photo of your face works too, and only the two of us
see it."* The bluntness is the reassurance.

**2. Undersell the mechanism, oversell the care.** Never describe the process as
sophisticated. Describe it as attentive. *"We read every one, and if yours make us curious,
we'll reach out for a quick call."*

### Calibration

**On-voice**, all live on the page:

> "Now the good part. Seven questions, about seven minutes, no wrong answers. The thoughtful ones get a call."
>
> "Because matching interests isn't the same as matching lives."
>
> "Not always. We call when your answers make us curious, and it takes 15 minutes."
>
> "We check your Instagram to make sure you're a real person. We won't post, comment, or message from it."

**Off-voice**, reject anything resembling these:

> ~~"Ready to find your perfect match? Let's go!"~~ — hype, exclamation, cheerleading
> ~~"Join thousands of singles near you."~~ — we have none, and scale is anti-positioning
> ~~"Our proprietary algorithm analyzes 29 dimensions."~~ — there is no algorithm, that's the pitch
> ~~"Only 3 spots left!"~~ — manufactured urgency, explicitly removed once already
> ~~"We know dating is hard."~~ — pity, and it presumes to speak for them

### The timing claim

Use **"Seven questions, about seven minutes."** Not "7 questions in 7 minutes." A
stopwatch promise invites people to rush, and rushed answers are worthless to a human
matchmaker. "About seven minutes" sets the same expectation while still asking for care.

---

## 5. Design language

### The governing idea

**A printed institutional form, corrected by a human hand.**

The page is built as a piece of stationery: a dinner invitation with an RSVP card. Kraft
paper stock, a high-contrast Didone for display, a typewriter face for the labels and
small print, and over all of it, ink strokes that underline, circle, and strike through
the printed matter.

That tension is not decoration. It is the product argument rendered visually. The printed
form is the algorithm: neat, confident, and slightly wrong. The ink is the human hand
correcting it. When the 96% match score gets struck through with a pen stroke, the design
is making the same claim as the copy, in a different language.

**Any new visual element should be able to answer: is this the printed form, or is it the
hand?** Elements that are neither will feel imported from another website.

### Influences worth knowing

- 🖋 **Letterpress stationery and wedding invitation conventions.** "kindly reply" is RSVP
  language. The 404 page says "wrong table." The confirmation animates a clink. The whole
  page is an invitation to a dinner, held consistently down to the microcopy.
- 📐 **Didone typography**, Bodoni specifically, which carries fashion-masthead authority.
  Paired against Courier Prime it produces the central tension: permanent and provisional,
  engraved and typed, the institution and the person filling in the form.
- ✍️ **Editorial marginalia and proof-correction marks.** The underline-and-circle motif is
  borrowed from a copy editor's pen moving across a galley. It reads as attention paid.
- 🍽 **Supper club and private dining menus.** Small, hand-set, priced without a dollar sign,
  assuming you already know why you're there.
- 📖 **Editorial restraint in the Kinfolk / The Gentlewoman register** for whitespace and
  measure, and **Aesop's product copy** for the specific trick of being informative in a
  register that sounds unhurried.

### Tokens

```css
--grass:#4F6B45   /* primary green */
--tag:#1F4D1B     /* deep green accent band */
--clay:#8A4129    /* rust accent band */
--ink:#46553A     /* body text */
--paper:#FBFAF5   /* card stock */
--kraft:#CDC4AF   /* page background */
--kraft-deep:#B5AB93
--line:#EDEAE1
--rule:rgba(70,85,58,.2)
--serif:"Bodoni Moda",Didot,"Bodoni 72",Georgia,serif   /* all display */
--type:"Courier Prime","Courier New",Courier,monospace  /* labels, meta, small caps */
--opsz:10             /* Bodoni optical size for text-size serif; headings 18, hero 24 */
--w:min(540px,82vw)   /* single column measure */
```

The palette is a garden and a paper bag. Greens do the talking, clay and deep green appear
only as accent bands on card edges, and nothing is pure black or pure white anywhere.

### Craft rules

- Ink strokes use `filter="url(#pen)"`, an feTurbulence displacement that gives lines a
  nib's wobble. A perfectly smooth stroke reads as vector clipart and breaks the metaphor.
- Draw-on reveals use `pathLength="1"` with `stroke-dashoffset`, triggered by `data-reveal`
  on scroll. Things should appear to be *being written*, not to fade in.
- `.paper` cards sit at a slight rotation (`rotate(-1.4deg)`) with a colored band at the top
  edge via `inset` box-shadow. Never square to the grid.
- A `--noise` feTurbulence overlay gives the background its grain. Remove it and the whole
  page goes flat and digital.
- Bodoni's optical size is pinned, never left on auto. Auto sets `opsz` to the pixel size,
  which holds every hairline near 0.2px at any size: fine for a printing press, invisible
  on a screen, and the letters change identity ("perfect" reads "pcrfcct"). Tiers are set
  with `--opsz`: text 10 (`:root`), headings 18, the hero invitation 24. The OG card runs
  lower (8 / 14) because it is only ever seen as a thumbnail. New serif text at heading
  size needs `--opsz:18`, and `!important` on the rule stays because font shorthands reset it.
- `prefers-reduced-motion` is honored through a `reduced` flag that skips animation.
- The **floating header** (`.fhead`, on `/c/01` and `/involved`, added 2026-09-23) is the
  printed form: a paper strip that drops in once the hero's own topbar scrolls away, with a
  "menu" card listing the page's parts. The hand is the pen underline under wherever you are
  (live on the landing page, the current page on `/involved`). On touch screens it steps aside
  while a text field has focus, so the questionnaire stays a clean writing surface.

**Layout:** single column, mobile-first, `540px` measure. Most traffic is a phone scanning
a printed QR code, standing up. Nothing should require two hands or a wide viewport.

---

## 6. The flow

```
QR / link  →  /  →  307  →  /c/01
                              │
            step 1: RSVP      name · Instagram (or photo fallback) · cities · what you're looking for (ranked)
            step 2: details   age range · who you'd like to meet · price perception ·
                              18+ · sensitive-data consent · optional comms opt-in
            step 3: questions  seven, one per screen, saved after each
                              │
                       confirmation
```

### Verification

Instagram is the default and required. Handle is normalized (strips
`https://instagram.com/`, `@`, trailing path, lowercases) and validated against a regex
mirroring Instagram's own rules.

The fallback, "no instagram? verify with a photo instead," reveals a dropzone plus a
required contact field. **The face check runs entirely in the browser** via MediaPipe
`FaceDetector` from jsDelivr. The image never leaves the device for detection. If no face
or several faces are found the person can still proceed via "use it anyway," and the
override is recorded.

### The seven questions

Ordered **softest to hardest by self-exposure required.** Question one is tap-only and
demands nothing personal. The heaviest ask, regret in a past relationship, comes last,
once the person is invested and has already answered six times.

| # | key | type | question |
|---|---|---|---|
| 1 | `relationship_adds` | bestworst (drag-rank) | What do you want most from them? |
| 2 | `wednesday` | text | What does a good Wednesday in your life look like? |
| 3 | `friendships` | text | What do you value most in your closest friendships? |
| 4 | `sharing_life` | slider | In your ideal relationship, how much of your life do you want to share with your partner? |
| 5 | `cared_for` | text | Think of a time someone made you feel really cared for. |
| 6 | `not_done_yet` | text | What's something you really want to do with your life that you haven't done yet? |
| 7 | `spoke_up_sooner` | text | What's something you wish you'd spoken up about sooner in a close relationship or friendship? |

**Question 1 is load-bearing.** It is the thesis from §1 turned into an input. Its two
outputs, `want_most` and `could_skip`, are the primary matching signal. Everything else is
texture that helps a human judge fit.

As of 2026-09-22 it's a **drag-to-rank** picker, not a checkbox pick. Five scene-line
options, each with a small key label above the scene line: *Chemistry, Ease, Play,
Ambition, Building.* The person drags all five into order (top to bottom); the top item is
`want_most`, the bottom item is `could_skip`. It reuses the exact same drag/keyboard-reorder
engine as the `looking` question in step 1 (`initRankList()`, `.rank-item`/`.rank-handle`
6-dot grip, `moveBy()`), just fed different content and a different status/live-region
element - see `initRankList(list, status, onChange)` in the script block. A default order
(options in `CONFIG.poll[0].options` order) is valid and submittable without any drag,
same as `looking`; "next" is never blocked on it.

This design went through two iterations before landing here. The nine-option
choose-up-to-2-then-pick-the-top-one picker (*Teammate, Emotional support, Companionship,
Adventure/activity, Affection/closeness, Growth, Family/home, Fun/playfulness, Independence
+ partnership*) wrote `adds_most`/`adds_also`; a tap-based two-step most/then-least picker
(five options, same as now) briefly replaced it and wrote `want_most`/`could_skip` via two
taps plus a strikethrough for "least." Both `adds_most`/`adds_also` and that tap flow are
gone from the page. `adds_most`/`adds_also` are frozen, not deleted - old rows keep their
data, the page just no longer writes to them. `want_most`/`could_skip` are unchanged by
this second pivot (still the two column names, still one option key each). See §8.

As of 2026-09-23 the **full ranking** is recorded too, not just its ends. The page sends
`want_ranking` (all five keys, most wanted first). The sheet stores it as a comma-joined
`want_ranking` cell plus one `rank_<option>` column per option (`rank_chemistry` ...
`rank_building`, 1 = want most, 5 = could skip), so middle positions are sortable and
averageable across the cohort. If an option is added or renamed, update `RANK_OPTIONS` and
append its `rank_` column at the end of `COLUMNS` in the Apps Script.

**Question 2 does hidden work.** "A good Wednesday" extracts life-shape without asking for
it. Nobody performs on a Wednesday. The answers reveal whether someone's life has room in
it, which is the thing the checkbox apps cannot see.

Text answers are required, minimum two characters. While empty the button stays disabled
and the meta line reads *"a sentence or two."* Answers persist to `localStorage` so a
closed tab can resume.

**Question 4 is a slider, not text.** A 0-100% drag input (labeled "separate lives" to
"fully intertwined"), defaulting to 50, plus an optional textarea below it inviting the
person to say why. The slider always has a valid value, so "next" is never blocked on it.
The elaboration is folded into the same answer string: `70%` alone, or `70% — <note>` when
they wrote something. The spreadsheet column (`q4_sharing_life`) sees that same string, so
no Apps Script changes were needed to support it.

---

## 7. Technical

**Stack:** one static `index.html`. Vercel hosting, GitHub as source of truth, auto-deploy
on push to `main`. Google Apps Script Web App as the form backend, writing to a Google
Sheet. No build step, no framework, nothing external except the PostHog snippet and
MediaPipe. **This is deliberate. Resist adding a build step.**

**Repo, flat at root:** `index.html`, `privacy.html`, `ruby.jpg`, `404.html`, `vercel.json`,
`context.md`

### URL structure, and why

The QR code is printed. Its target can never change.

```
/          307 →  /c/01     the permanent QR target
/c         307 →  /c/01
/qr        307 →  /c/01?src=qr
/rsvp      307 →  /c/01?go=rsvp
/c/01      rewrite → /index.html
/privacy   rewrite → /privacy.html
```

Redirects are **307 (temporary)** on purpose. A 301 is cached by browsers indefinitely and
would weld a printed QR code to cohort 01 forever. To ship cohort 02: change the redirect
destinations and `CONFIG.cohort`. The printed code keeps working.

**Configuration lives in one `CONFIG` object** at the top of the script block: brand,
cohort, IG account, cities, cohort size, launch date, the poll array, the Apps Script
endpoint, the paywall toggle, founder bios. Change the site by changing `CONFIG`, not by
hunting through markup.

**The header menu is hand-listed in two places.** Its targets are the section ids `#idea`
`#how` `#experiment` `#rsvp` `#faq` `#team` on `index.html`, and `involved.html` links to the
same ones as `/#faq` (the fragment survives the `/` redirect). Rename a section and update both
menus. Anchor jumps land below the header through `html{scroll-padding-top}`, which is built
from `--fh-top` and `--fh-h`: change the header's height there, not in the padding.

### ☠️ Landmines, each one already stepped on

- **Never add `"cleanUrls": true` to `vercel.json`.** It strips `.html` at build time, which
  deletes `/index.html` as a rewrite target and 404s the entire site. This took production
  down on 2026-09-18.
- **Never set `keepalive: true` unconditionally** on the lead `fetch`. Browsers cap keepalive
  bodies near 64KB and compressed photos are ~150KB, so uploads vanished silently. The
  guard is `keepalive: body.length < 60000`.
- **Never change the POST from `mode:"no-cors"` + `Content-Type: text/plain;charset=utf-8`.**
  Apps Script cannot answer a CORS preflight. Any other content type breaks every
  submission, silently, with no console error.
- **Cohort must be sent as `"c" + CONFIG.cohort`.** Sending `"01"` makes Sheets coerce it to
  the number `1`.
- **The Apps Script is deployed from an NYU account.** If that account is restricted or
  expires, sign-ups break with no warning. Move it to a personal Google account before the
  QR code is printed.

---

## 8. Data

**Sheet** `1Jy7SUieIe0czsjNdIalHDSnUQ9BcJ-_izSGoxn1d2sw`, tab **`leads`**. Not `Sheet1`,
which is an empty decoy that has cost us time twice.

**QA rows never land in `leads`.** Any sign-up whose first name starts with `test`
(case-insensitive: `test`, `testing test`, `Test User`) is routed to a separate **`test`**
tab, created automatically on first use, with the same header row as `leads`. An id sticks
to whichever tab it first landed on for every later stage update, so one person's answers
never split across both sheets. See `targetSheetName_()` in `apps-script/Code.js`.

Rows are keyed by a client-generated `id` and **upserted at every stage**, so someone who
abandons at question four still leaves a usable partial row. This is already paying off:
several live rows sit at `details` or `q6` and are still worth following up. Stages run
`rsvp → q1 … q6 → poll_done`. `LockService` guards concurrent writes.

```
id created updated stage src cohort
name email cities looking
verify instagram photo photo_check verified_by_us
age meet price consent
adds_most adds_also
q1_relationship_adds q2_wednesday q3_friendships q4_sharing_life
q5_cared_for q6_not_done_yet q7_spoke_up_sooner
sensitive_consent marketing_consent
want_most could_skip
want_ranking rank_chemistry rank_ease rank_play rank_ambition rank_building
phone reach_on
```

- `email` holds the fallback contact **only** when `verify == "photo"`. There is no email
  field on the Instagram path.
- `looking` is a **drag-to-rank list**, not a checkbox pick. All four options (a date,
  something serious, new friends, finding my people) are always present; the person orders
  them most-to-least wanted. It's stored as one comma-joined string, most wanted first, so
  reordering never changes the sheet shape, only the order within the cell.
- `photo` is a **Drive link**, never image data. Sheet cells cap at 50,000 characters and a
  base64 photo runs about 200,000. Photos live in the Drive folder
  `datein5days / verification photos`.
- Poll answers are mapped **by the `key` field** each question carries, so reordering
  `CONFIG.poll` no longer corrupts the columns. If you add a question, add its key to
  `POLL_MAP` in the Apps Script and add the column to `COLUMNS`.
- `consent` (18+), `sensitive_consent` (explicit consent to use dating/matching preferences
  including anything revealing sexual orientation) and `marketing_consent` (optional,
  opted-in comms) are three **separate** checkboxes as of 2026-09-19, per legal review.
  `sensitive_consent` and `marketing_consent` were **appended to the end of `COLUMNS`**,
  not inserted near `consent`, specifically so older rows' existing data doesn't shift
  under new headers. Rows from before that date have `consent` only, blank
  `sensitive_consent`/`marketing_consent` — that's correct, not a bug: those people were
  never asked. Never backfill them. See `/privacy.html` for what each legal basis covers.
- `want_most`/`could_skip` (each an option key: `chemistry`, `ease`, `play`, `ambition`,
  `building`) are Question 1's real output as of 2026-09-20, also **appended to the end of
  `COLUMNS`** for the same shift-nothing-under-old-headers reason. `adds_most`/`adds_also`
  are frozen: the page no longer writes them, but rows from before that date keep theirs.
  Never backfill `want_most`/`could_skip` onto old rows, same rule as above.

### 🔒 Promises made to users, in writing, on the page

These are commitments, not preferences. Do not trade them for convenience.

- The Drive folder of verification photos **stays unshared**. The page says "only the two of us see it."
- The face check **stays in the browser**. No photo is transmitted for detection.
- **No lead payloads in `console.log`.** Removed deliberately.
- Any future admin view shows **totals only.** No names, no answers, no handles. A
  hard-to-guess URL is not access control.
- We do not post, comment, message, or follow from the Instagram account. The page says so.

---

## 9. Analytics

PostHog, project **142716**, US region. The `phc_…` key in the page is the **public**
project key and belongs in client source. The `phx_…` personal key is a secret and must
never appear in this repo or in a chat.

`person_profiles: "identified_only"`. Session replay masks all inputs, masks
`[data-ph-mask]`, blocks `[data-ph-block]` (the photo dropzone), and does not capture
console logs. `?src=…` tags traffic; `src=qr` is the printed code, `src=claude-test` is
test traffic and every dashboard insight filters it out.

> ⚠️ **Capture is opted out by default for everyone, as of 2026-09-19, on legal review.**
> There is no consent flow yet, so PostHog must not fire for a regular visitor. `?team=on`
> opts a device in for internal QA; `?team=off` opts back out. Do not flip
> `opt_out_capturing_by_default` back to conditional without a real consent mechanism in
> place. Meta Pixel / Google Analytics were checked and are **not** loaded anywhere on the
> page (the dead `window.fbq?.()` call in `track()` was removed); if either is ever added,
> it must be gated the same way.

Events: `rsvp_sent`, `question_answered` (with `q`), `questions_done`, `poll_resume`,
`verify_mode`. Dashboard **2107266**, "datein5days: cohort 01 launch."

**Read the dashboard with §3 in mind.** Drop-off through the questions is the filter
working. The number that matters is how many people finish *with real answers*, not what
fraction of visitors finish.

---

## 10. Open items

- [x] Instagram path collects no contact channel. Fixed 2026-09-23: phone + `reach_on` in step 2 (see §3).
- [ ] Retention vs. waitlist: privacy notice deletes data 3 months after the cohort, but out-of-town RSVPs are promised "first to go" when their city opens. Ruby to decide.
- [x] Privacy notice. Live at `/privacy` (`privacy.html`), linked from the footer and from
      the RSVP consent step. Controller, purposes, legal bases, recipients/processors,
      transfers, retention, rights, withdrawal and complaint rights are all in it.
- [ ] Move the Apps Script off the NYU Google account
- [x] Kai founder photo added (`kai.jpg`, same 360x480 treatment as `ruby.jpg`)
- [ ] Delete only the rows whose `src` is `claude-test`, and the one corrupted row (id repeated across every column). **Everything else in `leads` is a real sign-up.**
- [ ] Delete the `Sheet1` tab (empty decoy) and the test photo from Drive
- [ ] Share Sheet and Drive folder with Ruby; invite Ruby to PostHog
- [ ] Rename the PostHog project from "Default project" and fix its app URL

---

## 11. Working on this

- Edit `index.html` directly. No build, no framework, no bundler.
- Prefer changing `CONFIG` over changing markup.
- After any change to the form or the poll, **walk the entire flow in a headless browser**
  before shipping. Stub `script.google.com` and `*.posthog.com` so tests never write rows.
- Push to `main` deploys to production. There is no staging.
- Verify a deploy by asserting `/c/01` returns **200**. `/` returning a 307 proves nothing:
  the redirect working while the page 404s is exactly the failure already seen.
- Before committing copy, check it against §4. Before committing a visual, ask whether it
  is the printed form or the hand.
