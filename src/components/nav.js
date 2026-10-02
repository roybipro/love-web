import { $, $$, esc, pad2 } from "../lib/dom.js";
import { scrollToSection } from "../lib/scroll.js";
import { play } from "../lib/sound.js";

/**
 * The memory rail. A vertical list of chapters on wide screens, a
 * single "next memory" pill everywhere else, and a "Memory 03 / 08"
 * readout that follows wherever she has got to.
 */
export function mountNav({ items }) {
  const rail = $("#nav");
  const pill = $("#navpill");
  if (!rail) return;

  rail.innerHTML = `
    <nav class="nav__inner" aria-label="Memories">
      <ol class="nav__list">
        ${items
          .map(
            (m, i) => `
          <li>
            <a class="nav__link" href="#${esc(m.id)}" data-index="${i}">
              <span class="nav__dot" aria-hidden="true"></span>
              <span class="nav__name">${esc(m.label)}</span>
            </a>
          </li>`,
          )
          .join("")}
      </ol>
      <p class="nav__count">Memory <b id="navNo">${pad2(1)}</b> / ${pad2(items.length)}</p>
    </nav>`;

  let current = 0;

  const paint = (index) => {
    if (index === current) return;
    current = index;
    $$(".nav__link", rail).forEach((link, i) =>
      link.classList.toggle("is-current", i === index),
    );
    const no = $("#navNo");
    if (no) no.textContent = pad2(index + 1);
    if (pill) {
      $("#pillNo").textContent = `${pad2(index + 1)} / ${pad2(items.length)}`;
      $("#pillName").textContent = items[index].label;
    }
  };

  /* which chapter is she looking at */
  const sections = items
    .map((m) => document.getElementById(m.id))
    .filter(Boolean);

  const tracker = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const index = items.findIndex((m) => m.id === visible.target.id);
      if (index > -1) paint(index);
    },
    { rootMargin: "-40% 0px -40% 0px", threshold: [0.01, 0.25, 0.5] },
  );
  sections.forEach((s) => tracker.observe(s));

  /* clicking a chapter */
  rail.addEventListener("click", (e) => {
    const link = e.target.closest(".nav__link");
    if (!link) return;
    e.preventDefault();
    play("click");
    scrollToSection(items[Number(link.dataset.index)].id);
  });

  /* the pill jumps to the next chapter, wrapping at the end */
  pill?.addEventListener("click", () => {
    play("click");
    const next = (current + 1) % items.length;
    paint(next);
    scrollToSection(items[next].id);
  });

  paint(0);
}
