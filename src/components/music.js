import { $, asset } from "../lib/dom.js";

const VOLUME = 0.5;

/**
 * Background music from a file in public/audio/.
 *
 * Browsers refuse to start audio without a real tap, so playback is armed by
 * the "Open it" button — the one gesture she always makes first. The control
 * stays on screen so she can quiet it down.
 *
 * If the file isn't there yet the button hides itself, so the site never
 * shows a control that does nothing.
 */
export function mountMusic({ file, startOn, label = "Our song" }) {
  const button = $("#musicBtn");
  const text = $("#musicLabel");
  if (!button) return;

  if (!file) return giveUp();

  const track = new Audio(asset(file));
  track.loop = true;
  track.preload = "auto";
  track.volume = 0;

  let playing = false;

  function giveUp() {
    button.hidden = true;
  }

  function paint() {
    button.classList.toggle("is-on", playing);
    button.setAttribute("aria-pressed", String(playing));
    if (text) text.textContent = playing ? label : "Sound off";
  }

  track.addEventListener("error", giveUp);

  /** ease the song in rather than slamming it on */
  function fadeTo(target, ms = 2400) {
    const start = track.volume;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / ms);
      track.volume = Math.max(0, Math.min(1, start + (target - start) * p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  async function play() {
    try {
      await track.play();
      playing = true;
      fadeTo(VOLUME);
    } catch {
      playing = false; // autoplay refused — the button still works
    }
    paint();
  }

  function pause() {
    track.pause();
    playing = false;
    paint();
  }

  button.addEventListener("click", () => (playing ? pause() : play()));

  document.querySelector(startOn)?.addEventListener("click", play, { once: true });

  paint();
}
