import { Address, PublicClient, WalletClient } from "viem";
import { handleContractCall } from "../utils/handleContractCall";
import { handleContractRead } from "../utils/handleContractRead";
import { EtsReadFunction, EtsWriteFunction } from "../types";
import { getConfig } from "../contracts/config";
import { validateConfig } from "../utils/validateConfig";

export class EtsClient {
  private readonly publicClient: PublicClient;
  private readonly walletClient: WalletClient | undefined;
  private readonly etsConfig: { address: Address; abi: any };

  /**
   * @description Sets properties `publicClient`, `walletClient`, and `address`, validates
   * input parameters, retrieves configuration data using the `getConfig()` function,
   * and stores ETS configuration in a private field `etsConfig`.
   * 
   * @param { PublicClient } .publicClient - PublicClient object passed from the caller,
   * which provides access to the public side of the smart contract for interacting
   * with external users and systems.
   * 
   * @param { WalletClient } .walletClient - wallet client associated with the contract,
   * which is used to validate the configuration and retrieve the ETS configuration.
   * 
   * @param { Address } .address - Address object that contains the contract's address
   * information, which is then validated and stored as part of the constructor execution.
   * 
   * @param { number } .chainId - blockchain network associated with the contract, and
   * is used to validate the configuration retrieved from the network.
   */
  constructor({
    publicClient,
    walletClient,
    address,
    chainId,
  }: {
    publicClient: PublicClient;
    walletClient?: WalletClient;
    address?: Address;
    chainId?: number;
  }) {
    this.publicClient = publicClient;
    this.walletClient = walletClient;

    validateConfig(chainId, publicClient, walletClient);
    if (!address) throw new Error("Contract address is required");

    const config = getConfig(chainId);
    if (!config) throw new Error("Configuration could not be retrieved");

    this.etsConfig = config.etsConfig;
  }

  /**
   * @description Retrieves data from an Ethereum smart contract using the specified
   * function name and arguments, and returns the result as a promise.
   * 
   * @param { EtsReadFunction } functionName - name of the Ethereum contract function
   * to be read.
   * 
   * @param { any[] } args - optional arguments that will be passed to the contract
   * when invoking its functionality using the `handleContractRead()` function.
   * 
   * @returns { Promise<any> } the result of executing the specified contract function
   * using the provided parameters.
   */
  private async readContract(functionName: EtsReadFunction, args: any[] = []): Promise<any> {
    return handleContractRead(this.publicClient, this.etsConfig.address, this.etsConfig.abi, functionName, args);
  }

  /**
   * @description Calls a smart contract function provided in `functionName`. It takes
   * an array of arguments and returns a promise containing the transaction hash and status.
   * 
   * @param { EtsWriteFunction } functionName - name of an Ethereum smart contract
   * function that should be called by the `callContract` function.
   * 
   * @param { any } args - additional data to be passed to the Ets Write Function when
   * it is called using the `callContract()` method.
   * 
   * @returns { Promise<{ transactionHash: string; status: number }> } an object
   * containing the transaction hash and status.
   */
  private async callContract(
    functionName: EtsWriteFunction,
    args: any = [],
  ): Promise<{ transactionHash: string; status: number }> {
    if (!this.walletClient) {
      throw new Error("Wallet client is required to perform this action");
    }
    return handleContractCall(
      this.publicClient,
      this.walletClient,
      this.etsConfig.address,
      this.etsConfig.abi,
      functionName,
      args,
    );
  }

  // Read Functions
  /**
   * @description Retrieves the accrued value for a given address from the contract.
   * 
   * @param { Address } address - address of the contract to read from in the
   * `readContract()` method call.
   * 
   * @returns { Promise<number> } a number representing the total accrued value for the
   * given address.
   */
  async accrued(address: Address): Promise<number> {
    return this.readContract("accrued", [address]);
  }

  /**
   * @description Reads the percentage of users on an asynchronous platform using the
   * `readContract` method and returns the result as a number.
   * 
   * @returns { Promise<number> } a number representing the percentage of the platform's
   * total value that is stored on the blockchain.
   */
  async platformPercentage(): Promise<number> {
    return this.readContract("platformPercentage", []);
  }

  /**
   * @description Retrieves the relayers percentage from a specified contract address.
   * 
   * @returns { Promise<number> } a number representing the percentage of transactions
   * that are relayed on the network.
   */
  async relayerPercentage(): Promise<number> {
    return this.readContract("relayerPercentage", []);
  }

  /**
   * @description Retrieves the `fee` value stored in the contract at the specified tag
   * address.
   * 
   * @returns { Promise<number> } a promise of a number representing the tagging fee.
   */
  async taggingFee(): Promise<number> {
    return this.readContract("taggingFee", []);
  }

  /**
   * @description Checks if a specific `taggingRecordId` exists in the contract.
   * 
   * @param { number } taggingRecordId - ID of the tagging record being checked for existence.
   * 
   * @returns { Promise<boolean> } a boolean value indicating whether a tagging record
   * with the given ID exists or not.
   */
  async taggingRecordExists(taggingRecordId: number): Promise<boolean> {
    return this.readContract("taggingRecordExists", [taggingRecordId]);
  }

