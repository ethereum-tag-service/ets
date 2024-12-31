# IETSRelayer

## Overview

#### License: MIT

```solidity
interface IETSRelayer
```


## Events info

### RelayerPauseToggledByOwner

```solidity
event RelayerPauseToggledByOwner(address relayerAddress)
```

Emitted when an IETSRelayer contract is paused/unpaused by owner.



Parameters:

| Name           | Type    | Description                  |
| :------------- | :------ | :--------------------------- |
| relayerAddress | address | Address of relayer contract. |

### RelayerOwnerChanged

```solidity
event RelayerOwnerChanged(address relayerAddress)
```

Emitted when an IETSRelayer contract has changed owners.



Parameters:

| Name           | Type    | Description                  |
| :------------- | :------ | :--------------------------- |
| relayerAddress | address | Address of relayer contract. |

## Functions info

### pause (0x8456cb59)

```solidity
function pause() external
```

Pause this relayer contract.

This function can only be called by the owner when the contract is unpaused.
### unpause (0x3f4ba83a)

```solidity
function unpause() external
```

Unpause this relayer contract.

This function can only be called by the owner when the contract is paused.
### changeOwner (0xa6f9dae1)

```solidity
function changeOwner(address newOwner) external
```

Transfer this contract to a new owner.


This function can only be called by the owner when the contract is paused.



Parameters:

| Name     | Type    | Description                        |
| :------- | :------ | :--------------------------------- |
| newOwner | address | Address of the new contract owner. |

### supportsInterface (0x01ffc9a7)

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```

Broadcast support for IETSRelayer interface to external contracts.


ETSCore will only add relayer contracts that implement IETSRelayer interface.
Your implementation should broadcast that it implements IETSRelayer interface.



Return values:

| Name | Type | Description                                                                      |
| :--- | :--- | :------------------------------------------------------------------------------- |
| [0]  | bool | boolean: true if this contract implements the interface defined by `interfaceId` |

### isPaused (0xb187bd26)

```solidity
function isPaused() external view returns (bool)
```

Check whether this contract has been pasued by the owner.


Pause functionality should be provided by OpenZeppelin Pausable utility.


Return values:

| Name | Type | Description                                     |
| :--- | :--- | :---------------------------------------------- |
| [0]  | bool | boolean: true for paused; false for not paused. |

### getOwner (0x893d20e8)

```solidity
function getOwner() external view returns (address payable)
```

Returns address of an IETSRelayer contract owner.



Return values:

| Name | Type            | Description                |
| :--- | :-------------- | :------------------------- |
| [0]  | address payable | address of contract owner. |

### getRelayerName (0x613facdd)

```solidity
function getRelayerName() external view returns (string memory)
```

Returns human readable name for this IETSRelayer contract.



Return values:

| Name | Type   | Description                               |
| :--- | :----- | :---------------------------------------- |
| [0]  | string | name of the Relayer contract as a string. |

### getCreator (0x0ee2cb10)

```solidity
function getCreator() external view returns (address payable)
```

Returns address of an IETSRelayer contract creator.



Return values:

| Name | Type            | Description                                     |
| :--- | :-------------- | :---------------------------------------------- |
| [0]  | address payable | address of the creator of the Relayer contract. |

### applyTags (0x42a7bfa5)

```solidity
function applyTags(
    IETS.TaggingRecordRawInput[] calldata _rawInput
) external payable
```

Apply one or more tags to a targetURI using tagging record raw client input data.



Parameters:

| Name      | Type                                | Description                                                   |
| :-------- | :---------------------------------- | :------------------------------------------------------------ |
| _rawInput | struct IETS.TaggingRecordRawInput[] | Raw client input data formed as TaggingRecordRawInput struct. |

### replaceTags (0x0f9becab)

```solidity
function replaceTags(
    IETS.TaggingRecordRawInput[] calldata _rawInput
) external payable
```

Replace entire tag set in tagging record using raw data for record lookup.

If supplied tag strings don't have CTAGs, new ones are minted.



Parameters:

| Name      | Type                                | Description                                                   |
| :-------- | :---------------------------------- | :------------------------------------------------------------ |
| _rawInput | struct IETS.TaggingRecordRawInput[] | Raw client input data formed as TaggingRecordRawInput struct. |

### removeTags (0x1002bc83)

```solidity
function removeTags(
    IETS.TaggingRecordRawInput[] calldata _rawInput
) external payable
```

Remove one or more tags from a tagging record using raw data for record lookup.



Parameters:

| Name      | Type                                | Description                                                   |
| :-------- | :---------------------------------- | :------------------------------------------------------------ |
| _rawInput | struct IETS.TaggingRecordRawInput[] | Raw client input data formed as TaggingRecordRawInput struct. |

### getOrCreateTagIds (0x5edab3ed)

```solidity
function getOrCreateTagIds(
    string[] calldata _tags
) external payable returns (uint256[] memory _tagIds)
```

Get or create CTAG tokens from tag strings.

Combo function that accepts a tag strings and returns corresponding CTAG token Id if it exists,
or if it doesn't exist, creates a new CTAG and then returns corresponding Id.

Only ETS Publisher contracts may call this function.



Parameters:

| Name  | Type     | Description            |
| :---- | :------- | :--------------------- |
| _tags | string[] | Array of tag strings.  |


Return values:

| Name    | Type      | Description              |
| :------ | :-------- | :----------------------- |
| _tagIds | uint256[] | Array of Id of CTAG Ids. |

### computeTaggingFee (0xf8c8ef09)

```solidity
function computeTaggingFee(
    IETS.TaggingRecordRawInput calldata _rawInput,
    IETS.TaggingAction _action
) external view returns (uint256 fee, uint256 tagCount)
```

Compute tagging fee for raw input and desired action.



Parameters:

| Name      | Type                              | Description                                                                    |
| :-------- | :-------------------------------- | :----------------------------------------------------------------------------- |
| _rawInput | struct IETS.TaggingRecordRawInput | Raw client input data formed as TaggingRecordRawInput struct.                  |
| _action   | enum IETS.TaggingAction           | Integer representing action to be performed according to enum TaggingAction.   |


Return values:

| Name     | Type    | Description                                       |
| :------- | :------ | :------------------------------------------------ |
| fee      | uint256 | Calculated tagging fee in ETH/Matic               |
| tagCount | uint256 | Number of new tags being added to tagging record. |
