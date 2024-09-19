// chainsConfig.ts

// Importing chain definitions from viem/chains. These are predefined chain configurations
// for use with wagmi and Ethereum-based chains.
import { type Chain, arbitrumSepolia, baseSepolia, localhost } from "viem/chains";

// Define a type for the chains configuration object, mapping chain IDs (as strings)
// to the Chain type. Additionally, the type enforces the inclusion of specific chain IDs.
export type MultiChainConfig = { [chainId: string]: Chain } & {
  readonly [K in "421614" | "84532" | "31337"]: Chain;
};

// The chains object contains the chain configurations for specific chain IDs.
// These are imported from viem/chains and mapped to their respective chain IDs.
export const chains: MultiChainConfig = {
  "421614": arbitrumSepolia,
  "84532": baseSepolia,
  "31337": localhost,
};

// Define a type alias for the supported chain IDs. It dynamically infers the chain IDs
// from the keys of the chains object.
export type SupportedChainId = keyof typeof chains;

// Define a type alias for the supported chains. It dynamically infers the Chain type
// based on the SupportedChainId type.
export type SupportedChain = (typeof chains)[SupportedChainId];

// Export an array of available chain IDs. This converts the keys of the chains object to strings
// and casts them as SupportedChainId[] for type safety.
export const availableChainIds = Object.keys(chains) as SupportedChainId[];
