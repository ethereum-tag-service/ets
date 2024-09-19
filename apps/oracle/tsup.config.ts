import { readdirSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "tsup";

// Function to get all directories in a given path
const getDirectories = (source: string) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

// Get all OZ Defender Action directories
const actionDirs = getDirectories(path.join("src", "defender", "actions"));

// Create entry points for each Defender Action
const entryPoints = actionDirs.reduce(
  (acc, dir) => {
    acc[`defender/actions/${dir}/index`] = path.join("src", "defender", "actions", dir, "index.ts");
    return acc;
  },
  {} as Record<string, string>,
);

// Localhost entry point
entryPoints["localhost/index"] = path.join("src", "localhost", "index.ts");

export default defineConfig({
  entry: entryPoints,
  format: ["cjs"],
  outDir: "dist",
  clean: true,
  minify: false,
  splitting: false,
  sourcemap: true,
  outExtension: () => ({ js: ".js" }),
  noExternal: ["@ethereum-tag-service/contracts", "@ethereum-tag-service/subgraph-endpoints"],
  external: [
    "@openzeppelin/defender-sdk-action-client",
    "@openzeppelin/defender-sdk-relay-signer-client",
    "ethers",
    "axios",
  ],
  esbuildOptions(options) {
    options.define = {
      ...options.define,
      global: "globalThis",
    };
    options.target = "node16";
  },
  env: {
    NODE_ENV: process.env.NODE_ENV || "localhost",
  },
});
