# availableNetworkNames

An array of all supported network names.

## Usage

```ts twoslash
import { availableNetworkNames } from '@ethereum-tag-service/contracts'

console.log(availableNetworkNames)
// @log: Output: ["arbitrumsepolia", "basesepolia", "hardhat"]
```

## Returns

`string[]`

Array of network name strings.

## Examples

```ts twoslash
import { availableNetworkNames } from '@ethereum-tag-service/contracts'

// Check if network name is supported
const isSupported = availableNetworkNames.includes('arbitrumsepolia');

// Iterate over network names
availableNetworkNames.forEach(name => {
  console.log(name)
})
// @log: Output: "arbitrumsepolia"
// @log: Output: "basesepolia"
// @log: Output: "hardhat"
```
