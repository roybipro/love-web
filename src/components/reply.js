import { $ } from "../lib/dom.js";
import { burst } from "../lib/motion.js";
import { play } from "../lib/sound.js";

const KEY = "our-sto…note";

/**
 * A note back. She writes something, it keeps it on her own device, and
 * the card remembers it the next time she opens the book.
 *
 * Nothing leaves the phone — there is no server here, and that is on
 * purpose. It is a private exchange, not a form.
 */
export function mountReply({ slot = "#reply" } = {}) {
  const host = $(slot);
  if (!host) return;

  host.innerHTML = `
    <div class="reply">
      <span class="tape tape--top" aria-hidden="true"></span>
      <p class="reply__prompt hand">Your turn. Write me something back.</p>

      <label class="reply__label" for="replyText">Your note</label>
      <textarea id="replyText" class="reply__text" rows="4"
                placeholder="Start typing — it stays on this phone."></textarea>

      <div class="reply__row">
        <button class="btn btn--small" id="replySave" type="button">Keep it</button>
        <button class="reply__clear" id="replyClear" type="button" hidden>Clear it</button>
      </div>

      <p class="reply__saved" id="replySaved" role="status" aria-live="polite"></p>
    </div>`;

  const text = $("#replyText");
  const saved = $("#replySaved");
  const clear = $("#replyClear");
  const save = $("#replySave");

  const stamp = (iso) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
    } catch {
      return "";
    }
  };

  function restore() {
    let stored = null;
    try {
      stored = JSON.parse(localStorage.getItem(KEY) || "null");
    } catch {
      return; /* nothing readable there */
    }
    if (!stored?.text) return;
    text.value = stored.text;
    clear.hidden = false;
    saved.textContent = `Kept since ${stamp(stored.at)}.`;
  }

  save.addEventListener("click", () => {
    const value = text.value.trim();
    if (!value) {
      saved.textContent = "Nothing written yet.";
      text.focus();
      return;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify({ text: value, at: new Date().toISOString() }));
    } catch {
      saved.textContent = "This browser will not let me keep it here.";
      return;
    }
    clear.hidden = false;
    saved.textContent = `Kept. Thank you — that is my favourite page now.`;
    burst(host, 12, 0.7);
    play("found");
  });

  clear.addEventListener("click", () => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* nothing to clean up */
    }
    text.value = "";
    clear.hidden = true;
    saved.textContent = "";
    text.focus();
  });

  restore();
}
