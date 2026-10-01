# five days / datein5days — project context

> Read this before touching the repo. It exists so that any tool or collaborator arriving
> cold can make a change that **fits** rather than a change that merely works. Most of what
> follows cannot be inferred from reading `index.html`. That is the point of the file.

Cohort 01: **New York, private beta** (the fixed Sep 21 date was retired 2026-09-23) · Last updated 2026-09-30
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
and a mobile ICP may use both. `/admin`'s "by place" card tests that claim, region by
region (§8). Email was rejected: the follow-ups (your city opened, the
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
- **The hero opens in two beats, about 3s, CSS only.** The sealed envelope floats down out of
  focus onto the table (`.env`, `.env-tilt`), then the flap swings open as it lands and the
  letter follows it out; the polaroids and the clip come last. Every piece animates *from* a
  start state, so reduced motion or no JS simply renders the final frame. The envelope is a
  small 3D scene: its pieces sit sub-pixel distances apart in z (the stage has perspective,
  so bigger offsets visibly scale them), and their z-indexes repeat the same order for the
  moments the scene is flattened. Keep both orders in sync if you add a piece.
- **Polaroids never cover type.** On phones and tablets (≤820px) they land on the letter, so
  each is placed to clear the words: the top-left one stays off the D of "DATE" and rises only
  30px above the stage (which sits 40px under the top bar, so the wordmark stays clear), the
  right one drops below the S of "DAYS", the bottom-left one clears "WE HANDLE THE ADMIN". The
  stage scales with `--w`, so a placement holds across its breakpoint, but anything that widens
  the headline (size, tracking, `opsz`) or resizes a polaroid needs a re-check at 320, 375,
  393, 430 and 768. Until 2026-09-26 the top-left one covered the D on phones and tablets.
- The **floating header** (`.fhead`, on `/c/01`, `/involved` and `/privacy`, added 2026-09-23) is the
  printed form: a paper strip that drops in once the hero's own topbar scrolls away, with a
  "menu" card. **The menu card is a table of contents in the header's order** (2026-09-30): the
  four pages in italic Bodoni, *experiment no. 01 / why five days / faq / get involved*, with the
  landing page's six parts typed small under "experiment no. 01" behind a dashed rule, like acts
  under a title in a programme. On phones the card is the only navigation, so it must hold every
  page in the same order as the desktop strip; don't scatter pages into its foot again. The foot
  keeps leave us a note, privacy and the glyphs. The current page is inked in deep green and
  underlined; on the landing page the pen underline also moves live under the part you're in
  (the script only touches the nested list, so the page mark stays). On touch screens it steps aside
  while a text field has focus, so the questionnaire stays a clean writing surface.
  **The strip's links are typed apart with the same slash as the topbar and footer**, in a
  lighter ink, and a dashed perforation, the menu card's own rule, tears "menu +" and rsvp off
  as the stub: the pages are places, the stub is what you do (added 2026-09-30; before it the
  row read as one sentence). The strip is 780px wide and the wordmark never wraps. Its page links
  leave at 680px (700px on `/privacy`, which names five); below that it's the wordmark, the
  stub, and nothing else. A new header link means re-measuring that breakpoint.
  Its one button is **rsvp, at every width**; on the landing page it fades while the form
  itself is on screen. The strip
  replaced a phone-only bottom dock on 2026-09-24: with rsvp in the strip, a second sticky
  rsvp was one too many, so don't bring the dock back. The strip carries **no social glyphs**
  either: it follows the reader through the questionnaire, and a standing way off the page
  beside rsvp competes with the one thing the strip is for. They wait in the menu card's foot.
  **On phones the hero topbar carries a "menu" button** (added 2026-09-29) that drops the strip in
  with its menu card open, so the pages are reachable before any scroll; closing it while the
  topbar is still on screen puts the strip away again.
  **On phones the landing topbar holds no page link** (decided 2026-09-30): `five days · no. 01 ¦
  menu + · glyphs`. It used to keep "get involved", and a lone link up there reads as the site's
  headline: whichever page it names looks like the most important thing, and every candidate
  (get involved, faq, why) is a detour away from rsvp at the moment of highest intent. The menu
  has them all. "no. 01" stays because it's where you are, the edition number on the invitation,
  not a choice. The same cream perforation as the strip sits before "menu +", so the two don't
  read as one phrase. Below 340px the cohort number goes too, never the glyphs.
- **`.mk` pen underlines are `inline-block`.** As plain inline boxes, iOS Safari anchored the
  absolutely placed stroke to the wrong line when the phrase sat at a line end: on `/faq` it
  drew under the next line and ran off the screen.
- **Instagram and TikTok glyphs** (added 2026-09-26) are the printed form: monoline outlines at
  the typewriter's stroke weight, one `<symbol>` each (`#i-ig`, `#i-tt`) in every page's hidden
  defs, never the brands' colors. The hand is the pen loop (`#i-ring`) that circles one on
  hover. Each placement has its own job:
  - **the hero topbar is for being seen.** Someone who just scanned a QR code checks that real
    people with a public history are behind this before handing over their own Instagram. The
    glyphs sit static, small and cream in the top corner, which is the hardest spot to reach
    one-handed, so they read as proof without pulling taps from rsvp. When the topbar runs out
    of room the cohort number goes first (`.xp` at 860px, then `.no` at 340px on the landing
    page; 480/380 on `/privacy`, whose topbar is shorter), never the glyphs.
  - **the footer is for being clicked.** Larger glyphs plus the handle: the follow is the
    second-best outcome for someone who read to the end and isn't ready to rsvp.
  - **the menu card** holds them for anyone who goes looking.
- **`/privacy` wears the `/involved` frame** (grass hero, arc, grain, footer; added 2026-09-25),
  with a sealed envelope sketch whose wax seal presses on last. The notice sits on a *square*
  sheet with a letterhead band, the one deliberate exception to "never square": a long legal
  read stays level, and the page peeking out beneath it takes the tilt. The pen marks only two
  promises, "do not sell" and "no later than 7 days". The notice's words are legal text:
  restyle them, never reword them (headings are lowercased, nothing else changed).
- **`/faq` wears the `/involved` frame too** (added 2026-09-29): the same ten questions as the
  landing page's `#faq`, on their own page for anyone who wants answers before the pitch. It's
  linked as "faq" in every header strip and hero topbar and every footer. **Desktop headers
  read the same on every page: experiment no. 01 / why five days / faq / get involved** (plus privacy, on
  `/privacy`), in that order: the thing, the questions about it, then going further. On phones
  the topbar keeps only the page you're on (on the landing page, the cohort number); the rest
  are in the menu card.
  "leave us a note" stays out of the headers: it opens a sheet rather than going somewhere, and
  rsvp is the header's one action. The printed form is the numbered list, the find field and
  the topic chips; the hand is the clay pen loop that circles the number of an open question and
  the highlighter pass over a search hit, and beside the "questions" heading a **tin-can
  telephone** (a "?" rides the string over, a "!" comes back: asking, answered by hand; it
  plays once on arrival and on every tap). **"who picks my match?" is always question one**,
  on both pages: it is the whole proposition in one answer. **Haven**, our pigeon (the same sketch `note.js` uses),
  stands on the sealed envelope in the hero: the head follows the pointer, a tap gets a line typed
  into a paper scrap, and at the foot Haven paces with a letter and opens "leave us a note". Each
  question has an id (`/faq#cities`) that opens it. **The questions are hand-copied in three
  places**: `index.html`'s `#faq`, `faq.html`'s list, and `faq.html`'s `FAQPage` JSON-LD. Change
  one, change all three. The cost answer on `/faq` is static: flipping `paywall` needs it
  edited by hand. The last three are about cities and end on "how do i bring this to my city?",
  which hands off to `/involved`: an out-of-town reader should leave with something to do, not
  just a no. Answers may hold a link; the find field marks text nodes only, so links survive.
- **`/why` is the letter inside the envelope** (`why.html`, added 2026-09-30; `/story`, an older
  preview link, 307s to it). The landing page covers what happens to you; `/why` answers the one
  thing it doesn't: who is doing this, and why trust them. It must **never re-run the pitch**:
  no thesis diagram, no founder flip cards, no timeline of the five days, since each of those
  already has its landing section. Five blocks: the hero ("dating means going
  on dates."), **"the short version"**, the letter, "what we crossed out", and "pull up a chair.".
  The short version (added 2026-09-30, because the letter alone didn't say where we're going at a
  glance) is four paper cards, one line each, with a typed label and a pen glyph: *where we're
  going* (a world where people meet, not match), *what we do* (the mission, word for word, its one
  appearance), *why* (matching interests isn't the same as matching lives) and *what's next* (New
  York first, then every major walkable city, with a pen-drawn route). The labels are plain words,
  never "Mission", "Vision" or "Values". The letter is the founders' own (Kai and Ruby's draft, set
  2026-09-30, their wording kept): Ruby's part (the Netherlands, "Op ieder potje past een
  dekseltje", set off as a quote; the pen underlines "the one that fits."), signed with her
  polaroid; Kai's part (2026-10-01, his tightened draft plus two restored lines, "A break. From trying to meet someone." and "None of that fits on a profile.": the friend people send screenshots to; situationships; being kept as an option; a friend running another friend's profile and asking month-three questions; "We won't get every date right", date not match; ends "Modern problems, medieval solutions." set in italic), signed with his; then a
  shared close ending "That part is yours.", signed by both. Its `re:` is "a letter from the
  founders". The letter is set in the serif (a handwritten-font version was tried on
  2026-09-30 and set aside). Each part is signed with **the founders' real signatures**, traced
  from ink on paper into two `<symbol>`s (`#sig-ruby`, `#sig-kai`) and wiped in left to right on
  reveal, with the name typed small beneath, since neither signature is legible. The shared sign-off
  pairs the two signatures (tilted a few degrees, so they read dashed off, not notarized) with a
  **postage stamp** on the left: perforated edge, a clay 5, "NEW YORK", and inside it a pen-and-wash
  dusk scene, Haven on a bench with a letter in his beak, water towers, a flickering street lamp,
  the moon; a clay "NYC 01" postmark cancels its corner. Tap it and Haven hops. It exists because
  two signatures alone read as a presidential sign-off, not the site's playful register. With it the page runs past the 400-word budget, by the founders' choice. On this page we set up, seat and
  introduce; "match" only ever describes what the apps do. "what we crossed out" is the values
  section written as refusals: the pen strikes each line on reveal, a tap shows what took its place,
  and every line must be a promise that outlives cohort 01 (so no "a subscription": free is a beta
  condition). Haven paces with a letter at the foot, as on
  `/faq`. The hero's line sits between two paper props that land on load: a calendar leaf
  ("thu, 8pm", circled by the pen) and a kraft ticket stub ("admit two", ticked). Beside the h1 on
  wide screens, in a row beneath it below 1000px. As of 2026-09-30 **it's in every header**:
  desktop topbars and strips read **experiment no. 01 / why five days / faq / get involved** (the
  thing, why we do it, the questions, going further), and it's second in every menu card's
  list, in the same order. Below 860px the topbar drops the word "experiment"; on `/privacy`, which names one more
  page, the cohort number leaves both bars below 760px. The strip is 780px wide to hold it. It's
  also in every footer, one quiet line under the landing `#team` cards ("why we're doing this →")
  and "Here's why." in the `/involved` intro.
  Never beside the RSVP form: the form is the page's one action.
