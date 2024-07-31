import { PublicClient, WalletClient, Hex } from "viem";
import { handleContractCall } from "../utils/handleContractCall";
import { handleContractRead } from "../utils/handleContractRead";
import { TargetReadFunction, TargetWriteFunction } from "../types";
import { getConfig } from "../contracts/config";
import { validateConfig } from "../utils/validateConfig";

export class TargetClient {
  private readonly publicClient: PublicClient;
  private readonly walletClient: WalletClient | undefined;
  private readonly etsTargetConfig: { address: Hex; abi: any };

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

    const config = getConfig(chainId);
    if (!config) throw new Error("Configuration could not be retrieved");

    validateConfig(chainId, publicClient, walletClient);

    this.etsTargetConfig = config.etsTargetConfig;
  }

  private async readContract(functionName: TargetReadFunction, args: any[] = []): Promise<any> {
    return handleContractRead(
      this.publicClient,
      this.etsTargetConfig.address,
      this.etsTargetConfig.abi,
      functionName,
      args,
    );
  }

  private async callContract(
    functionName: TargetWriteFunction,
    args: any[] = [],
  ): Promise<{ transactionHash: string; status: number }> {
    if (!this.walletClient) {
      throw new Error("Wallet client is required to perform this action");
    }
    return handleContractCall(
      this.publicClient,
      this.walletClient,
      this.etsTargetConfig.address,
      this.etsTargetConfig.abi,
      functionName,
      args,
    );
  }

  async getTargetById(targetId: bigint): Promise<any> {
    return this.readContract("getTargetById", [targetId]);
  }

  async getTargetByURI(targetURI: string): Promise<any> {
    return this.readContract("getTargetByURI", [targetURI]);
  }

  async targetExistsById(targetId: bigint): Promise<boolean> {
    return this.readContract("targetExistsById", [targetId]);
  }

  async targetExistsByURI(targetURI: string): Promise<boolean> {
    return this.readContract("targetExistsByURI", [targetURI]);
  }

  async etsAccessControls(): Promise<string> {
    return this.readContract("etsAccessControls", []);
  }

  async etsEnrichTarget(): Promise<string> {
    return this.readContract("etsEnrichTarget", []);
  }

  async getName(targetId: bigint): Promise<string> {
    return this.readContract("getName", [targetId]);
  }

  async targets(index: bigint): Promise<any> {
    return this.readContract("targets", [index]);
  }

  async computeTargetId(targetURI: string): Promise<bigint> {
    return this.readContract("computeTargetId", [targetURI]);
  }

  async createTarget(targetURI: string): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("createTarget", [targetURI]);
  }

  async updateTarget(
    targetId: bigint,
    targetURI: string,
    enriched: number,
    httpStatus: number,
    ipfsHash: string,
  ): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("updateTarget", [targetId, targetURI, enriched, httpStatus, ipfsHash]);
  }

  async getOrCreateTargetId(targetURI: string): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("getOrCreateTargetId", [targetURI]);
  }
}
