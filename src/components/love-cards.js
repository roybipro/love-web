import { $, $$, esc, heart, pad2, rnd } from "../lib/dom.js";
import { burst } from "../lib/motion.js";
import { play } from "../lib/sound.js";

/**
 * Memory 06 — little things I love about you.
 * Small pinned notes that drift a little, and open when tapped.
 * More than one can stay open so she can read them all and look back.
 */
export function mountLoveCards({ items }) {
  const wrap = $("#cards");
  if (!wrap) return;

  wrap.innerHTML = items
    .map(
      (item, i) => `
      <button class="card" data-reveal style="--rd:${((i % 3) * 0.1).toFixed(2)}s"
              aria-expanded="false">
        <span class="card__idx">no. ${pad2(i + 1)}</span>
        <span class="card__top">
          <span class="card__title">${heart(item.title)}</span>
          <span class="card__toggle" aria-hidden="true"></span>
        </span>
        <span class="card__body">
          <span><span class="card__text">${esc(item.text)}</span></span>
        </span>
      </button>`,
    )
    .join("");

  $$(".card", wrap).forEach((card, i) => {
    /* each note bobs on its own schedule so they never move in step */
    card.style.setProperty("--ft", `${rnd(6.5, 10.5).toFixed(1)}s`);
    card.style.setProperty("--fdl", `${rnd(0, 4).toFixed(1)}s`);

    card.addEventListener("click", () => {
      const opened = card.classList.toggle("open");
      card.setAttribute("aria-expanded", String(opened));
      if (opened) {
        burst(card, 8, 0.55);
        play("pop");
      }
    });
  });
}