- **The divider under every hero is one straight diagonal**: about 3°, rising to the right, a
  10px cream rule. Subpages draw it as the `.arc` SVG; the landing page draws it as a hard-stop
  `linear-gradient(177deg…)` on `.hero`, because the envelope sits across it. Until 2026-09-29
  the landing page used an ellipse (`radial-gradient`), so its line curved and its thickness
  grew with the hero's height while the subpages held 8px. Keep the two in step.
- **The favicon is the envelope's wax seal**: clay, an italic Bodoni 5, the inner ring
  (`share/icon.html`, rendered with the OG card by `node share/render.js`; added 2026-09-26).
  Below 48px the 5 goes heavier and the ring goes, the same hairline problem as above at its
  most extreme.

**Layout:** single column, mobile-first, `540px` measure. Most traffic is a phone scanning
a printed QR code, standing up. Nothing should require two hands or a wide viewport.

---

## 6. The flow

```
QR / link  →  /  →  307  →  /c/01        (tagged links: /qr, /ig, /@maya … → /c/01?src=…, §9)
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

**Repo, flat at root:** the pages (`index.html`, `faq.html`, `why.html`, `involved.html`, `privacy.html`, `404.html`,
and `admin.html`, the team dashboard),
`note.js`, `attr.js`, the images, the icons, `robots.txt`, `sitemap.xml`, `vercel.json`, and
`.vercelignore`, which decides which of those actually deploy. Notes (`context.md`,
`CLAUDE.md`), `apps-script/` and `share/` live here too but never reach the site.

### URL structure, and why

The QR code is printed. Its target can never change.

```
/          307 →  /c/01     the permanent QR target
/c         307 →  /c/01
/qr        307 →  /c/01?src=qr
/rsvp      307 →  /c/01?go=rsvp
/c/01      rewrite → /index.html
/privacy   rewrite → /privacy.html
/faq       rewrite → /faq.html
/why       rewrite → /why.html   (/story 307s here)
/admin     rewrite → /admin.html   the team dashboard, password only, §8

