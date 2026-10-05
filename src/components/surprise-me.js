import { $, $$ } from "../lib/dom.js";
import { play } from "../lib/sound.js";

/**
 * "Surprise me" — let the book choose the next print.
 * It scrolls the chosen print into view first so the zoom still grows
 * out of the right photograph rather than flying in from off-screen.
 */
export function mountSurpriseMe({ button = "#surpriseMe", onPick }) {
  const btn = $(button);
  if (!btn) return;

  let last = -1;

  btn.addEventListener("click", async () => {
    const items = $$(".wall__item");
    if (!items.length) return;

    play("click");

    let pick;
    do {
      pick = Math.floor(Math.random() * items.length);
    } while (items.length > 1 && pick === last);
    last = pick;

    btn.classList.add("is-shuffling");
    setTimeout(() => btn.classList.remove("is-shuffling"), 620);

    items[pick].scrollIntoView({ behavior: "smooth", block: "center" });

    /* give the scroll a moment to settle so the zoom measures correctly */
    setTimeout(() => onPick(pick, items[pick]), 460);
  });
}
