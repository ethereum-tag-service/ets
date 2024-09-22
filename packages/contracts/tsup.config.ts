import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/contracts.ts", "src/multiChainConfig.ts", "src/utils.ts", "src/version.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  target: "es2020",
  platform: "node",
  esbuildOptions(options) {
    options.bundle = true;
    options.loader = {
      ".json": "json",
    };
  },
});
