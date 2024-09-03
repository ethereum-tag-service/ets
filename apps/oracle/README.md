# ETS Oracle

The ETS Oracle facilitates off-chain processes that support the Ethereum Tag Service (ETS), leveraging [OpenZeppelin Defender](https://www.openzeppelin.com/defender) for its robust security practices and developer tools. As ETS evolves, we aim to progressively adopt more decentralized infrastructure solutions.

## Overview of Oracle Processes

### Release Next Auction

ETS enforces strict limits on concurrent tag auctions and dictates the sequence of tag releases. While the ETS Tag Auction operates entirely on-chain, inspired by [Nouns Auction](https://nouns.wtf/), selecting and releasing the next tag for auction requires off-chain computation.

#### Workflow

1. **Auction Closure**: An auction concludes when the current block time exceeds the `end_time`, disallowing further bids.
2. **Settlement**: A public function, `ETSAuctionHouse.settleAuction(uint256 _auctionId)`, settles the auction, transferring the tag to the winner, distributing funds, and emitting an `AuctionSettled` event.
3. **Event Monitoring**: A custom [Defender Monitor](https://docs.openzeppelin.com/defender/v2/module/monitor) listens for `AuctionSettled` events.
4. **Action Trigger**: On detecting an `AuctionSettled` event, the monitor triggers a [Defender Action](https://docs.openzeppelin.com/defender/v2/module/actions), `ReleaseNextAuction`.
5. **Tag Selection**: The action queries our ETS Graph to identify the next tag based on specific criteria.
6. **Tag Release**: The selected tag is then released for auction via a [Defender Relayer](https://docs.openzeppelin.com/defender/v2/manage/relayers), calling `ETSAuctionHouse.fulfillRequestCreateAuction(uint256 _tokenId)` on-chain, initiating a new auction cycle.

#### Selection Criteria

- Prioritize tags with a positive "tagAppliedInTaggingRecord" count.
- In the absence of such tags, select the oldest tag.
- For ties, choose the oldest among those with equal "tagAppliedInTaggingRecord" counts.

### Local Development

For local testing with Hardhat:

1. Ensure environment variables are set in the project root:

```bash
MNEMONIC_LOCAL="test test test test test test test test test test test junk"
ETS_ORACLE_LOCALHOST_PK=your_private_key_here
NETWORK=localhost
NEXT_PUBLIC_ETS_ENVIRONMENT=development
```

Start the local oracle, Hardhat, and the front-end app with:

```bash
# within repository root
pnpm run dev
```

For front-end testing on ETS testnet, configure:

```bash
NETWORK= // Select a testnet chain from hardhat.config.ts eg. "arbitrumSepolia"
NEXT_PUBLIC_ETS_ENVIRONMENT=stage
```

#### Building and Deployment

The source code, written in TypeScript, requires compilation via Rollup.js. Separate Rollup configurations and build commands are available for local and Defender environments:

```bash
# Build commands within /apps/oracle

# For localhost oracle
pnpm run build:localhost

# For Defender oracle
pnpm run build:defender
```

Deploy the Defender Action with the Defender as Code plugin, configured in /apps/oracle/serverless.yml. Deployment requires Team API keys:

```bash
# Environment variables for local deployment
TEAM_API_KEY=your_api_key_here
TEAM_API_SECRET=your_api_secret_here
```

Deploy with:

```bash
pnpm run deploy:defender
```

#### Testing Defender Processes Locally

Test Defender Actions locally while using a Defender Relayer for transactions by setting:

```bash
NETWORK= // Select a testnet chain from hardhat.config.ts eg. "arbitrumSepolia"
# Api keys for the Defender relayer
API_KEY=your_api_key_here
API_SECRET=your_api_secret_here
```

Run the Action with:

```bash
pnpm run dev:defender
```

#### Dependencies

Dependencies are pinned to versions compatible with Defender's environment, ensuring seamless integration and deployment.

```bash
# Defender Dependency Version: v2024-01-18
Node version: v16.20.2
@openzeppelin/defender-sdk: 1.5.0
@datadog/datadog-api-client: 1.18.0
@gnosis.pm/safe-core-sdk: 0.3.1
@gnosis.pm/safe-ethers-adapters: 0.1.0-alpha.13
axios: 1.6.1
axios-retry: 3.5.0
@openzeppelin/defender-admin-client: 1.52.0
@openzeppelin/defender-autotask-client: 1.52.0
@openzeppelin/defender-autotask-utils: 1.52.0
@openzeppelin/defender-kvstore-client: 1.52.0
@openzeppelin/defender-relay-client: 1.52.0
@openzeppelin/defender-sentinel-client: 1.52.0
ethers: 5.5.3
fireblocks-sdk: 2.5.4
graphql: 15.8.0
graphql-request: 3.4.0
web3: 1.9.0
```
