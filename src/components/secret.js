import { $ } from "../lib/dom.js";
import { burst } from "../lib/motion.js";

/**
 * A hidden note. Tapping the heart in the opening title a few times brings it
 * out. Nothing advertises it — she has to be curious, which is the point.
 */
export function mountSecret({ taps = 5, message }) {
  const note = $("#introSecret");
  if (!note || !message) return;

  let count = 0;
  let resetTimer;

  const trigger = () => {
    note.textContent = message;
    note.hidden = false;
    requestAnimationFrame(() => note.classList.add("in"));
    burst(note.parentElement, 16, 0.8);
  };

  /* the heart only exists once the title has been split into words */
  const findHeart = () => $("#introTitle .beat");

  document.addEventListener(
    "click",
    (e) => {
      const heart = findHeart();
      if (!heart || !heart.contains(e.target)) return;

      count += 1;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => (count = 0), 1600);

      if (count >= taps) {
        count = 0;
        trigger();
      }
    },
    true,
  );
}
