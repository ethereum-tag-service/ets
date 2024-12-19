import { useSearch } from "@app/hooks/useSearch";
import type { SearchResult, TagResult } from "@app/types/search";
import { type FC, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import AddressSection from "./AddressSection";
import RelayerSection from "./RelayerSection";
import TagSection from "./TagSection";

const isTagResult = (result: SearchResult): result is TagResult =>
  result.type === "tags" && typeof result.display === "string";

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 text-slate-400"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export const Search: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const [dropdownStyles, setDropdownStyles] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  useEffect(() => {
    const element =
      document.getElementById("search-portal-container") ||
      (() => {
        const el = document.createElement("div");
        el.id = "search-portal-container";
        el.className = "fixed inset-0 z-50 pointer-events-none";
        document.body.appendChild(el);
        return el;
      })();
    setPortalElement(element);

    return () => {
      if (element?.parentElement && element.childNodes.length === 0) {
        element.parentElement.removeChild(element);
      }
    };
  }, []);

  const updatePosition = () => {
    if (!searchRef.current) return;
    const rect = searchRef.current.getBoundingClientRect();
    setDropdownStyles({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (showResults) {
      updatePosition();
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);
    }

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [showResults]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { results, isSearching } = useSearch(debouncedTerm);
  const isAddressSearch = debouncedTerm?.startsWith("0x") && debouncedTerm?.length === 42;
  const addressResults = results.filter((result) => result.type !== "tags" && result.type !== "relayers");
  const tagResults = results.filter(isTagResult);
  const relayerResults = results.filter((result) => result.type === "relayers");
  const hasAnyResults = results.length > 0;

  const renderResults = () => (
    <div
      ref={dropdownRef}
      className="fixed bg-white rounded-lg shadow-lg border border-slate-200 max-h-[80vh] overflow-y-auto pointer-events-auto overflow-x-visible"
      style={{
        top: `${dropdownStyles.top}px`,
        left: `${dropdownStyles.left}px`,
        width: `${dropdownStyles.width}px`,
        overflow: "visible",
      }}
    >
      {isSearching ? (
        <div className="p-4 text-slate-600">Searching...</div>
      ) : !hasAnyResults ? (
        <div className="p-4 text-slate-600">No results found</div>
      ) : (
        <>
          {tagResults.length > 0 && <TagSection results={tagResults} />}
          {relayerResults.length > 0 && <RelayerSection results={relayerResults} />}
          {addressResults.length > 0 && isAddressSearch && <AddressSection results={addressResults} />}
        </>
      )}
    </div>
  );

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative flex items-center">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <SearchIcon />
        </div>
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 border-transparent focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-400 transition-colors"
          placeholder="Search by address or name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(true);
            updatePosition();
          }}
          onFocus={() => {
            setShowResults(true);
            updatePosition();
          }}
        />
      </div>

      {showResults && searchTerm && portalElement && createPortal(renderResults(), portalElement)}
    </div>
  );
};

export default Search;
