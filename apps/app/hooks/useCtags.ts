import useSWR from "swr";
import type { SWRConfiguration } from "swr";
import { TagType } from "@app/types/tag";

type FetchTagsResponse = {
  tags: TagType[];
};

/**
 * @description Provides data and next tags data based on filters applied to the
 * database and performs pagination based on skip and pageSize parameters.
 * 
 * @param { number } .pageSize - number of tags to return per page in the API response.
 * 
 * @param { number } .skip - number of tags to skip from the start when retrieving
 * tags, allowing users to control the position of the retrieved data.
 * 
 * @param { string } .orderBy - name of a field to use as an ascending or descending
 * sort key for the tags, which can be one of `timestamp`, `machineName`, `display`,
 * or any custom value specified by the user.
 * 
 * @param { string } .orderDirection - direction of the sort order for the tags, with
 * possible values being `asc` or `desc`.
 * 
 * @param { any } .filter - tag filtering options that can be applied to the tags query.
 * 
 * @param { SWRConfiguration } .config - SWRConfiguration object that customizes the
 * configuration for the SWReact hook used to fetch the tags data.
 * 
 * @returns { object } an object containing `tags`, `nextTags`, `isLoading`, and `isError`.
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