/ig /tt /invite /@<name>   307 →  /c/01?src=…   the link book, §9
```

Redirects are **307 (temporary)** on purpose. A 301 is cached by browsers indefinitely and
would weld a printed QR code to cohort 01 forever. To ship cohort 02: change the redirect
destinations and `CONFIG.cohort`, and move the canonical and `og:url` in `index.html` and the
entry in `sitemap.xml` to the new path. The printed code keeps working.

**Configuration lives in one `CONFIG` object** at the top of the script block: brand,
cohort, IG and TikTok accounts, cities, cohort size, launch date, the poll array, the Apps
Script endpoint, the paywall toggle. Change the site by changing `CONFIG`, not by hunting
through markup. The one exception is anything a search engine should read (see below): the
founder cards are markup in `#team`, not config.

### Search engines and crawlers

As of 2026-09-26 the site invites crawlers in. The invitation is marketing: we want it
read, quoted, and repeated, by search engines and AI tools alike.

- `robots.txt` allows everyone, AI training and search crawlers included, and points to
  `sitemap.xml`, which lists `/c/01`, `/faq`, `/involved` and `/why`. A new public page goes in the sitemap.
- `/privacy` is `noindex` by design. Never `Disallow` it in `robots.txt`: a blocked page
  can't show Google its `noindex`, and the bare URL can get indexed anyway.
