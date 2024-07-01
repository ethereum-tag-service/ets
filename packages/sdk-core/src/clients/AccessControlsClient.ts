import { PublicClient, Hex } from "viem";
import { handleContractRead } from "../utils/handleContractRead";
import { AccessControlsReadFunction } from "../types";
import { getConfig } from "../contracts/config";

export class AccessControlsClient {
  private readonly publicClient: PublicClient;
  private readonly etsAccessControlsConfig: { address: Hex; abi: any };

  /**
   * @description Sets properties `publicClient` and `chainId`, validates configuration
   * for ETS Access Controls, and initializes the `etsAccessControlsConfig` property
   * with retrieved configuration.
   * 
   * @param { PublicClient } .publicClient - PublicClient object, which provides access
   * to the Ethereum network and is used by the function to validate configuration.
   * 
   * @param { number } .chainId - Chain ID that is used to retrieve configuration
   * information for the ETS Access Controls.
   */
  constructor({ publicClient, chainId }: { publicClient: PublicClient; chainId?: number }) {
    this.publicClient = publicClient;

    this.validateConfig(chainId, publicClient);

    const config = getConfig(chainId);
    if (!config) throw new Error("Configuration could not be retrieved");

    this.etsAccessControlsConfig = config.etsAccessControlsConfig;
  }

  /**
   * @description Verifies if a valid public client is provided and ensures that the
   * chain ID in the public client matches the one passed as an argument.
   * 
   * @param { number | undefined } chainId - identifier of the blockchain associated
   * with the public client, which is verified to match the value specified in the
   * `publicClient` object.
   * 
   * @param { PublicClient } publicClient - PublicClient object, which is required for
   * validation.
   */
  private validateConfig(chainId: number | undefined, publicClient: PublicClient) {
    if (!publicClient) throw new Error("Public client is required");

    if (publicClient.chain?.id !== chainId)
      throw new Error(
        `Provided chain id (${chainId}) should match the public client chain id (${publicClient.chain?.id})`,
      );
  }

  /**
   * @description Handles read operations for a smart contract, invoking the
   * `handleContractRead()` method to perform the actual read operation based on the
   * provided function name and arguments.
   * 
   * @param { AccessControlsReadFunction } functionName - name of the Ethereum contract
   * function to call the method on, and it is used to specify the function to execute
   * within the contract.
   * 
   * @param { any[] } args - 1-2 arguments to pass through to the `handleContractRead()`
   * method.
   * 
   * @returns { Promise<any> } the result of calling the `handleContractRead` function
   * with the provided parameters.
   */
  private async readContract(functionName: AccessControlsReadFunction, args: any[] = []): Promise<any> {
    return handleContractRead(
      this.publicClient,
      this.etsAccessControlsConfig.address,
      this.etsAccessControlsConfig.abi,
      functionName,
      args,
    );
  }

  /**
   * @description Async queries the roles of an account in a blockchain contract. It
   * takes a role string and an account string as inputs, returning a Promise of a
   * boolean value indicating if the given account has the specified role.
   * 
   * @param { string } role - Role that is being checked for possession by the specified
   * `account`.
   * 
   * @param { string } account - account for which the role is being checked.
   * 
   * @returns { Promise<boolean> } a boolean value indicating whether the specified
   * role is held by the given account.
   */
  async hasRole(role: string, account: string): Promise<boolean> {
    return this.readContract("hasRole", [role, account]);
  }

  /**
   * @description Retrieves the isAdmin value for a given address from the contract's
   * view functions and returns a Promise representing the result.
   * 
   * @param { string } addr - ether address of a contract to check if it has been
   * assigned an admin role.
   * 
   * @returns { Promise<boolean> } a promise of a boolean value indicating whether the
   * address provided is an administrator.
   */
  async isAdmin(addr: string): Promise<boolean> {
    return this.readContract("isAdmin", [addr]);
  }

  /**
   * @description Evaluates whether the provided address is an auction oracle by querying
   * the contract's functionality through a readContract call, returning a promise of
   * the result.
   * 
   * @param { string } addr - 32-bit binary address of the contract to be checked for
   * being an auction oracle.
   * 
   * @returns { Promise<boolean> } a boolean value indicating whether the specified
   * address is an auction oracle.
   */
  async isAuctionOracle(addr: string): Promise<boolean> {
    return this.readContract("isAuctionOracle", [addr]);
  }

