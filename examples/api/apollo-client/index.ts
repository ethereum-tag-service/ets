import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { getSubgraphEndpoint } from "@ethereum-tag-service/subgraph-endpoints";

// Get the correct endpoint for Arbitrum Sepolia testnet
const endpoint = getSubgraphEndpoint(421614);

// Initialize Apollo Client
const client = new ApolloClient({
  uri: endpoint,
  cache: new InMemoryCache(),
});

// Query for tags
const TAGS_QUERY = gql`
  query tags(
    $first: Int!,
    $skip: Int!,
    $orderBy: Tag_orderBy!,
    $orderDirection: OrderDirection
  ) {
    tags(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      display
      machineName
      timestamp
      creator {
        id
      }
      owner {
        id
      }
    }
  }
`;

// Fetch tags
const { data } = await client.query({
  query: TAGS_QUERY,
  variables: {
    first: 5,
    skip: 0,
    orderBy: "timestamp",
    orderDirection: "desc",
  },
});

export const tags = data.tags;
