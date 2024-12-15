import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  outExtension: (ctx) => {
    return {
      js: ctx.format === "esm" ? ".mjs" : ".cjs",
    };
  },
  outDir: "dist",
  sourcemap: true,
  dts: true,
  clean: true,
});
