import { crx } from "@crxjs/vite-plugin";
import { defineConfig } from "vite";
import manifest from "./manifest";

export default defineConfig({
  plugins: [crx({ manifest })],

  build: {
    rollupOptions: {
      input: {
        main: "src/main.ts",
      },
    },
  },
});
