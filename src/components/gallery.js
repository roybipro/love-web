import { $, $$, asset, esc, heart } from "../lib/dom.js";

/**
 * The photo grid. Add another object to memory.js and a tile appears.
 * `feature: true` makes one photo sit larger and centred.
 */
export function mountGallery({ photos, heading, onOpen }) {
  const grid = $("#gallery");
  const hint = heading.tapHint || "Tap to open";

  grid.innerHTML = photos
    .map(
      (photo, i) => `
      <button class="tile${photo.feature ? " tile--wide" : ""}" data-reveal data-index="${i}"
              style="--rd:${((i % 2) * 0.12).toFixed(2)}s" aria-label="Open photo: ${esc(photo.title)}">
        <span class="tile__media">
          <img src="${asset(photo.image)}" alt="${esc(photo.title)}"
               loading="${i < 2 ? "eager" : "lazy"}" decoding="async" />
          <span class="tile__plus" aria-hidden="true">+</span>
        </span>
        <span class="tile__cap">
          ${photo.date ? `<span class="tile__date">${esc(photo.date)}</span>` : ""}
          <span class="tile__title">${heart(photo.title)}</span>
          <span class="tile__hint">${esc(hint)}</span>
        </span>
      </button>`,
    )
    .join("");

  $$(".tile", grid).forEach((tile) =>
    tile.addEventListener("click", () => onOpen(Number(tile.dataset.index), tile)),
  );

  return grid;
}
