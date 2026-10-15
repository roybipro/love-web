import { $ } from "../lib/dom.js";
import { play } from "../lib/sound.js";
import { saveContactSheet } from "../lib/contact-sheet.js";

/**
 * "Keep the whole wall" — one page with every print on it.
 * Drawing fifteen photographs takes a moment, so the button says so
 * rather than appearing to do nothing.
 */
export function mountKeepSheet({ photos, heading = {}, names = {}, button = "#contactSheet" } = {}) {
  const btn = $(button);
  if (!btn) return;

  const label = $("#sheetLabel");
  const idle = label?.textContent || "Keep the whole wall";

  btn.addEventListener("click", async () => {
    if (btn.disabled) return;
    play("click");
    btn.disabled = true;
    if (label) label.textContent = "Laying them out…";

    try {
      await saveContactSheet(photos, { ...names, title: heading.title });
      if (label) label.textContent = "Saved — again?";
      play("found");
    } catch {
      if (label) label.textContent = "Would not draw";
    } finally {
      btn.disabled = false;
      setTimeout(() => {
        if (label) label.textContent = idle;
      }, 3200);
    }
  });
}
