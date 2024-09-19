import { etsAccessControlsConfig, etsAuctionHouseConfig } from "@ethereum-tag-service/contracts/contracts";
import type { DefenderRelaySigner } from "@openzeppelin/defender-sdk-relay-signer-client/lib/ethers/signer";
import { ethers } from "ethers";
import { TagService } from "./tagService";

export class BlockchainService {
  private signer: ethers.Signer | DefenderRelaySigner;
  private accessControlsContract: ethers.Contract;
  private auctionHouseContract: ethers.Contract;
  private chainId: number;

  constructor(signer: ethers.Signer | DefenderRelaySigner, chainId: number) {
    this.signer = signer as ethers.Signer;
    this.chainId = chainId;

    const accessControlsAddress =
      etsAccessControlsConfig.address[this.chainId as keyof typeof etsAccessControlsConfig.address];
    const auctionHouseAddress =
      etsAuctionHouseConfig.address[this.chainId as keyof typeof etsAuctionHouseConfig.address];

    this.accessControlsContract = new ethers.Contract(accessControlsAddress, etsAccessControlsConfig.abi, this.signer);
    this.auctionHouseContract = new ethers.Contract(auctionHouseAddress, etsAuctionHouseConfig.abi, this.signer);
  }

  public async getPlatformAddress(): Promise<string> {
    try {
      const platformAddress = await this.accessControlsContract.getPlatformAddress();
      console.info(`Retrieved platform address: ${platformAddress}`);
      return platformAddress.toLowerCase();
    } catch (error) {
      console.error("Error getting platform address:", error instanceof Error ? error.message : String(error));
      throw new Error("Failed to get platform address");
    }
  }

  public async getLastAuctionId(): Promise<bigint> {
    try {
      const lastAuctionId = await this.auctionHouseContract.getTotalCount();
      console.info(`Retrieved last auction ID: ${lastAuctionId}`);
      return lastAuctionId;
    } catch (error) {
      console.error("Error getting last auction ID:", error instanceof Error ? error.message : String(error));
      throw new Error("Failed to get last auction ID");
    }
  }

  public async getAuctionedTokenId(auctionId: bigint): Promise<bigint> {
    try {
      const auction = await this.auctionHouseContract.getAuction(auctionId);
      console.info(`Retrieved auctioned token ID for auction ${auctionId}: ${auction.tokenId}`);
      return auction.tokenId;
    } catch (error) {
      console.error(
        `Error getting auctioned token ID for auction ${auctionId}:`,
        error instanceof Error ? error.message : String(error),
      );
      throw new Error(`Failed to get auctioned token ID for auction ${auctionId}`);
    }
  }

  public async handleRequestCreateAuctionEvent() {
    try {
      console.info("Handling RequestCreateAuction event");
      const activeAuctionsCount = await this.auctionHouseContract.getActiveCount();
      const maxAuctions = await this.auctionHouseContract.maxAuctions();
      console.info(`Active auctions: ${activeAuctionsCount}, Max auctions: ${maxAuctions}`);

      if (activeAuctionsCount < maxAuctions) {
        console.info("Open slot available for new auction. Proceeding to create auction.");
        const platformAddress = await this.getPlatformAddress();
        console.info(`Using platform address: ${platformAddress}`);

        const tagService = new TagService();
        console.info("Calling findNextCTAG...");
        const tokenId = await tagService.findNextCTAG(platformAddress, this.chainId);

        if (!tokenId) {
          console.info("No eligible tag found to create an auction.");
          return;
        }

        console.info(`Next token ID for auction: ${tokenId}`);
        const tx = await this.auctionHouseContract.fulfillRequestCreateAuction(BigInt(tokenId));
        const receipt = await tx.wait();
        console.info(`Next token successfully released. Txn Hash: ${receipt.transactionHash}`);
      } else {
        console.info("No open auction slots available. Skipping auction creation.");
      }
    } catch (error) {
      console.error(
        "Error in handleRequestCreateAuctionEvent:",
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  public async watchRequestCreateAuction() {
    console.info("***** Local auction oracle started *****");
    console.info("Listening for RequestCreateAuction event...");
    console.info(`AuctionHouse contract address: ${this.auctionHouseContract.address}`);

    try {
      const filter = this.auctionHouseContract.filters.RequestCreateAuction();
      console.info("Event filter created:", filter);

      this.auctionHouseContract.on(filter, async (...args) => {
        console.info("RequestCreateAuction event detected:", args);
        await this.handleRequestCreateAuctionEvent();
      });

      console.info("Event listener attached successfully");

      const totalCount = await this.auctionHouseContract.getTotalCount();
      console.info("Current total auction count:", totalCount.toString());
    } catch (error) {
      console.error("Error setting up event listener:", error instanceof Error ? error.message : String(error));
    }

    const stopListening = () => {
      this.auctionHouseContract.removeAllListeners("RequestCreateAuction");
      console.info("Stopped listening to RequestCreateAuction events.");
    };

    process.on("SIGINT", () => {
      stopListening();
      console.info("Cleanup complete. Exiting now.");
      process.exit();
    });
  }
}
