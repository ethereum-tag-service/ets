import type { SearchResultType } from "@app/types/search";
import { useMemo } from "react";
import { useAddressEntities } from "./useAddressEntities";
import { useCtags } from "./useCtags";
import { useRelayers } from "./useRelayers";

export function useSearch(searchTerm: string) {
  const isAddress = searchTerm?.startsWith("0x") && searchTerm?.length === 42;

  const commonConfig = {
    dedupingInterval: 5000,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  };

  const {
    relayers: addressRelayers,
    creators,
    owners,
    taggers,
    isLoading: isLoadingEntities,
  } = useAddressEntities(isAddress ? searchTerm : null, commonConfig);

  const { tags, isLoading: isLoadingTags } = useCtags({
    pageSize: 5,
    filter: searchTerm
      ? isAddress
        ? { id: searchTerm.toLowerCase() }
        : { display_contains_nocase: searchTerm }
      : undefined,
    config: commonConfig,
  });

  const { relayers: nameRelayers, isLoading: isLoadingNameRelayers } = useRelayers({
    pageSize: 5,
    filter: searchTerm && !isAddress ? { name_contains_nocase: searchTerm } : undefined,
    config: commonConfig,
  });

  const results = useMemo(() => {
    if (!searchTerm) return [];

    const relayerResults = isAddress ? addressRelayers : nameRelayers;

    return [
      ...(tags?.map((tag) => ({
        type: "tags" as SearchResultType,
        name: tag.display?.replace(/#/g, "") || "",
        id: tag.id,
        display: tag.display,
        ens: tag.creator.ens,
      })) || []),
      ...(relayerResults?.map((relayer) => ({
        type: "relayers" as SearchResultType,
        id: relayer.id,
        display: relayer.name || relayer.id,
        ens: relayer.creator.ens,
      })) || []),
      ...(creators?.map((creator) => ({
        type: "creators" as SearchResultType,
        id: creator.id,
        display: creator.id,
        ens: creator.ens,
      })) || []),
      ...(owners?.map((owner) => ({
        type: "owners" as SearchResultType,
        id: owner.id,
        display: owner.id,
        ens: owner.ens,
      })) || []),
      ...(taggers?.map((owner) => ({
        type: "taggers" as SearchResultType,
        id: owner.id,
        display: owner.id,
        ens: owner.ens,
      })) || []),
    ];
  }, [searchTerm, tags, addressRelayers, nameRelayers, creators, owners, taggers, isAddress]);

  const effectiveEntityLoading = isAddress ? isLoadingEntities : isLoadingNameRelayers;

  return {
    results,
    isSearching: searchTerm ? isLoadingTags || effectiveEntityLoading : false,
  };
}
