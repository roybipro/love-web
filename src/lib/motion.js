import { rnd } from "./dom.js";

/** Honour the OS "reduce motion" setting everywhere at once. */
export const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Slow dust catching the light, drifting up the background layer.
 * Negative delays mean the air is already full when she arrives.
 */
export function seedDust(host, count = 26) {
  if (!host || reduceMotion || host.childElementCount) return;

  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const mote = document.createElement("i");
    mote.style.left = `${rnd(1, 99).toFixed(1)}%`;
    mote.style.setProperty("--s", `${rnd(2, 6).toFixed(1)}px`);
    mote.style.setProperty("--x", `${rnd(-70, 70).toFixed(0)}px`);
    mote.style.setProperty("--t", `${rnd(20, 44).toFixed(0)}s`);
    mote.style.setProperty("--dl", `${(-rnd(0, 44)).toFixed(0)}s`);
    mote.style.setProperty("--o", rnd(0.18, 0.55).toFixed(2));
    frag.appendChild(mote);
  }
  host.appendChild(frag);
}

/** A short radial burst of hearts from the centre of `host`. */
export function burst(host, count = 16, scale = 1) {
  if (reduceMotion || !host) return;

  const wrap = document.createElement("div");
  wrap.className = "burst";
  host.appendChild(wrap);

  for (let i = 0; i < count; i++) {
    const spark = document.createElement("span");
    spark.textContent = "♥";
    spark.style.fontSize = `${rnd(9, 18) * scale}px`;
    wrap.appendChild(spark);

    const angle = ((Math.PI * 2) / count) * i + rnd(-0.25, 0.25);
    const distance = rnd(60, 170) * scale;

    spark
      .animate(
        [
          { transform: "translate(-50%,-50%) scale(.3)", opacity: 1 },
          {
            transform: `translate(${Math.cos(angle) * distance - 6}px, ${Math.sin(angle) * distance - 6}px) scale(${rnd(0.8, 1.6)}) rotate(${rnd(-70, 70)}deg)`,
            opacity: 0,
          },
        ],
        { duration: rnd(750, 1300), easing: "cubic-bezier(.15,.8,.3,1)" },
      )
      .onfinish = () => spark.remove();
  }

  setTimeout(() => wrap.remove(), 1600);
}

/**
 * Confetti, but paper: small squares that flutter away when the
 * cover turns. Uses transform and opacity only, so it stays cheap.
 */
export function throwPaper(originX, originY, count = 22) {
  if (reduceMotion) return;

  for (let i = 0; i < count; i++) {
    const flake = document.createElement("i");
    flake.className = "flake";
    const size = rnd(6, 15);
    flake.style.setProperty("--s", `${size.toFixed(0)}px`);
    flake.style.left = `${originX}px`;
    flake.style.top = `${originY}px`;
    flake.style.background = ["#eae0d1", "#f0dbdf", "#fffdf8", "#ded2c0"][i % 4];
    document.body.appendChild(flake);

    const angle = rnd(-Math.PI * 0.9, -Math.PI * 0.1);
    const distance = rnd(120, 420);

    flake
      .animate(
        [
          { transform: "translate(-50%,-50%) rotate(0deg)", opacity: 1 },
          {
            transform: `translate(${Math.cos(angle) * distance}px, ${
              Math.sin(angle) * distance + rnd(180, 340)
            }px) rotate(${rnd(-420, 420)}deg)`,
            opacity: 0,
          },
        ],
        { duration: rnd(1100, 2000), easing: "cubic-bezier(.2,.6,.3,1)" },
      )
      .onfinish = () => flake.remove();
  }
}
