# ETSAccessControls

## Overview

#### License: MIT

```solidity
contract ETSAccessControls is Initializable, AccessControlUpgradeable, IETSAccessControls, UUPSUpgradeable
```


## Constants info

### NAME (0xa3f4df7e)

```solidity
string constant NAME = "ETS access controls"
```

Public constants
### RELAYER_ROLE (0x926d7d7f)

```solidity
bytes32 constant RELAYER_ROLE = keccak256("RELAYER_ROLE")
```


### RELAYER_FACTORY_ROLE (0xdd37dc22)

```solidity
bytes32 constant RELAYER_FACTORY_ROLE = keccak256("RELAYER_FACTORY_ROLE")
```


### RELAYER_ADMIN_ROLE (0xbf2a2241)

```solidity
bytes32 constant RELAYER_ADMIN_ROLE = keccak256("RELAYER_ADMIN_ROLE")
```


### AUCTION_ORACLE_ROLE (0xc8d8311d)

```solidity
bytes32 constant AUCTION_ORACLE_ROLE = keccak256("AUCTION_ORACLE_ROLE")
```


### SMART_CONTRACT_ROLE (0x857d2608)

```solidity
bytes32 constant SMART_CONTRACT_ROLE = keccak256("SMART_CONTRACT_ROLE")
```


## State variables info

### relayerLocked (0x942da8f0)

```solidity
mapping(address => bool) relayerLocked
```

Mapping to contain whether Relayer is paused by the protocol.
### relayerNameToContract (0x1a943187)

```solidity
mapping(string => address) relayerNameToContract
```

Relayer name to contract address.
### relayerContractToName (0x5235075c)

```solidity
mapping(address => string) relayerContractToName
```

Relayer contract address to human readable name.
### relayerOwnerToAddress (0xac9f40a5)

```solidity
mapping(address => address) relayerOwnerToAddress
```

Relayer owner address to relayer address.
## Modifiers info

### onlyValidName

```solidity
modifier onlyValidName(string calldata _name)
```


## Functions info

### constructor

```solidity
constructor()
```

oz-upgrades-unsafe-allow: constructor
### initialize (0xc4d66de8)

```solidity
function initialize(address _platformAddress) public initializer
```


### setPlatform (0x6945c5ea)

```solidity
function setPlatform(
    address payable _platform
) public onlyRole(DEFAULT_ADMIN_ROLE)
```

Sets the Platform wallet address. Can only be called by address with DEFAULT_ADMIN_ROLE.



Parameters:

| Name      | Type            | Description                      |
| :-------- | :-------------- | :------------------------------- |
| _platform | address payable | The new Platform address to set. |

### setRoleAdmin (0x1e4e0091)

```solidity
function setRoleAdmin(
    bytes32 _role,
    bytes32 _adminRole
) public onlyRole(DEFAULT_ADMIN_ROLE)
```

Sets the role admin for a given role. An address with role admin can grant or
revoke that role for other addresses. Can only be called by address with DEFAULT_ADMIN_ROLE.



Parameters:

| Name       | Type    | Description                                         |
| :--------- | :------ | :-------------------------------------------------- |
| _role      | bytes32 | bytes32 representation of role being administered.  |
| _adminRole | bytes32 | bytes32 representation of administering role.       |

### registerRelayer (0x2b70420b)

```solidity
function registerRelayer(
    address _relayer,
    string calldata _name,
    address _owner
) public onlyRole(RELAYER_FACTORY_ROLE)
```

Adds a Relayer contract to ETS. Can only be called by address
with DEFAULT_ADMIN_ROLE.



Parameters:

| Name     | Type    | Description                                                    |
| :------- | :------ | :------------------------------------------------------------- |
| _relayer | address | Address of the Relayer contract. Must conform to IETSRelayer.  |
| _name    | string  | Human readable name of the Relayer.                            |
| _owner   | address | Address of relayer owner.                                      |

### pauseRelayerByOwnerAddress (0xa10138e8)

```solidity
function pauseRelayerByOwnerAddress(
    address _relayerOwner
) public onlyRole(RELAYER_ADMIN_ROLE)
```

