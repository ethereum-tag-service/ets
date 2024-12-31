# ETSRelayerBeacon

## Overview

#### License: MIT

```solidity
contract ETSRelayerBeacon is Ownable
```


## State variables info

### relayerLogic (0xd2977ad8)

```solidity
address relayerLogic
```


## Functions info

### constructor

```solidity
constructor(address _relayerLogic)
```


### update (0x1c1b8772)

```solidity
function update(address _relayerLogic) public onlyOwner
```


### implementation (0x5c60da1b)

```solidity
function implementation() public view returns (address)
```

