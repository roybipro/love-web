/*  ============================================================
    CONTACT SHEET — the whole wall of prints on one page, so she
    can keep every memory at once rather than one at a time.

    Same idea as a photographer's sheet: small, square-ish, each
    one captioned, on paper.
    ============================================================ */

import { asset, pad2 } from "./dom.js";
import {
  BURGUNDY,
  EDGE,
  GOLD,
  INK,
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
  wrap,
} from "./paper-art.js";

const W = 1400;
const MARGIN = 64;
const GAP = 18;
const HEADER = 150;
const FOOTER = 96;
const CAPTION = 38;
const RATIO = 1.26; /* portrait cells, like the wall */

/** A grid with roughly the shape of the sheet it has to fill. */
function columns(count) {
  return Math.max(2, Math.min(5, Math.round(Math.sqrt(count * 1.15))));
}

/**
 * Paint the sheet onto a canvas and return it. Prints that will not
 * load are left out rather than failing the whole page.
 */
export async function renderContactSheet(photos, { herName = "you", sign = "", title = "Little moments" } = {}) {
  await Promise.all([
    loadFont('400 34px "Instrument Serif"'),
    loadFont('400 13px "Inter"'),
    loadFont('400 26px "Caveat"'),
  ]);

  const loaded = await Promise.allSettled(photos.map((p) => loadImage(asset(p.image))));
  const prints = photos
    .map((photo, i) => ({ photo, img: loaded[i].status === "fulfilled" ? loaded[i].value : null }))
    .filter((entry) => entry.img);

  if (!prints.length) throw new Error("none of the prints would load");

  const cols = columns(prints.length);
  const usable = W - MARGIN * 2;
  const cellW = (usable - (cols - 1) * GAP) / cols;
  const cellH = cellW * RATIO + CAPTION;
  const rows = Math.ceil(prints.length / cols);
  const H = HEADER + rows * cellH + (rows - 1) * GAP + FOOTER + MARGIN;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = EDGE;
  ctx.lineWidth = 1;
  ctx.strokeRect(22.5, 22.5, W - 45, H - 45);

  /* ---- header ---- */
  ctx.textAlign = "left";
  ctx.fillStyle = GOLD;
  ctx.font = '400 12px "Inter", sans-serif';
  letterSpacing(ctx, "A CONTACT SHEET OF US", MARGIN, 78, 3.4);

  ctx.fillStyle = BURGUNDY;
  ctx.font = '400 52px "Instrument Serif", Georgia, serif';
  ctx.fillText(title, MARGIN, 134);

  ctx.fillStyle = MUTED;
  ctx.font = '400 13px "Inter", sans-serif';
  ctx.textAlign = "right";
  ctx.fillText(`${pad2(prints.length)} prints`, W - MARGIN, 126);
  ctx.textAlign = "left";

  /* ---- the grid ---- */
  prints.forEach((entry, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = MARGIN + col * (cellW + GAP);
    const y = HEADER + row * (cellH + GAP);
    const box = { x: x + 8, y: y + 8, w: cellW - 16, h: cellH - CAPTION - 16 };

    ctx.fillStyle = "#fffdf8";
    ctx.fillRect(x, y, cellW, cellH - CAPTION + 8);
    ctx.strokeStyle = "rgba(43, 33, 28, 0.12)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, cellW - 1, cellH - CAPTION + 7);

    coverCrop(ctx, entry.img, box);

    ctx.fillStyle = INK;
    ctx.font = '400 15px "Instrument Serif", Georgia, serif';
    const cap = wrap(ctx, entry.photo.title || "", cellW - 16, 1);
    ctx.fillText(cap[0] || "", x + 8, y + cellH - CAPTION + 26);

    ctx.fillStyle = ROSE;
    ctx.font = '400 11px "Inter", sans-serif';
    ctx.textAlign = "right";
    ctx.fillText(pad2(i + 1), x + cellW - 8, y + cellH - CAPTION + 26);
    ctx.textAlign = "left";
  });

  /* ---- footer ---- */
  const fy = H - FOOTER - MARGIN / 2;
  ctx.fillStyle = INK;
  ctx.font = '400 30px "Caveat", cursive';
  ctx.fillText(`To ${herName},`, MARGIN, fy + 24);
  ctx.fillStyle = BURGUNDY;
  ctx.fillText(sign || "— me", MARGIN + 150, fy + 24);

  heartAt(ctx, W - MARGIN - 14, fy + 14, 24, ROSE);

  return canvas;
}

/** Draw the sheet and hand her the download. */
export async function saveContactSheet(photos, names) {
  const canvas = await renderContactSheet(photos, names);
  await downloadCanvas(canvas, `${slug(names.title || "little-moments", "contact-sheet")}-sheet.png`);
}
