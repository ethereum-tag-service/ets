# Contract Constants

Core contract addresses and ABIs for the Ethereum Tag Service protocol.

## Addresses

```ts twoslash
import {
  etsAddress,
  etsAccessControlsAddress,
  etsAuctionHouseAddress,
  etsEnrichTargetAddress,
  etsRelayerFactoryAddress,
  etsRelayerV1Address,
  etsTargetAddress,
  etsTokenAddress
} from '@ethereum-tag-service/contracts/contracts'

// Core Protocol
etsAddress['421614']
// @log: Output: "0x4763975ee6675C50381e7044524C2a25D5fD5774"

// Access Controls
etsAccessControlsAddress['421614']
// @log: Output: "0x945f8d0534E6e774Db73A3843568B8c5be2167C0"

// Auction House
etsAuctionHouseAddress['421614']
// @log: Output: "0x79A3098b1cc02b5FB675Ce7A97f51d8DdDEeA450"
```

## Contract Configurations

Complete contract configurations including addresses and ABIs:

```ts twoslash
import {
  etsConfig,
  etsAccessControlsConfig,
  etsAuctionHouseConfig,
  etsEnrichTargetConfig,
  etsRelayerFactoryConfig,
  etsRelayerV1Config,
  etsTargetConfig,
  etsTokenConfig
} from '@ethereum-tag-service/contracts/contracts'

// Access contract configuration
const { address, abi } = etsConfig
```

## Supported Networks

See [chains](/docs/contracts/package/chains) for a list of supported networks.
