# ETSRelayerV1

## Overview

#### License: MIT

```solidity
contract ETSRelayerV1 is IETSRelayer, Initializable, ERC165Upgradeable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable
```


## Constants info

### NAME (0xa3f4df7e)

```solidity
string constant NAME = "ETS Relayer"
```


### VERSION (0xffa1ad74)

```solidity
string constant VERSION = "0.1-Beta"
```


### IID_IETSRELAYER (0x743b7b1f)

```solidity
bytes4 constant IID_IETSRELAYER = type(IETSRelayer).interfaceId
```


## State variables info

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
### etsAccessControls (0x8299f9f9)

```solidity
contract IETSAccessControls etsAccessControls
```

Address and interface for ETS Access Controls.
### creator (0x02d05d3f)

```solidity
address payable creator
```

Address that built this smart contract.
### relayerName (0xe12bcd68)

```solidity
string relayerName
```

Public name for Relayer instance.
## Modifiers info

### onlyRelayerAdmin

```solidity
modifier onlyRelayerAdmin()
```

Modifiers
## Functions info

### constructor

```solidity
constructor()
```

oz-upgrades-unsafe-allow: constructor
### initialize (0xf796e587)

```solidity
function initialize(
    string memory _relayerName,
    IETS _ets,
    IETSToken _etsToken,
    IETSTarget _etsTarget,
    IETSAccessControls _etsAccessControls,
    address payable _creator,
    address payable _owner
) public initializer
```


### pause (0x8456cb59)

```solidity
function pause() public onlyRelayerAdmin
```

Pause this relayer contract.

This function can only be called by the owner when the contract is unpaused.
### unpause (0x3f4ba83a)

```solidity
function unpause() public onlyRelayerAdmin
```

Unpause this relayer contract.

This function can only be called by the owner when the contract is paused.
### changeOwner (0xa6f9dae1)

```solidity
function changeOwner(address _newOwner) public whenPaused onlyOwner
```

Transfer this contract to a new owner.


This function can only be called by the owner when the contract is paused.



Parameters:

| Name     | Type    | Description                        |
| :------- | :------ | :--------------------------------- |
| newOwner | address | Address of the new contract owner. |

### applyTags (0x42a7bfa5)

```solidity
function applyTags(
    IETS.TaggingRecordRawInput[] calldata _rawInput
) public payable whenNotPaused
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
) public payable whenNotPaused
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
) public payable whenNotPaused
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
) public payable whenNotPaused returns (uint256[] memory _tagIds)
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

### version (0x54fd4d50)

```solidity
function version() external view virtual returns (string memory)
```


### supportsInterface (0x01ffc9a7)

```solidity
function supportsInterface(
    bytes4 interfaceId
) public view virtual override returns (bool)
```

See {IERC165-supportsInterface}.
### isPaused (0xb187bd26)

```solidity
function isPaused() public view virtual returns (bool)
```

Check whether this contract has been pasued by the owner.


Pause functionality should be provided by OpenZeppelin Pausable utility.


Return values:

| Name | Type | Description                                     |
| :--- | :--- | :---------------------------------------------- |
| [0]  | bool | boolean: true for paused; false for not paused. |

### getOwner (0x893d20e8)

```solidity
function getOwner() public view virtual returns (address payable)
```

Returns address of an IETSRelayer contract owner.



Return values:

| Name | Type            | Description                |
| :--- | :-------------- | :------------------------- |
| [0]  | address payable | address of contract owner. |

### getRelayerName (0x613facdd)

```solidity
function getRelayerName() public view returns (string memory)
```

Returns human readable name for this IETSRelayer contract.



Return values:

| Name | Type   | Description                               |
| :--- | :----- | :---------------------------------------- |
| [0]  | string | name of the Relayer contract as a string. |

### getCreator (0x0ee2cb10)

```solidity
function getCreator() public view returns (address payable)
```

Returns address of an IETSRelayer contract creator.



Return values:

| Name | Type            | Description                                     |
| :--- | :-------------- | :---------------------------------------------- |
| [0]  | address payable | address of the creator of the Relayer contract. |

### computeTaggingFee (0xf8c8ef09)

```solidity
function computeTaggingFee(
    IETS.TaggingRecordRawInput calldata _rawInput,
    IETS.TaggingAction _action
) public view returns (uint256 fee, uint256 tagCount)
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

### getBalance (0x12065fe0)

```solidity
function getBalance() public view returns (uint256)
```


### receive

```solidity
receive() external payable
```


### fallback

```solidity
fallback() external payable
```

