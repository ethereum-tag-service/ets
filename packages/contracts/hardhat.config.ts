//import "hardhat-ethernal";
import type { HardhatUserConfig } from "hardhat/types";
import "hardhat-deploy";
import "solidity-docgen";
import "hardhat-abi-exporter";
import "@nomiclabs/hardhat-web3";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-truffle5";
import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-chai-matchers";

import { resolve } from "node:path";
import { config as dotenvConfig } from "dotenv";

import "./tasks";

dotenvConfig({ path: resolve(__dirname, "../../.env") });

const mnemonic = {
  local: `${process.env.MNEMONIC_LOCAL}`.replace(/_/g, " "),
  testnet: `${process.env.MNEMONIC_TESTNET}`.replace(/_/g, " "),
};

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      chainId: 31337,
      mining: {
        auto: false,
        interval: 2000,
        mempool: {
          order: "fifo",
        },
      },
      accounts: {
        mnemonic: mnemonic.local,
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: {
        mnemonic: mnemonic.local,
      },
    },
    baseSepolia: {
      // Get chain name from Viem: https://github.com/wevm/viem/blob/main/src/chains/index.ts
      url: `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_TESTNET}`,
      chainId: 84532,
      accounts: {
        mnemonic: mnemonic.testnet,
      },
      gas: 2100000,
      gasPrice: 8000000000,
    },
    arbitrumSepolia: {
      // was testnet_stage
      url: `https://arb-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_TESTNET}`,
      chainId: 421614, // Arbitrum Sepolia
      accounts: {
        mnemonic: mnemonic.testnet,
      },
      gas: 2100000,
      gasPrice: 8000000000,
    },
  },
  abiExporter: {
    path: "./abi",
    runOnCompile: true,
  },
  // ETS administration accounts.
  namedAccounts: {
    ETSAdmin: { default: 0 },
    ETSPlatform: { default: 1 },
    ETSOracle: { default: 2 },
  },
  etherscan: {
    apiKey: {
      arbitrumSepolia: process.env.ARBISCAN_API_KEY ? process.env.ARBISCAN_API_KEY : "",
      baseSepolia: process.env.BASESCAN_API_KEY ? process.env.BASESCAN_API_KEY : "",
    },
  },
  docgen: {
    outputDir: "docs",
    pages: "files",
    templates: "./templates",
    exclude: ["mocks", "test", "utils"],
  },
  // typechain: {
  //   outDir: '../app/types',
  // },
  solidity: {
    compilers: [
      {
        version: "0.4.24",
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.8.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.8.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
  //  ethernal: {
  //    disableSync: false,
  //    disableTrace: true,
  //    workspace: process.env.ETHERNAL_WORKSPACE ? process.env.ETHERNAL_WORKSPACE : undefined,
  //    uploadAst: false,
  //    disabled: process.env.ETHERNAL_DISABLED == "true" ? true : false,
  //    resetOnStart: process.env.ETHERNAL_WORKSPACE ? process.env.ETHERNAL_WORKSPACE : undefined,
  //  },
};

export default config;
