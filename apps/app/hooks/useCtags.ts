import useSWR from "swr";
import type { SWRConfiguration } from "swr";
import { TagType } from "@app/types/tag";

type FetchTagsResponse = {
  tags: TagType[];
};

/**
 * @description Uses SWR to fetch and paginate a GraphQL API for tags, returning the
 * tags and their meta information along with pagination information and mutation state.
 * 
 * @param { number } .pageSize - number of tags to retrieve per page and affects the
 * performance of the query by determining the amount of data to fetch from the API.
 * 
 * @param { number } .skip - 0-based index of the next batch of data to retrieve from
 * the API, and it is used in combination with `pageSize` to control the pagination
 * of results.
 * 
 * @param { string } .orderBy - name of the field to use for sorting the results of
 * the query when there are multiple fields available.
 * 
 * @param { string } .orderDirection - direction of the tag list order (either "asc"
 * or "desc").
 * 
 * @param { any } .filter - Tag filter to be applied in the query, allowing users to
 * customize the retrieved data.
 * 
 * @param { SWRConfiguration } .config - configuration options for the SWR cache,
 * which are used to customize the cache behavior and handling of errors.
 * 
 * @returns { object } an object with fields for `tags`, `nextTags`, `isLoading`, and
 * `isError`.
 */
export function useCtags({
  pageSize = 20,
  skip = 0,
  orderBy = "timestamp",
  orderDirection = "desc",
  filter = {},
  config = {},
}: {
  pageSize?: number;
  skip?: number;
  orderBy?: string;
  orderDirection?: string;
  filter?: any;
  config?: SWRConfiguration;
}) {
  const { data, mutate, error } = useSWR<FetchTagsResponse>(
    [
      `query tags(
        $filter: Tag_filter,
        $first: Int!,
        $skip: Int!,
        $orderBy: Tag_orderBy!,
        $orderDirection: OrderDirection
      ) {
        tags: tags(
          first: $first
          skip: $skip
          orderBy: $orderBy
          orderDirection: $orderDirection
          where: $filter
        ) {
          id
          display
          machineName
          timestamp
          premium
          reserved
          tagAppliedInTaggingRecord
          relayer {
            id
            name
          }
          creator {
            id
          }
          owner {
            id
          }
          relayerRevenue
          ownerRevenue
          protocolRevenue
          creatorRevenue
          auctions {
            id
            settled
          }
        }
      }`,
      {
        skip,
        first: pageSize,
        orderBy: orderBy,
        orderDirection: orderDirection,
        filter: filter,
      },
    ],
    config,
  );

  const { data: nextTagsData } = useSWR(
    [
      `query nextTags(
        $filter: Tag_filter,
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
          where: $filter) {
          id
        }
      }`,
      {
        skip: skip + pageSize,
        first: pageSize,
        orderBy: orderBy,
        orderDirection: orderDirection,
        filter: filter,
      },
    ],
    config,
  );

  return {
    tags: data?.tags,
    nextTags: nextTagsData?.tags,
    isLoading: (!error && !data?.tags) || (!nextTagsData && !error),
    isError: error?.statusText,
    mutate,
  };
}
