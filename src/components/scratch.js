import { $, asset } from "../lib/dom.js";
import { burst, reduceMotion } from "../lib/motion.js";

const BRUSH = 46; // how wide the coin is, in css pixels
const DONE_AT = 0.5; // half the foil gone counts as found

/**
 * The scratch card. A foil layer is painted on a canvas sitting on top of the
 * prize; dragging erases it with destination-out compositing. Once enough has
 * been removed the rest lifts away on its own so she doesn't have to be
 * thorough — and there's always a tap-to-reveal escape.
 */
export function mountScratch({ data, onReveal }) {
  const card = $("#scratchCard");
  const canvas = $("#scCanvas");
  const skip = $("#scSkip");
  const bar = $("#scProgress");
  if (!card || !canvas) return;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  let w = 0;
  let h = 0;
  let covering = true;
  let down = false;
  let last = null;
  let removed = 0;

  $("#scKicker").textContent = data.kicker;
  $("#scPrompt").textContent = data.prompt;
  $("#scHint").textContent = data.hint;
  $("#scDate").textContent = data.date || "";
  $("#scDate").hidden = !data.date;
  $("#scTitle").textContent = data.title;
  $("#scText").textContent = data.text;
  skip.textContent = data.skip;

  const prize = $("#scImg");
  prize.src = asset(data.image);
  prize.alt = data.title;

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

    /* a pale sheen across the middle, like real foil catching the light */
    const sheen = ctx.createRadialGradient(w * 0.35, h * 0.28, 0, w * 0.35, h * 0.28, w * 0.9);
    sheen.addColorStop(0, "rgba(249,231,234,0.5)");
    sheen.addColorStop(1, "rgba(249,231,234,0)");
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(247,242,234,0.72)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `400 ${Math.round(Math.min(w, h) * 0.13)}px "Mrs Saint Delafield", cursive`;
    ctx.fillText($("#scHint").textContent, w / 2, h / 2);
  }

  /** how much of the foil she has cleared, 0 → 1 */
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

  function local(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function track() {
    removed = measure();
    if (bar) bar.style.setProperty("--p", Math.min(1, removed / DONE_AT).toFixed(3));
    if (removed >= DONE_AT) finish();
  }

  function finish() {
    if (!covering) return;
    covering = false;
    canvas.classList.add("is-gone");
    card.classList.add("is-open");
    skip.hidden = true;
    if (bar) bar.classList.add("is-done");
    burst(card, 20, 1);
    onReveal?.();
  }

  canvas.addEventListener("pointerdown", (e) => {
    if (!covering) return;
    /* one tap is enough if dragging is hard — the surprise survives */
    if (reduceMotion) {
      finish();
      e.preventDefault();
      return;
    }
    down = true;
    last = local(e);
    canvas.setPointerCapture?.(e.pointerId);
    scratchTo(last);
    e.preventDefault();
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!down || !covering) return;
    scratchTo(local(e));
  });

  const stop = () => {
    if (!down) return;
    down = false;
    last = null;
    track();
  };
  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointercancel", stop);

  /* let the foil settle in after the fonts, so the hint isn't drawn in fallback */
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

  skip.addEventListener("click", finish);
}
