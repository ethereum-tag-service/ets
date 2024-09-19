import type { ActionEvent } from "@openzeppelin/defender-sdk-action-client";
import { BlockchainService } from "./../../../services/blockchainService";
import { initializeSigner } from "./../../../services/initializeSigner";

// Main handler function to be invoked by Defender or locally for testing.
export async function handler(event: ActionEvent): Promise<void> {
  try {
    const { signer, chainId } = await initializeSigner(event);
    console.info("****** MONITOR CHAIN ID ******");
    console.info(`Monitor executed on Chain ID: ${chainId}`);

    const blockchainService = new BlockchainService(signer, chainId);
    await blockchainService.handleRequestCreateAuctionEvent();
  } catch (error) {
    console.error("Error in handler:", error instanceof Error ? error.message : String(error));
    throw error;
  }
}

// Local testing entry point
/* if (require.main === module) {
  require("dotenv").config();

  // Dynamically calculate valid networks based on the chains configuration
  const VALID_NETWORKS = availableChainIds.map((id) => chains[id].name);

  // Type for valid networks
  type ValidNetwork = (typeof VALID_NETWORKS)[number];

  // Check if the NETWORK environment variable is set and valid
  const network = process.env.NETWORK as ValidNetwork | undefined;

  if (!network || !VALID_NETWORKS.includes(network)) {
    console.error(
      `Local testing requires NETWORK environment variable to be set to one of the following: ${VALID_NETWORKS.join(", ")}.`,
    );
    process.exit(1);
  }

  type EnvInfo = {
    API_KEY: string;
    API_SECRET: string;
  };

  const { API_KEY: apiKey, API_SECRET: apiSecret } = process.env as unknown as EnvInfo;
  handler({ apiKey, apiSecret })
    .then(() => process.exit(0))
    .catch((error: Error) => {
      console.error("An error occurred during local testing:", error);
      process.exit(1);
    });
} */
