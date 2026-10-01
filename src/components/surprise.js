import { $, asset, heart } from "../lib/dom.js";
import { burst, reduceMotion, seedHearts } from "../lib/motion.js";

/**
 * The one surprise. The prompt folds away, the photo and message arrive,
 * and the final screen starts drifting hearts.
 */
export function mountSurprise({ data, sign }) {
  const stage = $("#surpriseStage");
  const card = $("#surpriseCard");
  const button = $("#surpriseBtn");

  const date = $("#spDate");
  date.textContent = data.date || "";
  date.hidden = !data.date;
  $("#spTitle").innerHTML = heart(data.title);
  $("#spText").innerHTML = heart(data.text);
  $("#spSign").textContent = sign;

  // warm the cache so the reveal never shows an empty frame
  new Image().src = asset(data.image);

  button.addEventListener("click", () => {
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
        seedHearts($("#finalDrift"), 16);
      },
      reduceMotion ? 0 : 460,
    );
  });
}
