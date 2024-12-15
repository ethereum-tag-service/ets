import type { SearchResult } from "@app/types/search";
import Link from "next/link";
import type { FC } from "react";

interface SearchResultsProps {
  results: SearchResult[];
  isSearching: boolean;
}

export const SearchResults: FC<SearchResultsProps> = ({ results, isSearching }) => {
  if (isSearching) {
    return <div className="p-4 text-slate-600">Searching...</div>;
  }

  if (results.length === 0) {
    return <div className="p-4 text-slate-600">No results found</div>;
  }

  return (
    <div className="divide-y divide-slate-200">
      {results.map((result) => (
        <Link
          href={`/${result.type}/${result.id}`}
          key={`${result.type}-${result.id}`}
          className="block p-4 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-slate-900">{result.display || result.id}</span>
              {result.ens && <span className="ml-2 text-sm text-slate-500">({result.ens})</span>}
            </div>
            <span className="text-xs text-slate-500 capitalize">{result.type.replace(/([A-Z])/g, " $1").trim()}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};
