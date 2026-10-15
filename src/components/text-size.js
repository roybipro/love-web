import { $ } from "../lib/dom.js";
import { play } from "../lib/sound.js";

const KEY = "our-story:text-size";
const STEPS = [
  { id: "", label: "Normal" },
  { id: "lg", label: "Large" },
  { id: "xl", label: "Largest" },
];

/**
 * Three reading sizes. The whole book is built in rem, so moving the
 * root font-size moves everything — headings, captions, the paper the
 * words sit on — and nothing has to be re-tuned by hand.
 *
 * A page <head> script applies the saved choice before first paint, so
 * the book never shows her the wrong size and corrects itself.
 */
export function mountTextSize({ button = "#textSize" } = {}) {
  const btn = $(button);
  if (!btn) return;

  const label = $("#textSizeLabel");
  const root = document.documentElement;

  let at = 0;
  try {
    const saved = localStorage.getItem(KEY);
    const found = STEPS.findIndex((s) => s.id && s.id === saved);
    if (found > -1) at = found;
  } catch {
    /* no storage — normal is fine */
  }

  const apply = () => {
    const step = STEPS[at];
    if (step.id) root.setAttribute("data-text", step.id);
    else root.removeAttribute("data-text");
    if (label) label.textContent = step.label;
    btn.setAttribute("aria-label", `Text size: ${step.label}. Change it.`);
  };
  apply();

  btn.addEventListener("click", () => {
    at = (at + 1) % STEPS.length;
    apply();
    try {
      localStorage.setItem(KEY, STEPS[at].id || "normal");
    } catch {
      /* this visit only, then */
    }
    play("click");
  });
}