- `/c/01` and `/involved` carry a canonical tag, which folds every `?src=` tag, `?go=rsvp`,
  `?team=on` and the vercel.app copy into one URL.
- **AI crawlers don't run JavaScript.** Anything worth quoting has to be in the HTML, not
  injected by the script. That's why the founder cards moved from `CONFIG` into markup.
- `index.html` carries JSON-LD (`WebSite` + `Organization`) naming the founders. Keep it in
  step with `#team`.

**The header menu is hand-listed in five places** (`index.html`, `faq.html`, `involved.html`,
`privacy.html`, `why.html`): the four pages in header order, the six landing parts nested under
the first; so are the menu card foot (leave us a note, privacy) and the footer link row (which
adds why five days). Its targets are the section ids `#idea`
`#how` `#experiment` `#rsvp` `#faq` `#team` on `index.html`, and `involved.html` and
`privacy.html` link to the same ones as `/#faq` (the fragment survives the `/` redirect).
Rename a section and update all three menus. The social glyphs are hand-copied the same way
(topbar, menu card, footer on each of the three pages); `CONFIG` only rewrites `index.html`'s,
so a handle change is a find-and-replace across all three files. Anchor jumps land below the header through
`html{scroll-padding-top}`, which is built from `--fh-top` and `--fh-h`: change the header's
height there, not in the padding.

### What a stranger can see, and what they can't

Everything a browser downloads is public: the page source, `note.js`, `attr.js`, `CONFIG`. So
the site holds no secrets, by design. The two things in it that look like keys aren't:

- **PostHog's `phc_…` key** can send events, never read them (§9).
- **The Apps Script `/exec` URL** has to be in the page for the form to post to it. Anyone can
  post anything to it, which is why `Code.js` treats every field as hostile (landmines, below).

What is private, and what keeps it that way (checked 2026-09-28):

- **The sheet** is shared with two named accounts, no link sharing. Its ID was public from
  2026-09-18 to 09-26, while `apps-script/Code.js` was a URL, so that sharing setting is the
  whole defense. Never turn on "anyone with the link".
- **The photo folder** is owner-only, and a promise (§8).
- **`CLASPRC_JSON`**, the repo secret that deploys the script, is a Google login that can
  rewrite the backend and so read everything. `apps-script.yml` pins clasp to an exact version
  with install scripts off, so only a known clasp runs next to it.
- **`ADMIN_PASSWORD`**, the `/admin` password, lives in GitHub's secret store and the Apps
  Script project, never the repo (§8). The deploy writes it to disk beside clasp too, one more
  reason for the pin. Nothing limits guesses at it, so keep it long and random.
- **The repo** is private. Old deployments, which did serve `context.md`, sit behind Vercel
  Authentication (Standard Protection); only the custom domains are public.

The guards:

- **`.github/workflows/leak-check.yml`** fetches the live site like a stranger: every repo file
  `.vercelignore` leaves out must 404, the site must serve exactly `main`, nothing served may
  look like a secret key, and the headers must be on. It runs after every auto-ship merge
  (through `workflow_run`: those merges can't trigger push workflows), daily, and on demand.
  Its key scan also runs in `auto-ship.yml` before every merge, so a key can't ship. A
  failure shows red in the Actions tab.
- **`vercel.json` headers**, on every path: no framing (`frame-ancestors`, `X-Frame-Options`)
  except by PostHog's heatmaps, no MIME sniffing, a referrer policy, `form-action 'none'` (a
  form that ever submitted natively would put a name and number in a URL), and a
  `Permissions-Policy`. HSTS is set here too, at Vercel's own default, so it never rests on a
  platform default nobody can see.
