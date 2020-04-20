import cjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

import filesize from "rollup-plugin-filesize";
import builtins from "rollup-plugin-node-builtins";

export default {
  input: "src/index.js",
  output: {
    dir: "dist",
    format: "cjs",
  },
  plugins: [cjs(), resolve(), filesize(), builtins()],
};
