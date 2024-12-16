import { useSearch } from "@app/hooks/useSearch";
import type {
  CreatorResult,
  OwnerResult,
  RelayerResult,
  SearchResult,
  TagResult,
  TaggerResult,
} from "@app/types/search";
import { type FC, useEffect, useState } from "react";
import CategorySection from "./CategorySection";

// Type guard functions
const isTagResult = (result: SearchResult): result is TagResult =>
  result.type === "tags" && typeof result.display === "string";

const isOwnerResult = (result: SearchResult): result is OwnerResult => result.type === "owners";

const isCreatorResult = (result: SearchResult): result is CreatorResult => result.type === "creators";

const isRelayerResult = (result: SearchResult): result is RelayerResult => result.type === "relayers";

const isTaggerResult = (result: SearchResult): result is TaggerResult => result.type === "taggers";

export const Search: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { results, isSearching } = useSearch(debouncedTerm);

  const categorizedResults = {
    tags: results.filter(isTagResult),
    owners: results.filter(isOwnerResult),
    creators: results.filter(isCreatorResult),
    relayers: results.filter(isRelayerResult),
    taggers: results.filter(isTaggerResult),
  };

  const showResults = debouncedTerm.length > 0;
  const hasAnyResults = Object.values(categorizedResults).some((category) => category.length > 0);

  return (
    <div className="relative w-full">
      <input
        type="text"
        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
        placeholder="Search by address or name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 max-h-[80vh] overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-slate-600">Searching...</div>
          ) : !hasAnyResults ? (
            <div className="p-4 text-slate-600">No results found</div>
          ) : (
            <>
              {categorizedResults.tags.length > 0 && <CategorySection title="Tags" results={categorizedResults.tags} />}
              {categorizedResults.owners.length > 0 && (
                <CategorySection title="Tag Owners" results={categorizedResults.owners} />
              )}
              {categorizedResults.creators.length > 0 && (
                <CategorySection title="Tag Creators" results={categorizedResults.creators} />
              )}
              {categorizedResults.relayers.length > 0 && (
                <CategorySection title="Relayers" results={categorizedResults.relayers} />
              )}
              {categorizedResults.taggers.length > 0 && (
                <CategorySection title="Taggers" results={categorizedResults.taggers} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
