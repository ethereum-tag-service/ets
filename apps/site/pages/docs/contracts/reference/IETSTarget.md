# IETSTarget

## Overview

#### License: MIT

```solidity
interface IETSTarget
```


## Structs info

### Target

```solidity
struct Target {
	string targetURI;
	address createdBy;
	uint256 enriched;
	uint256 httpStatus;
	string ipfsHash;
}
```


## Events info

### AccessControlsSet

```solidity
event AccessControlsSet(address etsAccessControls)
```

emitted when the ETSAccessControls is set.



Parameters:

| Name              | Type    | Description                                   |
| :---------------- | :------ | :-------------------------------------------- |
| etsAccessControls | address | contract address ETSAccessControls is set to. |

### EnrichTargetSet

```solidity
event EnrichTargetSet(address etsEnrichTarget)
```

emitted when the ETSEnrichTarget API address is set.



Parameters:

| Name            | Type    | Description                                 |
| :-------------- | :------ | :------------------------------------------ |
| etsEnrichTarget | address | contract address ETSEnrichTarget is set to. |

### TargetCreated

```solidity
event TargetCreated(uint256 targetId)
```

emitted when a new Target is created.



Parameters:

| Name     | Type    | Description              |
| :------- | :------ | :----------------------- |
| targetId | uint256 | Unique Id of new Target. |

### TargetUpdated

```solidity
event TargetUpdated(uint256 targetId)
```

emitted when an existing Target is updated.



Parameters:

| Name     | Type    | Description                 |
| :------- | :------ | :-------------------------- |
| targetId | uint256 | Id of Target being updated. |

## Functions info

### setEnrichTarget (0xf0496c86)

```solidity
function setEnrichTarget(address _etsEnrichTarget) external
```

Sets ETSEnrichTarget contract address so that Target metadata enrichment
functions can be called from ETSTarget.



Parameters:

| Name             | Type    | Description                          |
| :--------------- | :------ | :----------------------------------- |
| _etsEnrichTarget | address | Address of ETSEnrichTarget contract. |

### getOrCreateTargetId (0xcf99c815)

```solidity
function getOrCreateTargetId(
    string memory _targetURI
) external returns (uint256)
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
) external returns (uint256 targetId)
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
) external view returns (uint256 targetId)
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
function targetExistsByURI(
    string memory _targetURI
) external view returns (bool)
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
function targetExistsById(uint256 _targetId) external view returns (bool)
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
) external view returns (IETSTarget.Target memory)
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
) external view returns (IETSTarget.Target memory)
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
