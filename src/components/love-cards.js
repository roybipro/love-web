import { $, $$, esc, heart, pad2 } from "../lib/dom.js";
import { burst } from "../lib/motion.js";

/**
 * "Things I love about you" — cards that unfold to show the message inside.
 * More than one can stay open, so she can read them all and look back.
 */
export function mountLoveCards({ items }) {
  const wrap = $("#cards");

  wrap.innerHTML = items
    .map(
      (item, i) => `
      <button class="card" data-reveal style="--rd:${((i % 3) * 0.1).toFixed(2)}s" aria-expanded="false">
        <span class="card__top">
          <span class="card__idx">${pad2(i + 1)}</span>
          <span class="card__title">${heart(item.title)}</span>
          <span class="card__toggle" aria-hidden="true"></span>
        </span>
        <span class="card__body">
          <span><span class="card__text">${esc(item.text)}</span></span>
        </span>
      </button>`,
    )
    .join("");

  $$(".card", wrap).forEach((card) =>
    card.addEventListener("click", () => {
      const opened = card.classList.toggle("open");
      card.setAttribute("aria-expanded", String(opened));
      if (opened) burst(card, 8, 0.55);
    }),
  );

  return wrap;
}
