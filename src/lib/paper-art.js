/*  ============================================================
    PAPER ART — the drawing tricks shared by everything that
    turns a memory into a file she can keep.

    Both the postcard and the contact sheet are canvas work at
    fixed pixel sizes, so what she saves looks the same on every
    phone. The palette here is deliberately hardcoded: these are
    printed objects, and a print does not change its colours
    because the lights in the room did.
    ============================================================ */

export const PAPER = "#faf6ee";
export const EDGE = "#ded2c0";
export const INK = "#2b211c";
export const INK_SOFT = "#4a3a31";
export const MUTED = "#6e5c51";
export const BURGUNDY = "#6b1f2f";
export const ROSE = "#b0576b";
export const GOLD = "#b08d57";

/** Wait for a webfont, or let the fallback in the ctx.font string win. */
export async function loadFont(spec) {
  try {
    await document.fonts.load(spec);
    await document.fonts.ready;
  } catch {
    /* offline or unsupported — the fallback is already in the font string */
  }
}

/** Load an image from the same origin so the canvas stays exportable. */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("the print would not load"));
    img.decoding = "async";
    img.src = src;
  });
}

/** Draw `img` filling `box`, cropped from the middle rather than squashed. */
export function coverCrop(ctx, img, box) {
  const scale = Math.max(box.w / img.naturalWidth, box.h / img.naturalHeight);
  const sw = box.w / scale;
  const sh = box.h / scale;
  const sx = (img.naturalWidth - sw) / 2;
  const sy = (img.naturalHeight - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, box.x, box.y, box.w, box.h);
}

/** Greedy word wrap. Returns at most `maxLines`, with the last one ellipsised. */
export function wrap(ctx, text, width, maxLines = 4) {
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

/** ctx.letterSpacing is still patchy, so place the glyphs by hand. */
export function letterSpacing(ctx, text, x, y, spacing) {
  let cursor = x;
  for (const ch of text) {
    ctx.fillText(ch, cursor, y);
    cursor += ctx.measureText(ch).width + spacing;
  }
  return cursor - x - spacing;
}

export function heartAt(ctx, x, y, size, colour) {
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

/** A strip of aged tape, laid at an angle from (x, y). */
export function tapeAt(ctx, x, y, w, h, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, "rgba(222, 210, 192, 0.72)");
  g.addColorStop(0.5, "rgba(238, 228, 210, 0.8)");
  g.addColorStop(1, "rgba(222, 210, 192, 0.72)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/** Draw a canvas and hand her the file. */
export async function downloadCanvas(canvas, filename) {
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((out) => (out ? resolve(out) : reject(new Error("canvas was empty"))), "image/png");
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** "Our First Date" -> "our-first-date" for a filename. */
export const slug = (text, fallback = "keepsake") =>
  String(text || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || fallback;
