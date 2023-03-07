import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  root: "dev",
  build: {},
  server: { open: true },
  plugins: [
    tsconfigPaths({
      root: resolve(__dirname, "../"),
    }),
  ],
});
