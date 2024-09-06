// utils.ts

// Importing the chainsConfig types and objects to use in utility functions.
import { type SupportedChain, type SupportedChainId, chains } from "./chainsConfig";

// Retrieves a chain configuration by its ID. Takes in a SupportedChainId and returns
// the corresponding Chain object from the chains configuration.
export const getChainById = (chainId: SupportedChainId): SupportedChain => chains[chainId];

/**
 * Generates a URL to the block explorer for a given chain, transaction, address, or token.
 * @param chainId - The ID of the chain.
 * @param type - The type of URL to generate (e.g., "tx" for transaction, "address", or "token").
 * @param hash - Optional hash or identifier for the transaction, address, or token.
 * @returns A string representing the full URL to the block explorer.
 */
export const getExplorerUrl = (
  chainId: SupportedChainId,
  type: "tx" | "nft" | "address" | "token" = "tx",
  hash?: string,
): string => {
  // Fetches the corresponding chain by ID.
  const chain = getChainById(chainId);

  // Fallback to Etherscan if the block explorer for the specific chain is unavailable.
  const baseUrl = chain.blockExplorers?.default?.url || "https://etherscan.io";

  // Return the fully constructed block explorer URL.
  return `${baseUrl}/${type}/${hash}`;
};

/**
 * Generates the base Alchemy RPC URL for a given chain name.
 * @param chainName - The name of the chain (e.g., "arbitrumSepolia" or "baseSepolia").
 * @returns A string representing the Alchemy RPC URL for the specified chain.
 */
export const getAlchemyRpcUrl = (chainName: string): string => {
  // A mapping of chain names to Alchemy network identifiers.
  const alchemyNetworkMap: Record<string, string> = {
    arbitrumSepolia: "arb-sepolia",
    baseSepolia: "base-sepolia",
    // Add more mappings as needed for additional supported chains.
  };

  // Lookup the network name in the map, falling back to the lowercased chain name if not found.
  const networkName = alchemyNetworkMap[chainName] || chainName.toLowerCase();

  // Return the full Alchemy RPC URL.
  return `https://${networkName}.g.alchemy.com/v2/`;
};

/**
 * Retrieves the Alchemy RPC URL for a specific chain by its ID.
 * @param chainId - The ID of the chain (e.g., "421614" for Arbitrum Sepolia).
 * @param alchemyKey - The Alchemy API key to be appended to the URL.
 * @returns A string representing the Alchemy RPC URL for the specified chain.
 */
export function getAlchemyRpcUrlById(chainId: SupportedChainId, alchemyKey: string): string {
  // Fetch the corresponding chain by ID.
  const chain = getChainById(chainId);

  // Construct the full RPC URL for the chain using the Alchemy key.
  return `${getAlchemyRpcUrl(chain.name)}${alchemyKey}`;
}
