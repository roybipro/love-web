import { $, $$, asset, esc, heart, pad2 } from "../lib/dom.js";

/**
 * The timeline, in order. Each entry may carry a photo; if that photo also
 * lives in the gallery, tapping it opens the viewer on the right picture.
 */
export function mountTimeline({ items, photos, onOpen }) {
  const list = $("#timeline-list");

  list.innerHTML = items
    .map((entry, i) => {
      const galleryIndex = photos.findIndex((p) => p.image === entry.image);
      const shot =
        entry.image && galleryIndex > -1
          ? `<button class="tl__shot" data-gallery="${galleryIndex}"
                    aria-label="Open photo: ${esc(photos[galleryIndex].title)}">
                <img src="${asset(entry.image)}" alt="${esc(entry.title)}" loading="lazy" decoding="async" />
              </button>`
          : "";

      return `
      <li class="tl__item" data-reveal style="--rd:${((i % 2) * 0.08).toFixed(2)}s">
        <span class="tl__num" aria-hidden="true">${pad2(i + 1)}</span>
        <div class="tl__body">
          ${entry.date ? `<p class="datestamp tl__date">${esc(entry.date)}</p>` : ""}
          <h3 class="tl__title">${heart(entry.title)}</h3>
          <p class="tl__text">${heart(entry.text)}</p>
        </div>
        ${shot}
      </li>`;
    })
    .join("");

  $$(".tl__shot", list).forEach((shot) =>
    shot.addEventListener("click", () => onOpen(Number(shot.dataset.gallery), shot)),
  );

  return list;
}
