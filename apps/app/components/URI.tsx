import type React from "react";

interface URIProps {
  value: string;
  className?: string;
}

export const URI: React.FC<URIProps> = ({ value, className = "link link-primary" }) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(value, "_blank", "noopener,noreferrer");
      }}
      className={className}
      aria-label="Open URI"
    >
      <svg
        className="inline-flex w-5 h-5"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        aria-labelledby="openLinkTitle"
      >
        <title id="openLinkTitle">Open link</title>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M17.25 15.25V6.75H8.75 M17 7L6.75 17.25"
        />
      </svg>
    </button>
  );
};
