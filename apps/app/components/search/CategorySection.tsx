import type { SearchResult } from "@app/types/search";
import type { FC } from "react";

interface CategorySectionProps {
  title: string;
  results: SearchResult[];
}

const CategorySection: FC<CategorySectionProps> = ({ title, results }) => {
  return (
    <div className="py-2">
      <h3 className="px-4 py-1 text-sm font-medium text-slate-700">{title}</h3>
      <div className="divide-y divide-slate-100">
        {results.map((result) => (
          <div key={result.id} className="px-4 py-2 hover:bg-slate-50">
            <div className="font-medium">{result.display || result.id}</div>
            {result.ens && <div className="text-sm text-slate-500">{result.ens}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
