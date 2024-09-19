import subgraphEndpoints, { getSubgraphEndpoint } from "./index";

console.info("Default export:", subgraphEndpoints);
console.info("Endpoint for chainId 84532:", getSubgraphEndpoint(84532));
console.info('Endpoint for "baseSepolia":', subgraphEndpoints.baseSepolia);

try {
  getSubgraphEndpoint(1); // Should throw an error
} catch (error) {
  console.info("Error caught as expected:", error instanceof Error ? error.message : String(error));
}

console.info("Test completed.");
