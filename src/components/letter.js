import { $, $$, heart } from "../lib/dom.js";
import { createReader, speechAvailable } from "../lib/speech.js";
import { play } from "../lib/sound.js";

/**
 * Memory 08 — the letter. The closing message from earlier versions,
 * now written on ruled paper at the end of the book.
 *
 * She can also hear it read aloud, in whatever voice her phone ships
 * with. That is the point: it costs nothing to build and nothing to
 * download, and it reaches her on a day her eyes will not manage it.
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
      ${speechAvailable() ? `
      <p class="letter__hear-wrap">
        <button class="letter__hear" id="hearLetter" type="button" aria-pressed="false">
          <span class="letter__hear-glyph" aria-hidden="true">▶</span>
          <span id="hearLetterLabel">Hear it read</span>
        </button>
      </p>` : ""}
    </div>`;

  const btn = $("#hearLetter");
  if (!btn) return;

  const label = $("#hearLetterLabel");
  const reader = createReader();

  /* read what is actually on the page, minus the hearts a voice would spell out.
     ❤️ is a heart plus a variation selector, so both halves have to go. */
  const HEARTS = /[❤♥\uFE0E\uFE0F]/g;
  const parts = [
    $(".letter__greeting", slot),
    ...$$(".letter__line", slot),
    $(".letter__love", slot),
    $(".letter__sign", slot),
  ]
    .filter(Boolean)
    .map((el) => ({ el, text: el.textContent.replace(HEARTS, "").replace(/\s+/g, " ").trim() }))
    .filter((p) => p.text);

  const mark = (i) => {
    parts.forEach((p, n) => p.el.classList.toggle("is-read", n === i));
  };
  const clear = () => parts.forEach((p) => p.el.classList.remove("is-read"));

  const reset = () => {
    btn.setAttribute("aria-pressed", "false");
    btn.classList.remove("is-on");
    if (label) label.textContent = "Hear it read";
    clear();
  };

  btn.addEventListener("click", () => {
    if (reader.speaking) {
      reader.stop();
      reset();
      return;
    }
    play("open");
    btn.setAttribute("aria-pressed", "true");
    btn.classList.add("is-on");
    if (label) label.textContent = "Stop reading";
    reader.speak(parts, { onLine: mark, onDone: reset });
  });

  /* leaving the letter should not leave a voice talking over the rest of the book */
  window.addEventListener("scroll", () => {
    if (!reader.speaking) return;
    const page = $(".letter__page", slot)?.getBoundingClientRect();
    if (page && (page.bottom < 0 || page.top > window.innerHeight)) {
      reader.stop();
      reset();
    }
  }, { passive: true });
}
