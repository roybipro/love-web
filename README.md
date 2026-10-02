# Our Story

A handcrafted digital scrapbook — one page, no login, no database, nothing to
maintain. Built for one person.

Eight memories, read top to bottom: the cover, how we met, our first memory,
little moments, favourite memories, things I love, our timeline, and a letter.

---

## Run it

```bash
npm install     # once
npm run dev     # then open the web address it prints
npm run build   # a plain dist/ folder you can upload anywhere
```

---

## The only file you need to touch

**`src/content/memory.js`**

Every word and every photo comes from that one file. Change the text, add a
print, swap the cover photo. Save and the browser updates itself.

The comments in the file explain each block.

---

## Adding a photo

1. Drop the file into **`public/photos/`**
2. Add one block to the `photos` list in `memory.js`:

```js
{
  image: "/photos/date-1.jpg",
  date: "",
  place: "",
  title: "Our First Date",
  caption: "One of my favourite days with you ❤️",
  note: "the little line written beside it",
}
```

The wall grows on its own, the numbering fixes itself, and the new print joins
the swipe-through viewer.

**Optional fields — leave them `""` and they disappear without leaving a gap:**

| Field   | What it does                                              |
| ------- | --------------------------------------------------------- |
| `date`  | e.g. `"12 January 2025"`. Nothing is invented for you.     |
| `place` | a small stamped label, e.g. `"Sylhet"`                     |
| `note`  | the handwritten aside — hover the print, or double-tap it  |
| `ar`    | the shape of the print, e.g. `"4 / 3"` for a landscape     |

Without `ar`, a print is cropped to a portrait square like the rest of the
wall. Give a landscape photo `ar: "4 / 3"` and it shows itself whole.

**Tips**

- The existing photos are already resized for the web. New ones aren't, so big
  phone photos will be slow. Under ~500 KB is ideal.
- Filenames with spaces work, they're just annoying to type.

---

## Changing a section

| What you want to change      | Where                                    |
| ---------------------------- | ---------------------------------------- |
| Her name                     | `herName` at the top of `memory.js`      |
| The cover photo and words    | `cover` in `memory.js`                   |
| The chapter list / order     | `memories` in `memory.js`                |
| How we met                   | `howWeMet`                               |
| Our first memory             | `firstMemory`                            |
| The polaroid wall            | `photos` and `galleryHeading`            |
| The big lines between prints | `pullQuotes`                             |
| Favourite memories           | `favouritesHeading.picks` (match titles) |
| The surprise                 | `surprise`                               |
| "Things I love" notes        | `love`                                   |
| Timeline entries             | `timeline`                               |
| The letter                   | `letter`                                 |
| The scratch card prize       | `scratch`                                |
| The hidden heart note        | `secret`                                 |
| The song and its label       | `music` + `public/audio/our-song.mp3`    |
| Colours, fonts, spacing      | `src/styles/tokens.css`                  |

---

## Layout of the project

```
public/
  photos/              images, served at /photos/...
  audio/
    our-song.mp3       the background song
src/
  content/
    memory.js          ← all of your words and photos (edit this)
  components/          one file per thing on the page
    loader.js          "our story is loading"
    cover.js           the book cover and the page turn
    nav.js             the memory rail and the progress pill
    story.js           how we met · first memory · favourites
    gallery.js         the polaroid wall
    lightbox.js        the zoom-in photo viewer
    love-cards.js      the pinned notes that open
    timeline.js        our little timeline
    surprise.js        the wrapped gift reveal
    scratch.js         the scratch-off postscript
    letter.js          the last page
    music.js           the player: seek, volume, visualiser
    secret.js          the hidden heart
    copy.js            puts memory.js into the static headings
    cursor.js          the dot, the ring, magnetic buttons
  lib/
    dom.js             selecting elements, escaping text, paths
    motion.js          reduced-motion switch, dust, bursts, paper
    scroll.js          reveals, progress line, timeline thread
    sound.js           the optional interface clicks
    typography.js      splits headings into rising words
  styles/
    index.css          imports everything below, in order
    tokens.css         colours, fonts, spacing, shadows, easing
    background.css     paper, tooth, grain, dust, glow, progress
    primitives.css     paper · tape · polaroid · note · sticker · stamp
    base.css           reset, type, buttons, reveals
    loader.css  cover.css  nav.css  story.css  gallery.css
    lightbox.css  timeline.css  cards.css  surprise.css
    scratch.css  music.css  cursor.css  reduced-motion.css
index.html             the structure of the page
vite.config.js         relative base — one build works anywhere
```

The rule: **content lives in `memory.js`, behaviour in `components/`, looks in
`styles/`.** No photo path or sentence is hardcoded anywhere else.

---

## Things she has to find herself

- **Double-tap a print** on the wall and the handwritten note beside it pops
  out with a small burst.
- **Tap the ❤️ on the cover five times** and a hidden line fades in. Change the
  wording or the count in `secret` in `memory.js`.
- **The scratch card** is the letter's postscript — she rubs the silver off
  with a finger. There's a quiet "tap here" underneath if she'd rather not.

## The music player

The little disc bottom-left opens a compact player with play/pause, a seek bar,
volume and a visualiser. The song starts on its own when she presses "Open Our
Story" — that press is the only permission the browser needs.

At the bottom of the player is **Interface sounds**, off by default. Turning it
on adds very quiet paper clicks to buttons and photos. It remembers her choice.

---

## Publishing

`npm run build` gives you a `dist/` folder of plain files for any static host.
The build uses relative paths, so it works at a domain root *and* in a
subfolder like `roybipro.github.io/love-web/` with no config changes.

### Updating the GitHub Pages copy

The live Pages site comes from an orphan `gh-pages` branch holding only `dist/`:

```bash
npm run build
rm -rf .deploy-tmp && mkdir .deploy-tmp && cp -R dist/. .deploy-tmp/
cd .deploy-tmp
git init && git add -A
git commit -m "Update the site"
git branch -M gh-pages
git push -f git@github.com:roybipro/love-web.git gh-pages
```

`gh-pages` is force-pushed every time — it is disposable output, never a place
to edit. Your real work lives on `main`.

---

## One honest note

No dates appear anywhere, because I wasn't going to invent yours — put the real
ones into the `date` fields whenever you like. The captions, the six "things I
love" notes and the letter are my best guess at your voice. Read them once and
rewrite any line that isn't something you'd actually say. That's the change
that makes it yours.
