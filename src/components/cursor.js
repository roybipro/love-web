import { reduceMotion } from "../lib/motion.js";
import { rnd } from "../lib/dom.js";

/**
 * A dot, a lazy ring, the occasional heart, and buttons that lean
 * toward the pointer. Desktop only — touch devices get none of it.
 */
export function mountCursor() {
  if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

  const dot = document.createElement("div");
  const ring = document.createElement("div");
  dot.className = "cursor-dot";
  ring.className = "cursor-ring";
  document.body.append(dot, ring);

  let x = innerWidth / 2;
  let y = innerHeight / 2;
  let rx = x;
  let ry = y;
  let hearts = 0;
  let lastHeart = 0;

  const HOT = "a, button, [role='button'], input, .tile, .card, .polaroid, .tl__shot";

  window.addEventListener(
    "pointermove",
    (e) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px)`;
      document.body.classList.add("cursor-on");

      const hot = e.target.closest?.(HOT);
      document.body.classList.toggle("cursor-hot", !!hot);

      /* a heart now and then, never a stream of them */
      const now = performance.now();
      if (hot && now - lastHeart > 900 && Math.random() < 0.35 && hearts < 6) {
        lastHeart = now;
        hearts++;
        trailHeart(x, y, () => hearts--);
      }
    },
    { passive: true },
  );

  function trailHeart(px, py, done) {
    const heart = document.createElement("i");
    heart.className = "ctrail";
    heart.textContent = "♥";
    heart.style.left = `${px}px`;
    heart.style.top = `${py}px`;
    document.body.appendChild(heart);

    heart
      .animate(
        [
          { transform: "translate(-50%,-50%) scale(.4)", opacity: 0 },
          { transform: `translate(${px - 50 + rnd(-14, 14)}px, ${py - 58}px) scale(1.1) rotate(${rnd(-25, 25)}deg)`, opacity: 0.85, offset: 0.35 },
          { transform: `translate(${px - 50 + rnd(-30, 30)}px, ${py - 130}px) scale(.7)`, opacity: 0 },
        ],
        { duration: 1200, easing: "cubic-bezier(.2,.7,.3,1)" },
      )
      .onfinish = () => {
        heart.remove();
        done?.();
      };
  }

  /* the ring lags a little behind the hand */
  (function follow() {
    rx += (x - rx) * 0.16;
    ry += (y - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(follow);
  })();

  window.addEventListener("pointerleave", () => document.body.classList.remove("cursor-on"));
}

/**
 * Magnetic buttons: the label drifts a few pixels toward the pointer
 * while it is over them. Applied to anything marked .magnet.
 */
export function mountMagnets() {
  if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

  const bind = (el) => {
    if (el.dataset.magnet) return;
    el.dataset.magnet = "1";
    let frame = 0;

    el.addEventListener("pointermove", (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.3;
        el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      });
    });

    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  };

  const scan = () => document.querySelectorAll(".magnet").forEach(bind);
  scan();
  /* chapters are built after this runs, so look again shortly after */
  setTimeout(scan, 400);
}
