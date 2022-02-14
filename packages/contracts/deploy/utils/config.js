const { network } = require("hardhat");
const { provider } = network;
const fs = require("fs");
const merge = require("lodash.merge");
const configPath = "./config/config.json";
const emptyConfig = {
  address: "0x0000000000000000000000000000000000000000",
  implementation: "0x0000000000000000000000000000000000000000",
  deploymentBlock: null,
  upgradeBlock: null,
};

/**
 * Save deployment information into network configuration file.
 * @param {string} name Contract name.
 * @param {object} deployment Deployment artifact. Points to proxy if UUPS.
 * @param {string} implementation Implementation address if deployment is a proxy.
 * @param {boolean} upgrade Set true to indicate deployment was an upgrade.
 */
async function saveNetworkConfig(name, deployment, implementation, upgrade) {

  const config = readNetworkConfig();

  // We use OpenZeppelin Upgrades plugin for deployment. Their deployment
  // receipt signature looks different than vanilla hardhat deploy receipts.
  // (OZ uses "deployedTransaction" for the deployment receipt key vs. "receipt"
  // for hardhat-deploy)
  // const receipt = deployment.receipt ? deployment.receipt : deployment.deployTransaction;
  const receipt = await provider.send('eth_getTransactionReceipt', [deployment.deployTransaction.hash]);


  // Load up deployment block from config if it exists.
  let deploymentBlock = null;
  if (
    config[network.config.chainId]
    && config[network.config.chainId].contracts
    && config[network.config.chainId].contracts[name]
  ) {
    deploymentBlock = config[network.config.chainId].contracts[name].deploymentBlock;
  }

  // If deployment block has been set, use that; otherwise this is a new 
  // contract deployment, so set the initial deployment block from the receipt.
  deploymentBlock = deploymentBlock ? deploymentBlock : receipt.blockNumber;
  const upgradeBlock = upgrade ? receipt.blockNumber : null;

  const newConfig = merge(config, {
    [network.config.chainId]: {
      contracts: {
        [name]: {
          ...emptyConfig,
          address: deployment.address,
          implementation: implementation,
          deploymentBlock: deploymentBlock,
          upgradeBlock: upgradeBlock
        },
      },
    }
  });
  mergeNetworkConfig(newConfig);
}

function readNetworkConfig() {
  const file = fs.existsSync(configPath) ? fs.readFileSync(configPath) : "{}";
  return JSON.parse(file.length ? file : "{}");
}

function mergeNetworkConfig(config) {
  const _config = merge(readNetworkConfig(), config);
  fs.writeFileSync(configPath, `${JSON.stringify(_config, null, 2)}\n`);
  console.log("Network config at ./config/config.json updated.");
}

module.exports = {
  readNetworkConfig,
  mergeNetworkConfig,
  saveNetworkConfig,
};
