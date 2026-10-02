import { $, asset, esc, heart } from "../lib/dom.js";

/** A heading block used by every chapter. */
export function headMarkup(label, title, lead) {
  return `
    <header class="head" data-reveal>
      ${label ? `<span class="head__no" aria-hidden="true">${esc(label.replace(/\D/g, "") || "")}</span>` : ""}
      <p class="head__label">${esc(label || "")}</p>
      <h2 class="head__title" data-split>${esc(title)}</h2>
      ${lead ? `<p class="head__lead">${esc(lead)}</p>` : ""}
    </header>`;
}

/**
 * One print, taped to the page.
 * `ar` overrides the default portrait shape so a landscape photo is
 * never cropped into a strip.
 */
function polaroid({ src, caption, no = "", tilt = "-2deg", ar = "", tape = "", alt = "" }) {
  return `
    <span class="polaroid" style="--tilt:${tilt}${ar ? `;--ar:${ar}` : ""}">
      ${tape ? `<span class="tape ${tape}" aria-hidden="true"></span>` : '<span class="tape" aria-hidden="true"></span>'}
      <span class="polaroid__frame">
        <img src="${asset(src)}" alt="${esc(alt || caption)}" loading="lazy" decoding="async" />
      </span>
      <span class="polaroid__foot"><span>${esc(caption)}</span><em>${esc(no)}</em></span>
    </span>`;
}

/**
 * Memory 02 — how we met.
 */
export function mountHowWeMet(data) {
  const slot = $("#howWeMet");
  if (!slot) return;

  const paragraphs = (data.paragraphs ?? (data.text ? [data.text] : []))
    .map((p) => `<p>${heart(p)}</p>`)
    .join("");

  slot.innerHTML = `
    ${headMarkup(data.label, data.title, data.lead)}
    <div class="spread" data-reveal>
      <div class="spread__text">
        <div class="story paper--torn">${paragraphs}</div>
        ${data.note ? `<span class="spread__note note note--slip">${esc(data.note)}</span>` : ""}
      </div>
      ${
        data.image
          ? `<div class="spread__photo">
               ${polaroid({ src: data.image, caption: data.title, no: "02", tilt: "-2.4deg", ar: data.ar })}
             </div>`
          : `<div class="spread__photo">
               <span class="bigquote" aria-hidden="true">“</span>
             </div>`
      }
    </div>`;
}

/**
 * Memory 03 — our first memory. One print, one story, one note in pen.
 */
export function mountFirstMemory(data) {
  const slot = $("#firstMemory");
  if (!slot) return;

  slot.innerHTML = `
    ${headMarkup(data.label, data.title, "")}
    <div class="spread" data-reveal>
      <div class="spread__photo">
        ${polaroid({ src: data.image, caption: data.title, no: "03", tilt: "-2.2deg", ar: data.ar, tape: "tape--left" })}
        ${data.note ? `<span class="spread__note note note--slip">${esc(data.note)}</span>` : ""}
      </div>
      <div class="spread__text">
        <div class="spread__meta">
          ${data.date ? `<span class="datestamp">${esc(data.date)}</span>` : ""}
          ${data.place ? `<span class="stamp">${esc(data.place)}</span>` : ""}
        </div>
        <h3>${heart(data.title)}</h3>
        <p>${heart(data.text)}</p>
      </div>
    </div>`;
}

/**
 * Memory 05 — favourite memories. Three prints pulled out of the wall.
 */
export function mountFavourites({ photos, picks }) {
  const slot = $("#favWall");
  if (!slot) return;

  const tilts = [-2.4, 1.6, -1.1];

  slot.innerHTML = picks
    .map((title) => photos.find((p) => p.title === title))
    .filter(Boolean)
    .map(
      (photo, i) => `
      <div data-reveal style="--rd:${(i * 0.1).toFixed(2)}s">
        ${polaroid({
          src: photo.image,
          caption: photo.title,
          no: "fav",
          tilt: `${tilts[i % 3]}deg`,
          ar: photo.ar,
          tape: i === 1 ? "tape--right" : "",
        })}
      </div>`,
    )
    .join("");
}
