import { $ } from "./dom.js";
import { play } from "./sound.js";

const KEY = "our-story:calm";

let on = false;
try {
  on = localStorage.getItem(KEY) === "on";
} catch {
  /* no storage — motion is fine */
}

/** Anything that animates for its own sake should ask this before doing so. */
export const calmOn = () => on;

/**
 * Calm — one switch that stills the drifting motes, the hearts behind
 * the cursor, the prints leaning toward the pointer and the paper in the
 * air. The book's own setting, separate from the system one, because
 * "I like the motion, just not tonight" is a real thing.
 *
 * `onResume` runs when she takes calm back off. The dust is seeded at
 * boot and skipped entirely while calm is on, so without it the air
 * would stay empty for the rest of the visit.
 */
export function mountCalm({ button = "#calmToggle", onResume } = {}) {
  const btn = $(button);
  if (!btn) return;

  const label = $("#calmLabel");
  const root = document.documentElement;

  const apply = () => {
    if (on) root.setAttribute("data-calm", "on");
    else root.removeAttribute("data-calm");
    btn.setAttribute("aria-pressed", String(on));
    if (label) label.textContent = on ? "Moving" : "Calm";
  };
  apply();

  btn.addEventListener("click", () => {
    on = !on;
    apply();
    try {
      localStorage.setItem(KEY, on ? "on" : "off");
    } catch {
      /* this visit only */
    }
    if (!on) onResume?.();
    play("click");
  });
}
