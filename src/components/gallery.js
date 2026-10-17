import { $, $$, asset, esc, heart, pad2 } from "../lib/dom.js";
import { calmOn } from "../lib/calm.js";
import { burst, reduceMotion } from "../lib/motion.js";
import { play } from "../lib/sound.js";

/**
 * Which print is today's. Uses local midnight rather than UTC so it
 * turns over when her day turns over, and rounds so a short or long
 * day near a clock change cannot repeat one.
 */
function todayIndex(count) {
  if (!count) return -1;
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round(midnight.getTime() / 86400000) % count;
}

const FAV_KEY = "our-story:favourites";

/** Her own shortlist, kept on her device. Never sent anywhere. */
function loadFavourites() {
  try {
    const raw = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
    return new Set(Array.isArray(raw) ? raw : []);
  } catch {
    return new Set();
  }
}

function saveFavourites(set) {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify([...set]));
  } catch {
    /* private mode: the hearts just will not stick, which is fine */
  }
}

/**
 * Little moments — the wall of polaroids.
 * Add another object to memory.js and the wall, the numbering and the
 * swipe-through viewer all grow on its own.
 */
export function mountGallery({ photos, heading, quotes = [], onOpen }) {
  const wall = $("#wall");
  if (!wall) return;

  const tag = heading.today ?? "today's";
  const todays = tag ? todayIndex(photos.length) : -1;
  const favs = loadFavourites();
  const blocks = [];

  photos.forEach((photo, i) => {
    blocks.push(
      printMarkup(photo, i, heading.tapHint, i === todays ? tag : "", favs.has(photo.image)),
    );
    const quote = quotes[Math.floor(i / 4)];
    if ((i + 1) % 4 === 0 && quote) blocks.push(quoteMarkup(quote));
  });

  wall.innerHTML = `
    <p class="folio" data-reveal>
      <span>${esc(heading.issue || "the prints")}</span>
      <span class="folio__rule" aria-hidden="true"></span>
      <span class="folio__note">${esc(heading.note || "")}</span>
      <span>${pad2(photos.length)} prints</span>
      <button class="folio__filter" id="wallFilter" type="button" aria-pressed="false" hidden>
        <span aria-hidden="true">♥</span> <span id="filterLabel">hers</span>
      </button>
    </p>
    ${blocks.join("")}`;

  const filter = $("#wallFilter", wall);
  const filterLabel = $("#filterLabel", wall);

  const syncFilter = () => {
    const kept = $$(".wall__item.is-fav", wall).length;
    if (!filter) return;
    filter.hidden = kept === 0;
    if (filterLabel) filterLabel.textContent = `hers (${kept})`;
    if (kept === 0 && wall.classList.contains("wall--hers")) {
      wall.classList.remove("wall--hers");
      filter?.setAttribute("aria-pressed", "false");
    }
  };

  filter?.addEventListener("click", () => {
    const on = wall.classList.toggle("wall--hers");
    filter.setAttribute("aria-pressed", String(on));
    play("click");
  });

  $$(".wall__item", wall).forEach((item) => {
    const index = Number(item.dataset.index);
    const image = item.dataset.image;
    const open = $(".wall__open", item);

    open?.addEventListener("click", () => {
      play("photo");
      onOpen(index, item);
    });

    /* double-tap a print and the note I wrote beside it appears */
    open?.addEventListener("dblclick", () => {
      item.classList.add("peeking");
      burst($(".polaroid", item), 10, 0.6);
      play("found");
    });

    const heartBtn = $(".wall__fav", item);
    heartBtn?.addEventListener("click", () => {
      const on = item.classList.toggle("is-fav");
      heartBtn.setAttribute("aria-pressed", String(on));
      if (on) {
        favs.add(image);
        burst(heartBtn, 7, 0.5);
        play("found");
      } else {
        favs.delete(image);
        play("click");
      }
      saveFavourites(favs);
      syncFilter();
    });

    addParallax(item);
  });

  syncFilter();
}

function printMarkup(photo, i, hint, today, isFav) {
  /* the heart cannot live inside the open button, so the print is a
     wrapper holding two siblings rather than one big button */
  return `
    <div class="wall__item${today ? " is-today" : ""}${isFav ? " is-fav" : ""}"
         data-reveal data-index="${i}" data-image="${esc(photo.image)}"
         style="--rd:${((i % 4) * 0.07).toFixed(2)}s${photo.ar ? `;--ar:${photo.ar}` : ""}">
      ${today ? `<span class="wall__today">${esc(today)}</span>` : ""}
      <button class="wall__open" type="button"
              aria-label="Open photo: ${esc(photo.title)}${today ? ` — ${esc(today)} memory` : ""}">
        <span class="polaroid">
          <span class="tape" aria-hidden="true"></span>
          <span class="polaroid__frame">
            <img src="${asset(photo.image)}" alt="${esc(photo.title)}"
                 loading="${i < 2 ? "eager" : "lazy"}" decoding="async" />
          </span>
          <span class="polaroid__foot">
            <span>${esc(photo.title)}</span>
            <em>${pad2(i + 1)}</em>
          </span>
        </span>
        ${photo.note ? `<span class="wall__peek">${esc(photo.note)}</span>` : ""}
      </button>
      <button class="wall__fav" type="button" aria-pressed="${isFav ? "true" : "false"}"
              aria-label="Keep ${esc(photo.title)} in your favourites">♥</button>
    </div>`;
}

function quoteMarkup(text) {
  return `
    <figure class="wall__quote" data-reveal>
      <blockquote>${heart(text)}</blockquote>
    </figure>`;
}

/** The print drifts a few pixels toward the pointer, so it feels lit. */
function addParallax(item) {
  if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

  const frame = $(".polaroid__frame", item);
  if (!frame) return;
  let queued = 0;

  frame.addEventListener("pointermove", (e) => {
    if (queued) return;
    queued = requestAnimationFrame(() => {
      queued = 0;
      if (calmOn()) {
        reset();
        return;
      }
      const r = frame.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      frame.style.setProperty("--px", `${(-x * 10).toFixed(1)}px`);
      frame.style.setProperty("--py", `${(-y * 10).toFixed(1)}px`);
    });
  });

  const reset = () => {
    frame.style.setProperty("--px", "0px");
    frame.style.setProperty("--py", "0px");
  };
  frame.addEventListener("pointerleave", reset);
}
