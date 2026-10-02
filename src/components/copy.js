import { $, heart } from "../lib/dom.js";

/**
 * Fills the chapter headings that are static in index.html.
 * Anything with a real story to tell renders itself instead.
 */
export function mountCopy(c) {
  const set = (sel, value) => {
    const el = $(sel);
    if (el) el.textContent = value ?? "";
  };
  const rich = (sel, value) => {
    const el = $(sel);
    if (el) el.innerHTML = heart(value);
  };

  set("#coverKicker", c.cover.kicker);
  set("#coverSub", c.cover.subtitle);
  set("#openBtnLabel", c.cover.button);

  /* memory 04 — the wall */
  rich("#momentsNo", c.galleryHeading.label);
  set("#momentsLabel", c.galleryHeading.label);
  rich("#momentsTitle", c.galleryHeading.title);
  rich("#momentsLead", c.galleryHeading.lead);

  /* memory 05 — favourites */
  set("#favLabel", c.favouritesHeading.label);
  rich("#favTitle", c.favouritesHeading.title);
  rich("#favLead", c.favouritesHeading.lead);

  /* memory 06 — little things */
  set("#loveLabel", c.loveHeading.label);
  rich("#loveTitle", c.loveHeading.title);
  rich("#loveLead", c.loveHeading.lead);

  /* memory 07 — timeline */
  set("#tlLabel", c.timelineHeading.label);
  rich("#tlTitle", c.timelineHeading.title);
  rich("#tlLead", c.timelineHeading.lead);

  document.title = `To ${c.herName || "you"} — our story`;
}
