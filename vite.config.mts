import { defineConfig } from "@aiszlab/wasp/vite";
import { resolve } from "path";

export default defineConfig({
  server: {
    proxy: {},
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
