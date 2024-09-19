import { getSubgraphEndpoint } from "@ethereum-tag-service/subgraph-endpoints";
import axios, { type AxiosResponse } from "axios";

interface Auction {
  id: string;
  settled: boolean;
}

interface Tag {
  id: string;
  display: string;
  timestamp: number;
  tagAppliedInTaggingRecord: number;
  auctions: Auction[];
}

export class TagService {
  private async fetchTags(platformAddress: string, chainId: number): Promise<Tag[]> {
    try {
      const endpoint = getSubgraphEndpoint(chainId);
      console.info(`Using subgraph endpoint for chainId ${chainId}: ${endpoint}`);
      console.info("Platform address:", platformAddress);

      const query: string = `
        query {
          tags(
            orderBy: tagAppliedInTaggingRecord,
            orderDirection: desc,
            where: { owner_: { id: "${platformAddress}" } }
          ) {
            id
            display
            timestamp
            tagAppliedInTaggingRecord
            auctions {
              id
              settled
            }
          }
        }
      `;

      const response: AxiosResponse<{ data: { tags: Tag[] } }> = await axios.post(endpoint, { query });
      console.info(`Retrieved ${response.data.data.tags.length} tags`);
      return response.data.data.tags;
    } catch (error: any) {
      console.error("Error fetching tags:", error.message);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      throw new Error(`Failed to fetch tags from GraphQL API for chainId ${chainId}`);
    }
  }

  private filterEligibleTags(tags: Tag[]): Tag[] {
    const eligibleTags = tags.filter(
      (tag) => tag.auctions.length === 0 || tag.auctions.every((auction) => auction.settled),
    );
    console.info(`Filtered ${tags.length} tags to ${eligibleTags.length} eligible tags`);
    return eligibleTags;
  }

  /**
   * Selects the most appropriate tag for auction based on specific criteria.
   *
   * @param tags An array of tags fetched from the database.
   * @returns The selected tag or null if no eligible tags are found.
   */
  private selectTagForAuction(tags: Tag[]): Tag | null {
    if (tags.length === 0) {
      console.info("No tags available for selection");
      return null;
    }

    const tagsWithRecords = tags.filter((tag) => tag.tagAppliedInTaggingRecord > 0);
    console.info(`Found ${tagsWithRecords.length} tags with positive tagAppliedInTaggingRecord`);

    if (tagsWithRecords.length > 0) {
      const selected = tagsWithRecords.reduce((prev, current) =>
        prev.tagAppliedInTaggingRecord > current.tagAppliedInTaggingRecord ? prev : current,
      );
      console.info(`Selected tag with highest tagAppliedInTaggingRecord: ${selected.id}`);
      return selected;
    }

    const oldest = tags.reduce((prev, current) => (prev.timestamp < current.timestamp ? prev : current));
    console.info(`Selected oldest tag: ${oldest.id}`);
    return oldest;
  }

  public async findNextCTAG(platformAddress: string, chainId: number): Promise<string | null> {
    console.info(`Finding next CTAG for platform address ${platformAddress} on chain ${chainId}`);
    try {
      const tags = await this.fetchTags(platformAddress, chainId);
      const eligibleTags = this.filterEligibleTags(tags);

      if (eligibleTags.length === 0) {
        console.info("No eligible tags available for auctioning.");
        return null;
      }

      const selectedTag = this.selectTagForAuction(eligibleTags);
      if (!selectedTag) {
        console.info("No suitable tag found after filtering.");
        return null;
      }

      console.info(`Next tag selected for auction: ${selectedTag.display} with ID ${selectedTag.id}`);
      return selectedTag.id;
    } catch (error) {
      console.error("Error in findNextCTAG:", error instanceof Error ? error.message : String(error));
      return null;
    }
  }
}
