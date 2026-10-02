import { $, $$, asset, esc, heart, pad2 } from "../lib/dom.js";
import { reduceMotion } from "../lib/motion.js";

/* Which column span each photo gets, cycling so every row fills twelve.
   7 then 5, then 5 then 7 — deliberately uneven, like a magazine spread. */
const SPANS = ["a", "b", "b", "a"];

/**
 * The photo essay. A twelve-column editorial grid with the captions set as
 * article text and a pull quote dropped in every four prints.
 * Add objects to memory.js and it keeps laying itself out.
 */
export function mountGallery({ photos, heading, quotes = [], onOpen }) {
  const grid = $("#gallery");

  const blocks = [];
  photos.forEach((photo, i) => {
    blocks.push(tileMarkup(photo, i, heading.tapHint || "Tap to open"));
    if ((i + 1) % 4 === 0 && quotes[(i + 1) / 4 - 1]) {
      blocks.push(quoteMarkup(quotes[(i + 1) / 4 - 1], i));
    }
  });

  grid.innerHTML = mastheadMarkup(heading, photos.length) + blocks.join("");

  $$(".tile", grid).forEach((tile) => {
    tile.addEventListener("click", () => onOpen(Number(tile.dataset.index), tile));
    addParallax(tile);
  });
}

function mastheadMarkup(heading, total) {
  return `
    <div class="mag__masthead" data-reveal>
      <span class="mag__issue">${esc(heading.issue || "a scrapbook")}</span>
      <span class="mag__rule" aria-hidden="true"></span>
      <span class="mag__note">${esc(heading.note || "")}</span>
      <span class="mag__count">${pad2(total)} prints</span>
    </div>`;
}

function tileMarkup(photo, i, hint) {
  return `
    <button class="tile tile--${SPANS[i % SPANS.length]}" data-reveal data-index="${i}"
            style="--rd:${((i % 4) * 0.07).toFixed(2)}s" aria-label="Open photo: ${esc(photo.title)}">
      <span class="tile__num">${pad2(i + 1)}</span>
      <span class="tile__media">
        <img src="${asset(photo.image)}" alt="${esc(photo.title)}"
             loading="${i < 2 ? "eager" : "lazy"}" decoding="async" />
        <span class="tile__plus" aria-hidden="true">+</span>
      </span>
      <span class="tile__cap">
        ${photo.date ? `<span class="datestamp tile__date">${esc(photo.date)}</span>` : ""}
        <span class="tile__title">${heart(photo.title)}</span>
        <span class="tile__note">${heart(photo.caption)}</span>
        <span class="tile__hint">${esc(hint)}</span>
      </span>
    </button>`;
}

function quoteMarkup(text, i) {
  return `
    <figure class="mag__quote" data-reveal>
      <blockquote>${heart(text)}</blockquote>
    </figure>`;
}

/** The photograph drifts a few pixels toward the pointer, like it has depth. */
function addParallax(tile) {
  if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

  const media = $(".tile__media", tile);
  let frame = 0;

  media.addEventListener("pointermove", (e) => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const r = media.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      media.style.setProperty("--px", `${(-x * 12).toFixed(1)}px`);
      media.style.setProperty("--py", `${(-y * 12).toFixed(1)}px`);
    });
  });

  const reset = () => {
    media.style.setProperty("--px", "0px");
    media.style.setProperty("--py", "0px");
  };
  media.addEventListener("pointerleave", reset);
  tile.addEventListener("focusout", reset);
}
