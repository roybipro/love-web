/*  ============================================================
    POSTCARD — draws a memory as a real, printable postcard and
    hands her the file.

    Everything here is drawn on a canvas at fixed pixel sizes, so
    what she saves looks the same on every phone. The card is
    always paper-coloured, even at night: it is meant to be a
    physical thing you could put on a fridge.
    ============================================================ */

import { asset } from "./dom.js";

const W = 1200;
const H = 800;

/* the palette is hardcoded on purpose — a print does not change theme */
const PAPER = "#faf6ee";
const EDGE = "#ded2c0";
const INK = "#2b211c";
const INK_SOFT = "#4a3a31";
const MUTED = "#6e5c51";
const BURGUNDY = "#6b1f2f";
const ROSE = "#b0576b";
const GOLD = "#b08d57";

const loadFont = async (spec) => {
  try {
    await document.fonts.load(spec);
    await document.fonts.ready;
  } catch {
    /* the fallback in the ctx.font string takes over */
  }
};

/** Draw `src` filling `box`, cropped from the middle rather than squashed. */
function coverCrop(ctx, img, box) {
  const scale = Math.max(box.w / img.naturalWidth, box.h / img.naturalHeight);
  const sw = box.w / scale;
  const sh = box.h / scale;
  const sx = (img.naturalWidth - sw) / 2;
  const sy = (img.naturalHeight - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, box.x, box.y, box.w, box.h);
}

/** Greedy word wrap. Returns at most `maxLines`, with the last one ellipsised. */
function wrap(ctx, text, width, maxLines = 4) {
  const words = String(text ?? "").split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  const lines = [];
  let line = "";
  let i = 0;

  while (i < words.length) {
    const trial = line ? `${line} ${words[i]}` : words[i];
    if (line && ctx.measureText(trial).width > width) {
      lines.push(line);
      line = "";
      if (lines.length === maxLines) break;
      continue;
    }
    line = trial;
    i += 1;
  }
  if (line && lines.length < maxLines) lines.push(line);

  /* words left over means the text was cut, so say so with an ellipsis */
  const kept = lines.join(" ").split(/\s+/).filter(Boolean).length;
  if (kept < words.length && lines.length) {
    let last = lines[lines.length - 1];
    while (last.length && ctx.measureText(`${last}…`).width > width) {
      last = last.slice(0, -1).trimEnd();
    }
    lines[lines.length - 1] = `${last}…`;
  }
  return lines;
}

function letterSpacing(ctx, text, x, y, spacing) {
  /* ctx.letterSpacing is still patchy, so place the glyphs by hand */
  let cursor = x;
  for (const ch of text) {
    ctx.fillText(ch, cursor, y);
    cursor += ctx.measureText(ch).width + spacing;
  }
  return cursor - x - spacing;
}

function heartAt(ctx, x, y, size, colour) {
  const s = size / 2;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.75);
  ctx.bezierCurveTo(x, y + s * 0.3, x - s, y - s * 0.2, x - s, y - s * 0.55);
  ctx.bezierCurveTo(x - s, y - s, x - s * 0.45, y - s, x, y - s * 0.4);
  ctx.bezierCurveTo(x + s * 0.45, y - s, x + s, y - s, x + s, y - s * 0.55);
  ctx.bezierCurveTo(x + s, y - s * 0.2, x, y + s * 0.3, x, y + s * 0.75);
  ctx.closePath();
  ctx.fillStyle = colour;
  ctx.fill();
  ctx.restore();
}

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

  const img = await new Promise((resolve, reject) => {
    const node = new Image();
    node.onload = () => resolve(node);
    node.onerror = () => reject(new Error("the print would not load"));
    node.decoding = "async";
    node.src = asset(photo.image);
  });

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

  /* a strip of tape across the top corner */
  ctx.save();
  ctx.translate(box.x + 34, box.y - 20);
  ctx.rotate(-0.34);
  const tape = ctx.createLinearGradient(0, 0, 130, 0);
  tape.addColorStop(0, "rgba(222, 210, 192, 0.72)");
  tape.addColorStop(0.5, "rgba(238, 228, 210, 0.8)");
  tape.addColorStop(1, "rgba(222, 210, 192, 0.72)");
  ctx.fillStyle = tape;
  ctx.fillRect(0, 0, 130, 30);
  ctx.restore();
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
    letterSpacing(ctx, [photo.date, photo.place].filter(Boolean).join("  ·  ").toUpperCase(), col, y, 2.6);
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

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((out) => (out ? resolve(out) : reject(new Error("canvas was empty"))), "image/png");
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const slug = String(photo.title || "postcard")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

  a.href = url;
  a.download = `${slug || "postcard"}-postcard.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
