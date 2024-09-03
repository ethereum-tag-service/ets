# ETS Tasks

## Accounts

**`accounts`**

Prints a listing of named accounts for the chain and mnemonic in `hardhat.config.ts`. Named accounts can be used as the `signer` in various other tasks. eg. `--signer account6`

Note: `account0` is ETSAdmin(Deployer) & `account1` is ETSPlatform.

```bash
hardhat accounts --network [localhost|arbitrumSepolia]
```

output:

```bash
account0: 0x93A5f58566D436Cae0711ED4d2815B85A26924e6 Balance: 26.594860885037614049
account1: 0xE9FBC1a1925F6f117211C59b89A55b576182e1e9 Balance: 20.143140900271999525
account2: 0x60F2760f0D99330A555c5fc350099b634971C6Eb Balance: 11.00826380355641031
account3: 0xcF38E38DA8C9921f39DC8E9327Bc03bA514D4C37 Balance: 9.95031682028310787
account4: 0xE2d53594A3C7Fdf1CA86D8e957C275b72e34DA06 Balance: 9.501443532
account5: 0xdF0eB27bCc26E639137899d63B5221DABd2355f2 Balance: 9.1197065959375
account6: 0xD2592533dB2979a6c68152e8C859bAd1115474B5 Balance: 9.691938888
account7: 0x4a87997e329540Dc8bA02bEABb5C1e0f977ae1CC Balance: 0.0
account8: 0x0099e70f84475409f9567c90C8b212282cfFE671 Balance: 0.0
account9: 0x5b7B04a62431c16c9afFeB83dc423329a1998D85 Balance: 0.0
account10: 0x310e0299FfE527461341F63F3171fb2882De9E92 Balance: 0.0
```

## Relayers

**`addRelayer`**

Adds a new relayer to ETS. Signer must own a tag. Only one relayer is permitted per tag owner. Relayer name must unique to ETS. `account1` (ETSPlatform) may create unlimited relayers.

```bash
hardhat addRelayer --name "My Relayer" --signer "account3" --network [localhost|arbitrumSepolia]
```

**`togglePauseRelayerByOwner`**

Toggle switch to pauses/unpause a Relayer, `--signer` must be Relayer owner.

```bash
hardhat togglePauseRelayerByOwner --relayer "ETSRelayer" --signer "account1" --network [localhost|arbitrumSepolia]
```

**`transferRelayer`**

Transfer Relayer to a new owner, `--signer` must be Relayer owner.

```bash
hardhat transferRelayer --relayer "ETSRelayer" --signer "account1" --to "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" --network [localhost|arbitrumSepolia]
```

## Tags

**`createTags`**

Create one or more CTAGs. Required flags are `--tags` followed by one or more tags separated by commas, `--relayer` followed by Relayer name, and a `--signer` (which becomes "Creator").

```bash
hardhat createTags --relayer "ETSRelayer" --signer "account3" --tags "#USDC, #Solana" --network [localhost|arbitrumSepolia]
```

## Tagging Records

**`applyTags`**

Create a new tagging record or append tags to an existing tagging record. Required flags are `--relayer` followed by Relayer name, `--tags` followed by one or more tags separated by commas, `--uri` followed by a URI of any shape, `--record-type` followed by an arbitrary string describing the tagging record, a `--signer` (becomes the "Tagger").

Tagging record id (unique identifier) is a compound key composed of `relayer+uri+record-type+signer`

```bash
# Create a new tagging record
hardhat applyTags --relayer "Uniswap" --uri "https://solana.com/" --tags "#Solana,#Web" --record-type "discovery" --signer "account5" --network [localhost|arbitrumSepolia]

# Append #Infrastructure the tagging record we just created
hardhat applyTags --relayer "Uniswap" --uri "https://solana.com/" --tags "#Infrastructure" --record-type "discovery" --signer "account5" --network [localhost|arbitrumSepolia]
```

**`removeTags`**

Remove one or more tags from an existing Tagging Record.

```bash
# Remove #Solana from the tagging record created previously
hardhat removeTags --relayer "Uniswap" --uri "https://solana.com/" --tags "#Solana" --record-type "discovery" --signer "account5" --network [localhost|arbitrumSepolia]
```

**`replaceTags`**

Replace all tags in a tagging record.

```bash
# Replace #Solana,#Web,#Infrastructure with #Monolithic,#SolanaFoundation
hardhat removeTags --relayer "Uniswap" --uri "https://solana.com/" --tags "#Monolithic,#SolanaFoundation" --record-type "discovery" --signer "account5" --network [local]
```

## Auction House

**`auctionhouse`**

All `auctionhouse` tasks are called with the `action` flag. So a typical command will follow the pattern `hardhat auctionhouse --action [action name]`.

Depending on the action being called, additional flags may be required. Those are detailed below.

The only other required flag is the `--network` flag. This is simply the network you wish the task to be performed on. See `hardhat.config.ts` for list of configured networks. If you don't supply the network flag, the task will error out.

### Actions

**`--action settings`**

display global auction settings

`hardhat auctionhouse --action settings --network [localhost|arbitrumSepolia]`

output:

```bash
{
  paused: false,
  maxAuctions: 1,
  activeAuctions: 0,
  totalAuctions: 3,
  reserve: '0.1',
  bidIncrement: 5,
  duration: 5,
  timebuffer: 10
}
```

**`--action togglepause`**

Toggle switch to pause/unpause the auction.

```bash
hardhat auctionhouse --action togglepause --network [localhost|arbitrumSepolia]
```

**`--action setreserve`**

Sets the reserve price in ETH/POL for auctions.

