# ETSRelayerFactory

## Overview

#### License: MIT

```solidity
contract ETSRelayerFactory is Context
```


## Constants info

### NAME (0xa3f4df7e)

```solidity
string constant NAME = "ETS Relayer Factory V1"
```

Public constants
## State variables info

### etsAccessControls (0x8299f9f9)

```solidity
contract IETSAccessControls etsAccessControls
```

ETS access controls contract.
### ets (0x15ccda22)

```solidity
contract IETS ets
```

Address and interface for ETS Core.
### etsToken (0x46ca0f4d)

```solidity
contract IETSToken etsToken
```

Address and interface for ETS Token
### etsTarget (0x56c63489)

```solidity
contract IETSTarget etsTarget
```

Address and interface for ETS Target.
## Modifiers info

### onlyValidName

```solidity
modifier onlyValidName(string calldata _name)
```


## Functions info

### constructor

```solidity
constructor(
    address _etsRelayerLogic,
    IETSAccessControls _etsAccessControls,
    IETS _ets,
    IETSToken _etsToken,
    IETSTarget _etsTarget
)
```


### addRelayer (0xc09b06b4)

```solidity
function addRelayer(
    string calldata _relayerName
) external onlyValidName(_relayerName) returns (address relayer)
```


### getImplementation (0xaaf10f42)

```solidity
function getImplementation() public view returns (address)
```


### getBeacon (0x2d6b3a6b)

```solidity
function getBeacon() public view returns (address)
```

