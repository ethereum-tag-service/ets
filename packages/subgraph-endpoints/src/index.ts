const subgraphEndpoints: Record<string, string> = {
  development: "http://localhost:8000/subgraphs/name/ets/ets-local",
  arbitrumSepolia: "https://api.studio.thegraph.com/query/87165/ets-arbitrum-sepolia/version/latest",
  baseSepolia: "https://api.studio.thegraph.com/query/87165/ets-base-sepolia/version/latest",
};

export default subgraphEndpoints;
