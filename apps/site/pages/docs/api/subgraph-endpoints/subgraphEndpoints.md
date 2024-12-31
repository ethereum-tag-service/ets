# subgraphEndpoints

A constant object that provides a mapping of network names to their corresponding Graph Protocol endpoint URLs.

## Usage

```ts twoslash
import subgraphEndpoints from '@ethereum-tag-service/subgraph-endpoints'

const endpoint = subgraphEndpoints.arbitrumSepolia
// @log: Output: "https://api.studio.thegraph.com/query/87165/ets-arbitrum-sepolia/version/latest"
```

## Returns

`Record<string, string>`

An object containing network names mapped to their endpoint URLs.

## Properties

### Network Keys

- **Type:** `string`
- **Description:** Network identifier keys

## Examples

```ts twoslash
import subgraphEndpoints from '@ethereum-tag-service/subgraph-endpoints'

// Access localhost endpoint
const localEndpoint = subgraphEndpoints.localhost // [!code focus]
// @log: Output: "http://localhost:8000/subgraphs/name/ets-local"

// Access Arbitrum Sepolia endpoint
const arbitrumEndpoint = subgraphEndpoints.arbitrumSepolia // [!code focus]
// @log: Output: "https://api.studio.thegraph.com/query/87165/ets-arbitrum-sepolia/version/latest"

```
