# Ethereum Tag Service Contracts

Ethereum Tag Service (ETS) is an EVM-based content tagging service running on the Polygon Blockchain. ETS provides composable tagging infrastructure through smart contract interactions.

## Core Features

- Fully composable tags and tagging data
- Contract-to-contract interaction support
- Publisher and Relayer interfaces for custom implementations

## Installation

With Hardhat or Truffle:

```bash
npm install @ethereum-tag-service/contracts
```

or with pnpm:

```sh
pnpm install @ethereum-tag-service/contracts
```

## Implementing a Relayer

The IETSRelayer interface provides core tagging functionality:

```solidity
pragma solidity ^0.8.10;

import {IETSRelayer} from "@ethereum-tag-service/contracts/relayers/interfaces/IETSRelayer.sol";

contract MyRelayer is IETSRelayer {
    // Implement required interface methods
}
```

Key Relayer capabilities:

- Apply, replace, and remove tags
- Create new tags
- Compute tagging fees
- Ownership and pause controls

## Usage Example

This implementation allows your contract to leverage an existing Relayer's functionality to apply tags through the ETS protocol. The msg.value is forwarded to cover any tagging fees.

```solidity
pragma solidity ^0.8.10;

import {IETSRelayer} from "@ethereum-tag-service/contracts/relayers/interfaces/IETSRelayer.sol";
import {IETS} from "@ethereum-tag-service/contracts/interfaces/IETS.sol";

contract MyContract {
    // Initialize with specific deployed relayer address
    IETSRelayer public relayer = IETSRelayer(0xd2499cf4a47a959217efeacefb7edbd524661f59);

    // Or set via constructor
    constructor(address _relayerAddress) {
        relayer = IETSRelayer(_relayerAddress);
    }

    function applyTags(IETS.TaggingRecordRawInput[] calldata _rawInput) external payable {
        // Forward the tagging request to the relayer
        relayer.applyTags{value: msg.value}(_rawInput);
    }
}

```
