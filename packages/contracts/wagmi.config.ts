import hardhatDeploy from "@sunodo/wagmi-plugin-hardhat-deploy";
import { defineConfig } from "@wagmi/cli";

export default defineConfig({
  out: "src/contracts.ts",
  plugins: [
    hardhatDeploy({
      directory: "src/chainConfig",
    }),
  ],
});
