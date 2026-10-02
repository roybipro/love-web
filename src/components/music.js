import { $, asset } from "../lib/dom.js";
import { reduceMotion } from "../lib/motion.js";
import { play, setSound, soundIsOn } from "../lib/sound.js";

const fmt = (s) => {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

/**
 * Background music, and the little player that carries it.
 *
 * Nothing starts by itself — browsers refuse that, and honestly a
 * song should not begin before she is ready for it. The disc opens a
 * compact player with seek, volume and a visualiser, and the switch
 * at the bottom turns the interface clicks on or off.
 */
export function mountMusic({ data, startOn }) {
  const player = $("#player");
  if (!player) return;

  if (!data.file) return void player.remove();

  const track = new Audio(asset(data.file));
  track.loop = true;
  track.preload = "metadata";

  const disc = $("#playerToggle");
  const seek = $("#playerSeek");
  const vol = $("#playerVol");
  const playBtn = $("#playerPlay");
  const sfx = $("#playerSfx");

  let playing = false;
  let volume = 0.55;

  $("#playerTitle").textContent = data.title || "Our song";
  $("#playerArtist").textContent = data.artist || "";
  track.volume = volume;

  const setPlaying = (on) => {
    playing = on;
    player.classList.toggle("is-playing", on);
    playBtn.textContent = on ? "❚❚" : "▶";
    playBtn.setAttribute("aria-label", on ? "Pause the music" : "Play the music");
  };

  const paint = () => {
    const dur = track.duration || 0;
    seek.style.setProperty("--p", dur ? (track.currentTime / dur).toFixed(4) : "0");
    $("#playerTime").textContent = `${fmt(track.currentTime)} / ${fmt(dur)}`;
  };

  /* ---------- open and close the panel ---------- */
  disc.addEventListener("click", () => {
    player.classList.toggle("is-open");
    play("click");
  });

  /* ---------- play / pause ---------- */
  const toggle = async () => {
    if (playing) {
      track.pause();
      setPlaying(false);
      return;
    }
    try {
      await track.play();
      setPlaying(true);
    } catch {
      setPlaying(false); // refused; the button stays ready for her tap
    }
  };

  playBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle();
  });

  /* ---------- dragging the seek and volume bars ---------- */
  function draggable(el, onRatio) {
    let dragging = false;
    const ratio = (e) => {
      const r = el.getBoundingClientRect();
      return Math.min(1, Math.max(0, (e.clientX - r.left) / Math.max(1, r.width)));
    };
    el.addEventListener("pointerdown", (e) => {
      dragging = true;
      el.setPointerCapture?.(e.pointerId);
      onRatio(ratio(e));
      e.preventDefault();
    });
    el.addEventListener("pointermove", (e) => dragging && onRatio(ratio(e)));
    const stop = () => (dragging = false);
    el.addEventListener("pointerup", stop);
    el.addEventListener("pointercancel", stop);
  }

  draggable(seek, (r) => {
    if (Number.isFinite(track.duration)) track.currentTime = r * track.duration;
    paint();
  });

  draggable(vol, (r) => {
    volume = r;
    track.volume = r;
    vol.style.setProperty("--v", r.toFixed(3));
  });

  vol.style.setProperty("--v", String(volume));
  track.addEventListener("timeupdate", paint);
  track.addEventListener("loadedmetadata", paint);

  /* ---------- the interface-sound switch ---------- */
  sfx.setAttribute("aria-pressed", String(soundIsOn()));
  sfx.addEventListener("click", (e) => {
    e.stopPropagation();
    const next = !soundIsOn();
    setSound(next);
    sfx.setAttribute("aria-pressed", String(next));
    if (next) play("pop");
  });

  /* the cover tap is a real gesture, so the song may start there */
  document
    .querySelector(startOn)
    ?.addEventListener("click", () => setTimeout(toggle, reduceMotion ? 0 : 900), { once: true });
}
