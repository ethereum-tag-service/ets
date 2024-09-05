// context/AuctionHouseContext.ts

/**
 * The AuctionHouseContext provides a React context for auction-related data and operations.
 * It encapsulates state and logic for managing auctions, including fetching current and all auctions,
 * handling bid placement, and dynamically updating auction status based on blockchain events and user navigation.
 *
 * Usage:
 * Wrap your component tree with `<AuctionHouseProvider>` to provide auction context to all child components.
 * Use `useContext(AuctionHouseContext)` to access auction-related data and functions within your components.
 *
 * @module AuctionHouseContext
 */

import { useAuctions } from "@app/hooks/useAuctions";
import type { AuctionHouse } from "@app/types/auction";
import type React from "react";
import { createContext, useEffect, useMemo, useState } from "react";

import {
  fetchAuctionPaused,
  fetchAuctionSettingsData,
  fetchCurrentAuctionId,
  watchAuctionPaused,
  watchAuctionUnpaused,
  watchNewAuctionReleased,
} from "@app/services/auctionHouseService";

// Define the default values and functions
const defaultAuctionHouseContextValue: AuctionHouse = {
  auctionPaused: false,
  maxAuctions: null,
  minIncrementBidPercentage: 0,
  duration: null,
  timeBuffer: 0,
  maxAuctionId: null,
  allAuctions: [], // released and active
  refreshAuctions: async () => undefined, // No-op async function
};
/**
 * Creating a React context for the auction house with undefined initial value.
 */
export const AuctionHouseContext = createContext<AuctionHouse>(defaultAuctionHouseContextValue);

/**
 * Props definition for AuctionHouseProvider component.
 */
type AuctionHouseProviderProps = {
  children: React.ReactNode;
};

/**
 * The AuctionHouseProvider component manages and provides auction house context to its child components.
 * It initializes and updates auction-related data based on user interactions and blockchain events.
 *
 * @param children - The child components of the AuctionHouseProvider.
 */
export const AuctionHouseProvider: React.FC<AuctionHouseProviderProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [auctionPaused, setAuctionPaused] = useState(true);
  const [maxAuctions, setMaxAuctions] = useState<number | null>(null); // Specify the type explicitly
  const [minIncrementBidPercentage, setMinIncrementBidPercentage] = useState<number>(0);
  const [duration, setDuration] = useState<number | null>(null);
  const [timeBuffer, setTimeBuffer] = useState<number>(0);
  const [maxAuctionId, setMaxAuctionId] = useState<number>(0);

  const { auctions: allAuctions, mutate: refreshAuctions } = useAuctions({
    pageSize: 1000, // Adjust pageSize, skip, orderBy, and filter as needed
    skip: 0,
    orderBy: "endTime",
    filter: {}, // Add filter criteria if required
    config: {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 1000,
    },
  });

  useEffect(() => {
    //console.info("AuctionHouseContext: Fetching auction settings and data...");
    fetchAuctionSettings();
    startWatchers();
  }, []); // Empty dependency array ensures this effect runs only once

  const fetchAuctionSettings = async () => {
    try {
      const currentId = await fetchCurrentAuctionId();
      const auctionPaused = await fetchAuctionPaused();
      const auctionSettings = await fetchAuctionSettingsData();
      setMaxAuctionId(currentId);
      setAuctionPaused(auctionPaused);
      setMaxAuctions(auctionSettings.maxAuctions);
      setMinIncrementBidPercentage(auctionSettings.minIncrementBidPercentage);
      setDuration(auctionSettings.duration);
      setTimeBuffer(auctionSettings.timeBuffer);

      //console.info("AuctionHouseContext: Auction settings fetched and state updated.");
    } catch (error) {
      console.error("AuctionHouseContext: Failed to initialize auction data:", error);
    }
  };

  const startWatchers = async () => {
    try {
      const unwatchNewAuction = watchNewAuctionReleased(fetchAuctionSettings);
      const unwatchAuctionPaused = watchAuctionPaused(handleAuctionPauseToggled);
      const unwatchAuctionUnpaused = watchAuctionUnpaused(handleAuctionPauseToggled);

      //console.info("AuctionHouseContext: auction watchers started");

      // Cleanup functions
      return () => {
        unwatchNewAuction();
        unwatchAuctionPaused();
        unwatchAuctionUnpaused();
      };
    } catch (error) {
      console.error("AuctionHouseContext: Failed to initialize auction watchers: ", error);
    }
  };

  // Callback function to handle both auction paused & unpaused events
  const handleAuctionPauseToggled = async () => {
    const auctionPaused = await fetchAuctionPaused();
    setAuctionPaused(auctionPaused);
  };
  // Context value assembled from state and functions.
  const contextValue = useMemo(
    () => ({
      auctionPaused,
      maxAuctions,
      minIncrementBidPercentage,
      duration,
      timeBuffer,
      maxAuctionId,
      allAuctions: allAuctions || [], // Ensure it defaults to []
      refreshAuctions,
    }),
    [
      auctionPaused,
      maxAuctions,
      minIncrementBidPercentage,
      duration,
      timeBuffer,
      maxAuctionId,
      allAuctions,
      refreshAuctions,
    ],
  );

  // Providing the auction house context to child components.
  return <AuctionHouseContext.Provider value={contextValue}>{children}</AuctionHouseContext.Provider>;
};
