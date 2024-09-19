import { ethers } from "ethers";

async function testHardhatConnection() {
  const providerUrl = "http://127.0.0.1:8545";
  console.info(`Attempting to connect to Hardhat node at ${providerUrl}`);

  try {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const network = await provider.getNetwork();

    // Check if it's a known network or likely a local Hardhat network
    const networkName = network.name !== "unknown" ? network.name : "Local Hardhat Network";

    console.info(`Successfully connected to network: ${networkName} (chainId: ${network.chainId})`);

    const blockNumber = await provider.getBlockNumber();
    console.info(`Current block number: ${blockNumber}`);

    // Additional information that might be useful
    const gasPrice = await provider.getGasPrice();
    console.info(`Current gas price: ${ethers.utils.formatUnits(gasPrice, "gwei")} gwei`);

    const accounts = await provider.listAccounts();
    console.info(`Number of accounts: ${accounts.length}`);
    console.info(`First account: ${accounts[0]}`);
  } catch (error) {
    console.error("Failed to connect to Hardhat node:", error);
  }
}

testHardhatConnection();
