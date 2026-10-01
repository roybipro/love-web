import { $ } from "../lib/dom.js";
import { reduceMotion, seedHearts } from "../lib/motion.js";

/**
 * The opening screen. Until she presses the button the page behind is
 * locked and unrevealed, so the scroll animations aren't wasted on her.
 */
export function mountIntro({ onOpen }) {
  seedHearts($("#introDrift"), 14);

  $("#openBtn").addEventListener("click", () => {
    const body = document.body;
    body.classList.add("opened");
    body.classList.remove("is-locked");
    $("#site").removeAttribute("aria-hidden");
    window.scrollTo({ top: 0, behavior: "auto" });
    setTimeout(onOpen, reduceMotion ? 0 : 420);
  });
}
