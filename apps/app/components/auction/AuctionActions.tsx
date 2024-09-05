import ConnectButtonETS from "@app/components/ConnectButtonETS";
import { Modal } from "@app/components/Modal";
import TransactionFlowWrapper from "@app/components/transaction/TransactionFlowWrapper";
import type { Auction } from "@app/types/auction";
import { TransactionType } from "@app/types/transaction";
import useTranslation from "next-translate/useTranslation";
import type React from "react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAccount } from "wagmi";
interface AuctionActionsProps {
  auction: Auction;
  buttonClasses?: string;
}

const AuctionActions: React.FC<AuctionActionsProps> = ({ auction, buttonClasses }) => {
  const { t } = useTranslation("common");
  const { isConnected } = useAccount();
  const transactionType = auction.ended ? TransactionType.SettleAuction : TransactionType.Bid;
  const buttonLabel = auction.ended ? t("AUCTION.SETTLE_BUTTON") : t("AUCTION.PLACE_BID_BUTTON");
  const hideButton = auction.ended && auction.settled;
  const visibilityClass = hideButton ? "hidden" : "";
  const extraClasses = buttonClasses ? buttonClasses : "";
  const finalButtonClasses = `${visibilityClass} ${extraClasses}`;
  const [transactionId, setTransactionId] = useState<string>("");

  useEffect(() => {
    console.info(`Auction ${auction.id} Ended Status:`, auction.ended);
    // Generate a new UUID for each new auction or transaction type change
    setTransactionId(uuidv4());
  }, [auction.id, auction.ended]);

  useEffect(() => {
    console.info("Auction updated (Auction Actions):", auction);
  }, [auction]);

  return (
    <div>
      {!isConnected ? (
        <ConnectButtonETS className={finalButtonClasses} />
      ) : (
        <Modal id={`auction-actions-${auction.id}`} label={buttonLabel} buttonClasses={finalButtonClasses}>
          <TransactionFlowWrapper id={transactionId} transactionType={transactionType} />
        </Modal>
      )}
    </div>
  );
};

export default AuctionActions;
