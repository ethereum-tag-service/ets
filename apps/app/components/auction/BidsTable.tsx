import React from "react";
import { Bid } from "@app/types/auction.js";
import { Truncate } from "@app/components/Truncate";
import { makeScannerLink } from "@app/utils";
import { Outlink } from "@app/components/Outlink";

// Your timestampToString function remains the same
const timestampToString = (timestamp: number, language = "en-US") => {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat(language, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
};

interface AuctionProps {
  bids: Bid[];
  limit?: number; // Optional prop to limit the number of rows
}

const network = process.env.NETWORK ? process.env.NETWORK : "localhost";

const BidsTable: React.FC<AuctionProps> = ({ bids, limit }) => {
  // If limit is provided, slice the bids array up to the limit. Otherwise, use the whole array.
  const displayedBids = limit ? bids.slice(0, limit) : bids;

  return (
    <ul className="list-none ml-0 px-0 py-1 rounded-md bg-base-200">
      {displayedBids.map((bid, index) => (
        <li key={index} className="text-sm flex justify-between items-center rounded-md m-4 py-2 px-3 bg-white">
          <div>
            <span className="font-semibold">{Truncate(bid.bidder.id, 12, "middle")}</span>
            <span className="text-xs text-gray-500 block mt-1">{timestampToString(bid.blockTimestamp)}</span>
          </div>
          <div className="flex items-center font-semibold text-right space-x-1">
            <span>{bid.amountDisplay} MATIC</span>
            <Outlink href={makeScannerLink(bid.id, network)} />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BidsTable;