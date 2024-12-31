# getAlchemyRpcUrl

Generates the base Alchemy RPC URL for a given chain Id.

## Usage

```ts twoslash
import { getAlchemyRpcUrl } from '@ethereum-tag-service/contracts/utils'

const url = getAlchemyRpcUrl('421614')
// @log: Output: "https://arb-sepolia.g.alchemy.com/v2/"
```

## Returns

`string`

A string representing the Alchemy RPC URL for the specified chain.

## Parameters

### chainId

- **Type:** `string`
- **Description:** The chain ID (e.g., "421614" for Arbitrum Sepolia)

## Supported Chain IDs

- `"421614"`: arb-sepolia
- `"84532"`: base-sepolia

## Examples

```ts twoslash
import { getAlchemyRpcUrl } from '@ethereum-tag-service/contracts/utils'

// Get Arbitrum Sepolia RPC URL
const arbitrumUrl = getAlchemyRpcUrl('421614')
// @log: Output: https://arb-sepolia.g.alchemy.com/v2/

// Get Base Sepolia RPC URL
const baseUrl = getAlchemyRpcUrl('84532')
// @log: Output: https://base-sepolia.g.alchemy.com/v2/
```
