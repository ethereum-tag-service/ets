/**
 * Module for initializing a signer for blockchain interactions
 * @module initializeSigner
 */

import { etsAccessControlsConfig } from "@ethereum-tag-service/contracts/contracts";
import { type SupportedChainId, availableChainIds, chains } from "@ethereum-tag-service/contracts/multiChainConfig";
import type { ActionEvent } from "@openzeppelin/defender-sdk-action-client";
import { ethers } from "ethers";

async function createProviderWithFallback(
  primaryUrl: string,
  fallbackUrls: string[],
  chainId: number,
): Promise<ethers.providers.Provider> {
  try {
    const provider = new ethers.providers.JsonRpcProvider(primaryUrl, chainId);
    await provider.getNetwork(); // Test the connection
    console.info(`Successfully connected to primary RPC for chainId ${chainId}`);
    return provider;
  } catch (error) {
    console.warn(
      `Failed to connect to primary RPC for chainId ${chainId}: ${error instanceof Error ? error.message : String(error)}`,
    );
    console.info("Trying fallback RPCs...");
    for (const url of fallbackUrls) {
      try {
        const provider = new ethers.providers.JsonRpcProvider(url, chainId);
        await provider.getNetwork(); // Test the connection
        console.info(`Successfully connected to fallback RPC ${url} for chainId ${chainId}`);
        return provider;
      } catch (fallbackError) {
        console.warn(
          `Failed to connect to fallback RPC ${url} for chainId ${chainId}: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`,
        );
      }
    }
    throw new Error(`Failed to connect to any RPC for chainId ${chainId}`);
  }
}

/**
 * Initializes a signer for interacting with the blockchain
 *
 * This function sets up an ethers.js signer based on the provided ActionEvent.
 * It handles both local development environments (Hardhat) and various testnets/mainnets.
 *
 * @param {ActionEvent} event - The event containing network and secret information
 * @returns {Promise<{ signer: ethers.Signer; chainId: number }>} The initialized signer and the chainId
 * @throws {Error} If there's an issue with initialization or connection
 */
