import { $, asset } from "../lib/dom.js";
import { reduceMotion, seedHearts } from "../lib/motion.js";

/**
 * The opening screen. Until she presses the button the page behind is locked
 * and unrevealed, so the scroll animations aren't wasted on her.
 */
export function mountIntro({ bleed = [], onOpen }) {
  /* a few prints scattered around the words */
  const host = $("#introScatter");
  if (host && bleed.length) {
    host.innerHTML = bleed
      .slice(0, 4)
      .map((src) => `<img src="${asset(src)}" alt="" aria-hidden="true" />`)
      .join("");
  }

  seedHearts($("#introDrift"), 14);

  /* the title is on screen before anything is observed, so it lifts itself */
  const title = $("#introTitle");
  if (title) setTimeout(() => title.classList.add("in"), reduceMotion ? 0 : 260);

  $("#openBtn").addEventListener("click", () => {
    const body = document.body;
    body.classList.add("opened");
    body.classList.remove("is-locked");
    $("#site").removeAttribute("aria-hidden");
    window.scrollTo({ top: 0, behavior: "auto" });
    setTimeout(onOpen, reduceMotion ? 0 : 500);
  });
}
