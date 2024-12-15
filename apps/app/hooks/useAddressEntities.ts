import type { CreatorType } from "@app/types/creator";
import type { OwnerType } from "@app/types/owners";
import type { RelayerType } from "@app/types/relayer";
import useSWR from "swr";
import type { SWRConfiguration } from "swr";
import { useEnsNames } from "./useEnsNames";

export function useAddressEntities(address: string | null, config: SWRConfiguration = {}) {
  const { data, error } = useSWR(
    address
      ? [
          `query searchAddress($address: String!) {
        relayers: relayers(where: { id: $address }, first: 1) {
          id
          name
          firstSeen
          creator
          owner
          pausedByOwner
          lockedByProtocol
          publishedTagsAddedToTaggingRecords
          publishedTagsAuctioned
          publishedTagsAuctionRevenue
          publishedTagsRemovedFromTaggingRecords
          publishedTagsTaggingFeeRevenue
          taggingRecordTxns
          taggingRecordsPublished
          tagsApplied
          tagsPublished
          tagsRemoved
        }
        creators: creators(where: { id: $address }, first: 1) {
          id
          firstSeen
          tagsCreated
          createdTagsAddedToTaggingRecords
          createdTagsRemovedFromTaggingRecords
          createdTagsAuctionRevenue
          createdTagsTaggingFeeRevenue
        }
        owners: owners(where: { id: $address }, first: 1) {
          id
          firstSeen
          tagsOwned
          tagsOwnedLifeTime
          ownedTagsAddedToTaggingRecords
          ownedTagsRemovedFromTaggingRecords
          ownedTagsTaggingFeeRevenue
        }
      }`,
          { address: address?.toLowerCase() },
        ]
      : null,
    config,
  );

  const allAddresses = [
    ...(data?.relayers || []).flatMap((r: { owner: string; creator: string }) => [r.owner, r.creator]),
    ...(data?.creators || []).map((c: { id: string }) => c.id),
    ...(data?.owners || []).map((o: { id: string }) => o.id),
  ];

  const { ensNames } = useEnsNames(allAddresses);

  const relayersWithEns: RelayerType[] =
    data?.relayers?.map((relayer: { owner: string; creator: string }) => ({
      ...relayer,
      owner: {
        id: relayer.owner,
        ens: ensNames[relayer.owner] || null,
      },
      creator: {
        id: relayer.creator,
        ens: ensNames[relayer.creator] || null,
      },
    })) || [];

  const creatorsWithEns: CreatorType[] =
    data?.creators?.map((creator: { id: string }) => ({
      ...creator,
      ens: ensNames[creator.id] || null,
    })) || [];

  const ownersWithEns: OwnerType[] =
    data?.owners?.map((owner: { id: string }) => ({
      ...owner,
      ens: ensNames[owner.id] || null,
    })) || [];

  // Only consider it loading if we have an address and are waiting for data
  const isLoading = address ? !error && !data : false;

  return {
    relayers: relayersWithEns,
    creators: creatorsWithEns,
    owners: ownersWithEns,
    isLoading,
    isError: error?.statusText,
  };
}