Pause relayer given the relayer owner address. Callable by Platform only.



Parameters:

| Name          | Type    | Description                   |
| :------------ | :------ | :---------------------------- |
| _relayerOwner | address | Address of the Relayer owner. |

### changeRelayerOwner (0x8e0ed37c)

```solidity
function changeRelayerOwner(
    address _currentOwner,
    address _newOwner
) public onlyRole(RELAYER_ROLE)
```

Change the relayer owner as stored in ETSAccessControls. Callable from Relayer only.
Called via changeOwner() on a relayer.



Parameters:

| Name          | Type    | Description                            |
| :------------ | :------ | :------------------------------------- |
| _currentOwner | address | Address of the current relayer owner.  |
| _newOwner     | address | Address of the new relayer owner.      |

### toggleRelayerLock (0x21c82406)

```solidity
function toggleRelayerLock(
    address _relayer
) public onlyRole(RELAYER_ADMIN_ROLE)
```

Pauses/Unpauses a Relayer contract. Can only be called by address
with DEFAULT_ADMIN_ROLE.



Parameters:

| Name     | Type    | Description                      |
| :------- | :------ | :------------------------------- |
| _relayer | address | Address of the Relayer contract. |

### isSmartContract (0x347308b2)

```solidity
function isSmartContract(address _addr) public view returns (bool)
```

Checks whether given address has SMART_CONTRACT role.



Parameters:

| Name  | Type    | Description             |
| :---- | :------ | :---------------------- |
| _addr | address | Address being checked.  |


Return values:

| Name | Type | Description                                      |
| :--- | :--- | :----------------------------------------------- |
| [0]  | bool | boolean True if address has SMART_CONTRACT role. |

### isAdmin (0x24d7806c)

```solidity
function isAdmin(address _addr) public view returns (bool)
```

Checks whether given address has DEFAULT_ADMIN_ROLE role.



Parameters:

| Name  | Type    | Description             |
| :---- | :------ | :---------------------- |
| _addr | address | Address being checked.  |


Return values:

| Name | Type | Description                                          |
| :--- | :--- | :--------------------------------------------------- |
| [0]  | bool | boolean True if address has DEFAULT_ADMIN_ROLE role. |

### isAuctionOracle (0x58594dc4)

```solidity
function isAuctionOracle(address _addr) public view returns (bool)
```

Checks whether given address has AUCTION_ORACLE_ROLE role.



Parameters:

| Name  | Type    | Description             |
| :---- | :------ | :---------------------- |
| _addr | address | Address being checked.  |


Return values:

| Name | Type | Description                                           |
| :--- | :--- | :---------------------------------------------------- |
| [0]  | bool | boolean True if address has AUCTION_ORACLE_ROLE role. |

### isRelayerFactory (0xf968b877)

```solidity
function isRelayerFactory(address _addr) public view returns (bool)
```

Checks whether given address can act as relayer factory.



Parameters:

| Name  | Type    | Description             |
| :---- | :------ | :---------------------- |
| _addr | address | Address being checked.  |


Return values:

| Name | Type | Description                                         |
| :--- | :--- | :-------------------------------------------------- |
| [0]  | bool | boolean True if address can act as relayer factory. |

### isRelayer (0x541d5548)

```solidity
function isRelayer(address _addr) public view returns (bool)
```

Checks whether given address is a relayer.



Parameters:

| Name  | Type    | Description             |
| :---- | :------ | :---------------------- |
| _addr | address | Address being checked.  |


Return values:

| Name | Type | Description                               |
| :--- | :--- | :---------------------------------------- |
| [0]  | bool | boolean True if address can be a relayer. |

### isRelayerLocked (0xa8e2f235)

```solidity
function isRelayerLocked(address _addr) public view returns (bool)
```

Checks relayer is paused by ETS Platform.



Parameters:

| Name  | Type    | Description             |
| :---- | :------ | :---------------------- |
| _addr | address | Address being checked.  |


Return values:

| Name | Type | Description                                            |
| :--- | :--- | :----------------------------------------------------- |
| [0]  | bool | boolean True if relayer address is paused by platform. |

