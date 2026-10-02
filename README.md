# For You ❤️

A small scrapbook website — one page, no login, no database, nothing to maintain.
Built for one person.

---

## Run it

```bash
npm install     # once
npm run dev     # then open the web address it prints
```

To make a real folder of files you can upload anywhere:

```bash
npm run build   # output lands in dist/
```

---

## The only file you need to touch

**`src/content/memory.js`**

Every word and every photo on the site comes from that one file. Change the
text, change a date, add a card. Save, and the browser updates itself.

There are comments in the file showing exactly what each part does.

---

## Adding a photo

1. Drop the file into **`public/photos/`**
2. Add one block to the `photos` list in `memory.js`:

```js
{
  image: "/photos/date-1.jpg",
  date: "",
  title: "Our First Date",
  caption: "One of my favourite days with you ❤️",
}
```

That's it — the grid grows on its own, and the new photo joins the swipe
through the viewer.

The photos lay themselves out on a twelve-column editorial grid — each one
numbered, alternating wide and narrow so the rows never look like a table —
with a pull quote dropped in every four prints. Edit those lines in the
`pullQuotes` list in `memory.js`; add or remove as many as you like.
`date` is optional everywhere: leave it `""` and no date is shown. Put
`"12 January 2025"` in whenever you want one to appear.

**Tips**

- Portrait (taller than wide) photos look best — the layout is built around them.
- Filenames with spaces are fine, but no spaces is easier to type.
- The current photos are already resized for the web. New ones aren't, so very
  large phone photos can be slow. Anything under ~500 KB is ideal.

---

## Changing a section

| What you want to change       | Where                                   |
| ----------------------------- | --------------------------------------- |
| Photos, dates, captions       | `photos` in `memory.js`                 |
| Timeline entries              | `timeline` in `memory.js`               |
| "Things I love" cards         | `love` in `memory.js`                   |
| The surprise photo + message  | `surprise` in `memory.js`               |
| The scratch card prize        | `scratch` in `memory.js`                |
| The hidden heart note         | `secret` in `memory.js`                 |
| Opening words, final words    | `intro` / `final` in `memory.js`        |
| Put her actual name on it     | `herName` at the top of `memory.js`     |
| Change or remove the song     | `music` in `memory.js` + `public/audio/` |
| Colours                       | `src/styles/tokens.css`                 |
| Fonts                         | the `<link>` in `index.html` + `tokens.css` |
| Spacing and text sizes        | `src/styles/tokens.css`                 |

---

## Layout of the project

```
public/
  photos/              drop images here, they're served at /photos/...
  audio/
    our-song.mp3       the background music, served at /audio/our-song.mp3
src/
  content/
    memory.js          ← all of your words and photos (edit this)
  components/          one file per section of the page
    intro.js           opening screen and the button
    gallery.js         the photo grid
    lightbox.js        the zoom-in photo viewer
    timeline.js        the dates
    love-cards.js      the expanding cards
    surprise.js        the gift reveal
    scratch.js         the scratch-off card (the game)
    secret.js          the hidden note behind the heart
    music.js           the background song and its toggle
    copy.js            puts memory.js into the page
  lib/
    dom.js             small helpers (selecting elements, escaping text)
    motion.js          floating hearts, bursts, reduced-motion switch
    scroll.js          scroll reveals, progress line, timeline drawing
  styles/
    index.css          imports everything below, in order
    tokens.css         colours, fonts, spacing
    base.css           resets and shared text
    atmosphere.css     grain, vignette, cursor glow, progress line
    buttons.css  reveal.css  intro.css  gallery.css  lightbox.css
    timeline.css  cards.css  surprise.css  final.css
    reduced-motion.css
index.html             the structure of the page
vite.config.js         only matters when you deploy
```

The rule: **content lives in `memory.js`, behaviour lives in `components/`,
looks live in `styles/`.** Nothing hardcodes a photo path or a sentence
anywhere else.

---

## Publishing

`npm run build` gives you a `dist/` folder of plain files. Upload it to any
static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages).

The build uses relative paths, so it works at the root of a domain *and* in a
subfolder like `roybipro.github.io/love-web/` with no config changes. Don't
edit `base` in `vite.config.js` unless a host genuinely complains.

### Updating the GitHub Pages copy

The live Pages site is built from an orphan `gh-pages` branch that holds only
the contents of `dist/`. To refresh it after changing anything:

```bash
npm run build
rm -rf .deploy-tmp && mkdir .deploy-tmp && cp -R dist/. .deploy-tmp/
cd .deploy-tmp
git init && git add -A
git commit -m "Update the site"
git branch -M gh-pages
git push -f git@github.com:roybipro/love-web.git gh-pages
```

Note that `gh-pages` is force-pushed every time — it is disposable output,
never a place to edit source. Your real work lives on `main`.

---

## Two things she has to find herself

- **The scratch card** — near the end, a silver card she rubs off with a
  finger to reveal a photo. If she can't or doesn't want to, there's a quiet
  "tap here" underneath that opens it.
- **The hidden note** — tap the ❤️ in "Hey, Ket ❤️" five times on the opening
  screen and a secret line fades in. Nobody finds this by accident. Change the
  wording, or the number of taps, in `secret` in `memory.js`.

## One honest note

No dates are shown anywhere, because I wasn't going to invent yours. The
captions, the six "things I love" messages and the surprise line are my best
guess at your voice — read them once and rewrite any line that isn't something
you'd actually say. That's the change that makes it yours.
