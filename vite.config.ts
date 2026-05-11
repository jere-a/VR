import type { UserConfig } from "vite";

export default {
  build: {
    rolldownOptions: {
      preserveEntrySignatures: false,
      optimization: {
        inlineConst: { mode: "smart", pass: 100 },
        pifeForModuleWrappers: false,
      },
      context: "T",
    },
  },
} satisfies UserConfig;
