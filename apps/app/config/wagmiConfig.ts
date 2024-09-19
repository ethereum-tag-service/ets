import {
  type SupportedChainId,
  availableChainIds,
  chains as etsChains,
} from "@ethereum-tag-service/contracts/multiChainConfig";
import { getAlchemyRpcUrlById, getChainById, getExplorerUrl } from "@ethereum-tag-service/contracts/utils";
import { type Chain, arbitrumSepolia, baseSepolia } from "viem/chains";
import { http, createConfig, fallback } from "wagmi";
import { injected } from "wagmi/connectors";

// Convert etsChains to an array of Chain objects
const configChains = Object.values(etsChains) as Chain[];
if (configChains.length === 0) {
  throw new Error("No chains configured");
}

// Wagmi Config
export const wagmiConfig = createConfig({
  chains: [arbitrumSepolia, baseSepolia],
  connectors: [injected()],
  transports: Object.fromEntries(
    availableChainIds.map((chainId) => [
      Number(chainId).toString,
      fallback([
        http(
          chainId === "31337"
            ? "http://localhost:8545"
            : `${getAlchemyRpcUrlById(chainId, process.env.NEXT_PUBLIC_ALCHEMY_KEY || "")}`,
        ),
      ]),
    ]),
  ),
});

// Re-export types and functions
export { etsChains, availableChainIds, getChainById, getExplorerUrl };
export type { SupportedChainId };

// Maintain compatibility with existing chainsMap function
export const chainsMap = (chainId?: number): Chain =>
  chainId ? (getChainById(chainId.toString() as SupportedChainId) as Chain) : configChains[0];

// Type alias for backward compatibility
export type SupportedChains = SupportedChainId;
