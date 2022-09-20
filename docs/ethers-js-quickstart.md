# Ethers.js quickstart

This guide walks through adding a [Publisher](./key-concepts.md#publisher) to ETS (required), creating a [CTAG](./key-concepts.md#tag-ctag), creating a [Tagging Record](./key-concepts.md#tagging-record) and modifying a Tagging Record. We'll be using set of custom [Hardhat Tasks](https://hardhat.org/) that use [Ethers.js](https://docs.ethers.io/v5/) to interact with the protocol.

If you are interested in contract-to-contract interaction, please see the [Contract-to-contract quickstart](./docs/contract-to-contract-quickstart.md).

## Setup

Our Hardhat Tasks can execute directly on the Polygon Mumbai testnet or on [ETS deployed to local hardhat network](./docs/local-dev-quickstart.md). This guide covers running on Polygon Mumbai. When running locally, all commands are the same except the `--network` flag is set to `localhost`.

For either method, you'll first need to clone the ETS repository and install ETS.

```zsh
# clone the repo directly
git clone https://github.com/ethereum-tag-service/ets.git
cd ets

pnpm install
```

Next, make sure you have a [Metamask wallet](https://blog.thirdweb.com/guides/create-a-metamask-wallet/), the secret recovery phrase for that wallet, and [some test Matic](https://blog.thirdweb.com/guides/get-matic-on-polygon-mumbai-testnet-faucet/) in one or more of the first 6 accounts.

Finally, from the root of ETS, make a copy of `example.env`, save as `.env` and add your secret recovery phrase to `MNEMONIC_MUMBAI` and a free [Alchemy API](https://www.alchemy.com/) key for Polygon Mumbai to `ALCHEMY_MUMBAI`.

Note: All commands are issued from within the contracts package.

```zsh
cd packages/contracts
```

## Check accounts and balances

Before interacting with ETS on Polygon Mumbai, you'll want to confirm that the accounts and test Matic amounts match that of your Metamask wallet. For example:

```zsh
$ hardhat accounts --network mumbai

account0: 0x93A5f58566D436Cae0711ED4d2815B85A26924e6 Balance: 1.653168035626479011
account1: 0xE9FBC1a1925F6f117211C59b89A55b576182e1e9 Balance: 0.438160535492833465
account2: 0x60F2760f0D99330A555c5fc350099b634971C6Eb Balance: 1.408666583344570904
account3: 0xcF38E38DA8C9921f39DC8E9327Bc03bA514D4C37 Balance: 3.34470009028310787
account4: 0xE2d53594A3C7Fdf1CA86D8e957C275b72e34DA06 Balance: 0.0
account5: 0xdF0eB27bCc26E639137899d63B5221DABd2355f2 Balance: 0.0
```

## Create a Publisher

```zsh
$ hardhat addPublisher --name "Solana" --network mumbai --signer "account2"

started txn 0x10d14f87fbab80b7f372256f1a1164c4d5283335b48168cd90ea262a4cb1d0ec
New publisher contract deployed at 0xb16170ed1a08EE57d18d41C204dCde3c6C9d2D1a by account2
```

Note that the signer `"account2"` becomes the Publisher Owner and that Publisher names can not be duplicated. For example, if we issue the same command:

```zsh
$ hardhat addPublisher --name "Solana" --network mumbai --signer "account2"
Publisher name exists
```

You can check that the Publisher was created with the correct credentials by running the following command in [our subgraph](https://api.thegraph.com/subgraphs/name/ethereum-tag-service/ets-mumbai/graphql).

```graphql
query Publishers {
  publishers(first: 1, orderBy: firstSeen, orderDirection: desc) {
    id
    name
    owner
  }
}
```

```json
# output
{
  "data": {
    "publishers": [
      {
        "id": "0xb16170ed1a08ee57d18d41c204dcde3c6c9d2d1a",
        "name": "Solana",
        "owner": "0x60f2760f0d99330a555c5fc350099b634971c6eb"
      }
    ]
  }
}
```

Learn more about [Publishers](./key-concepts.md#publisher). View the [addPublisher](../packages/contracts/tasks/addPublisher.js) Hardhat Task.

## Create CTAGs

Next, we'll create two CTAGs using the Publisher contract deployed in the previous step, and sign the transaction with a different account (`account3`).

```zsh
$ hardhat createTags --publisher "Solana" --signer "account3" --tags "#Phantom, #FamilySol" --network mumbai

Minting CTAGs "#Phantom,#FamilySol"
"#Phantom" minted by account3 with id 2534166372342226846419692081870028406351230466705393079417605661637489732040
"#FamilySol" minted by account3 with id 53310349790028376771296848103922679878406746938593754136048816181764772325808
```

There are a number of ways to get at the data. Here's one:

```graphql
query Tags {
  tags(where: { display_in: ["#Phantom", "#FamilySol"] }) {
    display
    publisher {
      name
      id
    }
    creator {
      id
    }
  }
}
```

```json
# output
{
  "data": {
    "tags": [
      {
        "display": "#Phantom",
        "publisher": {
          "name": "Solana",
          "id": "0xb16170ed1a08ee57d18d41c204dcde3c6c9d2d1a"
        },
        "creator": {
          "id": "0xcf38e38da8c9921f39dc8e9327bc03ba514d4c37"
        }
      },
      {
        "display": "#FamilySol",
        "publisher": {
          "name": "Solana",
          "id": "0xb16170ed1a08ee57d18d41c204dcde3c6c9d2d1a"
        },
        "creator": {
          "id": "0xcf38e38da8c9921f39dc8e9327bc03ba514d4c37"
        }
      }
    ]
  }
}

```

## Tagging Records

Next, we'll focus on the core utility of ETS, namely tagging content. In this section, we'll create a new [tagging record](./key-concepts.md#tagging-record), append tags to it, remove tags from it and finally, do a wholesale replacement (overwrite) of tags.

### Create a Tagging Record

Let's go ahead and tag some content, in this case an [NFT](https://etherscan.io/nft/0xC36442b4a4522E871399CD717aBDD847Ab11FE88/318669), and explain what's going on after...

```zsh
$ hardhat applyTags --publisher "Solana" \
--signer "account3" \
--tags "#Uniswap, #APE, #WETH, #APE/WETH" \
--uri "blink:ethereum:mainnet:0xC36442b4a4522E871399CD717aBDD847Ab11FE88:318669" \
--record-type "bookmark" \
--network mumbai

started txn 0xdbc7809ed849167e19798930202151259123dfb5b089054230f2a13aad1b9f53
New tagging record created with 4 tag(s) and id: 108496552797381919177769037368004847463135908918745565862845053892120713010827
account3 charged for 4 tags
```

Next, lets have a look at the new tagging record in the subgraph.

```graphql
query TaggingRecord {
  taggingRecords(where: { publisher_: { name: "Solana" } }) {
    timestamp
    tags {
      display
    }
    recordType
    target {
      targetURI
      targetType
      targetTypeKeywords
    }
  }
}
```

```json
# output
{
  "data": {
    "taggingRecords": [
      {
        "id": "108496552797381919177769037368004847463135908918745565862845053892120713010827",
        "timestamp": "1663648880",
        "tags": [
          {
            "display": "#Uniswap"
          },
          {
            "display": "#WETH"
          },
          {
            "display": "#APE"
          },
          {
            "display": "#APE/WETH"
          }
        ],
        "recordType": "bookmark",
        "target": {
          "targetURI": "blink:ethereum:mainnet:0xC36442b4a4522E871399CD717aBDD847Ab11FE88:318669",
          "targetType": "BLINK",
          "targetTypeKeywords": [
            "Blink",
            "ethereum",
            "mainnet",
            "0xC36442b4a4522E871399CD717aBDD847Ab11FE88:318669",
            "UNKNOWN",
            "UNKNOWN"
          ]
        }
      }
    ]
  }
}
```

So what just happened? On a conceptual level, a good way to think about Tagging Records is that they reflect **"who tagged what, with which tags, from where and why"**.

In this case, `account3` tagged the `Uniswap V3 LP NFT with ID 318669` with `"#Uniswap", "APE", "#WETH", "#APE/WETH"` from the `"Solana"` Publisher contract to create a `"bookmark"`.

There's a lot going on behind the scenes. To understand, a good place to start is the [applyTags Hardhat Task](../packages/contracts/tasks/applyTags.js) which is well documented.

A few things to note. If the tags applied ("#Uniswap", "#APE", "#WETH, "#APE/WETH") didn't exist in their tokenized form, new ones are minted just before the Tagging Record is recorded. For any new tags created, `account3` (the "Tagger") is recorded in the CTAG as the "Creator", and `Solana` is recorded as the Publisher.

This can be verified in the subgraph:

```GraphQl
query TaggingRecord {
  tags(where: {display: "#APE/WETH"}) {
    creator {
      id
    }
    publisher {
      name
      id
    }
  }
}
```

```json
{
  "data": {
    "tags": [
      {
        "creator": {
          "id": "0xcf38e38da8c9921f39dc8e9327bc03ba514d4c37"
        },
        "publisher": {
          "name": "Solana",
          "id": "0xb16170ed1a08ee57d18d41c204dcde3c6c9d2d1a"
        }
      }
    ]
  }
}
```

In addition, for the [target URI](./key-concepts.md#target), we could use the Etherscan link above. However, for the purposes of this demo, we'll use a Blink for the NFT URI.

If you are unfamiliar with [Blinks](https://w3c-ccg.github.io/blockchain-links/), they are a W3C RFC URI schema for blockchain based data. Blinks provide ETS a standardized way to know about the blockchain targets being tagged, especially during the indexing process.

### Appending tags

Next, let's go ahead and add some tags to the tagging record we just created.

```zsh
$ hardhat applyTags --publisher "Solana" \
--signer "account3" \
--tags "#Uniswap, #NFT, #Ethereum, #ERC-20, #Solana" \
--uri "blink:ethereum:mainnet:0xC36442b4a4522E871399CD717aBDD847Ab11FE88:318669" \
--record-type "bookmark" \
--network mumbai

started txn 0x70cf32caaad4ef89f892e6a304a325a5ae01135351b9bdca6a1ab543e8a133b9
4 tag(s) appended to 108496552797381919177769037368004847463135908918745565862845053892120713010827
account3 charged for 4 tags
```

Again there's a lot going on here, and to get a handle on things it would be best to have a look at the [applyTags Hardhat Task](../packages/contracts/tasks/applyTags.js) which is well documented.

A few things to point out. First off, note that the only thing that changed between the two calls is the `--tags` argument. Had any of the other arguments changed, a new tagging record would have been created. This is because a tagging record id is a [composite key](./backend-api/ETS.md#computetaggingrecordidfromrawinput) made up of targetId+recordType+publisher+tagger.

The other thing to note is even though five tags were passed in, "#Uniswap" already existed in the tagging record, and ETS respects that, therefore only four tag(s) were appended to the record.

### Removing tags

"#ERC-20" and "#Solana" are a bit out of place so let's remove them:

```zsh
$ hardhat removeTags --publisher "Solana" \
--signer "account3" \
--tags "#ERC-20, #Solana" \
--uri "blink:ethereum:mainnet:0xC36442b4a4522E871399CD717aBDD847Ab11FE88:318669" \
--record-type "bookmark" \
--network mumbai

started txn 0x46c6174132fc0ae2aa859b7856cff60c6fa0b54be72691abd0a951beb65fec94
2 tag(s) removed from 108496552797381919177769037368004847463135908918745565862845053892120713010827
account3 charged for 0 tags
```

Even if tagging fees are enabled, as they are in this demo, ETS never charges to remove tags from a tagging record.

Have a look at the [removeTags Hardhat Task](../packages/contracts/tasks/removeTags.js) for what's going on behind the scenes.

Again, note that had any of the arguments other than --tags changed, you'd likely get a "Tagging record not found". This makes Tagging Records tamper proof.

```zsh
$ hardhat removeTags --publisher "Solana" \
--signer "account2" \ # <-- Different signer
--tags "#ERC-20, #Solana" \
--uri "blink:ethereum:mainnet:0xC36442b4a4522E871399CD717aBDD847Ab11FE88:318669" \
--record-type "bookmark" \
--network mumbai

Tagging record not found
```

### Replacing tags

ETS allows for wholesale tag replacement in a tagging record.

```zsh
$ hardhat replaceTags --publisher "Solana" \
--signer "account3" \
--tags "#NFTsRock, #Like, #Tracking" \
--uri "blink:ethereum:mainnet:0xC36442b4a4522E871399CD717aBDD847Ab11FE88:318669" \
--record-type "bookmark" \
--network mumbai

started txn 0x3af5ee4b95d1799db9f4e166af92bec2da0e76a46ee81c9e72f5b87789cfb667
3 tag(s) replaced in 108496552797381919177769037368004847463135908918745565862845053892120713010827
account3 charged for 3 tags
```

Here's the [replaceTags Hardhat Task](../packages/contracts/tasks/replaceTags.js) for what's going on behind the scenes.

After running this Task, the tagging record will have 3 tags, "#NFTsRock", "#Like", "#Tracking"

```GraphQL
query TaggingRecord {
  taggingRecord(
    id: "108496552797381919177769037368004847463135908918745565862845053892120713010827") {
    tags {
      id
      display
    }
  }
}
```

```json
#output
{
  "data": {
    "taggingRecord": {
      "tags": [
        {
          "id": "11940174527937795487622668601435799153001121215016378815156862288936869596837",
          "display": "#Like"
        },
        {
          "id": "5418824124532979297078027690957359053463476613018091843950790331888927001282",
          "display": "#Tracking"
        },
        {
          "id": "77194467893067961604272989990640985373369769410062242421244700929529945107175",
          "display": "#NFTsRock"
        }
      ]
    }
  }
}
```
