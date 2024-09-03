# Backend API (contracts)

Note: The latest testnet contract addresses can also be found [here](../../packages/contracts/export/chainConfig/arbitrumSepolia.json).

## Contract API Documentation

Listed below are links to output from [solidity-docgen](https://github.com/OpenZeppelin/solidity-docgen) for key ETS smart contracts.

- **[ETSAccessControls](./ETSAccessControls.md)**
  Central access control and permissioning center for ETS.

- **[ETSToken](./ETSToken.md)**
  Contract that governs the creation & management of ETS [composable tags](../key-concepts.md#tag-ctag) (CTAGs).

- **[ETSTarget](./ETSTarget.md)**
  Contracts that governs creation of ETS [Targets](../key-concepts.md#target).

- **[ETS](./ETS.md) (aka. "ETS Core")**
  Central point for performing CRUD (Create, Read, Update, Delete) operations on ETS [Tagging Records](../key-concepts.md#tagging-record).

  Also contains governance functions around tagging fees as well as means for market participants to access accrued funds.

- **[ETSRelayerFactory](./ETSRelayerFactory.md)**
  Public facing API for deploying instances of ETSRelayerV1 contracts. Caller becomes owner of instance.

- **[IETSRelayer](./relayers/interfaces/IETSRelayer.md)**
  Base interface required for a [Relayer](../key-concepts.md#relayer-contract) contract.

- **[ETSRelayerV1](./relayers/ETSRelayerV1.md)**
  A simple, ETS designed Relayer contract that extends base IETSRelayer with some easy to use calls into ETS Core. Can be quickly deployed via ETSRelayerFactory. See [ETSRelayerV1.sol](../../packages/contracts/contracts/relayers/ETSRelayerV1.sol)
