import subgraphEndpoints from "@ethereum-tag-service/subgraph-endpoints";
import { gql, request } from "graphql-request";
import type { PublicClient } from "viem";

type Variables = Record<string, any>; // Define your custom variable types here if needed

export const fetcher = async <T = any>(query: string, variables: Variables): Promise<T> => {
  // Current ETS_ENVIRONMENTS are development/stage/production
  const environment: string = process.env.NEXT_PUBLIC_ETS_ENVIRONMENT || "localhost";

  console.info(`Fetching data from ${environment} environment`);
  // Use the environment to select the appropriate endpoint
  const GRAPH_API_ENDPOINT: string = subgraphEndpoints[environment];

  try {
    const data = await request(
      GRAPH_API_ENDPOINT,
      gql`
        ${query}
      `,
      variables,
    );
    return data;
  } catch (error) {
    // Handle errors here if needed
    console.error(error);
    throw error;
  }
};

// Example usage:
// const data = await fetcher<YourResponseType>(yourQuery, yourVariables);

export async function fetchEnsName(client: PublicClient, address: string): Promise<string | null> {
  try {
    return await client.getEnsName({ address: address as `0x${string}` });
  } catch (error) {
    console.error(`Error fetching ENS name for ${address}:`, error);
    return null;
  }
}
