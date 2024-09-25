import { defineConfig } from "tsup";

export default defineConfig({
  name: 'llmcrawl-js',
  target: "node18",
  entry: ["./src/index.ts"],
  format: ["cjs", "esm"],
  dts: {
    resolve: true,
    entry: './src/index.ts',
  },
  outDir: "dist",
  clean: true,
});