- **No `script-src` in the CSP, on purpose.** Every page is inline script, so it would need
  `'unsafe-inline'`, which cancels most of its value, and a wrong allowlist breaks PostHog or
  the face check without a sound. Hashing the inline scripts needs a build step (see Stack).

### ☠️ Landmines, each one already stepped on

- **Never add `"cleanUrls": true` to `vercel.json`.** It strips `.html` at build time, which
  deletes `/index.html` as a rewrite target and 404s the entire site. This took production
  down on 2026-09-18.
- **`.vercelignore` is an allowlist.** A new file the site serves (a page, an image, a
  script) must be added to it, or it 404s in production while working fine locally. It
  exists because, with no build step, Vercel served the whole repo root: until 2026-09-26
  this file and `apps-script/` were public URLs. The leak check fails either way: a served
  file that isn't live, or a private one that is.
- **The leak check never asks for `/.env`, `/.git/…` or any dotfile.** Its first version did,
  on 2026-09-28, and Vercel's firewall took the runner for a scanner: everything after got 403,
  headers included. A 403 proves nothing, so the check counts it as unchecked and fails; it
  only passes on a plain 404. It also paces itself and names itself in the User-Agent.
- **`Permissions-Policy` keeps the microphone at `(self)`.** Voice answers use it. A copied
  "secure headers" template with `microphone=()` kills them without an error (tested
  2026-09-28), and the leak check fails if it's dropped. Camera, geolocation and payments are
  off: a live selfie capture or an on-page Apple Pay button has to be allowed there first.
- **Every value bound for the sheet goes through `cellValue_()`** in `Code.js`, old values too.
  `getValues()` hands text back without the apostrophe that kept it inert, so an upsert that
  skipped it would re-arm a formula someone typed as their name. Before 2026-09-28 only notes
  were guarded, so a sign-up "name" like `=IMPORTXML("https://…", …)` became a live formula.
