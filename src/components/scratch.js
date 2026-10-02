import { $, asset } from "../lib/dom.js";
import { burst, reduceMotion } from "../lib/motion.js";
import { play } from "../lib/sound.js";

const BRUSH = 44; // how wide the coin is, in css pixels
const DONE_AT = 0.5; // half the foil gone counts as found

/**
 * The letter's postscript: a silver panel she scratches off with a
 * finger to reveal one last print. Enough cleared and the rest lifts
 * away by itself, and there is always a tap-to-open way out.
 */
export function mountScratch({ data, slot = "#scratchSlot" }) {
  const host = $(slot);
  if (!host || !data?.image) return;

  host.innerHTML = `
    <p class="letter__ps-label">${data.ps}</p>
    <div class="scratch">
      <div class="scratch__card" id="scratchCard">
        <div class="scratch__prize">
          <div class="scratch__frame"><img id="scImg" alt="${data.title}" /></div>
          <h3>${data.title}</h3>
          <p>${data.text}</p>
        </div>
        <canvas class="scratch__surface" id="scCanvas" aria-hidden="true"></canvas>
      </div>
      <p class="scratch__progress" id="scProgress" aria-hidden="true"></p>
      <button class="scratch__skip" id="scSkip">${data.skip}</button>
    </div>`;

  const canvas = $("#scCanvas");
  const card = $("#scratchCard");
  const skip = $("#scSkip");
  const bar = $("#scProgress");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  $("#scImg").src = asset(data.image);
  new Image().src = asset(data.image);

  let w = 0;
  let h = 0;
  let covering = true;
  let down = false;
  let last = null;

  function paintFoil() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#4a4245");
    g.addColorStop(0.3, "#8d8284");
    g.addColorStop(0.5, "#c8bdb8");
    g.addColorStop(0.7, "#7d7274");
    g.addColorStop(1, "#3d3639");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const sheen = ctx.createRadialGradient(w * 0.35, h * 0.28, 0, w * 0.35, h * 0.28, w * 0.9);
    sheen.addColorStop(0, "rgba(255,253,248,0.5)");
    sheen.addColorStop(1, "rgba(255,253,248,0)");
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(255,253,248,0.72)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `400 ${Math.round(Math.min(w, h) * 0.14)}px "Caveat", cursive`;
    ctx.fillText(data.hint, w / 2, h / 2);
  }

  function measure() {
    const { data: px } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const step = 4 * 14; // sample every 14th pixel (4 channels each)
    let total = 0;
    let clear = 0;
    for (let i = 3; i < px.length; i += step) {
      total++;
      if (px[i] < 40) clear++;
    }
    return total ? clear / total : 0;
  }

  function scratchTo(point) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.lineWidth = BRUSH;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last ? last.x : point.x, last ? last.y : point.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    last = point;
  }

  const local = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  function finish() {
    if (!covering) return;
    covering = false;
    canvas.classList.add("is-gone");
    skip.hidden = true;
    bar.classList.add("is-done");
    burst(card, 20, 1);
    play("found");
  }

  canvas.addEventListener("pointerdown", (e) => {
    if (!covering) return;
    e.preventDefault();
    /* one tap is enough if dragging is hard — the surprise survives */
    if (reduceMotion) return finish();
    down = true;
    last = local(e);
    canvas.setPointerCapture?.(e.pointerId);
    scratchTo(last);
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!down || !covering) return;
    scratchTo(local(e));
  });

  const stop = () => {
    if (!down) return;
    down = false;
    last = null;
    const removed = measure();
    bar.style.setProperty("--p", Math.min(1, removed / DONE_AT).toFixed(3));
    if (removed >= DONE_AT) finish();
  };
  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointercancel", stop);

  skip.addEventListener("click", finish);

  const start = () => paintFoil();
  document.fonts?.ready ? document.fonts.ready.then(start) : start();

  let resizing;
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizing);
      resizing = setTimeout(() => covering && paintFoil(), 220);
    },
    { passive: true },
  );
}
