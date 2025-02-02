import { getSubgraphEndpoint } from "@ethereum-tag-service/subgraph-endpoints";

const endpoint = getSubgraphEndpoint(421614);

console.info("querying endpoint", endpoint);

const graphqlQuery = {
  query: `
    {
  taggingRecords(
    first: 1
    skip: 0
    orderBy: timestamp
    orderDirection: desc
    where: {id: "80903853133999221435814377604232091751415136525898835875800777163543136099110"}
  ) {
    id
    recordType
    timestamp
    relayer {
      name
    }
    tagger {
      id
    }
    tags {
      display
      machineName
    }
    target {
      targetURI
      targetType
    }
  }
}
  `,
};

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(graphqlQuery),
});

const { data } = await response.json();

console.info(JSON.stringify(data, null, 2));

export const taggingInfo = {
  tags: data.taggingRecords[0].tags,
  recordId: data.taggingRecords[0].id,
};
