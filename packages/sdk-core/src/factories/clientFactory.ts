import { getAlchemyRpcUrlById } from "@ethereum-tag-service/contracts/utils";
import { AccessControlsClient } from "../clients/AccessControlsClient";
import { AuctionHouseClient } from "../clients/AuctionHouseClient";
import { CoreClient } from "../clients/CoreClient";
import { EnrichTargetClient } from "../clients/EnrichTargetClient";
import { EtsClient } from "../clients/EtsClient";
import { RelayerClient } from "../clients/RelayerClient";
import { RelayerFactoryClient } from "../clients/RelayerFactoryClient";
import { TargetClient } from "../clients/TargetClient";
import { TokenClient } from "../clients/TokenClient";
import { chainsMap } from "../config/chainsConfig";

import { http, type Account, type Hex, createPublicClient, createWalletClient, custom } from "viem";

type ClientConfig = {
  chainId: number;
  account?: Hex | Account;
  customTransport?: boolean;
};

function initializeClients(config: ClientConfig) {
  const { chainId, account } = config;

  const chain = chainsMap(chainId);
  if (!chain) {
    throw new Error(`[@ethereum-tag-service/sdk-core] Unsupported chain ID ${chainId}`);
  }

  let transportUrl = chain.rpcUrls?.default?.http?.[0];
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_ALCHEMY_KEY && chainId !== 31337) {
    transportUrl = getAlchemyRpcUrlById(chainId.toString(), process.env.NEXT_PUBLIC_ALCHEMY_KEY);
  }

  const publicClient = createPublicClient({
    chain,
    transport: http(transportUrl, { batch: true }),
  });

  // If account is a Hex string, it's a JSON-RPC account (window.ethereum)
  // If account is an Account object, it's a local account
  const useJsonRpcTransport = typeof account === "string";

  if (useJsonRpcTransport && (typeof window === "undefined" || !(window as any).ethereum)) {
    throw new Error("[@ethereum-tag-service/sdk-core] Window.ethereum is required for JSON-RPC accounts");
  }

  const transport = useJsonRpcTransport ? custom((window as any).ethereum) : http(transportUrl);
  const walletClient = createWalletClient({ chain, account, transport });

  return { publicClient, walletClient };
}

function createClient<T>(
  ClientType: new (args: any) => T,
  chainId: number | undefined,
  relayerAddress?: Hex,
  account?: Account | Hex,
): T | undefined {
  if (!chainId) return undefined;

  try {
    const { publicClient, walletClient } = initializeClients({ chainId, account });
    return new ClientType({
      chainId,
      publicClient,
      walletClient,
      relayerAddress,
    });
  } catch (error) {
    console.error(`[@ethereum-tag-service/sdk-core] Error creating ${ClientType.name}:`, error);
    return undefined;
  }
}

export function createTokenClient({
  chainId,
  account,
}: {
  chainId: number | undefined;
  account?: Account | Hex;
}): TokenClient | undefined {
  return createClient<TokenClient>(TokenClient, chainId, undefined, account);
}

export function createRelayerClient({
  chainId,
  relayerAddress,
  account,
}: {
  chainId: number | undefined;
  relayerAddress: Hex;
  account?: Account | Hex;
}): RelayerClient | undefined {
  return createClient<RelayerClient>(RelayerClient, chainId, relayerAddress, account);
}

export function createAuctionHouseClient({
  chainId,
  account,
}: {
  chainId: number | undefined;
  account?: Account | Hex;
}): AuctionHouseClient | undefined {
  return createClient<AuctionHouseClient>(AuctionHouseClient, chainId, undefined, account);
}

export function createAccessControlsClient({
  chainId,
  account,
}: {
  chainId: number | undefined;
  account?: Account | Hex;
}): AccessControlsClient | undefined {
  return createClient<AccessControlsClient>(AccessControlsClient, chainId, undefined, account);
}

export function createRelayerFactoryClient({
  chainId,
  account,
}: {
  chainId: number | undefined;
  account?: Account | Hex;
}): RelayerFactoryClient | undefined {
  return createClient<RelayerFactoryClient>(RelayerFactoryClient, chainId, undefined, account);
}

export function createTargetClient({
  chainId,
  account,
}: {
  chainId: number | undefined;
  account?: Account | Hex;
}): TargetClient | undefined {
  return createClient<TargetClient>(TargetClient, chainId, undefined, account);
}

export function createEnrichTargetClient({
  chainId,
  account,
}: {
  chainId: number | undefined;
  account?: Account | Hex;
}): EnrichTargetClient | undefined {
  return createClient<EnrichTargetClient>(EnrichTargetClient, chainId, undefined, account);
}

export function createEtsClient({
  chainId,
  account,
}: {
  chainId: number | undefined;
  account?: Account | Hex;
}): EtsClient | undefined {
  return createClient<EtsClient>(EtsClient, chainId, undefined, account);
}

export function createCoreClient({
  chainId,
  relayerAddress,
  account,
  clients,
}: {
  chainId: number | undefined;
  relayerAddress?: Hex;
  account?: Account | Hex;
  clients?: {
    tokenClient?: boolean;
    relayerClient?: boolean;
    accessControlsClient?: boolean;
    auctionHouseClient?: boolean;
    relayerFactoryClient?: boolean;
    targetClient?: boolean;
  };
}): CoreClient | undefined {
  if (!chainId) return undefined;

  try {
    const { publicClient, walletClient } = initializeClients({ chainId, account });

    return new CoreClient({
      chainId,
      publicClient,
      walletClient,
      relayerAddress,
      clients,
    });
  } catch (error) {
    console.error("[@ethereum-tag-service/sdk-core] Failed to create core client:", error);
    return undefined;
  }
}
