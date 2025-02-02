import { getSubgraphEndpoint } from "@ethereum-tag-service/subgraph-endpoints";
import { QueryClient } from "@tanstack/react-query";
import { http, createConfig } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http(),
  },
});

export const queryClient = new QueryClient();
// Get the correct endpoint for Arbitrum Sepolia testnet
export const graphqlEndpoint = getSubgraphEndpoint(421614);
