/* Small DOM + string helpers shared by every component. */

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escape copy coming from memory.js before it touches innerHTML. */
export const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ESCAPES[c]);

/** Let a ❤️ written in the copy beat on its own. */
export const heart = (value) => esc(value).replaceAll("❤️", '<span class="beat">❤️</span>');

export const rnd = (min, max) => min + Math.random() * (max - min);
export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
export const pad2 = (n) => String(n).padStart(2, "0");

/**
 * Resolve a path from memory.js ("/photos/x.jpg") against Vite's base,
 * so the site also works when deployed to a subfolder like GitHub Pages.
 */
export const asset = (path) => {
  if (!path) return "";
  if (/^(https?:|data:|\/\w)/.test(path) === false) return path;
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  return path.startsWith("/") ? `${base}${path}` : path;
};
