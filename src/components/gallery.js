import { $, $$, asset, esc, heart, pad2 } from "../lib/dom.js";
import { burst, reduceMotion } from "../lib/motion.js";
import { play } from "../lib/sound.js";

/**
 * Little moments — the wall of polaroids.
 * Add another object to memory.js and the wall, the numbering and the
 * swipe-through viewer all grow on their own.
 */
export function mountGallery({ photos, heading, quotes = [], onOpen }) {
  const wall = $("#wall");
  if (!wall) return;

  const blocks = [];

  photos.forEach((photo, i) => {
    blocks.push(printMarkup(photo, i, heading.tapHint));
    const quote = quotes[Math.floor(i / 4)];
    if ((i + 1) % 4 === 0 && quote) blocks.push(quoteMarkup(quote));
  });

  wall.innerHTML = `
    <p class="folio" data-reveal>
      <span>${esc(heading.issue || "the prints")}</span>
      <span class="folio__rule" aria-hidden="true"></span>
      <span class="folio__note">${esc(heading.note || "")}</span>
      <span>${pad2(photos.length)} prints</span>
    </p>
    ${blocks.join("")}`;

  $$(".wall__item", wall).forEach((item) => {
    const index = Number(item.dataset.index);
    item.addEventListener("click", () => {
      play("photo");
      onOpen(index, item);
    });
    /* double-tap a print and the note I wrote beside it appears */
    item.addEventListener("dblclick", () => {
      item.classList.add("peeking");
      burst($(".polaroid", item), 10, 0.6);
      play("found");
    });
    addParallax(item);
  });
}

function printMarkup(photo, i, hint) {
  return `
    <button class="wall__item" data-reveal data-index="${i}"
            style="--rd:${((i % 4) * 0.07).toFixed(2)}s${photo.ar ? `;--ar:${photo.ar}` : ""}"
            aria-label="Open photo: ${esc(photo.title)}">
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
    </button>`;
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
