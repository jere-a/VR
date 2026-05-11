// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  server: {
    allowedHosts: ["clever-chicken-march.loca.lt"],
  },
  vite: {
    assetsInclude: ["**/*.glb"],
  },
});
