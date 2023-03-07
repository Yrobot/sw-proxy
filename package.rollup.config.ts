import ts from "rollup-plugin-ts";

import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const configs = [
  {
    input: {
      client: "proxy/client.ts",
    },
    output: {
      format: "es",
    },
  },
  {
    input: {
      sw: "proxy/sw.ts",
    },
  },
];

/** @type {import('rollup').RollupOptions} */
export default configs.map(({ input = {}, output = {} }) => ({
  input,
  output: {
    dir: "build",
    format: "cjs",
    entryFileNames: "[name].js",
    chunkFileNames: "[name].js",
    ...output,
  },
  plugins: [
    ts({
      tsconfig: "tsconfig.json",
    }),
    commonjs(),
    resolve(),
  ],
}));
