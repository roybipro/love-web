import { clamp } from "./dom.js";

let observer;

/**
 * Fade sections in as she scrolls. Started only after the cover turns,
 * so nothing is already spent behind it.
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
    { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
  );
  document.querySelectorAll("[data-reveal], [data-wipe], [data-split]").forEach((el) => observer.observe(el));
}

/** The hairline at the top that fills as the book is read. */
function paintProgress() {
  const doc = document.documentElement;
  const bar = document.getElementById("scrollline");
  if (!bar) return;
  const ratio = doc.scrollTop / Math.max(1, doc.scrollHeight - window.innerHeight);
  bar.style.width = `${clamp(ratio, 0, 1) * 100}%`;
}

/** The timeline's thread draws itself as it passes the middle of the screen. */
function paintThread() {
  const list = document.getElementById("timeline-list");
  if (!list || !list.childElementCount) return;
  const rect = list.getBoundingClientRect();
  const ratio = (window.innerHeight * 0.62 - rect.top) / Math.max(1, rect.height);
  list.style.setProperty("--draw", clamp(ratio, 0, 1).toFixed(3));
}

/** Wire up every scroll-linked effect with one rAF-throttled listener. */
export function watchScroll() {
  let queued = false;
  const run = () => {
    paintProgress();
    paintThread();
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
}

/** Smooth scroll to a chapter, respecting reduced motion. */
export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}
