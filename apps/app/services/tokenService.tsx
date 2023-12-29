// services/auctionHouseServices.ts
import { readContract } from "wagmi/actions";
import { etsTokenConfig } from "../src/contracts";

export const fetchHasTags = async (
  address: `0x${string}` | undefined
): Promise<boolean> => {
  // Check if the address is undefined or not properly formatted
  if (!address || !address.startsWith("0x")) {
    console.log("Invalid or undefined address");
    return false;
  }
  const data = await readContract({
    ...etsTokenConfig,
    functionName: "balanceOf",
    args: [address],
  });
  if (data > BigInt(0)) {
    console.log("fetchHasTags", true);
    return true;
  } else {
    console.log("fetchHasTags", false);
    return false;
  }
};

// Get current user balance of CTAGs
//const {} = useContractRead({
//  ...etsTokenContractConfig,
//  functionName: "balanceOf",
//  args: [address],
//  enabled: address ? true : false,
//  onSuccess(data: bigint) {
//    console.log("balanceOf: ", data);
//    if (data > BigInt(0)) {
//      console.log("useContractRead user has tags");
//      setHasTags(true);
//    } else {
//      setHasTags(false);
//      console.log("useContractRead user has no tags");
//    }
//  },
//});