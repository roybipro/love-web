/*  ============================================================
    make-icons.mjs — draws the app icons for the home screen.

    Written from scratch on purpose: this project has no build
    dependencies beyond Vite, and adding sharp or canvas to make
    three PNGs would be the tail wagging the dog. Node has zlib,
    and a PNG is only a header, deflated scanlines and a CRC.

      node scripts/make-icons.mjs

    Colours come from the paper palette in src/styles/tokens.css.
    ============================================================ */

import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "icons");

/* paper and ink, straight out of tokens.css */
const PAPER = [0xfa, 0xf6, 0xee];
const ROSE = [0xb0, 0x57, 0x6b];
const BURGUNDY = [0x6b, 0x1f, 0x2f];

const lerp = (a, b, t) => a + (b - a) * t;
const mix = (c1, c2, t) => c1.map((v, i) => Math.round(lerp(v, c2[i], t)));

/*  The classic implicit heart: (x² + y² − 1)³ − x²y³ ≤ 0.
    Returns how far inside the curve a point is, in units of
    roughly one pixel, so the caller can feather the edge.   */
function heartField(x, y) {
  const a = x * x + y * y - 1;
  return a * a * a - x * x * y * y * y;
}

/** 0 outside the heart, 1 well inside, feathered between. */
function heartCoverage(px, py, size, spread) {
  /* normalise to roughly -1..1 with y pointing up, then fit the curve */
  const s = 1.28 / spread;
  const x = ((px / size) * 2 - 1) * s;
  const y = -((py / size) * 2 - 1) * s;

  const f = heartField(x, y);
  /* the field grows fast, so measure the step to convert it to a slope */
  const dx = (heartField(x + 0.004, y) - f) / 0.004;
  const dy = (heartField(x, y + 0.004) - f) / 0.004;
  const grad = Math.hypot(dx, dy) || 1;
  const dist = -f / grad; /* signed distance, in normalised units */
  const px0 = (dist / s) * size; /* back to pixels */

  if (px0 <= -0.5) return 0;
  if (px0 >= 0.5) return 1;
  return px0 + 0.5;
}

function drawIcon(size, { heartScale = 0.62 } = {}) {
  const rows = [];
  for (let py = 0; py < size; py += 1) {
    const row = Buffer.alloc(size * 3 + 1);
    row[0] = 0; /* filter: none */

    for (let px = 0; px < size; px += 1) {
      /* 3x3 supersampling keeps the curve smooth at 192px */
      let cover = 0;
      for (let sy = 0; sy < 3; sy += 1)
        for (let sx = 0; sx < 3; sx += 1)
          cover += heartCoverage(px + (sx + 0.5) / 3, py + (sy + 0.5) / 3, size, heartScale);
      cover /= 9;

      /* rose at the top of the heart down to burgundy at the point */
      const t = Math.min(1, Math.max(0, py / size));
      const ink = mix(ROSE, BURGUNDY, t);
      const bg = PAPER;

      const o = 1 + px * 3;
      row[o] = Math.round(lerp(bg[0], ink[0], cover));
      row[o + 1] = Math.round(lerp(bg[1], ink[1], cover));
      row[o + 2] = Math.round(lerp(bg[2], ink[2], cover));
    }
    rows.push(row);
  }
  return Buffer.concat(rows);
}

/* ---------- the smallest possible PNG writer ---------- */

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(size, rgb) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; /* bit depth */
  ihdr[9] = 2; /* colour type: truecolour, no alpha — a home screen icon is opaque */
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(rgb, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

mkdirSync(OUT, { recursive: true });

/*  The maskable copy keeps the heart inside the safe 80% circle, so
    whatever shape Android cuts still shows all of it.               */
const targets = [
  { file: "icon-192.png", size: 192, heartScale: 0.62 },
  { file: "icon-512.png", size: 512, heartScale: 0.62 },
  { file: "icon-maskable-512.png", size: 512, heartScale: 0.8 },
  { file: "apple-touch-icon.png", size: 180, heartScale: 0.66 },
];

for (const t of targets) {
  const png = encodePng(t.size, drawIcon(t.size, { heartScale: t.heartScale }));
  writeFileSync(join(OUT, t.file), png);
  console.log(`${t.file.padEnd(26)} ${t.size}x${t.size}  ${(png.length / 1024).toFixed(1)} KB`);
}
