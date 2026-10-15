/*  ============================================================
    POSTCARD — draws one memory as a real, printable postcard
    and hands her the file.

    The card is always paper-coloured, even at night: it is meant
    to be a physical thing she could put on a fridge.
    ============================================================ */

import { asset } from "./dom.js";
import {
  BURGUNDY,
  EDGE,
  GOLD,
  INK,
  INK_SOFT,
  MUTED,
  PAPER,
  ROSE,
  coverCrop,
  downloadCanvas,
  heartAt,
  letterSpacing,
  loadImage,
  loadFont,
  slug,
  tapeAt,
  wrap,
} from "./paper-art.js";

const W = 1200;
const H = 800;

function stamp(ctx) {
  const x = W - 64 - 96;
  const y = 56;
  const size = 96;

  ctx.save();
  ctx.strokeStyle = EDGE;
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.strokeRect(x, y, size, size);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "#f0dbdf";
  ctx.fillRect(x + 6, y + 6, size - 12, size - 12);
  heartAt(ctx, x + size / 2, y + size / 2, 40, ROSE);
  ctx.restore();

  /* a postmark, half over the stamp like a real one */
  ctx.save();
  ctx.translate(x + size - 10, y + 18);
  ctx.rotate(-0.22);
  ctx.strokeStyle = "rgba(107, 31, 47, 0.42)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(0, 0, 34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 27, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(107, 31, 47, 0.5)";
  ctx.font = '600 9px "Inter", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText("OUR STORY", 0, -2);
  ctx.fillText("KEPT", 0, 10);
  ctx.restore();
}

/**
 * Paint the card onto a canvas and return it.
 * `photo` is one entry from the `photos` list; `herName` and `sign` come
 * from memory.js so the card is addressed properly.
 */
export async function renderPostcard(photo, { herName = "you", sign = "" } = {}) {
  await Promise.all([
    loadFont('400 46px "Instrument Serif"'),
    loadFont('400 20px "Inter"'),
    loadFont('400 34px "Caveat"'),
  ]);

  const img = await loadImage(asset(photo.image));

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  /* paper */
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = EDGE;
  ctx.lineWidth = 1;
  ctx.strokeRect(22.5, 22.5, W - 45, H - 45);

  /* the print, pinned and a little crooked */
  const box = { x: 78, y: 92, w: 430, h: 560 };
  ctx.save();
  ctx.translate(box.x + box.w / 2, box.y + box.h / 2);
  ctx.rotate((-1.6 * Math.PI) / 180);
  ctx.translate(-(box.x + box.w / 2), -(box.y + box.h / 2));

  ctx.shadowColor = "rgba(43, 33, 28, 0.22)";
  ctx.shadowBlur = 26;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = "#fffdf8";
  ctx.fillRect(box.x - 14, box.y - 14, box.w + 28, box.h + 46);
  ctx.shadowColor = "transparent";

  coverCrop(ctx, img, box);
  tapeAt(ctx, box.x + 34, box.y - 20, 130, 30, -0.34);
  ctx.restore();

  /* the words */
  const col = 570;
  const colW = W - col - 64;

  ctx.fillStyle = GOLD;
  ctx.font = '400 12px "Inter", sans-serif';
  ctx.textAlign = "left";
  letterSpacing(ctx, "A MEMORY OF US", col, 116, 3.4);

  ctx.fillStyle = BURGUNDY;
  ctx.font = '400 46px "Instrument Serif", Georgia, serif';
  const title = wrap(ctx, photo.title || "Us", colW, 3);
  title.forEach((line, i) => ctx.fillText(line, col, 172 + i * 52));

  let y = 172 + title.length * 52 + 18;

  ctx.fillStyle = INK_SOFT;
  ctx.font = '300 20px "Inter", sans-serif';
  const caption = wrap(ctx, photo.caption || "", colW, 4);
  caption.forEach((line, i) => ctx.fillText(line, col, y + i * 30));
  y += caption.length * 30;

  if (photo.note) {
    y += 34;
    ctx.fillStyle = ROSE;
    ctx.font = '400 30px "Caveat", cursive';
    const note = wrap(ctx, photo.note, colW, 2);
    note.forEach((line, i) => ctx.fillText(line, col, y + i * 36));
    y += note.length * 36;
  }

  if (photo.date || photo.place) {
    y += 30;
    ctx.fillStyle = MUTED;
    ctx.font = '400 11px "Inter", sans-serif';
    letterSpacing(
      ctx,
      [photo.date, photo.place].filter(Boolean).join("  ·  ").toUpperCase(),
      col,
      y,
      2.6,
    );
  }

  /* signed */
  ctx.fillStyle = INK;
  ctx.font = '400 34px "Caveat", cursive';
  ctx.fillText(`To ${herName},`, col, H - 108);
  ctx.fillStyle = BURGUNDY;
  ctx.fillText(sign || "— me", col + 8, H - 62);

  heartAt(ctx, W - 92, H - 78, 26, ROSE);
  stamp(ctx);

  return canvas;
}

/** Draw the card for `photo` and hand her the download. */
export async function savePostcard(photo, names) {
  const canvas = await renderPostcard(photo, names);
  await downloadCanvas(canvas, `${slug(photo.title, "postcard")}-postcard.png`);
}
