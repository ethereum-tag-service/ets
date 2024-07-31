import type { Address, Hex, PublicClient, WalletClient } from "viem";
import { etsABI, etsRelayerV1ABI } from "../contracts/contracts";
import { TokenClient } from "./TokenClient";
import { handleContractCall } from "../utils/handleContractCall";
import { handleContractRead } from "../utils/handleContractRead";
import { RelayerReadFunction, RelayerWriteFunction } from "../types";
import { getConfig } from "../contracts/config";
import { validateConfig } from "../utils/validateConfig";

export class RelayerClient {
  private readonly chainId?: number;
  private readonly publicClient: PublicClient;
  private readonly walletClient?: WalletClient;
  private readonly relayerConfig: { address?: Hex; abi: any };
  private readonly etsConfig: { address?: Hex; abi: any };

  constructor({
    chainId,
    publicClient,
    walletClient,
    relayerAddress,
  }: {
    chainId?: number;
    publicClient: PublicClient;
    walletClient?: WalletClient;
    relayerAddress?: Hex;
  }) {
    this.chainId = chainId;
    this.publicClient = publicClient;
    this.walletClient = walletClient;

    validateConfig(chainId, publicClient, walletClient);
    if (!relayerAddress) throw new Error("Relayer address is required");

    const config = getConfig(chainId, relayerAddress);
    if (!config) throw new Error("Configuration could not be retrieved");

    this.relayerConfig = config.etsRelayerV1Config;
    this.etsConfig = config.etsConfig;
  }

  private async readContract(functionName: RelayerReadFunction, args: any = []): Promise<any> {
    if (!this.relayerConfig.address) {
      throw new Error("Relayer address is required");
    }

    return handleContractRead(
      this.publicClient,
      this.relayerConfig.address,
      this.relayerConfig.abi,
      functionName,
      args,
    );
  }

  private async callContract(
    functionName: RelayerWriteFunction,
    args: any = [],
  ): Promise<{ transactionHash: string; status: number }> {
    if (this.walletClient === undefined) {
      throw new Error("Wallet client is required to perform this action");
    }

    if (!this.relayerConfig.address) {
      throw new Error("Relayer address is required");
    }
    return handleContractCall(
      this.publicClient,
      this.walletClient,
      this.relayerConfig.address,
      this.relayerConfig.abi,
      functionName,
      args,
    );
  }

  async createTags(tags: string[]): Promise<{ transactionHash: string; status: number }> {
    if (this.walletClient === undefined) {
      throw new Error("Wallet client is required to perform this action");
    }

    if (!this.relayerConfig.address) {
      throw new Error("Relayer address is required");
    }

    const etsTokenClient = new TokenClient({
      chainId: this.chainId ?? 0,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
    });

    if (tags.length > 0) {
      const existingTags = await etsTokenClient.existingTags(tags);
      const tagsToMint = tags.filter((tag) => !existingTags.includes(tag));

      if (tagsToMint.length > 0 && this.relayerConfig.address) {
        try {
          const { request } = await this.publicClient.simulateContract({
            address: this.relayerConfig.address,
            abi: this.relayerConfig.abi,
            functionName: "getOrCreateTagIds",
            args: [tagsToMint],
            account: this.walletClient.account,
          });

          const hash = await this.walletClient.writeContract(request);

          const receipt = await this.publicClient.waitForTransactionReceipt({
            hash,
          });

          return {
            status: receipt.status,
            transactionHash: receipt.transactionHash,
          };
        } catch (error) {
          console.error("Error minting tags:", error);
          throw error;
        }
      }
    }

    return { transactionHash: "", status: 0 };
  }

  async createTaggingRecord(
    tagIds: string[],
    targetId: string,
    recordType: string,
    signerAddress?: Hex,
  ): Promise<{ transactionHash: `0x${string}`; status: any; taggingRecordId: string }> {
    if (this.relayerConfig.address === undefined) {
      throw new Error("Relayer address is required");
    }
    if (this.walletClient === undefined) {
      throw new Error("Wallet client is required to perform this action");
    }

    try {
      const tagParams = {
        targetURI: targetId,
        tagStrings: tagIds,
        recordType: recordType,
        enrich: false,
      };

      const [fee, actualTagCount] = await this.computeTaggingFee(tagParams, 0);

      const { request } = await this.publicClient.simulateContract({
        address: this.relayerConfig.address,
        abi: etsRelayerV1ABI,
        functionName: "applyTags",
        args: [[tagParams]],
        value: fee,
        account: this.walletClient.account,
      });

      const transactionHash = await this.walletClient.writeContract(request);

      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash: transactionHash,
      });

      if (this.etsConfig.address === undefined) {
        throw new Error("Ets address is required");
      }

      const taggingRecordId = await this.publicClient.readContract({
        address: this.etsConfig.address,
        abi: etsABI,
        functionName: "computeTaggingRecordIdFromRawInput",
        args: [tagParams, this.relayerConfig.address, signerAddress || "0x0"],
      });

      return {
        transactionHash,
        status: receipt.status,
        taggingRecordId: String(taggingRecordId),
      };
    } catch (error) {
      console.error("Error creating tagging record:", error);
      throw error;
    }
  }

  async pause(): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("pause");
  }

  async unpause(): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("unpause");
  }

  async changeOwner(newOwner: Address): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("changeOwner", [newOwner]);
  }

  async transferOwnership(newOwner: Address): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("transferOwnership", [newOwner]);
  }

  async getOrCreateTags(tags: string[]): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("getOrCreateTags", [tags]);
  }

  async applyTags(
    tags: string[],
    targetURI: string,
    recordType: string,
  ): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("applyTags", [
      {
        targetURI,
        tagStrings: tags,
        recordType,
      },
    ]);
  }

  async removeTags(
    tags: string[],
    targetURI: string,
    recordType: string,
  ): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("removeTags", [
      {
        targetURI,
        tagStrings: tags,
        recordType,
      },
    ]);
  }

  async replaceTags(
    tags: string[],
    targetURI: string,
    recordType: string,
  ): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("replaceTags", [
      {
        targetURI,
        tagStrings: tags,
        recordType,
      },
    ]);
  }

  // Additional utility and getter functions for the contract
  async owner(): Promise<Address> {
    return this.readContract("owner", []);
  }

  async paused(): Promise<boolean> {
    return this.readContract("paused", []);
  }

  async creator(): Promise<string> {
    return this.readContract("creator", []);
  }

  async ets(): Promise<string> {
    return this.readContract("ets", []);
  }

  async etsAccessControls(): Promise<string> {
    return this.readContract("etsAccessControls", []);
  }

  async etsTarget(): Promise<string> {
    return this.readContract("etsTarget", []);
  }

  async etsToken(): Promise<string> {
    return this.readContract("etsToken", []);
  }

  async getBalance(): Promise<number> {
    return this.readContract("getBalance", []);
  }

  async getRelayerName(): Promise<string> {
    return this.readContract("getRelayerName", []);
  }

  async renounceOwnership(): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("renounceOwnership", []);
  }

  async computeTaggingFee(tagParams: any, value: number): Promise<[bigint, bigint]> {
    return this.readContract("computeTaggingFee", [tagParams, value]);
  }

  async supportsInterface(interfaceId: string): Promise<boolean> {
    return this.readContract("supportsInterface", [interfaceId]);
  }

  async version(): Promise<string> {
    return this.readContract("version", []);
  }
}
