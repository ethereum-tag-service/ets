/**
 * The BlockchainService class encapsulates interactions with the blockchain, particularly
 * focusing on operations related to the ETS Auction House and Access Controls. It utilizes ethers.js
 * for blockchain interactions and the DefenderRelaySigner for transactions when deployed as an
 * OpenZeppelin Defender Autotask.
 */
import { ethers } from "ethers";
import { DefenderRelaySigner } from "@openzeppelin/defender-sdk-relay-signer-client/lib/ethers/signer";
import { etsAuctionHouseConfig, etsAccessControlsConfig } from "../contracts";
import { TagService } from "./tagService";

// ABI and contract addresses for the ETS Auction House and Access Controls, assuming these are correctly defined in your contracts configurations.
const { abi: accessControlsAbi, address: accessControlsAddress } = etsAccessControlsConfig;
const { abi: auctionHouseAbi, address: auctionHouseAddress } = etsAuctionHouseConfig;

export class BlockchainService {
  private signer: ethers.Signer | DefenderRelaySigner; // Signer used for blockchain transactions.
  private accessControlsContract: ethers.Contract; // Contract instance for Access Controls.
  private auctionHouseContract: ethers.Contract; // Contract instance for the Auction House.

  /**
   * Constructs a new BlockchainService instance.
   * @param signer An ethers.Signer or DefenderRelaySigner used for signing transactions.
   */
  constructor(signer: ethers.Signer | DefenderRelaySigner) {
    this.signer = signer as ethers.Signer;
    this.accessControlsContract = new ethers.Contract(accessControlsAddress, accessControlsAbi, this.signer);
    this.auctionHouseContract = new ethers.Contract(auctionHouseAddress, auctionHouseAbi, this.signer);
  }

  /**
   * Retrieves the platform address from the Access Controls contract.
   * @returns A promise that resolves to the platform address in lowercase.
   */
  public async getPlatformAddress(): Promise<string> {
    const platformAddress = await this.accessControlsContract.getPlatformAddress();
    return platformAddress.toLowerCase();
  }

  /**
   * Fetches the ID of the last auction from the Auction House contract.
   * @returns A promise that resolves to the ID of the last auction as a bigint.
   */
  public async getLastAuctionId(): Promise<bigint> {
    const lastAuctionId = await this.auctionHouseContract.getTotalCount();
    return lastAuctionId;
  }

  /**
   * Retrieves the token ID of a specific auction by its ID.
   * @param auctionId The ID of the auction.
   * @returns A promise that resolves to the token ID of the auction as a bigint.
   */
  public async getAuctionedTokenId(auctionId: bigint): Promise<bigint> {
    const auction = await this.auctionHouseContract.getAuction(auctionId);
    return auction.tokenId;
  }

  /**
   * Handles the RequestCreateAuction event by selecting the next tag to be auctioned and
   * creating an auction for it on the blockchain.
   */
  public async handleRequestCreateAuctionEvent() {
    try {
      const platformAccount = await this.getPlatformAddress();
      const lastAuctionId = await this.getLastAuctionId();
      const lastAuctionTokenId = (await this.getAuctionedTokenId(lastAuctionId)).toString();
      const tagService = new TagService(); // Instantiate TagService for determining the next tag.
      const tokenId = await tagService.findNextCTAG(platformAccount, lastAuctionTokenId);

      const tx = await this.auctionHouseContract.fulfillRequestCreateAuction(BigInt(tokenId));
      const receipt = await tx.wait();
      console.log(`Next token successfully released. Txn Hash: ${receipt.transactionHash}`);
    } catch (error) {
      console.error("An unexpected error occurred: ", error);
    }
  }

  /**
   * Starts listening for RequestCreateAuction events from the Auction House contract and
   * processes them by triggering handleRequestCreateAuctionEvent.
   */
  public async watchRequestCreateAuction() {
    console.log("***** Local auction oracle started *****");
    console.log("Listening for RequestCreateAuction event...");

    this.auctionHouseContract.on("RequestCreateAuction", async (...args) => {
      console.log("RequestCreateAuction event detected:", args);
      await this.handleRequestCreateAuctionEvent();
    });

    // Defines a function to stop listening to events, intended for cleanup.
    const stopListening = () => {
      this.auctionHouseContract.removeAllListeners("RequestCreateAuction");
      console.log("Stopped listening to RequestCreateAuction events.");
    };

    // Attaches stopListening to the SIGINT event for graceful shutdown.
    process.on("SIGINT", () => {
      stopListening();
      console.log("Cleanup complete. Exiting now.");
      process.exit();
    });
  }
}
