import hardhatDeploy from "@sunodo/wagmi-plugin-hardhat-deploy";
import { defineConfig } from "@wagmi/cli";

const network = process.env.NETWORK ? process.env.NETWORK : "arbitrumSepolia";
console.info("Wagmi contract ABIs being generated for network: ", network);

export default defineConfig({
  out: "src/contracts.ts",
  plugins: [
    hardhatDeploy({
      directory: "../../packages/contracts/export/chainConfig/",
      include_networks: [network],
    }),
  ],
});
