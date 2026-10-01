/**
 * Wrap each word of a [data-split] element in its own clipping box so it can
 * rise into place one after another. Element children (the beating heart) are
 * treated as a single unit so nothing pops in early.
 */
export function splitWords(root = document) {
  for (const el of root.querySelectorAll("[data-split]")) {
    if (el.dataset.splitDone) continue;

    const units = [];
    for (const node of [...el.childNodes]) {
      if (node.nodeType === Node.TEXT_NODE) {
        for (const word of node.textContent.split(/\s+/)) {
          if (word) units.push(word);
        }
      } else {
        units.push(node);
      }
    }

    el.textContent = "";

    units.forEach((unit, i) => {
      const clip = document.createElement("span");
      clip.className = "w";

      const inner = document.createElement("i");
      inner.style.setProperty("--wd", `${(i * 0.055).toFixed(3)}s`);

      if (typeof unit === "string") inner.textContent = unit;
      else inner.appendChild(unit);

      clip.appendChild(inner);
      el.appendChild(clip);
      el.appendChild(document.createTextNode(" "));
    });

    el.dataset.splitDone = "1";
  }
}
