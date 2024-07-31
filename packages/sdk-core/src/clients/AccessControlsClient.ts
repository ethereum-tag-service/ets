import { PublicClient, Hex } from "viem";
import { handleContractRead } from "../utils/handleContractRead";
import { AccessControlsReadFunction } from "../types";
import { getConfig } from "../contracts/config";

export class AccessControlsClient {
  private readonly publicClient: PublicClient;
  private readonly etsAccessControlsConfig: { address: Hex; abi: any };

  constructor({ publicClient, chainId }: { publicClient: PublicClient; chainId?: number }) {
    this.publicClient = publicClient;

    this.validateConfig(chainId, publicClient);

    const config = getConfig(chainId);
    if (!config) throw new Error("Configuration could not be retrieved");

    this.etsAccessControlsConfig = config.etsAccessControlsConfig;
  }

  private validateConfig(chainId: number | undefined, publicClient: PublicClient) {
    if (!publicClient) throw new Error("Public client is required");

    if (publicClient.chain?.id !== chainId)
      throw new Error(
        `Provided chain id (${chainId}) should match the public client chain id (${publicClient.chain?.id})`,
      );
  }

  private async readContract(functionName: AccessControlsReadFunction, args: any[] = []): Promise<any> {
    return handleContractRead(
      this.publicClient,
      this.etsAccessControlsConfig.address,
      this.etsAccessControlsConfig.abi,
      functionName,
      args,
    );
  }

  async hasRole(role: string, account: string): Promise<boolean> {
    return this.readContract("hasRole", [role, account]);
  }

  async isAdmin(addr: string): Promise<boolean> {
    return this.readContract("isAdmin", [addr]);
  }

  async isAuctionOracle(addr: string): Promise<boolean> {
    return this.readContract("isAuctionOracle", [addr]);
  }

  async isRelayer(addr: string): Promise<boolean> {
    return this.readContract("isRelayer", [addr]);
  }

  async isRelayerAdmin(addr: string): Promise<boolean> {
    return this.readContract("isRelayerAdmin", [addr]);
  }

  async isRelayerAndNotPaused(addr: string): Promise<boolean> {
    return this.readContract("isRelayerAndNotPaused", [addr]);
  }

  async isRelayerByAddress(addr: string): Promise<boolean> {
    return this.readContract("isRelayerByAddress", [addr]);
  }

  async isRelayerByName(name: string): Promise<boolean> {
    return this.readContract("isRelayerByName", [name]);
  }

  async isRelayerByOwner(addr: string): Promise<boolean> {
    return this.readContract("isRelayerByOwner", [addr]);
  }

  async isRelayerFactory(addr: string): Promise<boolean> {
    return this.readContract("isRelayerFactory", [addr]);
  }

  async isRelayerLocked(addr: string): Promise<boolean> {
    return this.readContract("isRelayerLocked", [addr]);
  }

  async isSmartContract(addr: string): Promise<boolean> {
    return this.readContract("isSmartContract", [addr]);
  }

  async getPlatformAddress(): Promise<string> {
    return this.readContract("getPlatformAddress");
  }

  async getRelayerAddressFromName(name: string): Promise<string> {
    return this.readContract("getRelayerAddressFromName", [name]);
  }

  async getRelayerAddressFromOwner(address: string): Promise<string> {
    return this.readContract("getRelayerAddressFromOwner", [address]);
  }

  async getRelayerNameFromAddress(address: string): Promise<string> {
    return this.readContract("getRelayerNameFromAddress", [address]);
  }

  async getRoleAdmin(role: string): Promise<string> {
    return this.readContract("getRoleAdmin", [role]);
  }

  async relayerContractToName(address: string): Promise<string> {
    return this.readContract("relayerContractToName", [address]);
  }

  async relayerLocked(address: string): Promise<boolean> {
    return this.readContract("relayerLocked", [address]);
  }

  async relayerNameToContract(name: string): Promise<string> {
    return this.readContract("relayerNameToContract", [name]);
  }

  async relayerOwnerToAddress(address: string): Promise<string> {
    return this.readContract("relayerOwnerToAddress", [address]);
  }

  async supportsInterface(interfaceId: string): Promise<boolean> {
    return this.readContract("supportsInterface", [interfaceId]);
  }
}
