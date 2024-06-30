import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { useAuctionHouse } from "@app/hooks/useAuctionHouse";
import { useAuction } from "@app/hooks/useAuctionContext";
import { useCurrentChain } from "@app/hooks/useCurrentChain";

import { TagGraphic } from "@app/components/TagGraphic";
import AuctionNavigation from "@app/components/auction/AuctionNavigation";
import AuctionActions from "@app/components/auction/AuctionActions";
import AuctionTimer from "@app/components/auction/AuctionTimer";
import AuctionSummary from "@app/components/auction/AuctionSummary";
import AuctionBids from "@app/components/auction/AuctionBids";
import { Truncate } from "@app/components/Truncate";

import AuctionDebug from "@app/components/auction/AuctionDebug";

/**
 * @description Displays information about an auction within a specific tag. It
 * retrieves the auction details from the API and formats them for display, including
 * the current bid amount, time left, winner, and owner.
 * 
 * @returns { HTML container element consisting of multiple elements, including but
 * not limited to an opening `div` element, a series of `div` and `Link` elements
 * representing the auction information, an additional `div` element displaying the
 * auction actions, and finally a closing `div` element } an HTML container displaying
 * information about a specific auction.
 * 
 * 	* `className`: The className of the div element that wraps the auction display.
 * 	* `<div className="flex w-full mb-8 items-center">`: A flexbox container with a
 * class of "items-center" and margin of 8 pixels in the vertical direction.
 * 	* `<div className="flex flex-grow flex-col items-start justify-center">`: A flexbox
 * container with a class of "justify-center" and a flex grow value of 1.
 * 	* `<div>{auction.ended ? t("AUCTION.WINNING_BID") : t("AUCTION.CURRENT_BID")}</div>`:
 * The current bid amount displayed in the auction, with the text for the "Winning
 * Bid" or "Current Bid" depending on whether the auction has ended.
 * 	* `<div className="font-semibold">{auction.amountDisplay} {chain?.nativeCurrency.symbol}</div>`:
 * The current bid amount displayed in a font-semibold style, with the currency symbol
 * for the auction house's native currency.
 * 	* `<div className="divider h-20 divider-horizontal" />`: A horizontal divider
 * with a height of 20 pixels and a class of "divider-horizontal".
 * 	* `<divClassName="flex flex-grow flex-col items-start justify-center">`: Another
 * flexbox container with a class of "justify-center" and a flex grow value of 1.
 * 	* {auction.ended ? (...)}: The content to display when the auction has ended,
 * including the winner's information or the time left in the auction.
 * 	* <AuctionActions auction={auction} buttonClasses="btn-primary btn-outline
 * btn-block">: An action menu for bidders with a class of "btn-primary btn-outline
 * btn-block".
 * 	* <AuctionSummary auction={auction}>: A summary of the auction details.
 * 	* <AuctionBids auction={auction} />: The list of bids placed in the auction.
 * 
 * 	Overall, the output of `WithinTagAuctionDisplay` is a component that displays
 * information about an auction, including the current bid amount, time left in the
 * auction, and winner's information if applicable, along with action menus and
 * summaries for bidders.
 */
const WithinTagAuctionDisplay = () => {
  const { t } = useTranslation("common");
  const { auction } = useAuction();
  const { maxAuctionId } = useAuctionHouse();

  if (!auction) {
    // If auction is null, return null or handle it as per your requirement
    return null;
  }

  const chain = useCurrentChain();
  return (
    <>
      <div className="flex w-full mb-8 items-center">
        <div className="flex flex-grow flex-col items-start justify-center">
          <div>{auction.ended ? t("AUCTION.WINNING_BID") : t("AUCTION.CURRENT_BID")}</div>
          <div className="font-semibold">
            {auction.amountDisplay} {chain?.nativeCurrency.symbol}
          </div>
        </div>
        <div className="divider h-20 divider-horizontal" />
        <div className="flex flex-grow flex-col items-start justify-center">
          {auction.ended ? (
            auction.settled ? (
              // Auction has ended and is settled, show "Held by / Owner"
              <>
                <div>{t("tag-owner")}</div>
                <div className="font-semibold">
                  <Link href={`/owners/${auction.tag.owner.id}`} legacyBehavior>
                    {Truncate(auction.tag.owner.id, 14, "middle")}
                  </Link>
                </div>
              </>
            ) : (
              // Auction has ended but is not settled, show "Winner"
              <>
                <div>{t("AUCTION.WINNER")}</div>
                <div className="font-semibold">{Truncate(auction.bidder.id, 14, "middle")}</div>
              </>
            )
          ) : (
            <>
              <div>{t("AUCTION.TIME_LEFT")}</div>
              <div className="font-semibold">
                <AuctionTimer auction={auction} />
              </div>
            </>
          )}
        </div>
      </div>

      <AuctionActions auction={auction} buttonClasses="btn-primary btn-outline btn-block" />
      <AuctionSummary auction={auction} />
      <AuctionBids auction={auction} />

      {/* <AuctionDebug /> */}
    </>
  );
};

export default WithinTagAuctionDisplay;
