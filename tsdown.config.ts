import { defineConfig } from "tsdown";

export default defineConfig({
  name: "llmcrawl-js",
  target: "node18",
  entry: ["./src/index.ts"],
  format: ["cjs", "esm"],
  dts: {
    resolve: true,
  },
  outDir: "dist",
  clean: true,
});
