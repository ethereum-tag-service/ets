import { etsTokenConfig, etsRelayerV1Config } from "../src/contracts";
import { readContract, writeContract, waitForTransactionReceipt, simulateContract } from "wagmi/actions";

import { wagmiConfig } from "@app/constants/wagmiConfig";

export const createTags = async (tags: string[]): Promise<void> => {
  if (tags.length > 0) {
    const tagsToMint = [];

    for (let tag of tags) {
      try {
        const tagId = await readContract(wagmiConfig, {
          ...etsTokenConfig,
          functionName: "computeTagId",
          args: [tag],
        });

        console.log("tagId", tagId);

        const exists = await readContract(wagmiConfig, {
          ...etsTokenConfig,
          functionName: "tagExistsById",
          args: [tagId],
        });

        console.log("exists", exists);

        if (!exists) {
          tagsToMint.push(tag);
        } else {
          console.log(`${tag} already exists`);
        }
      } catch (error) {
        console.error(`Error processing tag "${tag}":`, error);
      }
    }

    console.log("Tags to mint:", tagsToMint);

    if (tagsToMint.length > 0) {
      try {
        const hash = await writeContract(wagmiConfig, {
          ...etsRelayerV1Config,
          functionName: "getOrCreateTagIds",
          args: [tagsToMint],
        });

        console.log("Transaction hash:", hash);

        const transactionReceipt = await waitForTransactionReceipt(wagmiConfig, {
          hash,
        });

        console.log("Transaction receipt:", transactionReceipt);
      } catch (error) {
        console.error("Error minting tags:", error);
      }
    }
  }
};

export const fetchHasTags = async (address: `0x${string}` | undefined): Promise<boolean> => {
  // Check if the address is undefined or not properly formatted
  if (!address || !address.startsWith("0x")) {
    console.error("Invalid address");
    return false;
  }
  const data = await readContract(wagmiConfig, {
    ...etsTokenConfig,
    functionName: "balanceOf",
    args: [address],
  });

  return data > BigInt(0);
};
