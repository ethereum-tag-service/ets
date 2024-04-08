import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { useAuctionHouse } from "@app/hooks/useAuctionHouse";
import AuctionDebug from "@app/components/auction/AuctionDebug";
import { useAuction } from "@app/hooks/useAuctionContext";
//import { Auction } from "@app/types/auction";
import { TagGraphic } from "@app/components/TagGraphic";
import AuctionNavigation from "@app/components/auction/AuctionNavigation";
import AuctionActions from "@app/components/auction/AuctionActions";
import AuctionTimer from "@app/components/auction/AuctionTimer";
import AuctionSummary from "@app/components/auction/AuctionSummary";
import AuctionBids from "@app/components/auction/AuctionBids";
import { Truncate } from "@app/components/Truncate";

import TransactionDebug from "@app/components/transaction/shared/TransactionDebug";

const AuctionDisplay = () => {
  const { t } = useTranslation("common");
  const { auction } = useAuction();
  const { maxAuctionId } = useAuctionHouse();

  if (!auction) {
    // If auction is null, return null or handle it as per your requirement
    return null;
  }

  const isFirstAuction = auction.id == 1 ? true : false;
  const isLastAuction = auction.id == maxAuctionId ? true : false;
  const tagGraphic = auction && <TagGraphic tag={auction.tag} />;
  return (
    <>
      <AuctionNavigation
        onDisplayAuctionId={auction.id}
        isFirstAuction={isFirstAuction}
        isLastAuction={isLastAuction}
      />
      <section className="col-span-12 xl:col-span-6">
        <div>
          <TransactionDebug />
        </div>
      </section>

      <section className="col-span-12 overflow-hidden xl:col-span-6">
        <div className="card bg-base-100 shadow-sm w-full">
          <div className="card-body">
            <h1 className="text-4xl font-extrabold">{auction.tag.display}</h1>
            <div className="flex w-full mb-8 items-center">
              <div className="flex flex-grow flex-col items-start justify-center">
                <div>{auction.ended ? t("AUCTION.WINNING_BID") : t("AUCTION.CURRENT_BID")}</div>
                <div className="text-2xl font-semibold">{auction.amountDisplay} MATIC</div>
              </div>
              <div className="divider h-20 divider-horizontal" />
              <div className="flex flex-grow flex-col items-start justify-center">
                {auction.ended ? (
                  auction.settled ? (
                    // Auction has ended and is settled, show "Held by / Owner"
                    <>
                      <div>{t("tag-owner")}</div>
                      <div className="text-2xl font-semibold">
                        <Link href={`/owners/${auction.tag.owner.id}`} legacyBehavior>
                          {Truncate(auction.tag.owner.id, 14, "middle")}
                        </Link>
                      </div>
                    </>
                  ) : (
                    // Auction has ended but is not settled, show "Winner"
                    <>
                      <div>{t("AUCTION.WINNER")}</div>
                      <div className="text-2xl font-semibold">{Truncate(auction.bidder.id, 14, "middle")}</div>
                    </>
                  )
                ) : (
                  <AuctionTimer auction={auction} />
                )}
              </div>
            </div>

            <AuctionActions auction={auction} />
            <AuctionSummary auction={auction} />
            <AuctionBids auction={auction} />
          </div>
        </div>
      </section>
      <AuctionDebug />
    </>
  );
};

export default AuctionDisplay;
