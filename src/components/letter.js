import { $, heart } from "../lib/dom.js";

/**
 * Memory 08 — the letter. The closing message from earlier versions,
 * now written on ruled paper at the end of the book.
 */
export function mountLetter(data) {
  const slot = $("#letterPage");
  if (!slot) return;

  slot.innerHTML = `
    <header class="head" data-reveal>
      <span class="head__no" aria-hidden="true">08</span>
      <p class="head__label">${heart(data.label || "")}</p>
      <h2 class="head__title" data-split>${heart(data.title)}</h2>
    </header>

    <div class="letter" data-reveal>
      <div class="letter__page paper--torn">
        <span class="tape tape--left" aria-hidden="true"></span>
        <span class="tape tape--right" aria-hidden="true"></span>
        <span class="letter__doodles" aria-hidden="true">♥ ♥</span>

        <p class="letter__greeting">${heart(data.greeting)}</p>
        <div class="letter__body">
          ${data.lines.map((line) => `<p class="letter__line">${heart(line)}</p>`).join("")}
          <p class="letter__love">${heart(data.love)}</p>
          <span class="signature letter__sign">${heart(data.sign)}</span>
        </div>
      </div>
    </div>`;
}
