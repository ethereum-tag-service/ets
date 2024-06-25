import useSWR from "swr";
import type { SWRConfiguration } from "swr";

/**
 * @description Retrieves and paginates a collection of tagging records from an API
 * endpoint based on filter criteria provided as props. It also provides loading and
 * error states, and offers mutation and error handling capabilities.
 * 
 * @param { number } .pageSize - number of tagging records to fetch on each page,
 * with the functionality allowing for pagination through the use of non-zero values.
 * 
 * @param { number } .skip - number of records to skip when querying the database for
 * tagging records.
 * 
 * @param { string } .orderBy - taggingRecords to be sorted and retrieved based on a
 * specific field (`timestamp`, `recordType`, etc.).
 * 
 * @param { any } .filter - filter value used to narrow down the results of the query
 * when `nextTaggingRecords` is being queried.
 * 
 * @param { SWRConfiguration } .config - SWR Configuration object that determines how
 * the fetching and mutating of data are performed.
 * 
 * @returns { object } an object with three properties: `taggingRecords`,
 * `nextTaggingRecords`, and `isLoading`.
 */
export function useTaggingRecords({
  pageSize = 20,
  skip = 0,
  orderBy = "timestamp",
  filter = {},
  config = {},
}: {
  pageSize?: number;
  skip?: number;
  orderBy?: string;
  filter?: any;
  config?: SWRConfiguration;
}) {
  const { data, mutate, error } = useSWR(
    [
      `query taggingRecords($filter: TaggingRecord_filter $first: Int!, $skip: Int!, $orderBy: String!) {
        taggingRecords: taggingRecords(
          first: $first
          skip: $skip
          orderBy: $orderBy
          orderDirection: desc
          where: $filter
        ) {
          id
          recordType
          timestamp
          relayer {
            id
            name
          }
          tagger {
            id
          }
          tags {
            id
            display
            machineName
          }
          target {
            id
            targetURI
            targetType
          }
        },
        nextTaggingRecords: taggingRecords(
          first: $first
          skip: ${skip + pageSize}
          orderBy: $orderBy
          orderDirection: desc
          where: $filter) {
          id
        }
      }`,
      {
        skip,
        first: pageSize,
        orderBy: orderBy,
        filter: filter,
      },
    ],
    config,
  );

  return {
    taggingRecords: data?.taggingRecords,
    nextTaggingRecords: data?.nextTaggingRecords,
    isLoading: !error && !data?.taggingRecords,
    mutate,
    isError: error?.statusText,
  };
}
