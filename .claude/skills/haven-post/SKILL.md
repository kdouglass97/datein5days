---
name: haven-post
description: Make a Haven post for @datein5days, either an Instagram carousel (4:5 slides) or a Reel (a 9:16 animation) starring Haven, the pigeon, from a concept or a slide-by-slide brief. Use whenever someone asks for a Haven post, carousel, slides, Reel, animation, TikTok or social graphic, or pastes a concept for one, however loose.
---

# Haven posts

Kai or Ruby hands you a concept. You draw it fresh in the house look, render it, and hand back
files they can post. The drawings are new every time; Haven and the look never change. Both
founders make posts from their own sessions, and this file is what keeps the two sets looking
like one feed, so follow it over your own taste.

Read `context.md` §4 (voice) and §5 (design, Haven) first if you haven't this session.

## What you'll be handed

Anything from one line ("Haven on first-date nerves") to a slide-by-slide brief:

```
haven carousel: first-date nerves
1. cover: "first-date nerves, a field guide." Haven with a letter.
2. "You checked the menu three times." Haven tilts.
3. Haven: "Relax. I only deliver."
end: the close.
```

A Reel brief gives beats with rough timing ("0-2s Haven walks in with the letter").

Fill the gaps yourself: write Haven's lines, pick the scenes, choose carousel unless they say
Reel or animation. Don't ask what a draft can answer. Render first, then take notes.

## What never changes

- **Haven.** `share/posts/haven.js` draws them from `note.js`'s pigeon, the site's one drawing.
  Put `<g class="hv" data-o="walk letter" transform="translate(x y) scale(s)"></g>` inside any
  `.sc` svg. The pose words combine: `wave`, `walk`, `letter`, `tilt`, `tilt-up`, `bow`, `hearts`.
  Need something else? Move, scale or rotate the whole bird, or draw props around them (a hat,
  motion marks, a seat). Never edit or paste Haven's lines: `render.js` refuses to render if
  `haven.js` drifts from `note.js`. A truly new pose goes into `haven.js` as a new word, so every
  post gets it; mention it when you hand over.
- **The stock.** `share/posts/base.css` holds the tokens, type, card, tape, grain, hand marks and
  line weights. A post's own `<style>` adds only that post's layout; never restate or override
  the tokens.
- **The renderer.** `node share/posts/render.js <post>`, run from the repo root.

## The look

Carousel, 1080×1350:

- Every slide: `five days` top left, `NN / NN` top right.
- **Cover:** grass, Haven large in a pen scene, a lowercase serif headline ending in a period,
  one typed line with one hand mark, `swipe` at the foot, and a clay band cut across the foot on
  a slight diagonal.
- **Inside slides:** clay ground, one paper `.card` taped at the top and turned a degree or so,
  alternating direction (`--r`, `--t`). In the card: a `.scene` drawing, then `.say` (serif, one
  idea) and `.so` (typed, a sentence or two).
- **The hand:** usually one mark per slide, two at most, on the words that carry it: `.mk.u`
  underline, `.mk.o` circle, `.mk.x` strike, `.hl` highlight. Clay on paper, peach on grass.
  A mark is attention paid, never decoration.
- **Scenes** are pen line drawings at Haven's weight (`.sc`, `filter="url(#pen)"`), standing on a
  hand-drawn ground line with a peach wash under it (`.wash`). Colour comes from sage and peach
  washes; solid fills only for small accents (a clay seal, hearts).
- **Last slide:** grass, Haven happy (`hearts` or `wave`), the line that lands it, then the close.
- 5 to 7 slides is usual; 12 is the most so far.

Reel, 1080×1920 (`.slide.reel`):

- The page sets `window.REEL = { seconds, cover, at(t) }`. `at(t)` must build the whole frame
  from `t` alone, with no CSS animations, transitions, timers or randomness, because the
  renderer screenshots each frame by calling it. `cover` is the second used for `cover.jpg`.
