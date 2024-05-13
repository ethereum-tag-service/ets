import type { PublicClient, WalletClient, Hex } from "viem";
import { etsTokenConfig } from "../../contracts/contracts";
import { handleContractRead, handleContractCall } from "../utils";
import { TokenReadFunction, TokenWriteFunction } from "../types";

export class TokenClient {
  private readonly chainId?: number;
  private readonly publicClient: PublicClient;
  private readonly walletClient: WalletClient | undefined;

  constructor({
    chainId,
    publicClient,
    walletClient,
  }: {
    chainId?: number;
    publicClient: PublicClient;
    walletClient?: WalletClient;
  }) {
    this.chainId = chainId;
    this.publicClient = publicClient;
    this.walletClient = walletClient;

    if (!publicClient) {
      throw new Error("Public client is required");
    }
    if (publicClient.chain?.id !== chainId) {
      throw new Error("Provided chain id should match the public client chain id");
    }
    if (walletClient && walletClient.chain?.id !== chainId) {
      throw new Error("Provided chain id should match the wallet client chain id");
    }
  }

  async existingTags(tags: string[]): Promise<string[]> {
    const existingTags = [];
    for (let tag of tags) {
      const exists = await this.tagExistsById(tag);
      if (exists) existingTags.push(tag);
    }
    return existingTags;
  }

  async hasTags(address: `0x${string}` | undefined): Promise<boolean> {
    if (!address || !address.startsWith("0x")) {
      console.error("Invalid address");
      return false;
    }
    const data = await this.readContract("balanceOf", [address]);
    return data > BigInt(0);
  }

  async tagExistsById(tag: string): Promise<boolean> {
    const tagId = await this.computeTagId(tag);
    return this.readContract("tagExistsById", [tagId]);
  }

  async computeTagId(tag: string): Promise<bigint> {
    return this.readContract("computeTagId", [tag]);
  }

  async computeTagIds(tags: string[]): Promise<bigint[]> {
    return Promise.all(tags.map((tag) => this.computeTagId(tag)));
  }

  async balanceOf(owner: Hex): Promise<bigint> {
    return this.readContract("balanceOf", [owner]);
  }

  async getOrCreateTagId(tag: string, relayer: Hex, creator: Hex): Promise<bigint> {
    return this.readContract("getOrCreateTagId", [tag, relayer, creator]);
  }

  async getApproved(tokenId: bigint): Promise<Hex> {
    return this.readContract("getApproved", [tokenId]);
  }

  async getTagById(tokenId: bigint): Promise<any> {
    return this.readContract("getTagById", [tokenId]);
  }

  async getTagByString(tag: string): Promise<any> {
    return this.readContract("getTagByString", [tag]);
  }

  async isApprovedForAll(owner: Hex, operator: Hex): Promise<boolean> {
    return this.readContract("isApprovedForAll", [owner, operator]);
  }

  async ownerOf(tokenId: bigint): Promise<Hex> {
    return this.readContract("ownerOf", [tokenId]);
  }

  async getOwnershipTermLength(): Promise<bigint> {
    return this.readContract("getOwnershipTermLength", []);
  }

  async tagOwnershipTermExpired(tokenId: bigint): Promise<boolean> {
    return this.readContract("tagOwnershipTermExpired", [tokenId]);
  }

  async tagMaxStringLength(): Promise<bigint> {
    return this.readContract("tagMaxStringLength", []);
  }

  async tagMinStringLength(): Promise<bigint> {
    return this.readContract("tagMinStringLength", []);
  }

  async supportsInterface(interfaceId: Hex): Promise<boolean> {
    return this.readContract("supportsInterface", [interfaceId]);
  }

  async symbol(): Promise<string> {
    return this.readContract("symbol", []);
  }

  async transferFrom(from: Hex, to: Hex, tokenId: bigint): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("transferFrom", [from, to, tokenId]);
  }

  async recycleTag(tokenId: bigint): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("recycleTag", [tokenId]);
  }

  async renewTag(tokenId: bigint): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("renewTag", [tokenId]);
  }

  async safeTransferFrom(
    from: Hex,
    to: Hex,
    tokenId: bigint,
    data?: Hex,
  ): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("safeTransferFrom", [from, to, tokenId, data]);
  }

  private async readContract(functionName: TokenReadFunction, args: any = []): Promise<any> {
    return handleContractRead(this.publicClient, etsTokenConfig.address, etsTokenConfig.abi, functionName, args);
  }

  private async callContract(
    functionName: TokenWriteFunction,
    args: any = [],
  ): Promise<{ transactionHash: string; status: number }> {
    if (!this.walletClient) {
      throw new Error("Wallet client is required to perform this action");
    }
    return handleContractCall(
      this.publicClient,
      this.walletClient,
      etsTokenConfig.address,
      etsTokenConfig.abi,
      functionName,
      args,
    );
  }
}