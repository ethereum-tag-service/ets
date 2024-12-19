import type { SearchResult } from "@app/types/search";
import Link from "next/link";

const RelayerSection = ({ results }: { results: SearchResult[] }) => {
  return (
    <div className="py-3">
      <div className="px-4 pb-2 text-sm font-medium text-slate-500">Relayers</div>
      <div className="space-y-1">
        {results.map((result) => (
          <Link
            key={result.id}
            href={`/explore/relayers/${result.id}`}
            className="block px-4 py-2 hover:bg-slate-50 transition-colors"
          >
            <div className="font-medium text-slate-900">{result.display}</div>
            {result.ens && <div className="text-sm text-slate-500">Created by {result.ens}</div>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelayerSection;
