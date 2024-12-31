# getExplorerUrl

Generates a URL to a transaction, address, or CTAG token on the block explorer for a given chain.
This function is mainly meant for internal use, generating URLs for the ETS Explorer.

## Usage

```ts twoslash
import { getExplorerUrl } from '@ethereum-tag-service/contracts/utils'

const url = getExplorerUrl('421614', 'tx', '0x123...')
// @log: Output: Returns block explorer URL for the transaction
```

## Returns

`string`

A string representing the full URL to the block explorer.

## Parameters

### chainId

- **Type:** `SupportedChainId`
- **Description:** The ID of the chain. Must be an ETS supported chain ID.

### type

- **Type:** `"tx" | "nft" | "address" | "token"`
- **Default:** `"tx"`
- **Description:** The type of URL to generate. When type is "nft" or "token", hash must be CTAG token ID.

### hash

- **Type:** `string`
- **Optional:** Yes
- **Description:** Hash or identifier for the transaction, address, or token

## Examples

```ts twoslash
import { getExplorerUrl } from '@ethereum-tag-service/contracts/utils'

// Get transaction URL on Arbitrum Sepolia
const txUrl = getExplorerUrl('421614', 'tx', '0x123...')
// @log: Output: https://sepolia.arbiscan.io/tx/0x123...

// Get CTAG token URL on Base Sepolia
const nftUrl = getExplorerUrl('84532', 'nft', '123456...')
// @log: Output: https://sepolia.basescan.org/nft/0x0300c9f3FE108bf683D03005B6B66EA1db74007A/123456...

// Get address URL on Arbitrum Sepolia
const addressUrl = getExplorerUrl('421614', 'address', '0x456...')
// @log: Output: https://sepolia.arbiscan.io/address/0x456...
```
