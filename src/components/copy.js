import { $, heart, esc } from "../lib/dom.js";

/**
 * Puts every piece of copy from memory.js into its slot in index.html.
 * Keeps the markup free of hardcoded words.
 */
export function mountCopy(c) {
  const set = (selector, value) => {
    const node = $(selector);
    if (node) node.textContent = value ?? "";
  };
  const rich = (selector, value) => {
    const node = $(selector);
    if (node) node.innerHTML = heart(value);
  };

  /* the opening line — hers, or a plain "you" if no name is set */
  const title = $("#introTitle");
  if (title) title.innerHTML = `Hey, ${esc(c.herName || "you")} <span class="beat">❤️</span>`;

  set("#introLine", c.intro.line);
  set("#openBtnLabel", c.intro.button);

  set("#galKicker", c.galleryHeading.kicker);
  set("#galTitle", c.galleryHeading.title);
  set("#galLead", c.galleryHeading.lead);

  set("#tlKicker", c.timelineHeading.kicker);
  set("#tlTitle", c.timelineHeading.title);
  set("#tlLead", c.timelineHeading.lead);

  set("#loveKicker", c.loveHeading.kicker);
  set("#loveTitle", c.loveHeading.title);
  set("#loveLead", c.loveHeading.lead);

  set("#spKicker", c.surprise.kicker);
  set("#spPrompt", c.surprise.prompt);
  set("#spBtnLabel", c.surprise.button);

  set("#finKicker", c.final.kicker);
  set("#finLine1", c.final.line1);
  set("#finLine2", c.final.line2);
  rich("#finLine3", c.final.line3);
  set("#finSign", c.final.sign);

  document.title = `For ${c.herName || "You"} ❤️`;
}
