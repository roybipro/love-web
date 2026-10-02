/*  Very quiet paper sounds for the interface.
    Synthesised rather than files, so nothing has to be downloaded.
    Off unless she turns it on in the player — and the browser has
    already heard her tap something by then.                          */

const KEY = "our-story:sound";
let ctx = null;
let enabled = false;

try {
  enabled = localStorage.getItem(KEY) === "on";
} catch {
  /* private mode — stay off */
}

export const soundIsOn = () => enabled;

export function setSound(on) {
  enabled = !!on;
  try {
    localStorage.setItem(KEY, enabled ? "on" : "off");
  } catch {
    /* nothing to persist to */
  }
}

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

/** one soft note */
function tone(freq, { dur = 0.16, gain = 0.05, type = "sine", delay = 0 } = {}) {
  const ac = audio();
  if (!ac) return;

  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;

  const t = ac.currentTime + delay;
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.exponentialRampToValueAtTime(gain, t + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  osc.connect(amp).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

/** a short breath of noise, like a page lifting */
function whisper({ dur = 0.3, gain = 0.035 } = {}) {
  const ac = audio();
  if (!ac) return;

  const frames = Math.floor(ac.sampleRate * dur);
  const buffer = ac.createBuffer(1, frames, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames) ** 2;
  }

  const src = ac.createBufferSource();
  src.buffer = buffer;

  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1800;
  filter.Q.value = 0.7;

  const amp = ac.createGain();
  amp.gain.value = gain;

  src.connect(filter).connect(amp).connect(ac.destination);
  src.start();
}

const presets = {
  /* the cover turning: two notes and a page */
  open: () => {
    tone(392, { dur: 0.5, gain: 0.045 });
    tone(587.33, { dur: 0.7, gain: 0.04, delay: 0.09 });
    whisper({ dur: 0.5, gain: 0.03 });
  },
  click: () => tone(880, { dur: 0.07, gain: 0.028, type: "triangle" }),
  photo: () => whisper({ dur: 0.24, gain: 0.03 }),
  pop: () => tone(659.25, { dur: 0.13, gain: 0.035, type: "triangle" }),
  found: () => {
    tone(523.25, { dur: 0.22, gain: 0.04 });
    tone(659.25, { dur: 0.26, gain: 0.038, delay: 0.1 });
    tone(783.99, { dur: 0.5, gain: 0.035, delay: 0.2 });
  },
};

export function play(kind) {
  if (!enabled) return;
  presets[kind]?.();
}
