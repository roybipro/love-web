import { $, $$, clamp } from "./dom.js";

let observer;

/**
 * Fade sections in as she scrolls. Started only after the opening screen
 * lifts, so nothing is already "spent" behind the curtain.
 */
export function observeReveals() {
  if (observer) return;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
  );
  $$("[data-reveal], [data-split]").forEach((el) => observer.observe(el));
}

/** The hairline at the top that fills as the page is read. */
function paintProgress() {
  const doc = document.documentElement;
  const bar = $("#scrollline");
  if (!bar) return;
  const ratio = doc.scrollTop / Math.max(1, doc.scrollHeight - window.innerHeight);
  bar.style.width = `${clamp(ratio, 0, 1) * 100}%`;
}

/** The timeline's spine draws itself down as it passes the middle of the screen. */
function paintTimeline() {
  const list = $("#timeline-list");
  if (!list || !list.childElementCount) return;
  const rect = list.getBoundingClientRect();
  const ratio = (window.innerHeight * 0.62 - rect.top) / Math.max(1, rect.height);
  list.style.setProperty("--draw", clamp(ratio, 0, 1).toFixed(3));
}

/** A desktop-only warmth that follows the pointer. */
function trackCursor() {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  window.addEventListener(
    "pointermove",
    (e) => {
      const root = document.documentElement.style;
      root.setProperty("--mx", `${e.clientX}px`);
      root.setProperty("--my", `${e.clientY}px`);
    },
    { passive: true },
  );
}

/** Wire up every scroll-linked effect with one rAF-throttled listener. */
export function watchScroll() {
  let queued = false;
  const run = () => {
    paintProgress();
    paintTimeline();
    queued = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(run);
    },
    { passive: true },
  );

  window.addEventListener("resize", () => requestAnimationFrame(run), { passive: true });
  run();
  trackCursor();
}
