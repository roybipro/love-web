/*  ============================================================
    OUR STORY — service worker

    The book is mostly photographs and one song, so nothing here
    is pre-downloaded except the shell. Prints and audio join the
    cache the first time she actually sees or hears them, which
    means the second visit is instant and the first one is not
    slower than it was before this file existed.

    Once it has them, the book opens on a train, in a room with no
    signal, or with the phone on aeroplane mode.
    ============================================================ */

const CACHE = "our-story-v5";

/* just enough to draw a cover and boot */
const SHELL = [
  "./",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      /* one at a time: addAll gives up entirely if a single file 404s */
      .then(async (cache) => {
        await Promise.allSettled(SHELL.map((url) => cache.add(url)));
      })
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key !== CACHE) await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});

/** Keep a copy, but never an error page or a partial response. */
async function stash(request, response) {
  if (!response || !response.ok || response.type !== "basic") return;
  const cache = await caches.open(CACHE);
  await cache.put(request, response);
}

/*  The page's own script and stylesheet are fetched before this worker
    exists, so nothing ever caches them naturally — and without them the
    cached HTML opens to a blank page. The page posts them over once it
    is running and we hold on to them.                                  */
self.addEventListener("message", async (event) => {
  if (event.data?.type !== "warm") return;
  for (const url of event.data.urls ?? []) {
    try {
      const request = new Request(url, { credentials: "same-origin" });
      const hit = await caches.match(request);
      if (hit) continue;
      const response = await fetch(request);
      await stash(request, response.clone());
    } catch {
      /* if it cannot be had now, the next load will try again */
    }
  }
});

/*  Some hosts answer with `Vary: Origin`, and a stylesheet request does
    not carry an Origin header while a script request does — so the two
    can miss each other's entries. Matching loosely is what makes the
    book survive on a host that behaves like that.                    */
const LOOKUP = { ignoreSearch: true, ignoreVary: true };

async function fromCache(request) {
  try {
    return await caches.match(request, LOOKUP);
  } catch {
    return undefined;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  /* the fonts live on another origin — leave them alone, they fall
     back to the local stack offline and that is fine */
  if (url.origin !== self.location.origin) return;

  /*  The song streams with byte-range requests so she can scrub. A
      cache answers in whole, so serving it from here would break the
      seek bar. Let the audio go straight to the network.             */
  if (request.headers.has("range") || request.destination === "audio" || request.destination === "video") return;

  /* Navigations go to the network first so a new version reaches her,
     and only fall back to the cache when she genuinely cannot reach it. */
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          void stash(request, response.clone());
          return response;
        })
        .catch(async () => (await fromCache(request)) || (await caches.match("./")) || Response.error()),
    );
    return;
  }

  /* Everything else is cache first — photographs do not change. A miss
     with no signal must come back as a clean error, never a rejected
     promise, or the browser paints nothing at all. */
  event.respondWith(
    (async () => {
      const hit = await fromCache(request);
      if (hit) return hit;
      try {
        const response = await fetch(request);
        void stash(request, response.clone());
        return response;
      } catch {
        return Response.error();
      }
    })(),
  );
});