  /**
   * @description Returns a promise that resolves with a boolean value indicating whether
   * the given address is a relayer.
   * 
   * @param { string } addr - ether address of the contract being queried for relayer
   * information.
   * 
   * @returns { Promise<boolean> } a boolean value indicating whether the specified
   * address is a relayer or not.
   */
  async isRelayer(addr: string): Promise<boolean> {
    return this.readContract("isRelayer", [addr]);
  }

  /**
   * @description Queries the Ethers contract to determine whether a given address is
   * an admin.
   * 
   * @param { string } addr - ether address of the contract being queried for admin status.
   * 
   * @returns { Promise<boolean> } a boolean value indicating whether the provided
   * address is an admin of the relayer contract.
   */
  async isRelayerAdmin(addr: string): Promise<boolean> {
    return this.readContract("isRelayerAdmin", [addr]);
  }

  /**
   * @description Retrieves whether an address is a relayer and if it is not paused
   * from a contract.
   * 
   * @param { string } addr - ether address of the contract being checked for relayer
   * status and paused state.
   * 
   * @returns { Promise<boolean> } a boolean value indicating whether the address is a
   * relayer and not paused.
   */
  async isRelayerAndNotPaused(addr: string): Promise<boolean> {
    return this.readContract("isRelayerAndNotPaused", [addr]);
  }

  /**
   * @description Checks if an Ethereum address is a relay for the calling contract.
   * It does this by reading the value stored at the address using the `readContract`
   * method, which returns a promise of the value at that address.
   * 
   * @param { string } addr - address of the contract to check if it is a relayer, and
   * it is passed to the `readContract()` method to retrieve the necessary information
   * for the calculation.
   * 
   * @returns { Promise<boolean> } a boolean value indicating whether the address is a
   * relayer for the contract.
   */
  async isRelayerByAddress(addr: string): Promise<boolean> {
    return this.readContract("isRelayerByAddress", [addr]);
  }

  /**
   * @description Queries the smart contract to determine if a name exists as a relayer
   * in its records.
   * 
   * @param { string } name - name of the contract that is being checked if it is a
   * relayer by calling the `readContract` method with the specified name as argument.
   * 
   * @returns { Promise<boolean> } a boolean value indicating whether the provided name
   * is associated with a relayer.
   */
  async isRelayerByName(name: string): Promise<boolean> {
    return this.readContract("isRelayerByName", [name]);
  }

  /**
   * @description Queries the Ethereum blockchain to determine whether a given address
   * is the owner of a specific contract. It returns a promise of boolean value indicating
   * whether the address is the owner.
   * 
   * @param { string } addr - address of the contract to check if it is relayed by its
   * owner.
   * 
   * @returns { Promise<boolean> } a boolean value indicating whether the provided
   * address is a relayer by owner.
   */
  async isRelayerByOwner(addr: string): Promise<boolean> {
    return this.readContract("isRelayerByOwner", [addr]);
  }

  /**
   * @description 📊 returns a promise of a boolean value indicating whether an address
   * is a relayer factory, determined by reading the contract's state.
   * 
   * @param { string } addr - ether address of the contract being checked for the
   * `isRelayerFactory` role, which is queried using the `readContract()` method to
   * determine if it holds the role.
   * 
   * @returns { Promise<boolean> } a boolean value indicating whether the given address
   * is a relayer factory or not.
   */
  async isRelayerFactory(addr: string): Promise<boolean> {
    return this.readContract("isRelayerFactory", [addr]);
  }

  /**
   * @description Querries a smart contract to determine whether an address is locked
   * or not, using the `readContract()` method to retrieve the necessary data.
   * 
   * @param { string } addr - ether address of the contract or account for which the
   * isRelayerLocked status will be checked.
   * 
   * @returns { Promise<boolean> } a boolean value indicating whether the given address
   * is locked or not.
   */
  async isRelayerLocked(addr: string): Promise<boolean> {
    return this.readContract("isRelayerLocked", [addr]);
  }

  /**
   * @description Evaluates whether an Ethereum address is that of a smart contract by
   * reading its metadata from the blockchain.
   * 
   * @param { string } addr - smart contract address being queried for its "isSmartContract"
   * attribute value.
   * 
   * @returns { Promise<boolean> } a promise that resolves to a boolean value indicating
   * whether the specified address is a smart contract.
   */
  async isSmartContract(addr: string): Promise<boolean> {
    return this.readContract("isSmartContract", [addr]);
  }

