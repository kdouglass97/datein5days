# five days / datein5days — project context

> Read this before touching the repo. It exists so that any tool or collaborator arriving
> cold can make a change that **fits** rather than a change that merely works. Most of what
> follows cannot be inferred from reading `index.html`. That is the point of the file.

Cohort 01 launches **Sep 21, 2026** · Last updated 2026-09-18
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

**Tbilisi is first on the city list on purpose.** Kai is there. Cohort 01 is small enough
that founder presence in a city is an operational input, not a coincidence.

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

> 🔴 **Open product gap, unresolved.** The Instagram path collects **no contact channel**.
> The photo fallback collects one. If Instagram DMs are not the outreach method, every
> Instagram-verified lead is currently unreachable. Do not paper over this in copy by
> implying a contact method that does not exist. Fix it in the form or decide the channel.

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
- `prefers-reduced-motion` is honored through a `reduced` flag that skips animation.

**Layout:** single column, mobile-first, `540px` measure. Most traffic is a phone scanning
a printed QR code, standing up. Nothing should require two hands or a wide viewport.

---

## 6. The flow

```
QR / link  →  /  →  307  →  /c/01
                              │
            step 1: RSVP      name · Instagram (or photo fallback) · cities · what you're looking for
            step 2: details   age range · who you'd like to meet · price perception · 18+ consent
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
| 1 | `relationship_adds` | rank | What do you most want a relationship to add to your life? |
| 2 | `wednesday` | text | What does a good Wednesday in your life look like? |
| 3 | `friendships` | text | What do you value most in your closest friendships? |
| 4 | `sharing_life` | slider | In your ideal relationship, how much of your life do you want to share with your partner? |
| 5 | `cared_for` | text | Think of a time someone made you feel really cared for. |
| 6 | `not_done_yet` | text | What's something you really want to do with your life that you haven't done yet? |
| 7 | `spoke_up_sooner` | text | What's something you wish you'd spoken up about sooner in a close relationship or friendship? |

**Question 1 is load-bearing.** It is the thesis from §1 turned into an input. Its two
outputs, `adds_most` and `adds_also`, are the primary matching signal. Everything else is
texture that helps a human judge fit. Options, choose up to 2 then pick the one that
matters most: *Teammate, Emotional support, Companionship, Adventure/activity,
Affection/closeness, Growth, Family/home, Fun/playfulness, Independence + partnership.*

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

**Repo, flat at root:** `index.html`, `ruby.jpg`, `404.html`, `vercel.json`, `context.md`

### URL structure, and why

The QR code is printed. Its target can never change.

```
/          307 →  /c/01     the permanent QR target
/c         307 →  /c/01
/qr        307 →  /c/01?src=qr
/rsvp      307 →  /c/01?go=rsvp
/c/01      rewrite → /index.html
```

Redirects are **307 (temporary)** on purpose. A 301 is cached by browsers indefinitely and
would weld a printed QR code to cohort 01 forever. To ship cohort 02: change the redirect
destinations and `CONFIG.cohort`. The printed code keeps working.

**Configuration lives in one `CONFIG` object** at the top of the script block: brand,
cohort, IG account, cities, cohort size, launch date, the poll array, the Apps Script
endpoint, the paywall toggle, founder bios. Change the site by changing `CONFIG`, not by
hunting through markup.

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
```

- `email` holds the fallback contact **only** when `verify == "photo"`. There is no email
  field on the Instagram path.
- `photo` is a **Drive link**, never image data. Sheet cells cap at 50,000 characters and a
  base64 photo runs about 200,000. Photos live in the Drive folder
  `datein5days / verification photos`.
- Poll answers are mapped **by the `key` field** each question carries, so reordering
  `CONFIG.poll` no longer corrupts the columns. If you add a question, add its key to
  `POLL_MAP` in the Apps Script and add the column to `COLUMNS`.

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
console logs. `?team` opts a device out permanently, `?team=off` opts back in. `?src=…`
tags traffic; `src=qr` is the printed code, `src=claude-test` is test traffic and every
dashboard insight filters it out.

Events: `rsvp_sent`, `question_answered` (with `q`), `questions_done`, `poll_resume`,
`verify_mode`. Dashboard **2107266**, "datein5days: cohort 01 launch."

**Read the dashboard with §3 in mind.** Drop-off through the questions is the filter
working. The number that matters is how many people finish *with real answers*, not what
fraction of visitors finish.

---

## 10. Open items

- [ ] Instagram path collects no contact channel (see §3). Unresolved, and blocking.
- [ ] Privacy policy. Footer link is still `href="#"`. Matters more than usual: face photos.
- [ ] Move the Apps Script off the NYU Google account
- [ ] Kai has no founder photo, renders as the initial "K"
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
