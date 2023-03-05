import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nativeSW } from "vite-plugin-native-sw";

export default defineConfig({
  root: "dev",
  build: {
    outDir: "../dist",
  },
  plugins: [
    tsconfigPaths(),
    nativeSW({
      entries: [
        {
          src: resolve(__dirname, "sw-proxy.ts"),
          dist: "sw-proxy.js",
        },
      ],
    }),
  ],
});
