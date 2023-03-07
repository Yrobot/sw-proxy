import ts from "rollup-plugin-ts";

import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const inputs = [
  {
    client: "proxy/client.ts",
  },
  {
    sw: "proxy/sw.ts",
  },
];

/** @type {import('rollup').RollupOptions} */
export default inputs.map((input) => ({
  input,
  output: {
    dir: "build",
    format: "cjs",
    entryFileNames: "[name].js",
    chunkFileNames: "[name].js",
  },
  plugins: [
    ts({
      tsconfig: "tsconfig.json",
    }),
    commonjs(),
    resolve(),
  ],
}));
