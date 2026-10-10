/* =============================================================
   main.js — boots the book. Nothing here needs editing;
   all of the words and photos live in content/memory.js
   ============================================================= */

import "./styles/index.css";

import * as content from "./content/memory.js";
import { $ } from "./lib/dom.js";
import { seedDust } from "./lib/motion.js";
import { observeReveals, watchScroll } from "./lib/scroll.js";
import { splitWords } from "./lib/typography.js";

import { mountCopy } from "./components/copy.js";
import { mountLoader } from "./components/loader.js";
import { mountCover } from "./components/cover.js";
import { mountNav } from "./components/nav.js";
import { mountHowWeMet, mountFirstMemory, mountFavourites } from "./components/story.js";
import { mountGallery } from "./components/gallery.js";
import { mountSurpriseMe } from "./components/surprise-me.js";
import { createLightbox } from "./components/lightbox.js";
import { mountSurprise } from "./components/surprise.js";
import { mountLoveCards } from "./components/love-cards.js";
import { mountTimeline } from "./components/timeline.js";
import { mountLetter } from "./components/letter.js";
import { mountReply } from "./components/reply.js";
import { mountScratch } from "./components/scratch.js";
import { mountMusic } from "./components/music.js";
import { mountTheme } from "./components/theme.js";
import { mountSecret } from "./components/secret.js";
import { mountCursor, mountMagnets } from "./components/cursor.js";

/* The cover locks scrolling, so a browser that remembers the last scroll
   position would yank her down the page the moment it unlocks. */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

seedDust($("#bgDust"));
mountCopy(content);

const lightbox = createLightbox(content.photos, {
  herName: content.herName,
  sign: content.letter.sign,
});

mountHowWeMet(content.howWeMet);
mountFirstMemory(content.firstMemory);
mountGallery({
  photos: content.photos,
  heading: content.galleryHeading,
  quotes: content.pullQuotes,
  onOpen: lightbox.open,
});
mountSurpriseMe({ onPick: (i, item) => lightbox.open(i, item) });

mountFavourites({
  heading: content.favouritesHeading,
  photos: content.photos,
  picks: content.favouritesHeading.picks,
});
mountSurprise({ data: content.surprise, sign: content.letter.sign });
mountLoveCards({ items: content.love });
mountTimeline({
  items: content.timeline,
  photos: content.photos,
  onOpen: lightbox.open,
});
mountLetter(content.letter);
mountReply();
mountScratch({ data: content.scratch });

/* only once every heading has its final words in it */
splitWords();

watchScroll();
mountNav({ items: content.memories });
mountCursor();
mountMagnets();
mountTheme();
mountSecret(content.secret);
mountMusic({ data: content.music, startOn: "#openBtn" });

const cover = mountCover({
  data: content.cover,
  herName: content.herName,
  onOpen: observeReveals,
});

mountLoader({
  images: cover.images.map((src) => src),
  onReady: cover.reveal,
});
