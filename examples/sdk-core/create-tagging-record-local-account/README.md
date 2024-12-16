# `sdk-core` simple create tagging record example

This demo shows how to use the `sdk-core` package to create an ETS tagging record programmatically.

When you run the demo:

1. A local wallet account is generated using Viem's privateKeyToAccount
2. The SDK creates a RelayerClient configured with this local account
3. The RelayerClient calls createTaggingRecord with these parameters:

```typescript
const taggingRecord = await relayerClient.createTaggingRecord(
  ["#rainbow", "#unicorn"],
  "https://app.uniswap.org",
  "example"
);
```

## Instructions

### Run locally

```bash
pnpm install
pnpm run dev

# open Vite dev url in browser.
```

### Run on StackBlitz

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/ethereum-tag-service/ets/tree/main/examples/sdk-core/create-tagging-record-local-account)

Then...

1. Click "Run Demo" to generate a new wallet address
2. Fund that address with a small amount (0.0001) of Arbitrum Sepolia ETH
3. Click "Run Demo" again to create your tagging record
4. View your new tagging record in the ETS Explorer
