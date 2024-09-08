import { CopyAndPaste } from "@app/components/CopyAndPaste";
import { Truncate } from "@app/components/Truncate";
import { getExplorerUrl } from "@app/config/wagmiConfig";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import type { Hex } from "viem";
import { useChainId } from "wagmi";
import { URI } from "./URI";

interface AddressProps {
  address?: string | Hex;
  ens?: string | null;
  truncateLength?: number;
}

const Address: React.FC<AddressProps> = React.memo(function Address({ address, ens, truncateLength = 14 }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const spanRef = useRef<HTMLSpanElement>(null);
  const chainId = useChainId();

  const displayText = useMemo(() => ens || Truncate(address, truncateLength, "middle"), [ens, address, truncateLength]);
  const explorerUrl = useMemo(() => getExplorerUrl(chainId, "address", address), [chainId, address]);

  useEffect(() => {
    if (showTooltip && spanRef.current) {
      const rect = spanRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top - 30,
        left: rect.left + rect.width / 2,
      });
    }
  }, [showTooltip]);

  return (
    <span className="inline-flex items-center gap-1">
      <span
        ref={spanRef}
        className="border-b border-dotted border-gray-400 cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {displayText}
      </span>
      {address && <CopyAndPaste value={address.toString()} />}
      <URI value={explorerUrl} />
      {showTooltip &&
        createPortal(
          <div
            className="fixed z-50 px-2 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg whitespace-nowrap transform -translate-x-1/2"
            style={{ top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px` }}
          >
            {address}
          </div>,
          document.body,
        )}
    </span>
  );
});

export default Address;
