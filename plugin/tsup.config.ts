import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/main.ts"],
    format: ["esm"],
    outDir: "dist",
    external: ["vite", "rollup", "esbuild"],
    dts: true,
    clean: true,
    sourcemap: false,
    minify: false,
  },
]);
