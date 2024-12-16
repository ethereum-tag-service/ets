import type { SearchResultType } from "@app/types/search";
import { useMemo } from "react";
import { useAddressEntities } from "./useAddressEntities";
import { useCtags } from "./useCtags";

export function useSearch(searchTerm: string) {
  const isAddress = searchTerm?.startsWith("0x") && searchTerm?.length === 42;

  const commonConfig = {
    dedupingInterval: 5000,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  };

  const {
    relayers,
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

  const results = useMemo(() => {
    if (!searchTerm) return [];

    return [
      ...(tags?.map((tag) => ({
        type: "tags" as SearchResultType,
        name: tag.display?.replace(/#/g, "") || "",
        id: tag.id,
        display: tag.display,
        ens: tag.creator.ens,
      })) || []),
      ...(relayers?.map((relayer) => ({
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
  }, [searchTerm, tags, relayers, creators, owners, taggers]);

  const effectiveEntityLoading = isAddress ? isLoadingEntities : false;

  return {
    results,
    isSearching: searchTerm ? isLoadingTags || effectiveEntityLoading : false,
  };
}
