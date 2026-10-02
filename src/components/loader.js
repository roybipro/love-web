import { $ } from "../lib/dom.js";

/**
 * A short loading moment. The bar is driven by things that genuinely
 * have to happen — fonts arriving and the cover prints decoding — and
 * it never parks on screen longer than about a second.
 */
export function mountLoader({ images = [], onReady }) {
  const loader = $("#loader");
  const bar = $("#loaderBar");
  if (!loader) return onReady();

  let progress = 0;
  const started = performance.now();

  const advance = (to) => {
    progress = Math.max(progress, to);
    if (bar) bar.style.setProperty("--p", progress.toFixed(3));
  };

  advance(0.2);

  const fonts = document.fonts?.ready ?? Promise.resolve();
  const pictures = Promise.all(
    images
      .slice(0, 4)
      .map((src) => {
        const img = new Image();
        img.src = src;
        return img.decode ? img.decode().catch(() => {}) : new Promise((r) => (img.onload = img.onerror = r));
      }),
  );

  Promise.all([fonts, pictures]).then(() => advance(1), () => advance(0.85));

  /* do not wait forever if something stalls */
  setTimeout(() => advance(1), 2200);

  const wait = () => {
    if (progress < 1 || performance.now() - started < 700) return setTimeout(wait, 80);
    loader.classList.add("is-done");
    setTimeout(() => (loader.hidden = true), 900);
    onReady();
  };
  wait();
}
