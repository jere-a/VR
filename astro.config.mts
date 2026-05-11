// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  server: {
    allowedHosts: ["clever-chicken-march.loca.lt"],
  },

  vite: {
    assetsInclude: ["**/*.glb"],
  },

  adapter: cloudflare(),
});