```bash
# Set minimum first bid to 0.1 POL
hardhat auctionhouse --action setreserve --value 0.1 --network [localhost|arbitrumSepolia]
```

**`--action setduration`**

Sets the duration of the auction in seconds.

```bash
# set auction to one minute
hardhat auctionhouse --action setduration --value 60 --network [localhost|arbitrumSepolia]
```

**`--action settimebuffer`**

`timeBuffer` is the time in seconds required around the last bid. If a bid comes in within the `timeBuffer`, the auction is extended by this amount. For example, if `timeBuffer` is 60 seconds and a bid is cast with 10 seconds remaining, the auction is extended by 60 seconds. This prevents auction swooping.

```bash
# set auction timebuffer to one minute
hardhat auctionhouse --action settimebuffer --value 60 --network [localhost|arbitrumSepolia]
```

**`--action setmaxauctions`**

Set maximum number of active auctions that can be running at once in the Auction House.

```bash
# Set max concurrent auctions to 3
hardhat auctionhouse --action setmaxauctions --value 3 --network [localhost|arbitrumSepolia]
```

**`--action showcurrent`**

Shows details about the current open/active auction if any exist.

`hardhat auctionhouse --action showcurrent --network [localhost|arbitrumSepolia]`

output:

```bash
=================================================
    Auction Details for #way
-------------------------------------------------
      auctionId: 3
      tag: #way
      reservePrice: 0.1
      currentHighBid: 0.2
      startTime: 1704951479
      endTime: 1704951484
      currentTime: 1707011789
      bidder: 0xcF38E38DA8C9921f39DC8E9327Bc03bA514D4C37
      auctioneer: 0xE9FBC1a1925F6f117211C59b89A55b576182e1e9
      started: true
      ended: true
      settled: true
=================================================
```

optional flag: `--output: "object"` will output auction details as an json object:

```bash
Current Auction:  {
  auctionId: 3,
  tag: '#way',
  reservePrice: '0.1',
  currentHighBid: '0.2',
  startTime: 1704951479,
  endTime: 1704951484,
  currentTime: 1707012187,
  bidder: '0xcF38E38DA8C9921f39DC8E9327Bc03bA514D4C37',
  auctioneer: '0xE9FBC1a1925F6f117211C59b89A55b576182e1e9',
  started: true,
  ended: true,
  settled: true
}
```

**`--action status`**

Returns the status of a specific auction as identified by `--tag [tagstring]` or `--id [auction id]`.

```bash
hardhat auctionhouse --action status --tag [hastag] --id [auctionId] --output object --network [localhost|arbitrumSepolia]
```

output:

```bash
Current Auction:  {
  auctionId: 3,
  tag: '#way',
  reservePrice: '0.1',
  currentHighBid: '0.2',
  startTime: 1704951479,
  endTime: 1704951484,
  currentTime: 1707020409,
  bidder: '0xcF38E38DA8C9921f39DC8E9327Bc03bA514D4C37',
  auctioneer: '0xE9FBC1a1925F6f117211C59b89A55b576182e1e9',
  started: true,
  ended: true,
  settled: true
}
```

**`--action nextauction`**

Trigger release of next auction using the auction Oracle. Requires an open auction slot (no active or unsettled auctions). This is basically a utility/dev task that triggers the RequestCreateAuction event from the ETSAuctionHouse smart contract.

```bash
hardhat auctionhouse --action nextauction --network [localhost|arbitrumSepolia]
```

**`--action auction`**

Create an auction for a given tag. Requires open auction slot and tag exists and is owned by ETS.

```bash
hardhat auctionhouse --action auction --tag "#way" --network [localhost|arbitrumSepolia]
```

**`--action bid`**

Bid on an active auction.

```bash
# account3 bids 0.2POL on auction 3
hardhat auctionhouse --action bid --id "3" --signer account3 --bid 0.2 --network [localhost|arbitrumSepolia]
```

**`--action settleauction`**

Settles the latest auction assuming it has ended. Settling auction transfers tag to highest bidder and trigger release of next tag to be auctioned via the ETS Auction Oracle.

By default, ETSPlatform (account2) is the signer. You can optionally supply a different signer to settle the auction, eg `--signer account5`.

```bash
# Settle latest ended auction
hardhat auctionhouse --action settleauction --network [localhost|arbitrumSepolia]
```

## Test Data

**`testdata`**

The following test data commands are meant to rapidly populate a blockchain with ETS test data. Useful when developing locally (or on test nets).

`testdata` has the same pattern as `auctionhouse` where an `--action` flag is used.

### Testdata Actions

**`--action createTag`**

Create random CTAGs from random accounts. `--qty` sets how many tags to create, eg 10. `--signers` sets number of different signers (Tag Creators) starting from `account2` (see `hardhat accounts`).

```bash
hardhat testdata --action createTag --qty 5 --signers 4 --network [localhost|arbitrumSepolia]
```

**`--action createTaggingRecords`**

Create tagging records. `--qty` sets how many tagging records to create, `--signers` sets number of different signers (Taggers) starting from `account2`.

```bash
hardhat testdata --action createTaggingRecords --qty 4 --signers 5 --network [localhost|arbitrumSepolia]
```

**`--action createAuctions`**

Creates auctions. This command will release a tag for auction, bid on it a random number of times (up to 10) from a random bidder selected from the number of signers given in `--signers`. The auction will end, be settled, and the next auction will be released and bid on and so on for the number of auctions given by `--qty`. Requires tags are created before calling this command.

```bash
hardhat testdata --action createAuctions --qty 3 --signers 3 --network [localhost|arbitrumSepolia]
```