- Borrow the machinery from `day/` (cards slapped onto a stack, Haven walking with `setPose` and
  `step(t)`, strokes inked on with `draw()`) and `interview/` (typed-in text, a slow camera
  drift, a handheld prop). Opened in a browser, both pages play themselves.
- 18 to 25 seconds. End on the grass end card with the close. Silent: sound gets added in the app.

## Voice

- **Haven is they/them.** Never he or she: slides, captions, alt text, comments. Check every
  pronoun before showing anything; this slipped once already.
- When Haven speaks: first person, short, dry, proud of the job. *"I carry them. Kai and Ruby
  read them." "Long notes are heavy. I have never once complained." "I don't cuff."*
- Haven delivers and never picks. Kai and Ruby (or "we", "the two of us") read every answer and
  match by hand. Nothing implies Haven, or anything automatic, chooses anyone.
- §4 applies in full: lowercase headlines, sentence case body, no exclamation marks, no em
  dashes, none of the banned words, "algorithm" only as the thing we aren't, no scarcity.
- **The close:** "Seven questions, about seven minutes." with "New York first." and "Link in
  bio."; add "Somewhere else? RSVP anyway." when it fits.
- **Nothing real.** No sign-up's name, handle, answer or photo, ever. Every example is made up.

## Make it

1. Pick a short slug and create `share/posts/<slug>/`. Copy the closest post's `post.html` as the
   start (card slides: `flags`; type-led: `cuffing`; a Reel: `day` or `interview`), keep its
   header comment's form, and rewrite every slide for the new concept.
2. Write `caption.txt`: a hook line, a short paragraph in the voice, the close.
3. Render: `node share/posts/render.js <slug>`. A carousel writes `NN.jpg` and `sheet.jpg`
   (seconds). A Reel writes `reel.mp4` and `cover.jpg`, and takes a few minutes.
4. Look before you show. Read `sheet.jpg` (for a Reel, `cover.jpg` and a few frames grabbed with
   ffmpeg) and run the checklist below. Fix and re-render until it passes.
5. Send the files to whoever asked: `sheet.jpg` first, then the `NN.jpg` slides (or `reel.mp4` and
   `cover.jpg`), with the caption text in your reply so they can post straight from the session.
   One line on anything you decided for them.
6. Notes come back like proof marks ("03 is too wordy", "Haven bows on 04"). Change only what
   they mark, re-render, send again.
7. Keep the source: commit `post.html`, `caption.txt` and `sheet.jpg` (or `cover.jpg`) to your own
   `claude/` branch and push. The `NN.jpg` slides and `reel.mp4` are git-ignored on purpose: the
   repo is public and they re-render from source. Ship the usual way (`CLAUDE.md`) when told.

## Checklist

- [ ] Every Haven is a `.hv` drawn by `haven.js`, with no pasted pigeon paths.
- [ ] They/them everywhere, caption included.
- [ ] No text runs off the card, under the tape, or across Haven.
- [ ] Slide counters match the slide count.
- [ ] Two hand marks on a slide at most, each on words that matter.
- [ ] Lowercase headline; no `!`, no em dash, no banned words.
- [ ] The caption ends with the close.
- [ ] Nothing from a real sign-up.

## The posts so far

| post | kind | look at it for |
|---|---|---|
| `meet-haven` | carousel, 12 | the full card system; a speech scrap (04); a form filled in (06). It leaves Haven unfilled so washes glow through; the default fills them |
| `flags` | carousel, 6 | the cleanest card carousel to start from; Haven with props |
| `cuffing` | carousel, 5 | type-led slides; a proof correction (`.mk.x` plus a caret) |
| `bag` | carousel, 7 | an inventory, one labelled item per slide; the last is the empty slot where an algorithm would go |
| `day` | Reel, 23s | cards slapped onto a stack; Haven walking and carrying |
| `interview` | Reel, 24s | typed Q and A; camera drift; Haven answering |
