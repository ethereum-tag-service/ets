import type { CreatorType } from "@app/types/creator";
import type { OwnerType } from "@app/types/owners";
import type { RelayerType } from "@app/types/relayer";
import type { TaggerType } from "@app/types/tagger";
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
              creator
              owner
            }
            creators: creators(where: { id: $address }, first: 1) {
              id
            }
            owners: owners(where: { id: $address }, first: 1) {
              id
            }
            taggers: taggers(where: { id: $address }, first: 1) {
              id
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
    ...(data?.taggers || []).map((t: { id: string }) => t.id),
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

  const taggersWithEns: TaggerType[] =
    data?.taggers?.map((tagger: { id: string }) => ({
      ...tagger,
      ens: ensNames[tagger.id] || null,
    })) || [];

  const isLoading = address ? !error && !data : false;

  return {
    relayers: relayersWithEns,
    creators: creatorsWithEns,
    owners: ownersWithEns,
    taggers: taggersWithEns,
    isLoading,
    isError: error?.statusText,
  };
}
