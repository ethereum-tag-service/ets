const subgraphEndpoints = {
  localhost: "http://localhost:8000/subgraphs/name/ets-local",
  arbitrumSepolia: "https://api.studio.thegraph.com/query/87165/ets-arbitrum-sepolia/version/latest",
  baseSepolia: "https://api.studio.thegraph.com/query/87165/ets-base-sepolia/version/latest",
};

const chainIdToNetwork: Record<number, keyof typeof subgraphEndpoints> = {
  31337: "localhost",
  1337: "localhost",
  421614: "arbitrumSepolia",
  84532: "baseSepolia",
};

export function getSubgraphEndpoint(chainId: number): string {
  const network = chainIdToNetwork[chainId];
  if (!network) {
    throw new Error(`No subgraph endpoint found for chainId: ${chainId}`);
  }
  return subgraphEndpoints[network];
}

export default subgraphEndpoints;