export async function initializeSigner(event: ActionEvent): Promise<{ signer: ethers.Signer; chainId: number }> {
  console.info("Entering initializeSigner function");
  console.info("multiChainConfig:", JSON.stringify({ availableChainIds, chains }, null, 2));

  let chainId: number;
  let signer: ethers.Signer;

  // Extract chainId from the event
  if (event.request?.body && typeof event.request.body === "object") {
    const body = event.request.body as { monitor?: { chainId?: number } };
    chainId = body.monitor?.chainId || 0;
    console.info(`Extracted chainId from event: ${chainId}`);
  } else {
    console.error("Invalid event structure: missing chainId");
    throw new Error("Invalid event structure: missing chainId");
  }

  console.info(`Initializing signer for chainId: ${chainId}`);

  // Check if the chainId is supported
  if (availableChainIds.includes(chainId.toString() as SupportedChainId)) {
    if (chainId === 31337 || chainId === 1337) {
      // Localhost handling
      console.info("Detected localhost/Hardhat environment");
      const providerUrl = "http://127.0.0.1:8545";
      console.info(`Attempting to connect to local provider at ${providerUrl}`);

      try {
        // Set up provider and signer for local development
        const provider = new ethers.providers.JsonRpcProvider(providerUrl);
        const network = await provider.getNetwork();
        console.info(`Successfully connected to local provider. Network: ${network.name}, ChainId: ${network.chainId}`);

        const privateKey = process.env.ETS_ORACLE_LOCALHOST_PK;
        if (!privateKey) {
          console.error("ETS_ORACLE_LOCALHOST_PK environment variable is not set for local development");
          throw new Error("ETS_ORACLE_LOCALHOST_PK environment variable is not set for local development");
        }

        signer = new ethers.Wallet(privateKey, provider);
        console.info("Signer created successfully for local development");
      } catch (error) {
        console.error("Failed to connect to local provider:", error);
        throw new Error(`Failed to connect to local provider at ${providerUrl}. Is your Hardhat node running?`);
      }
    } else {
      // Non-local network handling
      console.info(`Initializing signer for non-local network: ${chainId}`);
      const { etsTestnetOraclePk, alchemyApiKey, baseSpoliaRpcUrl, arbitrumSpoliaRpcUrl } = event.secrets || {};

      if (!etsTestnetOraclePk) {
        console.error(`Private key secret (etsTestnetOraclePk) is not available for chainId ${chainId}`);
        throw new Error(`Private key secret (etsTestnetOraclePk) is not available for chainId ${chainId}`);
      }

      console.info("etsTestnetOraclePk secret is available");

      let provider: ethers.providers.Provider;

      switch (chainId) {
        case 84532: // Base Sepolia
          if (!baseSpoliaRpcUrl) {
            console.error("Base Sepolia RPC URL is not provided");
            throw new Error("Base Sepolia RPC URL is not provided");
          }
          console.info("Using custom RPC provider for Base Sepolia");
          try {
            const fallbackUrls = [
              "https://sepolia.base.org",
              "https://base-sepolia.blockpi.network/v1/rpc/public",
              "https://base-sepolia.publicnode.com",
            ];
            provider = await createProviderWithFallback(baseSpoliaRpcUrl, fallbackUrls, chainId);
          } catch (error) {
            console.error(
              `Failed to create provider for Base Sepolia: ${error instanceof Error ? error.message : String(error)}`,
            );
            throw new Error("Failed to create provider for Base Sepolia");
          }
          break;

        case 421614: // Arbitrum Sepolia
          if (!arbitrumSpoliaRpcUrl) {
            console.error("Arbitrum Sepolia RPC URL is not provided");
            throw new Error("Arbitrum Sepolia RPC URL is not provided");
          }
          console.info("Using custom RPC provider for Arbitrum Sepolia");
          try {
            const fallbackUrls = ["https://sepolia-rollup.arbitrum.io/rpc", "https://arbitrum-sepolia.publicnode.com"];
            provider = await createProviderWithFallback(arbitrumSpoliaRpcUrl, fallbackUrls, chainId);
          } catch (error) {
            console.error(
              `Failed to create provider for Arbitrum Sepolia: ${error instanceof Error ? error.message : String(error)}`,
            );
            throw new Error("Failed to create provider for Arbitrum Sepolia");
          }
          break;

        default:
          if (alchemyApiKey) {
            // Use Alchemy provider for other networks if API key is available
            console.info(`Using Alchemy provider for chainId ${chainId}`);
            try {
              provider = new ethers.providers.AlchemyProvider(chainId, alchemyApiKey);
              console.info("Alchemy provider created successfully");
            } catch (error) {
              console.error(
                `Error creating Alchemy provider: ${error instanceof Error ? error.message : String(error)}`,
              );
              throw new Error(`Failed to create Alchemy provider for chainId ${chainId}`);
            }
          } else {
            console.warn(`Provider not available for chainId ${chainId}. Falling back to default provider.`);
            // Fallback to default provider if no other option is available
            try {
              provider = ethers.getDefaultProvider(chainId);
              console.info("Default provider created successfully");
            } catch (error) {
              console.error(
                `Error creating default provider: ${error instanceof Error ? error.message : String(error)}`,
              );
              throw new Error(`Failed to create default provider for chainId ${chainId}`);
            }
          }
      }

      try {
        signer = new ethers.Wallet(etsTestnetOraclePk, provider);
        console.info("Signer created successfully for non-local network");
      } catch (error) {
        console.error(`Error creating signer: ${error instanceof Error ? error.message : String(error)}`);
        throw new Error(`Failed to create signer for chainId ${chainId}`);
      }
    }
  } else {
    // Handle unsupported networks
    const validNetworkNames = availableChainIds.map((id) => chains[id as SupportedChainId].name);
    console.error(`Unsupported chainId: ${chainId}. Supported networks are: ${validNetworkNames.join(", ")}.`);
    console.error(`Available chainIds: ${availableChainIds.join(", ")}`);
    throw new Error(`Unsupported chainId: ${chainId}. Supported networks are: ${validNetworkNames.join(", ")}.`);
  }

  // Check if the signer has the ETS oracle role
  try {
    const accessControlsAddress =
      etsAccessControlsConfig.address[chainId as keyof typeof etsAccessControlsConfig.address];
    const accessControlsContract = new ethers.Contract(accessControlsAddress, etsAccessControlsConfig.abi, signer);

    const signerAddress = await signer.getAddress();
    const isOracle = await accessControlsContract.isAuctionOracle(signerAddress);

    if (!isOracle) {
      console.error(`Signer ${signerAddress} does not have the oracle role`);
      throw new Error("Signer does not have the required oracle role");
    }

    console.info(`Confirmed signer ${signerAddress} has the oracle role`);
  } catch (error) {
    console.error("Error checking oracle role:", error instanceof Error ? error.message : String(error));
    throw new Error("Failed to verify oracle role for signer");
  }

  // Perform final connection test and gather additional network information
  try {
    const network = await signer.provider!.getNetwork();
    console.info(
      `Final connection test successful. Connected to network: ${network.name} (chainId: ${network.chainId})`,
    );

    const blockNumber = await signer.provider!.getBlockNumber();
    console.info(`Current block number: ${blockNumber}`);

    const signerAddress = await signer.getAddress();
    console.info(`Signer address: ${signerAddress}`);

    const balance = await signer.getBalance();
    console.info(`Signer balance: ${ethers.utils.formatEther(balance)} ETH`);
  } catch (error) {
    console.error("Failed final network connection test:", error);
    throw new Error("Failed to establish a stable connection to the network");
  }

  console.info("initializeSigner function completed successfully");
  return { signer, chainId };
}
