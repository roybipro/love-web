/*  ============================================================
    SPEECH — reads a passage in the browser's own voice.

    Nothing is downloaded and nothing is recorded: every phone
    already ships a voice. That makes it the one feature here
    that works for someone who cannot read the screen, or who
    wants to hear it while her eyes are tired.
    ============================================================ */

/** British first, then any English, then whatever is there. */
function pickVoice(voices) {
  const local = voices.filter((v) => !/^google/i.test(v.name));
  const pool = local.length ? local : voices;
  const by = (re) => pool.find((v) => re.test(v.lang));
  return by(/^en-GB/i) || by(/^en-IE/i) || by(/^en/i) || pool[0] || null;
}

export const speechAvailable = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;

/**
 * A one-at-a-time reader.
 * `speak(items)` takes `[{ text }]` and calls `onLine(i)` as each one
 * starts, so the page can follow along, and `onDone()` at the end.
 */
export function createReader({ rate = 0.94, pitch = 1 } = {}) {
  const synth = window.speechSynthesis;
  let voice = null;
  let generation = 0;
  let running = false;

  const loadVoices = () => {
    const found = pickVoice(synth.getVoices());
    if (found) voice = found;
  };
  loadVoices();
  /* voices arrive late on iOS and Android, so listen for them */
  synth.addEventListener?.("voiceschanged", loadVoices);

  function stop() {
    generation += 1;
    running = false;
    try {
      synth.cancel();
    } catch {
      /* nothing to cancel */
    }
  }

  function speak(items, { onLine, onDone } = {}) {
    stop();

    const lines = (items || []).filter((item) => item.text);
    if (!lines.length) return;

    /* stop() bumped the generation; this run owns the new one */
    const mine = generation;
    running = true;

    /* Chrome drops a queue started in the same tick as a cancel() */
    setTimeout(() => {
      if (mine !== generation) return;

      lines.forEach((item, i) => {
        const utter = new SpeechSynthesisUtterance(item.text);
        if (voice) utter.voice = voice;
        utter.rate = rate;
        utter.pitch = pitch;

        utter.onstart = () => {
          if (mine === generation) onLine?.(i);
        };
        if (i === lines.length - 1) {
          utter.onend = () => {
            if (mine !== generation) return;
            running = false;
            onDone?.();
          };
        }
        synth.speak(utter);
      });

      onLine?.(0);
    }, 60);
  }

  return {
    speak,
    stop,
    get speaking() {
      return running;
    },
  };
}
