import { defineConfig } from "vite";

/*
  base: "/"        → serving from the root of a domain (love.com)
  base: "/repo/"   → GitHub Pages project sites, e.g. roybipro.github.io/love-web/

  Change the one line below if you publish to GitHub Pages under a repo name.
  Photos referenced in src/content/memory.js follow this setting automatically.
*/
export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
  },
});
