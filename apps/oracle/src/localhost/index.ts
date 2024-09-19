/**
 * Local Oracle Initialization Script
 *
 * This script initializes and starts a local oracle for testing purposes.
 * It sets up a blockchain service to watch for auction-related events on a local Hardhat network.
 *
 * @module LocalOracleInitializer
 */

import type { ActionEvent } from "@openzeppelin/defender-sdk-action-client";
import { BlockchainService } from "./../services/blockchainService";
import { initializeSigner } from "./../services/initializeSigner";

/**
 * Main function to initialize and start the local oracle.
 * This function performs the following steps:
 * 1. Checks if the environment is set for local testing.
 * 2. Creates a mock ActionEvent for local testing.
 * 3. Initializes a signer for interacting with the blockchain.
 * 4. Sets up a BlockchainService to watch for auction events.
 */
async function main() {
  // Ensure the script is running in a local environment
  if (process.env.NETWORK !== "localhost") {
    console.error(
      `To start the testing oracle on localhost, set the NETWORK environment variable in the project root to "localhost"'`,
    );
    return;
  }

  // Hardhat's default chainId for local networks
  const hardhatChainId = 31337;

  // Create a mock ActionEvent for local testing
  // This mimics the event structure that would be received in a production environment
  const mockEvent: ActionEvent = {
    request: {
      body: {
        monitor: {
          chainId: hardhatChainId,
        },
      },
    },
    secrets: {}, // No secrets needed for local testing
    actionId: "mock-action-id",
    actionName: "Local Oracle Test",
    actionRunId: `mock-run-id-${Date.now()}`, // Unique run ID for each execution
  };

  try {
    // Initialize the signer using the mock event
    // This sets up an account that can interact with the local blockchain
    const { signer, chainId } = await initializeSigner(mockEvent);
    console.info(`Initialized signer for chainId: ${chainId}`);

    // Create a BlockchainService instance
    // This service will handle interactions with the blockchain, including watching for events
    const blockchainService = new BlockchainService(signer, chainId);

    // Start watching for RequestCreateAuction events
    // This is the main functionality of the oracle - listening for and responding to auction creation requests
    await blockchainService.watchRequestCreateAuction();

    console.info("Oracle listener initialized and watching for events");
  } catch (error) {
    // Comprehensive error logging for debugging purposes
    console.error("Failed to initialize the oracle listener:");
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Unexpected error:", error);
    }
    // Exit the process with an error code if initialization fails
    process.exit(1);
  }
}

// Execute the main function
main();
