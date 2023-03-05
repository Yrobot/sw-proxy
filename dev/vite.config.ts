import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  root: "dev",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        app: resolve(__dirname, "index.html"),
        "sw-proxy": resolve(__dirname, `sw-proxy.ts`),
      },
      output: {
        entryFileNames: ({ name }) =>
          name === "sw-proxy" ? "[name].js" : "assets/[name]-[hash].js",
      },
    },
  },
  server: {},
  plugins: [tsconfigPaths()],
});
