import { PublicClient, WalletClient, Hex } from "viem";
import { handleContractCall } from "../utils/handleContractCall";
import { handleContractRead } from "../utils/handleContractRead";
import { RelayerFactoryReadFunction, RelayerFactoryWriteFunction } from "../types";
import { getConfig } from "../contracts/config";
import { validateConfig } from "../utils/validateConfig";

export class RelayerFactoryClient {
  private readonly publicClient: PublicClient;
  private readonly walletClient: WalletClient | undefined;
  private readonly etsRelayerFactoryConfig: { address: Hex; abi: any };

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

    this.etsRelayerFactoryConfig = config.etsRelayerFactoryConfig;
  }

  private async readContract(functionName: RelayerFactoryReadFunction, args: any[] = []): Promise<any> {
    return handleContractRead(
      this.publicClient,
      this.etsRelayerFactoryConfig.address,
      this.etsRelayerFactoryConfig.abi,
      functionName,
      args,
    );
  }

  private async callContract(
    functionName: RelayerFactoryWriteFunction,
    args: any[] = [],
  ): Promise<{ transactionHash: string; status: number }> {
    if (!this.walletClient) {
      throw new Error("Wallet client is required to perform this action");
    }
    return handleContractCall(
      this.publicClient,
      this.walletClient,
      this.etsRelayerFactoryConfig.address,
      this.etsRelayerFactoryConfig.abi,
      functionName,
      args,
    );
  }

  async addRelayer(relayerName: string): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("addRelayer", [relayerName]);
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
}