- **Apps Script files share one global scope, and a second function with the same name
  silently replaces the first.** On 2026-09-28 a merge brought two `cell_()`s together (the
  dashboard's counter and the sheet guard) and every sign-up would have failed, while the page,
  which can't read the reply (`no-cors`), told people they were in. `auto-ship.yml` now refuses
  a merge that defines any name twice.
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
via
```

- `src` and `via` say where someone came from: which of our links, and which app. See §9.
  `via` was appended 2026-09-25; older rows stay blank, same never-backfill rule as below.
- A **`sources`** tab sits beside `leads`: formulas that total rsvps and finished
  questionnaires per link, per link and app (`@maya · tiktok`), and per app. It's built on
  the first real sign-up. The sheet holds sign-ups only: visits belong in PostHog (§9).
- **`/admin`** (`admin.html`, added 2026-09-28) is the team dashboard over `leads`, and it is
  not public: nothing on the site links to it, it's `noindex` and out of the sitemap, and
  until the password is in it shows the wordmark and a password box, nothing else. Behind
  it: sign-ups by day, how far people get, age, who they'd like to meet, what a date is
  worth, what they're looking for, the sharing slider, words written, question one's
  want-most/could-skip, cities, links and apps, each split into everyone and those who
  answered all seven. "side by side" crosses city, age, who they'd like to meet and what a
  date is worth (the two age tables also for New York alone), for everyone or only those
  who answered all seven. A city
  needs three people in a view for its own row; smaller ones share "elsewhere", which also
  waits for three, so a city row never points at one or two people. "by place" (added
  2026-09-28) reads two answers across places, each row split into shares that add to 100%
  so a small city sits on New York's scale: city × what a date is worth (plus the share at
  $50 or more), and region × which app they'd rather be texted on. Region is the country
  calling code on `phone`: the Apps Script reads the code off the number and keeps nothing
  else of it (`callingCode_()`), and the page names it (+1 is the US, Canada and much of
  the Caribbean). Rows from before 2026-09-23 have no number, so they sit out that table.
  Each by-place table picks its own rows by the same three-person rule. "who keeps their own
  life" (added 2026-09-30) tests the independence hunch: that older people in tier-one
  cities who'd pay more for a date want to share less of their life. It reads the sharing
  slider three ways, each row split into five bands (50 is its own band, since the slider
  starts there) with its share under 50 and its median: by age, by what a date is worth, and
  tier one against elsewhere. Tier one is roughly GaWC's alpha++ and alpha+ (`TIER_ONE` in
  the Apps Script); listing any of them counts. Age and price each get a rank correlation
  (Spearman) in words, with the size it needs to clear the noise at that head count. A
  fourth table, age × what a date is worth, shows the median in each square, switchable to
  tier one or elsewhere; a square needs three people for a median, a row three for its own
  line. One count switch drives all three cross cards. Own gender isn't asked, so "meet" is the only gender axis there
  is (§10). The page refreshes every minute while open and says what's new since you last
  looked.
  "shipped this week" (added 2026-09-30), the last card, lists what merged to `main` since
  Monday (the viewer's Monday), with a count against the week before and tags for what each
  merge touched (landing, faq, admin, sheet, guards …, read off its files). It is not in the
  page source: the repo is private, so the titles sit behind the password like everything
  else. After every deploy, `apps-script.yml`'s `shipped` job runs `.github/scripts/shipped.js`,
  which posts the last two weeks of `main` (`{ kind: "shipped" }`, signed with an HMAC of the
  password under its own label, so a device's token can read it but never write it); the
  Apps Script keeps it in one Script Property and `stats_()` returns it. Titles are the PR
  titles, so a clear PR title is a clear line on the card.
  The password is the **`ADMIN_PASSWORD` repo secret** (8+ characters; unset means locked).
  The Apps Script deploy writes it into `apps-script/secret.js` just before `clasp push`;
  that file is in `.gitignore` and must never be committed, and the password never goes in
  the Sheet either. To change it, update the secret and run the Deploy Apps Script workflow
  by hand (a secret change alone doesn't trigger it). Devices keep a token derived from the
  password, never the password, and a new password signs them all out. The page asks the Apps Script by POST
  (`{ kind: "stats" }`, `stats_()`), so the password never sits in a URL. `?tab=test` counts
  the `test` tab; `?demo` shows made-up numbers on a local copy or a preview, never on the
  live domain. Don't put `/admin` in `robots.txt`: a Disallow line advertises the path, and
  `noindex` already keeps it out of search. It loads no PostHog, no `attr.js` and nothing
  else that counts visits: team visits aren't traffic, and a device opted in with
  `?team=on` would otherwise put us in the dashboards. The auto-ship workflow refuses to
  merge a change that adds any of them to `admin.html`.

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
  hard-to-guess URL is not access control. `/admin` is built to this: the Apps Script
  aggregates before anything leaves Google, and the page opens only with the password. Keep
  it that way. A per-person feed (even "a 25–29 finished at 14:02") breaks this promise.
- We do not post, comment, message, or follow from the Instagram account. The page says so.

---

## 9. Analytics

PostHog, project **142716**, US region. The `phc_…` key in the page is the **public**
project key and belongs in client source. The `phx_…` personal key is a secret and must
never appear in this repo or in a chat.

`person_profiles: "identified_only"`. Session replay masks all inputs, masks
`[data-ph-mask]`, blocks `[data-ph-block]` (the photo dropzone), and does not capture
console logs. `src=claude-test` is test traffic and every dashboard insight filters it out.

> ⚠️ **Capture is opted out by default for everyone, as of 2026-09-19, on legal review.**
> There is no consent flow yet, so PostHog must not fire for a regular visitor. `?team=on`
> opts a device in for internal QA; `?team=off` opts back out. Do not flip
> `opt_out_capturing_by_default` back to conditional without a real consent mechanism in
> place. Meta Pixel / Google Analytics were checked and are **not** loaded anywhere on the
> page (the dead `window.fbq?.()` call in `track()` was removed); if either is ever added,
> it must be gated the same way.

PostHog loads only on `/c/01` (`index.html`). `/admin` loads neither PostHog nor `attr.js`,
so the team dashboard never shows up as a visit, a replay or a link credit, and auto-ship
checks `admin.html` for them before every merge (§8).

Events: `rsvp_sent`, `question_answered` (with `q`), `questions_done`, `poll_resume`,
`verify_mode`. Dashboard **2107266**, "datein5days: cohort 01 launch."

Outbound social clicks: `social_ig_top` / `social_tt_top` (hero topbar) and `social_ig_foot` /
`social_tt_foot` (footer); the menu card's arrive as `nav_menu_go` with the URL. Once capture
is on for real visitors, check the hero pair against `rsvp_sent`: if people leave through the
glyphs before rsvping, the topbar ones go and the footer keeps its pair.

**Read the dashboard with §3 in mind.** Drop-off through the questions is the filter
working. The number that matters is how many people finish *with real answers*, not what
fraction of visitors finish.

### Where people come from

Nothing in a request can tell a text from a QR scan from a typed address: all three arrive
carrying nothing. So attribution is **stamped into the link before it leaves our hands**,
and the page reads it back (`attr.js`, on every page). Every lead gets two fields:

- `src`: which of our links they used. We know it only because we minted the link.
- `via`: which app the click came from, read off the in-app browser (instagram, tiktok,
  threads, facebook, wechat …), the referrer (google, x, or the bare host of anything
  unknown) or, on Android, the app that opened the link (whatsapp, sms, gmail). iMessage,
  WhatsApp on an iPhone, QR scans and typed addresses read `none`: the blind spot `src` covers.

**The link book.** All 307s in `vercel.json`, so a printed or posted link never goes stale.

| link | src | for |
|---|---|---|
| `/ig`, `/tt` | `ig`, `tt` | our own Instagram and TikTok: bios, stories, DMs |
| `/invite` | `invite` | a link either of us texts or sends to a person |
| `/@<name>` | `@<name>` | a creator, e.g. `/@maya`. Any name works, no deploy (below) |
| `/qr` | `qr` | the printed code |
| share button | `friend` | "send to a single friend" |
| the bare link | `direct` | they found us on their own (see below). No per-founder links, by choice |

**A creator gets one link for every platform.** Maya pastes `/@maya` in her Instagram bio,
her stories and her TikTok, and `via` says which one each click came from: the `sources` tab
lists `@maya · instagram` and `@maya · tiktok` as separate rows, next to Maya's total.
Don't hand out per-platform links: the app is detected more reliably than a creator pastes
the right link in the right place. For a placement where the app can't be seen (a
newsletter, a podcast), mint a variant on the spot: `/@maya-podcast`.

**There is no list of creators.** Whatever follows `/@` becomes the label, so the link you
send a creator *is* their registration: nothing to add in code or in the sheet when a deal
is signed. The flip side: a typo (`/@mayaa`) becomes its own label. Copy the link, don't
retype it. Anyone could type `/@whatever` themselves, but that only labels their own
sign-up, which we check by hand anyway.

**Did they find us on their own?** That's `direct`, and `via` says how:

- `direct` + `google`, `bing`, `duckduckgo` … : a search.
- `direct` + `ai-…`: an AI assistant on the web. `ai-chatgpt`, `ai-claude`, `ai-gemini`,
  `ai-copilot`, `ai-meta`, `ai-perplexity`, `ai-grok`, `ai-deepseek`, `ai-mistral`, `ai-poe`,
  and the big Chinese ones (`ai-doubao`, `ai-kimi`, `ai-qwen`, `ai-yuanbao`, `ai-ernie`).
  Filter `via` on `ai-` to see them all. Their phone apps mostly pass nothing along (ChatGPT's
  tag is the exception, and Android names the app), so some AI traffic still reads `none`.
  The list is in `attr.js` (`AI`): add an assistant there when a new one matters.
- `direct` + a site's name (`reddit`, or the bare host of anything else): a link on another
  website.
- `direct` + `none`: typed the address, or a bookmark. This only means "found us" as long as
  our own texts use `/invite`: a texted bare link looks exactly like a typed one.

`?src=` works on any URL too. Other people's tags (`utm_source`, `ref`; ChatGPT adds
`utm_source` to every link it hands out) count as `via`, never `src`: `src` only ever names
one of our links. Location-specific QR codes (`/qr/<spot>`) were considered and dropped for now.

**The rules**, all in `attr.js`:

- A lead is credited to the **last of our links the browser clicked in the past 30 days**
  (kept as `d5d_attr` in localStorage). A tag beats no tag, so someone who scans the QR code
  and comes back two days later by typing the address still counts for the QR code. Reloads,
  the back button and moves between our own pages don't count as clicks.
  It was first-link-wins until 2026-09-27: a test of `/@itgirlmovement_` on a phone that had
  opened `/@maya` the day before landed as `@maya`. Creators expect the link that was
  clicked to get the sign-up.
- A lead's `src`/`via` are fixed when it's created. Resuming later from another link doesn't
  rewrite where they came from.
- In an in-app browser the app is written into the URL (`&via=instagram`), because "open in
  Safari" hands over nothing but the URL.
- **Visits go to PostHog, never the sheet** (decided 2026-09-25). Every PostHog event already
  carries `src` and `via`, so `landing_viewed` broken down by either is visits per link or
  per app. But capture is off for regular visitors (the ⚠️ above), so until a consent
  flow ships, PostHog sees team devices only and the sheet's sign-ups are the only numbers.
  `/admin` shows those numbers per link and per app, split by who answered all seven.

Read the `sources` tab with §3 in mind. Whether a creator was worth it is in `finished`,
not in `rsvps`.

---

## 10. Open items

- [x] Instagram path collects no contact channel. Fixed 2026-09-23: phone + `reach_on` in step 2 (see §3).
- [ ] Retention vs. waitlist: privacy notice deletes data 3 months after the cohort, but out-of-town RSVPs are promised "first to go" when their city opens. Ruby to decide.
- [ ] Ruby to confirm the privacy notice covers link attribution (`src`/`via` on the lead, `d5d_attr` in localStorage, §9). The notice's wording is untouched.
- [ ] Consent flow for PostHog, so visits per link and per app can be counted for real visitors (§9). Ruby's call.
- [x] Privacy notice. Live at `/privacy` (`privacy.html`), linked from the footer and from
      the RSVP consent step. Controller, purposes, legal bases, recipients/processors,
      transfers, retention, rights, withdrawal and complaint rights are all in it.
- [ ] Move the Apps Script off the NYU Google account
- [x] Kai founder photo added (`kai.jpg`, same 360x480 treatment as `ruby.jpg`)
- [ ] Delete only the rows whose `src` is `claude-test`, and the one corrupted row (id repeated across every column). **Everything else in `leads` is a real sign-up.**
- [ ] Delete the `Sheet1` tab (empty decoy) and the test photo from Drive
- [ ] Share Sheet and Drive folder with Ruby; invite Ruby to PostHog. (`/admin` is separate:
      it takes the team password, the `ADMIN_PASSWORD` repo secret.)
- [ ] Own gender isn't asked. `meet` is who someone wants to meet, not who they are, so
      nobody can count how many people each person could be matched with, and `/admin` can
      only show demand. Adding it is a form change and touches sensitive data (the privacy
      notice). Kai and Ruby.
- [ ] Both ranked lists (`looking`, question one) start in a fixed order and the sharing
      slider starts at 50, so an untouched answer reads like a chosen one. `/admin` counts
      how many kept the starting order. Shuffling each person's starting order would remove
      the bias. A product call, not a bug fix.
- [ ] "testing test" isn't routed to the `test` tab: `isTestName_()` matches "test" only as a
      whole first word, though §8 and the Code.js comments say it does. Decide which is right.
- [ ] Rename the PostHog project from "Default project" and fix its app URL
- [x] The founders' letter on `/why` says "5days", by the founders' choice (2026-09-30). The rest
      of the site still says "Five Days" (or "five days" in headings); the letter is their voice.
- [ ] Kai & Ruby: Kai's paragraph ("Bad dates. Weird messages. People disappearing.") is the kind
      of app grievance §1 cut from the landing page on 09-24. It's fine in a personal letter, far
      from the opening, but it's your call.
- [ ] Kai & Ruby: your notes give "purpose" and "vision" the same two lines. The page doesn't need
      both. If you keep a purpose, it should be the why behind the vision, not a repeat of it.
- [ ] Kai & Ruby: "meet, not match" collides with the site calling the person "your match", on
      the landing page and in the FAQ (hand-copied in three places, plus the JSON-LD). If the line
      sticks, change "your match" to "your date" everywhere, in a separate PR.
- [ ] Kai & Ruby: confirm every line in "what we crossed out" is a promise you'll keep for good.
- [ ] Haven's yard (from the old /story: tap to drop crumbs, Haven walks over and pecks) could live on 404.
- [ ] Two polaroid collisions left (§5): iPad Pro in portrait (821–1050px, desktop placement) slides the top-left polaroid under the "five days" wordmark, and landscape phones 700–820px wide put the bottom-left one on "WE HANDLE THE ADMIN".

---

## 11. Working on this

- Edit `index.html` directly. No build, no framework, no bundler.
- Prefer changing `CONFIG` over changing markup.
- After any change to the form or the poll, **walk the entire flow in a headless browser**
  before shipping. Stub `script.google.com` and `*.posthog.com` so tests never write rows.
- Never push to `main`. Work on your own `claude/` branch: each push there gets its own
  Vercel preview, so several changes can be in flight at once. To ship, open a PR to
  `main`; the auto-ship Action merges it, and the merge deploys to production. `CLAUDE.md`
  has the full steps.
- Verify a deploy by asserting `/c/01` returns **200**. `/` returning a 307 proves nothing:
  the redirect working while the page 404s is exactly the failure already seen. Then assert
  `/context.md` returns **404**, which proves the allowlist is working.
- Before committing copy, check it against §4. Before committing a visual, ask whether it
  is the printed form or the hand.
