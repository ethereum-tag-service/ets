---
"@ethereum-tag-service/contracts": patch
---

Significant refactor of the contracts package including the following:

1. Refactor deployment scripts to take target chain as argument.
2. Refactor package bundler to utilize tsup
3. Change deployment artifacts folder to /src
4. Add chain visibility functions to package including chains() & availableChainIds()
5. Add utility functions see /src/utils.ts

These changes make it easier for consuming applications to access available chain info via the @ethereum-tag-service/contracts package.
