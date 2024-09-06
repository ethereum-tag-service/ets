const { network } = require("hardhat");
const fs = require("node:fs");
const path = require("node:path");
const merge = require("lodash.merge");
//const configPath = "./config/config.json";
const emptyConfig = {
  address: "0x0000000000000000000000000000000000000000",
  implementation: "0x0000000000000000000000000000000000000000",
  deploymentBlock: null,
  upgradeBlock: null,
};

/**
 * Get the configuration file path for the current network.
 *
 * @return {string} Path to the network-specific configuration file.
 */
function getConfigPath() {
  return `./src/upgradeConfig/${network.name}.json`;
}

/**
 * Save deployment information into network configuration file.
 * Important for saving deployment block information for other services
 *
 * @param {string} name Contract name.
 * @param {object} deployment Deployment artifact. Points to proxy if UUPS.
 * @param {string} implementation Implementation address if deployment is a proxy.
 * @param {boolean} upgrade Set true to indicate deployment was an upgrade.
 */
async function saveNetworkConfig(name, deployment, implementation, upgrade) {
  const config = readNetworkConfig();

  if (network.config.chainId === 31337) {
    // If on localhost, flush any previous config.
    config.contracts = {};
  }

  // We use OpenZeppelin Upgrades plugin for deployment. Their deployment
  // receipt signature looks different than vanilla hardhat deploy receipts.
  // (OZ uses "deployedTransaction" for the deployment receipt key vs. "receipt"
  // for hardhat-deploy)
  const deploymentTxn = await deployment.deploymentTransaction();
  const deploymentReceipt = await deploymentTxn.wait(1);

  //  console.info(deploymentTxn);
  //  console.info("=====================================");
  //  console.info(deploymentReceipt);

  const receipt = deployment.receipt ? deployment.receipt : deploymentReceipt;

  // Load up deployment block from config if it exists.
  let deploymentBlock = config?.contracts?.[name]?.deploymentBlock;

  // If deployment block has not been set, use the initial deployment block from the receipt.
  deploymentBlock ??= Number.parseInt(receipt.blockNumber);

  const upgradeBlock = upgrade ? Number.parseInt(receipt.blockNumber) : null;

  const newConfig = merge(config, {
    contracts: {
      [name]: {
        ...emptyConfig,
        address: receipt.contractAddress,
        implementation: implementation,
        deploymentBlock: deploymentBlock,
        upgradeBlock: upgradeBlock,
      },
    },
  });
  mergeNetworkConfig(newConfig);
}

function readNetworkConfig() {
  const configPath = getConfigPath();
  const file = fs.existsSync(configPath) ? fs.readFileSync(configPath) : "{}";
  return JSON.parse(file.length ? file : "{}");
}

function mergeNetworkConfig(config) {
  const configPath = getConfigPath();
  const directory = path.dirname(configPath);

  // Ensure the directory exists, create it if it doesn't
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  const _config = merge(readNetworkConfig(), config);
  fs.writeFileSync(configPath, `${JSON.stringify(_config, null, 2)}\n`);
  console.info(`${configPath} updated.`);
}

module.exports = {
  readNetworkConfig,
  mergeNetworkConfig,
  saveNetworkConfig,
};
