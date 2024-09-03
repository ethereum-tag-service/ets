import { DefenderRelayProvider, DefenderRelaySigner } from "@openzeppelin/defender-relay-client/lib/ethers";
// File: initializeSigner.ts
import type { RelayerParams } from "@openzeppelin/defender-relay-client/lib/relayer";
import { ethers } from "ethers";

/**
 * Initializes and returns an ethers.js Signer based on the application's environment.
 * This signer can be used to interact with the Ethereum blockchain, allowing for
 * both read and write operations on smart contracts.
 *
 * @param credentials - When the signer is being initialized from a Defender Action
 *                      credentials are passed in automatically by Defender system.
 *                      If are testing a Defender Action locally, these credentials must be
 *                      set inside the action code. @see /src/defender/actions/release-next-auction/
 *
 * @returns An instance of ethers.Signer, which can either be a Wallet (for local environments)
 *          or a DefenderRelaySigner (for non-local environments like "arbitrumSepolia").
 *
 * @throws Error - If the NETWORK environment variable is set to an unsupported value
 *                 or if credentials are required but not provided.
 */
export async function initializeSigner(credentials?: RelayerParams): Promise<ethers.Signer> {
  if (process.env.NETWORK === "localhost") {
    // For local development, use a Wallet connected to a local JSON-RPC provider.
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    const privateKey = getRequiredEnv("ETS_ORACLE_LOCALHOST_PK");
    return new ethers.Wallet(privateKey, provider);
  }

  // Enforce the testnet network for local testing
  // TODO: turn VALID_NETWORKS into a value imported from the contracts package.
  const VALID_NETWORKS = ["arbitrumSepolia", "baseSepolia"] as const;

  // Type for valid networks
  type ValidNetwork = (typeof VALID_NETWORKS)[number];

  // Check if the NETWORK environment variable is set and valid
  const network = process.env.NETWORK as ValidNetwork | undefined;

  if (network && VALID_NETWORKS.includes(network)) {
    // using DefenderRelaySigner requires credentials.
    if (!credentials) {
      throw new Error(`"Defender relayer credentials must be provided for the ${network} network."`);
    }
    const provider = new DefenderRelayProvider(credentials);
    return new DefenderRelaySigner(credentials, provider, { speed: "fast" });
  }

  throw new Error(
    `Unsupported or missing NETWORK configuration. Supported networks are: ${Object.keys(VALID_NETWORKS).join(", ")}.`,
  );
}

/**
 * Helper function to get a required environment variable. Throws an error if the
 * variable is not set.
 *
 * @param variable - The name of the environment variable to retrieve.
 * @returns The value of the environment variable.
 *
 * @throws Error - If the specified environment variable is not set.
 */
function getRequiredEnv(variable: string): string {
  const value = process.env[variable];
  if (value === undefined) {
    throw new Error(`${variable} environment variable is not set.`);
  }
  return value;
}
