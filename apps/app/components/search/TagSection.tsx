import { Tag } from "@app/components/Tag";
import type { SearchResult } from "@app/types/search";
import Link from "next/link";
import type { FC } from "react";

const TagSection: FC<{ results: SearchResult[] }> = ({ results }) => (
  <div className="py-2">
    <h3 className="px-4 py-1 text-sm font-medium text-slate-700">Tags</h3>
    <div className="divide-y divide-slate-100">
      {results.map((result) => (
        <div key={result.id} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50">
          <Link
            href={`/explore/tags/${result.name}`}
            className="text-sm font-medium inline-block py-1 px-2 rounded link-primary hover:scale-105 transition-all duration-300 bg-primary-content last:mr-0 mr-1"
          >
            {result.display}
          </Link>
        </div>
      ))}
    </div>
  </div>
);

export default TagSection;
