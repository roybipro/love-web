import { $, asset, heart } from "../lib/dom.js";
import { burst } from "../lib/motion.js";
import { reduceMotion } from "../lib/motion.js";
import { play } from "../lib/sound.js";

/**
 * The last surprise at the end of "favourite memories" — a wrapped
 * button that opens into a print and a line about it.
 */
export function mountSurprise({ data, sign }) {
  const stage = $("#surpriseStage");
  const card = $("#surpriseCard");
  const button = $("#surpriseBtn");
  if (!stage || !card) return;

  $("#spPrompt").innerHTML = heart(data.prompt);
  button.querySelector("#spBtnLabel").textContent = data.button;

  const date = $("#spDate");
  date.textContent = data.date || "";
  date.hidden = !data.date;

  const place = $("#spPlace");
  place.textContent = data.place || "";
  place.hidden = !data.place;

  $("#spTitle").innerHTML = heart(data.title);
  $("#spText").innerHTML = heart(data.text);
  $("#spSign").textContent = sign;

  /* warm the cache so the reveal never shows an empty mount */
  new Image().src = asset(data.image);

  button.addEventListener("click", () => {
    play("found");
    burst(stage, 22, 1);
    stage.classList.add("gone");

    setTimeout(
      () => {
        stage.style.display = "none";
        const image = $("#spImg");
        image.src = asset(data.image);
        image.alt = data.title;
        card.hidden = false;
        requestAnimationFrame(() => card.classList.add("in"));
      },
      reduceMotion ? 0 : 460,
    );
  });
}
