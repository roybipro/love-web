import { $, $$, asset, esc, heart } from "../lib/dom.js";
import { reduceMotion } from "../lib/motion.js";

/**
 * The photo wall. Add another object to memory.js and a print appears.
 * `feature: true` pins one larger than the rest.
 */
export function mountGallery({ photos, heading, onOpen }) {
  const grid = $("#gallery");
  const hint = heading.tapHint || "Tap to open";

  grid.innerHTML = photos
    .map(
      (photo, i) => `
      <button class="tile${photo.feature ? " tile--wide" : ""}" data-reveal data-index="${i}"
              style="--rd:${((i % 3) * 0.09).toFixed(2)}s" aria-label="Open photo: ${esc(photo.title)}">
        <span class="tile__media">
          <img src="${asset(photo.image)}" alt="${esc(photo.title)}"
               loading="${i < 2 ? "eager" : "lazy"}" decoding="async" />
          <span class="tile__veil"></span>
          <span class="tile__plus" aria-hidden="true">+</span>
          <span class="tile__cap">
            ${photo.date ? `<span class="datestamp tile__date">${esc(photo.date)}</span>` : ""}
            <span class="tile__title">${heart(photo.title)}</span>
            <span class="tile__hint">${esc(hint)}</span>
          </span>
        </span>
      </button>`,
    )
    .join("");

  $$(".tile", grid).forEach((tile) => {
    tile.addEventListener("click", () => onOpen(Number(tile.dataset.index), tile));
    addParallax(tile);
  });
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
      media.style.setProperty("--px", `${(-x * 14).toFixed(1)}px`);
      media.style.setProperty("--py", `${(-y * 14).toFixed(1)}px`);
    });
  });

  const reset = () => {
    media.style.setProperty("--px", "0px");
    media.style.setProperty("--py", "0px");
  };
  media.addEventListener("pointerleave", reset);
  tile.addEventListener("focusout", reset);
}