  /**
   * @description Retrieves the platform address using a contract interaction, and
   * returns it as a string promise.
   * 
   * @returns { Promise<string> } a string representing the platform's address.
   */
  async getPlatformAddress(): Promise<string> {
    return this.readContract("getPlatformAddress");
  }

  /**
   * @description Retrieves the relayer address associated with the given name from the
   * smart contract.
   * 
   * @param { string } name - name of the relayer to retrieve the address for.
   * 
   * @returns { Promise<string> } a string representing the relayer address associated
   * with the given name.
   */
  async getRelayerAddressFromName(name: string): Promise<string> {
    return this.readContract("getRelayerAddressFromName", [name]);
  }

  /**
   * @description Retrieves the relayer address associated with a given owner address
   * through a contract read operation.
   * 
   * @param { string } address - ether address of the owner whose relayer address will
   * be retrieved.
   * 
   * @returns { Promise<string> } the relayer address of the given owner.
   */
  async getRelayerAddressFromOwner(address: string): Promise<string> {
    return this.readContract("getRelayerAddressFromOwner", [address]);
  }

  /**
   * @description Retrieves the relayer name associated with a given Ethereum address
   * from a smart contract.
   * 
   * @param { string } address - 12-byte Ethereum address for which the relayer name
   * is to be retrieved.
   * 
   * @returns { Promise<string> } the name of the relayer associated with the provided
   * address.
   */
  async getRelayerNameFromAddress(address: string): Promise<string> {
    return this.readContract("getRelayerNameFromAddress", [address]);
  }

  /**
   * @description Retrieves the admin role for a given role name from a contract through
   * the `readContract` method.
   * 
   * @param { string } role - Role that the function should retrieve the admin for, and
   * it is used to make the API call to retrieve the relevant data.
   * 
   * @returns { Promise<string> } a string representing the role admin of the given role.
   */
  async getRoleAdmin(role: string): Promise<string> {
    return this.readContract("getRoleAdmin", [role]);
  }

  /**
   * @description Reads the Relayer contract and returns the name associated with the
   * provided address.
   * 
   * @param { string } address - ether contract address that the function will name.
   * 
   * @returns { Promise<string> } a string containing the name of the given address.
   */
  async relayerContractToName(address: string): Promise<string> {
    return this.readContract("relayerContractToName", [address]);
  }

  /**
   * @description Reads the `relayerLocked` contract and checks if a specified address
   * is locked or not.
   * 
   * @param { string } address - 32-byte hexadecimal address of the smart contract to
   * be checked for locking, and it is passed as an argument to the `readContract()`
   * function to determine whether the contract is locked or not.
   * 
   * @returns { Promise<boolean> } a promise that resolves to a boolean value indicating
   * whether the specified address is locked or not.
   */
  async relayerLocked(address: string): Promise<boolean> {
    return this.readContract("relayerLocked", [address]);
  }

  /**
   * @description Reads the contract using the `readContract()` method, passing in the
   * name as an argument. It returns the result of this read operation as a promise.
   * 
   * @param { string } name - name of a contract that needs to be resolved to its
   * corresponding Smart Contract address.
   * 
   * @returns { Promise<string> } a promise that resolves to the name of the contract
   * associated with the given name.
   */
  async relayerNameToContract(name: string): Promise<string> {
    return this.readContract("relayerNameToContract", [name]);
  }

  /**
   * @description Reads a contract at the specified address and returns its content.
   * 
   * @param { string } address - 12-word hexadecimal address of the owner for which the
   * contract's information is to be retrieved.
   * 
   * @returns { Promise<string> } the owner's address.
   */
  async relayerOwnerToAddress(address: string): Promise<string> {
    return this.readContract("relayerOwnerToAddress", [address]);
  }

  /**
   * @description Returns a promise of `boolean` value whether the contract supports
   * the interface with the given `id`.
   * 
   * @param { string } interfaceId - ID of the interface that the `async supportsInterface()`
   * function checks if the contract supports.
   * 
   * @returns { Promise<boolean> } a boolean value indicating whether the interface
   * with the given ID is supported by the contract.
   */
  async supportsInterface(interfaceId: string): Promise<boolean> {
    return this.readContract("supportsInterface", [interfaceId]);
  }
}
