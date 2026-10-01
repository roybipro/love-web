import { defineConfig } from "vite";

/*
  Relative base: the same build works wherever you put it — the root of a
  domain, a GitHub Pages subfolder like roybipro.github.io/love-web/, or
  straight off a USB stick. Don't change this unless a host complains.
*/
export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
  },
});
