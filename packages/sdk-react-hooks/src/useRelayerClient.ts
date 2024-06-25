import { useEffect, useState } from "react";
import { createRelayerClient, RelayerClient } from "@ethereum-tag-service/sdk-core";

/**
 * @description Provides a layer of abstraction on top of the Relayer client, providing
 * various endpoints to interact with the Relayer network. It exposes functions for
 * managing tags, ownership, paused state, and other aspects of the Relayer ecosystem.
 * 
 * @param { `0x${string}` } .relayerAddress - 0x address of the Relayer client instance
 * being used to interact with the relayer service.
 * 
 * @param { number } .chainId - 0x chain ID of the Relayer client, which is used to
 * specify the correct instance of the Relayer contract for the current network.
 * 
 * @param { `0x${string}` } .account - 0x account that is used to interact with the
 * relayer client and perform operations on the ERC721 contract.
 * 
 * @returns { array } a collection of functions for interacting with a RelayER client.
 */
export const useRelayerClient = ({
  relayerAddress,
  chainId,
  account,
}: {
  relayerAddress?: `0x${string}`;
  chainId?: number;
  account?: `0x${string}`;
}) => {
  const [relayerClient, setRelayerClient] = useState<RelayerClient>();

  useEffect(() => {
    if (!chainId || !account || !relayerAddress) return;
    const client = createRelayerClient({ chainId, account, relayerAddress });
    setRelayerClient(client);
  }, [chainId, account, relayerAddress]);

  /**
   * @description Executes an API call to create tags using a relayer client, returning
   * a promise of the transaction hash and status after successful execution or the
   * original error in case of failure.
   * 
   * @param { string[] } tags - string array of tags to be created on the blockchain
   * by the relayer client.
   * 
   * @returns { Promise<{ transactionHash: string; status: number }> } a promise of a
   * `{ transactionHash: string; status: number }` object.
   */
  const createTags = async (tags: string[]): Promise<{ transactionHash: string; status: number }> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      return await relayerClient.createTags(tags);
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Async creates a new tagging record on the Ethereum blockchain using
   * the relayer client, passing in the tag IDs, target ID, and record type as inputs.
   * It returns the resulting tagging record ID.
   * 
   * @param { string[] } tagIds - 1 or more tags that will be assigned to the targetId
   * in the tagging record created by the `relayerClient.createTaggingRecord()` method.
   * 
   * @param { string } targetId - id of the target contract that will be tagged with
   * the given set of tags.
   * 
   * @param { string } recordType - type of record being tagged, and is used to determine
   * the appropriate tagging action to take.
   * 
   * @param { `0x${string}` } signerAddress - 0x hash of the signer's address, which
   * is optional and used to specify the address of the signer for the tagging record
   * creation operation.
   * 
   * @returns { Promise<string> } a unique identifier for the newly created tagging record.
   */
  const createTaggingRecord = async (
    tagIds: string[],
    targetId: string,
    recordType: string,
    signerAddress?: `0x${string}`,
  ): Promise<string> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      const { taggingRecordId } = await relayerClient.createTaggingRecord(tagIds, targetId, recordType, signerAddress);
      return taggingRecordId;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Within the `async` keyword, applies tags to a target resource specified
   * by `targetURI` and `recordType`.
   * 
   * @param { string[] } tags - 1 or more strings of metadata associated with the record
   * being recorded.
   * 
   * @param { string } targetURI - URI of the blockchain to which the tags will be applied.
   * 
   * @param { string } recordType - type of record to be created or updated in the
   * blockchain, which determines the actions taken by the relayer client in the applyTags
   * method.
   * 
   * @returns { Promise<{ transactionHash: string; status: number }> } a promise that
   * resolves to an object containing the transaction hash and status.
   */
  const applyTags = async (
    tags: string[],
    targetURI: string,
    recordType: string,
  ): Promise<{ transactionHash: string; status: number }> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      return await relayerClient.applyTags(tags, targetURI, recordType);
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Removes a set of tags from a record at a given target URI using a
   * relayer client.
   * 
   * @param { string[] } tags - list of tags that will be removed from the specified
   * target resource.
   * 
   * @param { string } targetURI - location to which tags should be removed from,
   * according to the function's implementation.
   * 
   * @param { string } recordType - type of record being tagged, which is used to
   * determine the appropriate action to take when removing tags from it.
   * 
   * @returns { Promise<{ transactionHash: string; status: number }> } a promise object
   * containing a transaction hash and status code.
   */
  const removeTags = async (
    tags: string[],
    targetURI: string,
    recordType: string,
  ): Promise<{ transactionHash: string; status: number }> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      return await relayerClient.removeTags(tags, targetURI, recordType);
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Uses a relayer client to update the tags associated with a given
   * record on a specified URI, returning the transaction hash and status.
   * 
   * @param { string[] } tags - tags that need to be replaced in the given target URI.
   * 
   * @param { string } targetURI - location to which the tags will be replaced within
   * the blockchain.
   * 
   * @param { string } recordType - type of record to be replaced with the new tags.
   * 
   * @returns { Promise<{ transactionHash: string; status: number }> } a promise that
   * resolves to an object containing the transaction hash and status.
   */
  const replaceTags = async (
    tags: string[],
    targetURI: string,
    recordType: string,
  ): Promise<{ transactionHash: string; status: number }> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      return await relayerClient.replaceTags(tags, targetURI, recordType);
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Asynchronous call to the relayer client's `pause` method, returning
   * a promise of the transaction hash and status after the pause is applied.
   * 
   * @returns { Promise<{ transactionHash: string; status: number }> } a promise object
   * containing the transaction hash and status.
   */
  const pause = async (): Promise<{ transactionHash: string; status: number }> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      return await relayerClient.pause();
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Async resolves with a { transactionHash: string, status: number }
   * object after successfully unpausing a transaction on the Relayer network.
   * 
   * @returns { Promise<{ transactionHash: string; status: number }> } a promise that
   * resolves to an object containing the transaction hash and status.
   */
  const unpause = async (): Promise<{ transactionHash: string; status: number }> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      return await relayerClient.unpause();
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Async executes a relayed transaction to change the ownership of a
   * contract address.
   * 
   * @param { `0x${string}` } newOwner - 32-character hexadecimal address of the new
   * owner whose ownership is being transferred.
   * 
   * @returns { Promise<{ transactionHash: string; status: number }> } a promise of an
   * object with a `transactionHash` property and a `status` property.
   */
  const changeOwner = async (newOwner: `0x${string}`): Promise<{ transactionHash: string; status: number }> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      return await relayerClient.changeOwner(newOwner);
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Performs a transfer of ownership of a smart contract instance to a
   * new owner, using an existing relayer client to interact with the Ethereum blockchain.
   * 
   * @param { `0x${string}` } newOwner - 32-byte hexadecimal string that will be used
   * to transfer ownership of the relayer client.
   * 
   * @returns { Promise<{ transactionHash: string; status: number }> } a promise of an
   * object containing the transaction hash and status.
   */
  const transferOwnership = async (newOwner: `0x${string}`): Promise<{ transactionHash: string; status: number }> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      return await relayerClient.transferOwnership(newOwner);
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Within the async block takes an array of tags `tags` and returns a
   * promise that resolves to an object containing the transaction hash and status.
   * 
   * @param { string[] } tags - array of strings to be queried for a transaction's tags
   * in the `getOrCreateTags` method of the `relayerClient`.
   * 
   * @returns { Promise<{ transactionHash: string; status: number }> } a promise that
   * resolves to an object containing the transaction hash and status.
   */
  const getOrCreateTags = async (tags: string[]): Promise<{ transactionHash: string; status: number }> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      return await relayerClient.getOrCreateTags(tags);
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Performs the operation of renouncing ownership of a specified asset
   * on a relayer client.
   * 
   * @returns { Promise<{ transactionHash: string; status: number }> } a promise of an
   * object with two properties: `transactionHash` and `status`.
   */
  const renounceOwnership = async (): Promise<{ transactionHash: string; status: number }> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      return await relayerClient.renounceOwnership();
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Retrieves the owner's address of the Relayer client.
   * 
   * @returns { Promise<string> } the address of the relayer client's owner.
   */
  const owner = async (): Promise<string> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      const ownerAddress = await relayerClient.owner();
      return ownerAddress;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Retrieves the current pause status of a relayer client.
   * 
   * @returns { Promise<boolean> } a boolean indicating whether the relayer is currently
   * paused.
   */
  const paused = async (): Promise<boolean> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      const isPaused = await relayerClient.paused();
      return isPaused;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Retrieves the creator's address using the `relayerClient`.
   * 
   * @returns { Promise<string> } a string representing the creator's address.
   */
  const creator = async (): Promise<string> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      const creatorAddress = await relayerClient.creator();
      return creatorAddress;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Retrieves the ETS address associated with the given relayer client.
   * 
   * @returns { Promise<string> } the Ethereum Mainnet TSS endpoint address.
   */
  const ets = async (): Promise<string> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      const etsAddress = await relayerClient.ets();
      return etsAddress;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Retrieves the ETS address for access controls from a Relayer client.
   * 
   * @returns { Promise<string> } the address of the ETS access control.
   */
  const etsAccessControls = async (): Promise<string> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      const etsAccessControlsAddress = await relayerClient.etsAccessControls();
      return etsAccessControlsAddress;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Retrieves the target ETS address for the given relayer client.
   * 
   * @returns { Promise<string> } the target address of the ETS network.
   */
  const etsTarget = async (): Promise<string> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      const etsTargetAddress = await relayerClient.etsTarget();
      return etsTargetAddress;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Retrieves the ETS token address associated with a relayer client.
   * 
   * @returns { Promise<string> } the address of the ETS token.
   */
  const etsToken = async (): Promise<string> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      const etsTokenAddress = await relayerClient.etsToken();
      return etsTokenAddress;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Fetches the current balance of an Ethereum account using a relayer client.
   * 
   * @returns { Promise<number> } a promise of the current balance of the given Relayer
   * client.
   */
  const getBalance = async (): Promise<number> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      const balance = await relayerClient.getBalance();
      return balance;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Retrieves the name of the relayer associated with a given client.
   * 
   * @returns { Promise<string> } a string representing the name of the relayer.
   */
  const getRelayerName = async (): Promise<string> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      const relayerName = await relayerClient.getRelayerName();
      return relayerName;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Computes the fee and the actual count of tags for a given parameter
   * `tagParams` and `value`.
   * 
   * @param { any } tagParams - parameters for the compute tagging fee call, which
   * includes the value of the tag to be computed.
   * 
   * @param { number } value - number of tags to be tagged, which is used by the relayer
   * client to compute the tagging fee.
   * 
   * @returns { Promise<[bigint, bigint]> } a tuple of two bigints, representing the
   * estimated fee and actual tag count for a given transaction.
   */
  const computeTaggingFee = async (tagParams: any, value: number): Promise<[bigint, bigint]> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      const [fee, actualTagCount] = await relayerClient.computeTaggingFee(tagParams, value);
      return [fee, actualTagCount];
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Verifies whether a relayer client supports an interface, throwing an
   * error if the relayer client is not initialized or if the interface is not supported.
   * 
   * @param { string } interfaceId - ID of the interface whose support is to be verified.
   * 
   * @returns { Promise<boolean> } a boolean value indicating whether the specified
   * interface is supported by the relayer client.
   */
  const supportsInterface = async (interfaceId: string): Promise<boolean> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      const supported = await relayerClient.supportsInterface(interfaceId);
      return supported;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @description Fetches and returns the current version of the Relayer client library.
   * 
   * @returns { Promise<string> } a string representation of the current Relayer client
   * version.
   */
  const version = async (): Promise<string> => {
    try {
      if (!relayerClient) throw new Error("Relayer client not initialized");
      const versionString = await relayerClient.version();
      return versionString;
    } catch (error) {
      throw error;
    }
  };

  return {
    createTags,
    createTaggingRecord,
    applyTags,
    removeTags,
    replaceTags,
    pause,
    unpause,
    changeOwner,
    transferOwnership,
    getOrCreateTags,
    renounceOwnership,
    owner,
    paused,
    creator,
    ets,
    etsAccessControls,
    etsTarget,
    etsToken,
    getBalance,
    getRelayerName,
    computeTaggingFee,
    supportsInterface,
    version,
  };
};
