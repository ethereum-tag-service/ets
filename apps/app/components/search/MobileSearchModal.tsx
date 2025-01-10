import { useSearch } from "@app/hooks/useSearch";
import type { SearchResult, TagResult } from "@app/types/search";
import { type FC, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import AddressSection from "./AddressSection";
import RelayerSection from "./RelayerSection";
import TagSection from "./TagSection";

const isTagResult = (result: SearchResult): result is TagResult =>
  result.type === "tags" && typeof result.display === "string";

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSearchModal: FC<MobileSearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setSearchTerm("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center">
      <div ref={modalRef} className="w-full h-full bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 p-4 border-b border-slate-200">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 border-transparent focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-400 transition-colors"
              placeholder="Search by tag or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
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
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-labelledby="closeIconTitle"
            >
              <title id="closeIconTitle">Close</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-slate-600">Searching...</div>
          ) : !hasAnyResults && searchTerm ? (
            <div className="p-4 text-slate-600">No results found</div>
          ) : (
            <>
              {tagResults.length > 0 && <TagSection results={tagResults} />}
              {relayerResults.length > 0 && <RelayerSection results={relayerResults} />}
              {addressResults.length > 0 && isAddressSearch && <AddressSection results={addressResults} />}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};
