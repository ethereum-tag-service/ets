# ETSEnrichTarget

## Overview

#### License: MIT

```solidity
contract ETSEnrichTarget is IETSEnrichTarget, Initializable, ContextUpgradeable, UUPSUpgradeable
```


## Constants info

### NAME (0xa3f4df7e)

```solidity
string constant NAME = "ETSEnrichTarget"
```


## State variables info

### etsAccessControls (0x8299f9f9)

```solidity
contract IETSAccessControls etsAccessControls
```

ETS access controls smart contract.
### etsTarget (0x56c63489)

```solidity
contract IETSTarget etsTarget
```

ETS access controls smart contract.
## Modifiers info

### onlyAdmin

```solidity
modifier onlyAdmin()
```


## Functions info

### constructor

```solidity
constructor()
```

oz-upgrades-unsafe-allow: constructor
### initialize (0x485cc955)

```solidity
function initialize(
    IETSAccessControls _etsAccessControls,
    IETSTarget _etsTarget
) public initializer
```


### requestEnrichTarget (0x6a34db1c)

```solidity
function requestEnrichTarget(uint256 _targetId) public
```

Request enrichment for a Target using the hybrid ETS Enrich Target API.



Parameters:

| Name      | Type    | Description                  |
| :-------- | :------ | :--------------------------- |
| _targetId | uint256 | Id of Target being enriched. |

### fulfillEnrichTarget (0x5b6411ab)

```solidity
function fulfillEnrichTarget(
    uint256 _targetId,
    string calldata _ipfsHash,
    uint256 _httpStatus
) public
```

Updates Target record with additional metadata stored behind IPFS hash.



Parameters:

| Name        | Type    | Description                                              |
| :---------- | :------ | :------------------------------------------------------- |
| _targetId   | uint256 | Id of Target being enriched & updated.                   |
| _ipfsHash   | string  | IPFS hash with metadata related to the Target.           |
| _httpStatus | uint256 | HTTP response code from off-chain ETS Enrich Target API. |
