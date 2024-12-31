import { getSubgraphEndpoint } from "@ethereum-tag-service/subgraph-endpoints";

const endpoint = getSubgraphEndpoint(421614);

const graphqlQuery = {
  query: `
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
  `,
  variables: {
    first: 5,
    skip: 0,
    orderBy: "timestamp",
    orderDirection: "desc",
  },
};

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(graphqlQuery),
});

const { data } = await response.json();
export const tags = data.tags;
