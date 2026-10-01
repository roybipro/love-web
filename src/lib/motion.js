import { $, rnd } from "./dom.js";

/** Honour the OS "reduce motion" setting everywhere at once. */
export const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scatter slow, blurred hearts across a container.
 * Negative animation delays mean the air is already full when she arrives.
 */
export function seedHearts(host, count) {
  if (!host || reduceMotion || host.childElementCount) return;

  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.className = "fh";
    heart.textContent = "♥";
    heart.style.left = `${rnd(2, 98).toFixed(1)}%`;
    heart.style.setProperty("--s", `${rnd(9, 24).toFixed(0)}px`);
    heart.style.setProperty("--x", `${rnd(-80, 80).toFixed(0)}px`);
    heart.style.setProperty("--t", `${rnd(15, 32).toFixed(0)}s`);
    heart.style.setProperty("--dl", `${(-rnd(0, 32)).toFixed(0)}s`);
    heart.style.setProperty("--o", rnd(0.1, 0.36).toFixed(2));
    heart.style.setProperty("--r", `${rnd(-60, 60).toFixed(0)}deg`);
    heart.style.setProperty("--b", Math.random() < 0.4 ? `${rnd(1, 3).toFixed(1)}px` : "0px");
    frag.appendChild(heart);
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
