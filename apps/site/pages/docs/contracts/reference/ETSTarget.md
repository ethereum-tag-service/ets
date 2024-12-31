# ETSTarget

## Overview

#### License: MIT

```solidity
contract ETSTarget is IETSTarget, UUPSUpgradeable, StringHelpers
```


## Constants info

### NAME (0xa3f4df7e)

```solidity
string constant NAME = "ETSTarget"
```


## State variables info

### etsAccessControls (0x8299f9f9)

```solidity
contract IETSAccessControls etsAccessControls
```


### etsEnrichTarget (0x1b8278e2)

```solidity
contract IETSEnrichTarget etsEnrichTarget
```


### targets (0x0a39ce02)

```solidity
mapping(uint256 => struct IETSTarget.Target) targets
```

Map of targetId to Target struct.
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
### initialize (0xc4d66de8)

```solidity
function initialize(address _etsAccessControls) public initializer
```


### setAccessControls (0xcd15832f)

```solidity
function setAccessControls(IETSAccessControls _accessControls) public onlyAdmin
```

Sets ETSAccessControls on the ETSTarget contract so functions can be
restricted to ETS platform only. Note Caller of this function must be deployer
or pre-set as admin of new contract.



Parameters:

| Name            | Type                        | Description                            |
| :-------------- | :-------------------------- | :------------------------------------- |
| _accessControls | contract IETSAccessControls | Address of ETSAccessControls contract. |

### setEnrichTarget (0xf0496c86)

```solidity
function setEnrichTarget(address _etsEnrichTarget) public onlyAdmin
```

Sets ETSEnrichTarget contract address so that Target metadata enrichment
functions can be called from ETSTarget.



Parameters:

| Name             | Type    | Description                          |
| :--------------- | :------ | :----------------------------------- |
| _etsEnrichTarget | address | Address of ETSEnrichTarget contract. |

### getOrCreateTargetId (0xcf99c815)

```solidity
function getOrCreateTargetId(string memory _targetURI) public returns (uint256)
```

Get ETS targetId from URI.

Combo function that given a URI string will return it's ETS targetId if it exists,
or create a new Target record and return corresponding targetId.



Parameters:

| Name       | Type   | Description              |
| :--------- | :----- | :----------------------- |
| _targetURI | string | URI passed in as string  |


Return values:

| Name | Type    | Description             |
| :--- | :------ | :---------------------- |
| [0]  | uint256 | Id of ETS Target record |

### createTarget (0x31bb0c69)

```solidity
function createTarget(
    string memory _targetURI
) public returns (uint256 targetId)
```

Create a Target record and return it's targetId.



Parameters:

| Name       | Type   | Description              |
| :--------- | :----- | :----------------------- |
| _targetURI | string | URI passed in as string  |


Return values:

| Name     | Type    | Description             |
| :------- | :------ | :---------------------- |
| targetId | uint256 | Id of ETS Target record |

### updateTarget (0x7ab3f1cd)

```solidity
function updateTarget(
    uint256 _targetId,
    string calldata _targetURI,
    uint256 _enriched,
    uint256 _httpStatus,
    string calldata _ipfsHash
) external returns (bool success)
```

Update a Target record.



Parameters:

| Name        | Type    | Description                                                                             |
| :---------- | :------ | :-------------------------------------------------------------------------------------- |
| _targetId   | uint256 | Id of Target being updated.                                                             |
| _targetURI  | string  | Unique resource identifier Target points to.                                            |
| _enriched   | uint256 | block timestamp when Target was last enriched                                           |
| _httpStatus | uint256 | https status of last response from ETSEnrichTarget API eg. "404", "200". defaults to 0  |
| _ipfsHash   | string  | ipfsHash of additional metadata for Target collected by ETSEnrichTarget API             |


Return values:

| Name    | Type | Description                               |
| :------ | :--- | :---------------------------------------- |
| success | bool | true when Target is successfully updated. |

### computeTargetId (0x23c7e9f3)

```solidity
function computeTargetId(
    string memory _targetURI
) public pure returns (uint256)
```

Function to deterministically compute & return a targetId.

Every Target in ETS is mapped to by it's targetId. This Id is computed from
the target URI sting hashed and cast as a uint256.

Note: Function does not verify if Target record exists.



Parameters:

| Name       | Type   | Description                                          |
| :--------- | :----- | :--------------------------------------------------- |
| _targetURI | string | Unique resource identifier Target record points to.  |


Return values:

| Name     | Type    | Description                        |
| :------- | :------ | :--------------------------------- |
| targetId | uint256 | Id of the potential Target record. |

### targetExistsByURI (0x0c48789c)

```solidity
function targetExistsByURI(string memory _targetURI) public view returns (bool)
```

Check that a Target record exists for a given URI string.



Parameters:

| Name       | Type   | Description                                          |
| :--------- | :----- | :--------------------------------------------------- |
| _targetURI | string | Unique resource identifier Target record points to.  |


Return values:

| Name | Type | Description                                 |
| :--- | :--- | :------------------------------------------ |
| [0]  | bool | true if Target record exists; false if not. |

### targetExistsById (0xcd7c68e2)

```solidity
function targetExistsById(uint256 _targetId) public view returns (bool)
```

Check that a Target record exists for a given computed targetId.



Parameters:

| Name      | Type    | Description                                             |
| :-------- | :------ | :------------------------------------------------------ |
| _targetId | uint256 | targetId uint computed from URI via computeTargetId().  |


Return values:

| Name | Type | Description                                 |
| :--- | :--- | :------------------------------------------ |
| [0]  | bool | true if Target record exists; false if not. |

### getTargetByURI (0x794e75fc)

```solidity
function getTargetByURI(
    string memory _targetURI
) public view returns (IETSTarget.Target memory)
```

Retrieve a Target record for a given URI string.

Note: returns a struct with empty members when no Target exists.



Parameters:

| Name       | Type   | Description                                          |
| :--------- | :----- | :--------------------------------------------------- |
| _targetURI | string | Unique resource identifier Target record points to.  |


Return values:

| Name | Type                     | Description    |
| :--- | :----------------------- | :------------- |
| [0]  | struct IETSTarget.Target | Target record. |

### getTargetById (0x1b2d87c3)

```solidity
function getTargetById(
    uint256 _targetId
) public view returns (IETSTarget.Target memory)
```

Retrieve a Target record for a computed targetId.

Note: returns a struct with empty members when no Target exists.



Parameters:

| Name      | Type    | Description                                             |
| :-------- | :------ | :------------------------------------------------------ |
| _targetId | uint256 | targetId uint computed from URI via computeTargetId().  |


Return values:

| Name | Type                     | Description    |
| :--- | :----------------------- | :------------- |
| [0]  | struct IETSTarget.Target | Target record. |
