# @ethereum-tag-service/subgraph-endpoints

## 1.0.0

### Major Changes

- [#523](https://github.com/ethereum-tag-service/ets/pull/523) [`daf499b`](https://github.com/ethereum-tag-service/ets/commit/daf499b6ed9378e3c313a7d6c9ad389e0eaada89) Thanks [@mhpaler](https://github.com/mhpaler)! - BREAKING: Refactor ETS to Base-only architecture

  This release removes all Arbitrum support and refactors ETS to run exclusively on Base blockchain. This is a breaking change for all applications using ETS on Arbitrum.

  **Breaking Changes:**
  - Removed all Arbitrum Sepolia (chainId: 421614) contract deployments and configurations
  - Removed Arbitrum network support from multichain configuration
  - Removed arbitrumSepolia subgraph endpoints
  - SDK clients now only support Base Sepolia (chainId: 84532) and localhost (chainId: 31337)
  - Environment-aware contract address resolution now properly supports localhost development

  **Migration Guide:**
  - Update all chainId references from 421614 (Arbitrum Sepolia) to 84532 (Base Sepolia)
  - Update wagmi chain imports from `arbitrumSepolia` to `baseSepolia`
  - Update subgraph endpoint calls to use Base Sepolia instead of Arbitrum
  - Update testnet ETH faucet links to Base Sepolia faucets
  - No code changes needed for environment-aware deployments (staging/production)

  **Technical Improvements:**
  - Fixed localhost contract address resolution for development environments
  - Simplified architecture with single blockchain support
  - Updated Wagmi CLI plugin to generate backward-compatible contract addresses
  - Preserved environment-specific contract resolution (staging/production)

### Patch Changes

- [#523](https://github.com/ethereum-tag-service/ets/pull/523) [`daf499b`](https://github.com/ethereum-tag-service/ets/commit/daf499b6ed9378e3c313a7d6c9ad389e0eaada89) Thanks [@mhpaler](https://github.com/mhpaler)! - Scaffold API3 Airnode integration with environment-specific contract deployments and parametrized oracle setup

## 0.0.5

### Patch Changes

- [#473](https://github.com/ethereum-tag-service/ets/pull/473) [`dd527ea`](https://github.com/ethereum-tag-service/ets/commit/dd527ea061686107510492dcedf7ea2a2555a18c) Thanks [@mhpaler](https://github.com/mhpaler)! - Update typescript and viem.

## 0.0.4

### Patch Changes

- [#401](https://github.com/ethereum-tag-service/ets/pull/401) [`d544088`](https://github.com/ethereum-tag-service/ets/commit/d544088664ac78424d290ee417c85dd9bf205749) Thanks [@mhpaler](https://github.com/mhpaler)! - Support multi-chains for ETS testnet.

- [#394](https://github.com/ethereum-tag-service/ets/pull/394) [`465ffe6`](https://github.com/ethereum-tag-service/ets/commit/465ffe6a5d99a469e770d5118e231eccf3faa86f) Thanks [@mhpaler](https://github.com/mhpaler)! - Add new function getSubgraphEndpoint(chainId) to fetch endpoint by chainId. Add basic unit test.

## 0.0.3

### Patch Changes

- [#370](https://github.com/ethereum-tag-service/ets/pull/370) [`4d2a9f2`](https://github.com/ethereum-tag-service/ets/commit/4d2a9f27ab59017b87294573ebc5f5f5a08d22f7) Thanks [@mhpaler](https://github.com/mhpaler)! - Added tagging record txnHash as field to the subgraph api.

## 0.0.2

### Patch Changes

- [#364](https://github.com/ethereum-tag-service/ets/pull/364) [`c85ab03`](https://github.com/ethereum-tag-service/ets/commit/c85ab033adbff506a27e0c747da01a0ac53e9f59) Thanks [@mhpaler](https://github.com/mhpaler)! - Add and configure and execute repository & package linting.

## 0.0.1

### Patch Changes

- ddefb50: Initial alpha-testnet release of sdk packages.
- 343c7d5: Testnet alpha release of subgraph-endpoints.
