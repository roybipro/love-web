import { $ } from "../lib/dom.js";
import { play } from "../lib/sound.js";

const KEY = "our-story:theme";

/**
 * Paper / Night. Only the tokens change, so every section flips with it.
 * The choice is remembered on her device. A two-line script in the page
 * <head> applies it before first paint so there is no flash.
 */
export function mountTheme({ button = "#themeToggle" } = {}) {
  const btn = $(button);
  if (!btn) return;

  const label = $("#themeLabel");
  const glyph = $("#themeGlyph");
  const root = document.documentElement;

  const apply = (theme) => {
    const night = theme === "night";
    if (night) root.setAttribute("data-theme", "night");
    else root.removeAttribute("data-theme");
    btn.setAttribute("aria-pressed", String(night));
    /* the button offers the opposite of what she is looking at */
    if (label) label.textContent = night ? "Paper" : "Night";
    if (glyph) glyph.textContent = night ? "☀" : "☾";
  };

  let current = "paper";
  try {
    if (localStorage.getItem(KEY) === "night") current = "night";
  } catch {
    /* no storage available — stay on paper */
  }
  apply(current);

  btn.addEventListener("click", () => {
    current = current === "night" ? "paper" : "night";
    apply(current);
    try {
      localStorage.setItem(KEY, current);
    } catch {
      /* nothing to persist to */
    }
    play("click");
  });
}
