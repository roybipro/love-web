import { $, $$, asset, heart, pad2 } from "../lib/dom.js";
import { reduceMotion } from "../lib/motion.js";
import { play } from "../lib/sound.js";

const ZOOM = "transform .62s cubic-bezier(.2,.8,.2,1), opacity .35s ease";

/**
 * The photo viewer. It opens by growing out of whichever print she
 * tapped — a FLIP animation, so the frame she was looking at becomes
 * the big one rather than a new window appearing.
 */
export function createLightbox(photos) {
  const lb = $("#lb");
  const mat = $(".lb__mat");
  const frame = $(".lb__frame");
  const img = $("#lbImg");
  const caption = $(".lb__cap");

  let index = 0;
  let origin = null;
  let restoreFocus = null;

  /** the box to zoom out of, whatever kind of print she tapped */
  const originBox = (el) =>
    $(".polaroid__frame", el) || $(".tl__shot", el) || $(".reveal-card__frame", el) || el;

  const tileFrame = (i) => {
    const item = $$(".wall__item")[i];
    return item ? $(".polaroid__frame", item) : null;
  };

  function paint(i) {
    const photo = photos[i];
    img.src = asset(photo.image);
    img.alt = photo.title;

    const date = $("#lbDate");
    date.textContent = photo.date || "";
    date.hidden = !photo.date;

    const place = $("#lbPlace");
    place.textContent = photo.place || "";
    place.hidden = !photo.place;

    $("#lbTitle").innerHTML = heart(photo.title);
    $("#lbCaption").innerHTML = heart(photo.caption);

    const note = $("#lbNote");
    note.textContent = photo.note || "";
    note.hidden = !photo.note;

    $("#lbCount").textContent = `${pad2(i + 1)} / ${pad2(photos.length)}`;

    /* let her keep the print — same origin, so a plain download works */
    const save = $("#lbSave");
    const url = asset(photo.image);
    save.href = url;
    save.download = url.split("/").pop() || "our-story.jpg";
  }

  function open(i, fromEl) {
    index = i;
    restoreFocus = document.activeElement;
    paint(i);
    lb.hidden = false;
    document.body.classList.add("lb-open");

    origin = (fromEl && originBox(fromEl)) || fromEl || tileFrame(i);

    const from = origin?.getBoundingClientRect();
    if (from?.width && from?.height) {
      /* match the mount to the print she tapped so the zoom never stretches */
      frame.style.setProperty("--ar", (from.width / from.height).toFixed(4));
    }
    const to = frame.getBoundingClientRect();

    if (!reduceMotion && from?.width && to.width) {
      img.style.transition = "none";
      img.style.transform = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;
      img.style.opacity = "0.4";
      requestAnimationFrame(() => {
        lb.classList.add("is-open");
        img.style.transition = ZOOM;
        img.style.transform = "translate(0,0) scale(1,1)";
        img.style.opacity = "1";
      });
    } else {
      lb.classList.add("is-open");
    }

    $("#lbX").focus({ preventScroll: true });
  }

  function close() {
    const rect = origin && document.contains(origin) ? origin.getBoundingClientRect() : null;
    const onScreen = rect && rect.top < window.innerHeight - 40 && rect.bottom > 40;

    if (!reduceMotion && onScreen && rect.width) {
      const to = frame.getBoundingClientRect();
      img.style.transition = "transform .5s cubic-bezier(.5,0,.3,1), opacity .4s ease";
      img.style.transform = `translate(${rect.left - to.left}px, ${rect.top - to.top}px) scale(${rect.width / to.width}, ${rect.height / to.height})`;
      img.style.opacity = "0";
    }

    lb.classList.remove("is-open");
    document.body.classList.remove("lb-open");

    setTimeout(
      () => {
        lb.hidden = true;
        img.style.transition = "none";
        img.style.transform = "translate(0,0) scale(1,1)";
        img.style.opacity = "1";
        restoreFocus?.focus?.({ preventScroll: true });
      },
      reduceMotion ? 0 : 500,
    );
    origin = null;
  }

  /** Step to the previous/next print without leaving the viewer. */
  function go(direction) {
    index = (index + direction + photos.length) % photos.length;
    play("click");

    if (reduceMotion) {
      paint(index);
      origin = tileFrame(index) || origin;
      return;
    }

    img.style.transition = "opacity .28s ease, transform .45s cubic-bezier(.2,.8,.2,1)";
    img.style.opacity = "0";
    img.style.transform = `translateX(${direction * -18}px)`;
    caption.style.opacity = "0";

    setTimeout(() => {
      paint(index);
      origin = tileFrame(index) || origin;
      img.style.transition = "opacity .4s ease, transform .55s cubic-bezier(.2,.8,.2,1)";
      img.style.opacity = "1";
      img.style.transform = "translate(0,0)";
      caption.style.transition = "opacity .5s ease";
      caption.style.opacity = "1";
    }, 240);
  }

  $("#lbX").addEventListener("click", close);
  $$("[data-lb-close]", lb).forEach((scrim) => scrim.addEventListener("click", close));
  $("#lbPrev").addEventListener("click", () => go(-1));
  $("#lbNext").addEventListener("click", () => go(1));

  window.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  });

  /* swipe, because arrows are off on phones */
  let startX = 0;
  lb.addEventListener("touchstart", (e) => (startX = e.changedTouches[0].clientX), { passive: true });
  lb.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
    },
    { passive: true },
  );

  return { open, close };
}
