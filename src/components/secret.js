import { $ } from "../lib/dom.js";
import { burst } from "../lib/motion.js";
import { play } from "../lib/sound.js";

/**
 * A hidden note. Tapping the heart on the cover a few times brings it
 * out. Nothing advertises it — she has to be curious, which is the point.
 */
export function mountSecret({ taps = 5, message }) {
  const note = $("#coverSecret");
  if (!note || !message) return;

  let count = 0;
  let resetTimer;

  document.addEventListener(
    "click",
    (e) => {
      const heart = e.target.closest?.("#coverTitle .beat");
      if (!heart) return;

      count += 1;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => (count = 0), 1600);

      if (count >= taps) {
        count = 0;
        note.textContent = message;
        note.hidden = false;
        requestAnimationFrame(() => note.classList.add("in"));
        burst(note.parentElement, 16, 0.8);
        play("found");
      }
    },
    true,
  );
}