### isRelayerAndNotPaused (0x01b96189)

```solidity
function isRelayerAndNotPaused(address _addr) public view returns (bool)
```

Checks whether given address is a registered Relayer and not paused.



Parameters:

| Name  | Type    | Description             |
| :---- | :------ | :---------------------- |
| _addr | address | Address being checked.  |


Return values:

| Name | Type | Description                                          |
| :--- | :--- | :--------------------------------------------------- |
| [0]  | bool | boolean True if address is a Relayer and not paused. |

### isRelayerByOwner (0x8776887a)

```solidity
function isRelayerByOwner(address _addr) public view returns (bool)
```

Checks whether given address owns a relayer.



Parameters:

| Name  | Type    | Description             |
| :---- | :------ | :---------------------- |
| _addr | address | Address being checked.  |


Return values:

| Name | Type | Description                             |
| :--- | :--- | :-------------------------------------- |
| [0]  | bool | boolean True if address owns a relayer. |

### isRelayerAdmin (0x3498e6ab)

```solidity
function isRelayerAdmin(address _addr) public view returns (bool)
```

Checks whether given address has RELAYER_ADMIN role.



Parameters:

| Name  | Type    | Description             |
| :---- | :------ | :---------------------- |
| _addr | address | Address being checked.  |


Return values:

| Name | Type | Description                                     |
| :--- | :--- | :---------------------------------------------- |
| [0]  | bool | boolean True if address has RELAYER_ADMIN role. |

### isRelayerByName (0x277c3f40)

```solidity
function isRelayerByName(string memory _name) public view returns (bool)
```

Checks whether given Relayer Name is a registered Relayer.



Parameters:

| Name  | Type   | Description          |
| :---- | :----- | :------------------- |
| _name | string | Name being checked.  |


Return values:

| Name | Type | Description                         |
| :--- | :--- | :---------------------------------- |
| [0]  | bool | boolean True if _name is a Relayer. |

### isRelayerByAddress (0x6ab04a93)

```solidity
function isRelayerByAddress(address _addr) public view returns (bool)
```

Checks whether given address is a registered Relayer.



Parameters:

| Name  | Type    | Description             |
| :---- | :------ | :---------------------- |
| _addr | address | Address being checked.  |


Return values:

| Name | Type | Description                                      |
| :--- | :--- | :----------------------------------------------- |
| [0]  | bool | boolean True if address is a registered Relayer. |

### getRelayerAddressFromName (0xa710f73e)

```solidity
function getRelayerAddressFromName(
    string memory _name
) public view returns (address)
```

Get relayer address from it's name.



Parameters:

| Name  | Type   | Description       |
| :---- | :----- | :---------------- |
| _name | string | Name of relayer.  |


Return values:

| Name | Type    | Description         |
| :--- | :------ | :------------------ |
| [0]  | address | Address of relayer. |

### getRelayerNameFromAddress (0x985dcdac)

```solidity
function getRelayerNameFromAddress(
    address _address
) public view returns (string memory)
```

Get relayer name from it's address.



Parameters:

| Name     | Type    | Description           |
| :------- | :------ | :-------------------- |
| _address | address | Adsdress of relayer.  |


Return values:

| Name | Type   | Description      |
| :--- | :----- | :--------------- |
| [0]  | string | Name of relayer. |

### getRelayerAddressFromOwner (0xdf3b5580)

```solidity
function getRelayerAddressFromOwner(
    address _address
) public view returns (address)
```

Get relayer address from its owner address.



Parameters:

| Name     | Type    | Description                |
| :------- | :------ | :------------------------- |
| _address | address | address of relayer owner.  |


Return values:

| Name | Type    | Description         |
| :--- | :------ | :------------------ |
| [0]  | address | Address of relayer. |

### getPlatformAddress (0x3c0c4566)

```solidity
function getPlatformAddress() public view returns (address payable)
```

Returns wallet address for ETS Platform.



Return values:

| Name | Type            | Description           |
| :--- | :-------------- | :-------------------- |
| [0]  | address payable | ETS Platform address. |
