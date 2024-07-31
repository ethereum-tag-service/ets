import { PublicClient, WalletClient, Hex } from "viem";
import { handleContractCall } from "../utils/handleContractCall";
import { handleContractRead } from "../utils/handleContractRead";
import { AuctionHouseReadFunction, AuctionHouseWriteFunction } from "../types";
import { getConfig } from "../contracts/config";
import { validateConfig } from "../utils/validateConfig";

export class AuctionHouseClient {
  private readonly publicClient: PublicClient;
  private readonly walletClient: WalletClient | undefined;
  private readonly etsAuctionHouseConfig: { address: Hex; abi: any };

  constructor({
    publicClient,
    walletClient,
    chainId,
  }: {
    publicClient: PublicClient;
    walletClient?: WalletClient;
    chainId?: number;
  }) {
    this.publicClient = publicClient;
    this.walletClient = walletClient;
    validateConfig(chainId, publicClient, walletClient);

    const config = getConfig(chainId);
    if (!config) throw new Error("Configuration could not be retrieved");

    this.etsAuctionHouseConfig = config.etsAuctionHouseConfig;
  }

  private async readContract(functionName: AuctionHouseReadFunction, args: any[] = []): Promise<any> {
    return handleContractRead(
      this.publicClient,
      this.etsAuctionHouseConfig.address,
      this.etsAuctionHouseConfig.abi,
      functionName,
      args,
    );
  }

  private async callContract(
    functionName: AuctionHouseWriteFunction,
    args: any[] = [],
    value?: bigint,
  ): Promise<{ transactionHash: string; status: number }> {
    if (!this.walletClient) {
      throw new Error("Wallet client is required to perform this action");
    }
    return handleContractCall(
      this.publicClient,
      this.walletClient,
      this.etsAuctionHouseConfig.address,
      this.etsAuctionHouseConfig.abi,
      functionName,
      args,
      value,
    );
  }

  // State-changing functions
  async createBid(auctionId: bigint, value?: bigint): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("createBid", [auctionId], value);
  }

  async createNextAuction(): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("createNextAuction", []);
  }

  async drawDown(account: string): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("drawDown", [account]);
  }

  async settleAuction(auctionId: bigint): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("settleAuction", [auctionId]);
  }

  async settleCurrentAndCreateNewAuction(auctionId: bigint): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("settleCurrentAndCreateNewAuction", [auctionId]);
  }

  // Read-only functions
  async getAuction(auctionId: bigint): Promise<any> {
    return this.readContract("getAuction", [auctionId]);
  }

  async auctionExists(auctionId: bigint): Promise<boolean> {
    return this.readContract("auctionExists", [auctionId]);
  }

  async getActiveCount(): Promise<bigint> {
    return this.readContract("getActiveCount", []);
  }

  async getAuctionCountForTokenId(tokenId: bigint): Promise<bigint> {
    return this.readContract("getAuctionCountForTokenId", [tokenId]);
  }

  async getAuctionForTokenId(tokenId: bigint): Promise<any> {
    return this.readContract("getAuctionForTokenId", [tokenId]);
  }

  async getBalance(): Promise<bigint> {
    return this.readContract("getBalance", []);
  }

  async getTotalCount(): Promise<bigint> {
    return this.readContract("getTotalCount", []);
  }

  async paused(): Promise<boolean> {
    return this.readContract("paused", []);
  }

  async accrued(address: string): Promise<bigint> {
    return this.readContract("accrued", [address]);
  }

  async auctionEnded(auctionId: bigint): Promise<boolean> {
    return this.readContract("auctionEnded", [auctionId]);
  }

  async auctionExistsForTokenId(tokenId: bigint): Promise<boolean> {
    return this.readContract("auctionExistsForTokenId", [tokenId]);
  }

  async auctionSettled(auctionId: bigint): Promise<boolean> {
    return this.readContract("auctionSettled", [auctionId]);
  }

  async auctions(index: bigint): Promise<any> {
    return this.readContract("auctions", [index]);
  }

  async auctionsByTokenId(tokenId: bigint, index: bigint): Promise<bigint> {
    return this.readContract("auctionsByTokenId", [tokenId, index]);
  }

  async creatorPercentage(): Promise<bigint> {
    return this.readContract("creatorPercentage", []);
  }

  async duration(): Promise<bigint> {
    return this.readContract("duration", []);
  }

  async etsAccessControls(): Promise<string> {
    return this.readContract("etsAccessControls", []);
  }

  async etsToken(): Promise<string> {
    return this.readContract("etsToken", []);
  }

  async maxAuctions(): Promise<bigint> {
    return this.readContract("maxAuctions", []);
  }

  async minBidIncrementPercentage(): Promise<number> {
    return this.readContract("minBidIncrementPercentage", []);
  }

  async paid(address: string): Promise<bigint> {
    return this.readContract("paid", [address]);
  }

  async platformPercentage(): Promise<bigint> {
    return this.readContract("platformPercentage", []);
  }

  async relayerPercentage(): Promise<bigint> {
    return this.readContract("relayerPercentage", []);
  }

  async reservePrice(): Promise<bigint> {
    return this.readContract("reservePrice", []);
  }

  async timeBuffer(): Promise<bigint> {
    return this.readContract("timeBuffer", []);
  }

  async totalDue(address: string): Promise<bigint> {
    return this.readContract("totalDue", [address]);
  }
}
