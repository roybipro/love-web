/*  ============================================================
    LINK — a web address that points at one memory.

    He can send her a single print — "this one, look at this
    one" — instead of the whole book and a scroll bar.
    ============================================================ */

const PARAM = "p";

/** The address of one print, on whatever host this is served from. */
export function memoryUrl(index) {
  const url = new URL(window.location.href);
  url.searchParams.set(PARAM, String(index));
  url.hash = "";
  return url.toString();
}

/** Which print a link asked for, or null. Clamped to what exists. */
export function pendingPrint(count) {
  const raw = new URLSearchParams(window.location.search).get(PARAM);
  if (raw === null) return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0 || n >= count) return null;
  return n;
}

/** Remove the pointer so reloading does not jump her back again. */
export function clearPendingPrint() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has(PARAM)) return;
  url.searchParams.delete(PARAM);
  history.replaceState(history.state, "", url.toString());
}

/**
 * Copy some text. The clipboard API needs a secure context and a user
 * gesture, so fall back to a throwaway field, and if even that is
 * refused hand the text back so the caller can show it instead.
 */
export async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* falls through to the old way */
  }

  try {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("aria-hidden", "true");
    field.style.cssText = "position:fixed;top:-100px;opacity:0";
    document.body.appendChild(field);
    field.select();
    const ok = document.execCommand("copy");
    field.remove();
    return ok;
  } catch {
    return false;
  }
}
