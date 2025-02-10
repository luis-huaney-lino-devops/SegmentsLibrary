import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      exports: "auto", // Permite export default sin errores
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
    },
  ],
  external: ["react", "react-dom"], // Evita que React se empaquete con la librería
  plugins: [
    resolve({
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      browser: true, // Asegura compatibilidad con frontend
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true, // Genera archivos .d.ts
      declarationDir: "dist",
    }),
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-env", "@babel/preset-react"],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      exclude: "node_modules/**", // No transforma dependencias externas
    }),
    terser(), // Minifica el código para reducir el tamaño final
  ],
};
