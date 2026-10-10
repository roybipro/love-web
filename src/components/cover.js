import { $, $$, asset, esc } from "../lib/dom.js";
import { reduceMotion, throwPaper } from "../lib/motion.js";
import { play } from "../lib/sound.js";

/**
 * The cover of the book. Pressing "Open Our Story" turns the page —
 * the lid swings on its spine, paper lifts off it, and the scrapbook
 * underneath starts revealing itself.
 *
 * Returns a `reveal` to call once the loading screen has cleared, so
 * the prints can start downloading while she is still waiting.
 */

/**
 * Pick the greeting for this hour. Entries are read in order of `at`;
 * an hour before the earliest one falls through to the last entry, so
 * 2am gets the late-night line rather than "good morning".
 */
function greetingFor(list, hour) {
  if (!list?.length) return "";
  const ordered = [...list].sort((a, b) => a.at - b.at);
  let pick = ordered[ordered.length - 1];
  for (const g of ordered) if (hour >= g.at) pick = g;
  return pick.text || "";
}

export function mountCover({ data, herName, onOpen }) {
  const cover = $("#cover");
  const title = $("#coverTitle");
  const deco = $("#coverDeco");
  const hello = $("#coverHello");

  if (hello) {
    const line = greetingFor(data.greetings, new Date().getHours()).replaceAll(
      "{name}",
      herName || "you",
    );
    if (line) {
      hello.textContent = line;
      hello.hidden = false;
    }
  }

  if (title) {
    title.innerHTML = `${esc(data.titleTo || "To")} <em>${esc(herName || "you")}</em> <span class="beat">❤️</span>`;
  }

  if (deco && data.deco?.length) {
    deco.innerHTML = data.deco
      .slice(0, 4)
      .map(
        (src, i) => `
        <span class="cover__snap d${i + 1}">
          <img src="${asset(src)}" alt="" aria-hidden="true" decoding="async" />
          <span class="tape" aria-hidden="true"></span>
        </span>`,
      )
      .join("");
  }

  $("#openBtn").addEventListener("click", () => {
    play("open");

    const page = $(".cover__page");
    if (page) {
      const r = page.getBoundingClientRect();
      throwPaper(r.left + r.width * 0.5, r.top + r.height * 0.5, 24);
    }

    cover.classList.add("is-open");
    document.body.classList.remove("is-locked");
    document.body.classList.add("opened");
    $("#site").removeAttribute("aria-hidden");
    window.scrollTo({ top: 0, behavior: "auto" });

    setTimeout(onOpen, reduceMotion ? 0 : 700);
  });

  return {
    reveal() {
      if (title) setTimeout(() => title.classList.add("in"), reduceMotion ? 0 : 200);
    },
    images: data.deco ?? [],
  };
}
