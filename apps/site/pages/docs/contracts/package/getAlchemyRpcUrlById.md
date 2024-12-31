# getAlchemyRpcUrlById

Retrieves the complete Alchemy RPC URL for a given chain ID.

## Usage

```ts twoslash
import { getAlchemyRpcUrlById } from '@ethereum-tag-service/contracts/utils'

const url = getAlchemyRpcUrlById('421614', 'your-api-key')
// @log: Output: "https://arb-sepolia.g.alchemy.com/v2/your-api-key"
```

## Returns

`string`

A string representing the complete Alchemy RPC URL with API key.

## Parameters

### chainId

- **Type:** `SupportedChainId`
- **Description:** The ID of the chain

### alchemyKey

- **Type:** `string`
- **Description:** The Alchemy API key to append to the URL

## Examples

```ts twoslash
import { getAlchemyRpcUrlById } from '@ethereum-tag-service/contracts/utils'

// Get complete Arbitrum Sepolia RPC URL
const arbitrumUrl = getAlchemyRpcUrlById('421614', 'YOUR_API_KEY')
// @log: Output: https://arb-sepolia.g.alchemy.com/v2/YOUR_API_KEY

// Get complete Base Sepolia RPC URL
const baseUrl = getAlchemyRpcUrlById('84532', 'YOUR_API_KEY')
// @log: Output: https://base-sepolia.g.alchemy.com/v2/YOUR_API_KEY
```
