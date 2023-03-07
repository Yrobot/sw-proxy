import ts from "rollup-plugin-ts";
import { nodeResolve } from "@rollup/plugin-node-resolve";

/** @type {import('rollup').RollupOptions} */
export default {
  input: "dev/sw-proxy.ts",
  output: {
    dir: "dev/public",
    format: "cjs",
    name: "[name].js",
  },
  plugins: [
    ts({
      tsconfig: "dev/tsconfig.json",
    }),
    nodeResolve(),
  ],
};
