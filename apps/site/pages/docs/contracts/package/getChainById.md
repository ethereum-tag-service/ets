# getChainById

Retrieves an ETS supported Viem Chain configuration object by its ID.

## Usage

```ts twoslash
import { getChainById } from '@ethereum-tag-service/contracts/utils'

const chain = getChainById('421614')
// @log: Output: Returns Viem chain object for Arbitrum Sepolia
```

## Returns

`SupportedChain`

The corresponding Chain object from the chains configuration.

## Parameters

### chainId

- **Type:** `SupportedChainId`
- **Description:** The ID of the supported chain to retrieve

## Examples

```ts twoslash
import { getChainById } from '@ethereum-tag-service/contracts/utils'

// Get Arbitrum Sepolia chain config
const arbitrumChain = getChainById('421614')

// Get Base Sepolia chain config
const baseChain = getChainById('84532')
```
