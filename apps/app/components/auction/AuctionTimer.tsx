import { useAuction } from "@app/hooks/useAuctionContext";
import { useSystem } from "@app/hooks/useSystem";
import type { Auction } from "@app/types/auction";
import useTranslation from "next-translate/useTranslation";
import type React from "react";
import { useEffect, useState } from "react";

interface AuctionTimerProps {
  auction: Auction;
}

const AuctionTimer: React.FC<AuctionTimerProps> = ({ auction }) => {
  const { t } = useTranslation("common");
  const { blockchainTime } = useSystem();
  const { endAuction, setAuctionEndTimeUI } = useAuction();
  const [timeLeft, setTimeLeft] = useState<number>(auction.endTime - blockchainTime());

  useEffect(() => {
    const interval: number = 1000; // Set interval to 1 second
    let timer: Timer; // Declare timer variable for setInterval

    const updateTimer = (): void => {
      const currentTime: number = blockchainTime();
      const hasStarted: boolean = auction.startTime > 0 && currentTime >= auction.startTime;
      const hasEnded: boolean = auction.endTime > 0 && currentTime > auction.endTime;

      if (hasStarted && !hasEnded) {
        setTimeLeft(auction.endTime - currentTime);
      } else if (hasEnded) {
        setTimeLeft(0);
        clearInterval(timer); // Now the timer is recognized correctly
        if (!auction.ended) {
          console.info(`Calling endAuction for Auction ID: ${auction.id}`);
          endAuction(auction.id);
          setAuctionEndTimeUI(currentTime);
        }
      }
    };

    if (!auction.ended) {
      timer = setInterval(updateTimer, interval); // Assign setInterval to timer
      updateTimer(); // Update immediately upon mounting
    }

    return () => clearInterval(timer); // Clean up the interval on component unmount
  }, [auction, endAuction, setAuctionEndTimeUI, blockchainTime]);

  const formatTimeLeft = (seconds: number): string => {
    const hours: number = Math.floor(seconds / 3600);
    const minutes: number = Math.floor((seconds % 3600) / 60);
    const remainingSeconds: number = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div>
      {auction.startTime === 0 ? (
        <div>{t("AUCTION.BID_TO_START")}</div>
      ) : auction.ended ? (
        <div>{t("AUCTION.ENDED")}</div>
      ) : (
        <div>{formatTimeLeft(timeLeft)}</div>
      )}
    </div>
  );
};

export default AuctionTimer;
