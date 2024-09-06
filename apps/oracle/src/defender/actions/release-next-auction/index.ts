/**
 * Defender ReleaseNextAuction Action Script
 *
 * Purpose:
 * This script is designed to automatically calculate and release the next auction tag based on data
 * fetched from a GraphQL endpoint. It executes a blockchain transaction to perform the release,
 * utilizing a Defender Relayer (Externally Owned Account, EOA) with the ETSOracle role.
 *
 * Deployment:
 * The script is bundled into `dist/defender/actions/release-next-auction/index.js` via Rollup and deployed
 * as an OpenZeppelin Defender Autotask using the Defender as Code plugin. The Defender Relayer's credentials
 * (API key and secret) are used for authentication with the relayer service, enabling the script to perform
 * transactions on behalf of the user.
 *
 * Local Testing:
 * To test this Defender Action locally, ensure the NETWORK environment variable is set to a valid testnet chain
 * from hardhat.config.ts eg. "arbitrumSepolia".
 * This setup allows developers to simulate the action's behavior in a test environment similar to the
 * environment running on OZ Defender.
 */

import { availableChainIds, chains } from "@ethereum-tag-service/contracts/chainsConfig";

import type { RelayerParams } from "@openzeppelin/defender-relay-client/lib/relayer";
import { BlockchainService } from "./../../../services/blockchainService";
import { initializeSigner } from "./../../../services/initializeSigner";

// Main handler function to be invoked by Defender or locally for testing.
export async function handler(credentials: RelayerParams) {
  const signer = await initializeSigner(credentials);
  const blockchainService = new BlockchainService(signer);
  await blockchainService.handleRequestCreateAuctionEvent();
}

// Local testing entry point
if (require.main === module) {
  require("dotenv").config();

  // TODO: turn VALID_NETWORKS into a value imported from the contracts package.
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
}