  /**
   * @description Retrieves the address of the ETS access controls contract.
   * 
   * @returns { Promise<Address> } an Address object containing the Ethereum address
   * of the contract that implements the `ETSAccessControl` interface.
   */
  async etsAccessControls(): Promise<Address> {
    return this.readContract("etsAccessControls", []);
  }

  /**
   * @description Retrieves the target address of a Smart Contract.
   * 
   * @returns { Promise<Address> } an Address value retrieved from a smart contract.
   */
  async etsTarget(): Promise<Address> {
    return this.readContract("etsTarget", []);
  }

  /**
   * @description Reads contract data from the Ethereum blockchain, specifically the
   * `etsToken` contract, and returns the Address of the contract.
   * 
   * @returns { Promise<Address> } an Address containing the contract's ETS token.
   */
  async etsToken(): Promise<Address> {
    return this.readContract("etsToken", []);
  }

  /**
   * @description Retrieves the total due amount for an given account from a smart contract.
   * 
   * @param { Address } account - Address for which the total due amount is to be
   * calculated and returned by the `totalDue` function.
   * 
   * @returns { Promise<number> } a number representing the total amount owed by the
   * specified account.
   */
  async totalDue(account: Address): Promise<number> {
    return this.readContract("totalDue", [account]);
  }

  // Write Functions
  /**
   * @description Performs the operation of applying multiple tags to a record with a
   * composite key using the given `tagIds`, `targetId`, `recordType`, and `tagger`.
   * 
   * @param { number[] } tagIds - 0-based index of tags to apply to a target id in a
   * record of a specific type.
   * 
   * @param { number } targetId - unique identifier of the record to which the tags
   * should be applied.
   * 
   * @param { string } recordType - type of data being tagged, which is used to determine
   * the appropriate actions to take when applying the tags.
   * 
   * @param { Address } tagger - 32-byte hash of the entity that is tagging the records,
   * which is used to validate the ownership of the tags in the contract.
   * 
   * @returns { Promise<{ transactionHash: string; status: number }> } a promise of an
   * object containing the transaction hash and status.
   */
  async applyTagsWithCompositeKey(
    tagIds: number[],
    targetId: number,
    recordType: string,
    tagger: Address,
  ): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("applyTagsWithCompositeKey", [tagIds, targetId, recordType, tagger]);
  }

  /**
   * @description Executes a contract call to append tags to a record, providing the
   * record's ID and an array of tag IDs as input. The function returns a promise that
   * resolves with a JSON object containing the transaction hash and status.
   * 
   * @param { number } taggingRecordId - unique identifier of the record being tagged.
   * 
   * @param { number[] } tagIds - array of tags that should be assigned to the specified
   * `taggingRecordId`.
   * 
   * @returns { Promise<{ transactionHash: string; status: number }> } a promise of an
   * object with two properties: `transactionHash` and `status`.
   */
  async appendTags(taggingRecordId: number, tagIds: number[]): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("appendTags", [taggingRecordId, tagIds]);
  }

  /**
   * @description Async applies tags to a target based on raw input from multiple sources.
   * 
   * @param { number[] } tagIds - 0-based array of IDs for the tags that will be applied
   * to the target item.
   * 
   * @param { number } targetId - id of the object that will receive the applied tags.
   * 
   * @param { string } recordType - type of transaction being processed for applying
   * tags, with possible values including "NEW", "UPDATE", and "DELETE".
   * 
   * @param { Address } tagger - address of the entity that is tagging the record.
   * 
   * @returns { Promise<{ transactionHash: string; status: number }> } a promise object
   * containing a `{ transactionHash: string; status: number }` object.
   */
  async applyTagsWithRawInput(
    tagIds: number[],
    targetId: number,
    recordType: string,
    tagger: Address,
  ): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("applyTagsWithRawInput", [tagIds, targetId, recordType, tagger]);
  }

  /**
   * @description Calls a contract method named "removeTags" and passes in the ID of
   * the tagging record and an array of tag IDs to remove.
   * 
   * @param { number } taggingRecordId - unique identifier of the tagged record that
   * the `removeTags()` method is called on.
   * 
   * @param { number[] } tagIds - 0-based index of the tags to be removed from the
   * record identified by the `taggingRecordId`.
   * 
   * @returns { Promise<{ transactionHash: string; status: number }> } a promise object
   * containing the transaction hash and status after successfully removing tags from
   * a record.
   */
  async removeTags(taggingRecordId: number, tagIds: number[]): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("removeTags", [taggingRecordId, tagIds]);
  }

  /**
   * @description Async replaces tags on a record with the specified ID by calling the
   * contract method "replaceTags" with the ID and array of tag IDs as arguments. It
   * returns a promise with the transaction hash and status after the replacement is complete.
   * 
   * @param { number } taggingRecordId - 10-byte hexadecimal ID of the record being tagged.
   * 
   * @param { number[] } tagIds - 1-based index or indices of the tags to be replaced
   * in the record, as an array of integers.
   * 
   * @returns { Promise<{ transactionHash: string; status: number }> } a promise object
   * containing the transaction hash and status.
   */
  async replaceTags(taggingRecordId: number, tagIds: number[]): Promise<{ transactionHash: string; status: number }> {
    return this.callContract("replaceTags", [taggingRecordId, tagIds]);
  }
}
