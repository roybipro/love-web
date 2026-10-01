/* =============================================================
   main.js — boots the page. Nothing here needs editing;
   all of the words and photos live in content/memory.js
   ============================================================= */

import "./styles/index.css";

import * as content from "./content/memory.js";
import { mountCopy } from "./components/copy.js";
import { mountIntro } from "./components/intro.js";
import { mountGallery } from "./components/gallery.js";
import { createLightbox } from "./components/lightbox.js";
import { mountTimeline } from "./components/timeline.js";
import { mountLoveCards } from "./components/love-cards.js";
import { mountSurprise } from "./components/surprise.js";
import { mountMusic } from "./components/music.js";
import { observeReveals, watchScroll } from "./lib/scroll.js";
import { splitWords } from "./lib/typography.js";

/* The opening screen locks scrolling, so a browser that remembers the last
   scroll position would yank her down the page the moment it unlocks. */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

mountCopy(content);

const lightbox = createLightbox(content.photos);

mountGallery({
  photos: content.photos,
  heading: content.galleryHeading,
  onOpen: lightbox.open,
});

mountTimeline({
  items: content.timeline,
  photos: content.photos,
  onOpen: lightbox.open,
});

mountLoveCards({ items: content.love });

mountSurprise({ data: content.surprise, sign: content.final.sign });

mountMusic({
  file: content.music.file,
  label: content.music.label,
  startOn: "#openBtn",
});

/* only once every heading has its final words in it */
splitWords();

watchScroll();

mountIntro({
  bleed: [
    content.photos[0]?.image,
    content.photos[2]?.image,
    content.surprise.image,
    content.photos.find((p) => p.feature)?.image,
  ].filter(Boolean),
  onOpen: observeReveals,
});
