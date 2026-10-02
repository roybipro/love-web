import { $, $$, asset, esc, heart, pad2 } from "../lib/dom.js";
import { play } from "../lib/sound.js";

/**
 * Memory 07 — our little timeline.
 * Each milestone is a small paper card on a gold thread, with the
 * print taped beside it. Tapping the print opens the viewer.
 */
export function mountTimeline({ items, photos, onOpen }) {
  const list = $("#timeline-list");
  if (!list) return;

  list.innerHTML = items
    .map((entry, i) => {
      const galleryIndex = photos.findIndex((p) => p.image === entry.image);
      const shot =
        entry.image && galleryIndex > -1
          ? `<button class="tl__shot" data-gallery="${galleryIndex}"
                    aria-label="Open photo: ${esc(photos[galleryIndex].title)}">
                <span class="tape" aria-hidden="true"></span>
                <img src="${asset(entry.image)}" alt="${esc(entry.title)}" loading="lazy" decoding="async" />
              </button>`
          : "";

      return `
      <li class="tl__item" data-reveal style="--rd:${((i % 2) * 0.08).toFixed(2)}s">
        <div class="tl__card">
          <span class="tl__no">${pad2(i + 1)}</span>
          ${entry.date ? `<span class="datestamp tl__date">${esc(entry.date)}</span>` : ""}
          <h3 class="tl__title">${heart(entry.title)}</h3>
          <p class="tl__text">${heart(entry.text)}</p>
        </div>
        ${shot}
      </li>`;
    })
    .join("");

  $$(".tl__shot", list).forEach((shot) =>
    shot.addEventListener("click", () => {
      play("photo");
      onOpen(Number(shot.dataset.gallery), shot);
    }),
  );
}
