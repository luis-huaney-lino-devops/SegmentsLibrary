import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      exports: "auto",
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
    },
  ],
  external: ["react", "react-dom"],
  plugins: [
    resolve({
      extensions: [".js", ".jsx"],
      browser: true,
    }),
    commonjs(),
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-env", "@babel/preset-react"],
      extensions: [".js", ".jsx"],
      exclude: "node_modules/**",
    }),
    terser(),
  ],
};