# IETSToken

## Overview

#### License: MIT

```solidity
interface IETSToken is IERC721Upgradeable
```


## Structs info

### Tag

```solidity
struct Tag {
	address relayer;
	address creator;
	string display;
	bool premium;
	bool reserved;
}
```


## Events info

### TagMaxStringLengthSet

```solidity
event TagMaxStringLengthSet(uint256 maxStringLength)
```

emitted when the maximum character length of CTAG display string is set.



Parameters:

| Name            | Type    | Description                         |
| :-------------- | :------ | :---------------------------------- |
| maxStringLength | uint256 | maximum character length of string. |

### TagMinStringLengthSet

```solidity
event TagMinStringLengthSet(uint256 minStringLength)
```

emitted when the minimum character length of CTAG display string is set.



Parameters:

| Name            | Type    | Description                         |
| :-------------- | :------ | :---------------------------------- |
| minStringLength | uint256 | minimum character length of string. |

### OwnershipTermLengthSet

```solidity
event OwnershipTermLengthSet(uint256 termLength)
```

emitted when the ownership term length of a CTAG is set.



Parameters:

| Name       | Type    | Description                    |
| :--------- | :------ | :----------------------------- |
| termLength | uint256 | Ownership term length in days. |

### ETSCoreSet

```solidity
event ETSCoreSet(address ets)
```

emitted when the ETS core contract is set.



Parameters:

| Name | Type    | Description                |
| :--- | :------ | :------------------------- |
| ets  | address | ets core contract address. |

### AccessControlsSet

```solidity
event AccessControlsSet(address etsAccessControls)
```

emitted when the ETS Access Controls is set.



Parameters:

| Name              | Type    | Description                                 |
| :---------------- | :------ | :------------------------------------------ |
| etsAccessControls | address | contract address access controls is set to. |

### PremiumTagPreSet

```solidity
event PremiumTagPreSet(string tag, bool isPremium)
```

emitted when a tag string is flagged/unflagged as premium prior to minting.



Parameters:

| Name      | Type   | Description                                 |
| :-------- | :----- | :------------------------------------------ |
| tag       | string | tag string being flagged.                   |
| isPremium | bool   | boolean true for premium/false not premium. |

### PremiumFlagSet

```solidity
event PremiumFlagSet(uint256 tagId, bool isPremium)
```

emitted when a CTAG is flagged/unflagged as premium subsequent to minting.



Parameters:

| Name      | Type    | Description                                 |
| :-------- | :------ | :------------------------------------------ |
| tagId     | uint256 | Id of CTAG token.                           |
| isPremium | bool    | boolean true for premium/false not premium. |

### ReservedFlagSet

```solidity
event ReservedFlagSet(uint256 tagId, bool isReserved)
```

emitted when a CTAG is flagged/unflagged as reserved subsequent to minting.



Parameters:

| Name       | Type    | Description                                       |
| :--------- | :------ | :------------------------------------------------ |
| tagId      | uint256 | Id of CTAG token.                                 |
| isReserved | bool    | boolean true for reserved/false for not reserved. |

### TagRenewed

```solidity
event TagRenewed(uint256 indexed tokenId, address indexed caller)
```

emitted when CTAG token is renewed.



Parameters:

| Name    | Type    | Description         |
| :------ | :------ | :------------------ |
| tokenId | uint256 | Id of CTAG token.   |
| caller  | address | address of renewer. |

### TagRecycled

```solidity
event TagRecycled(uint256 indexed tokenId, address indexed caller)
```

emitted when CTAG token is recycled back to ETS.



Parameters:

| Name    | Type    | Description          |
| :------ | :------ | :------------------- |
| tokenId | uint256 | Id of CTAG token.    |
| caller  | address | address of recycler. |

## Functions info

### setTagMaxStringLength (0x060defec)

```solidity
function setTagMaxStringLength(uint256 _tagMaxStringLength) external
```

admin function to set maximum character length of CTAG display string.



Parameters:

| Name                | Type    | Description                         |
| :------------------ | :------ | :---------------------------------- |
| _tagMaxStringLength | uint256 | maximum character length of string. |

### setTagMinStringLength (0x86f57171)

```solidity
function setTagMinStringLength(uint256 _tagMinStringLength) external
```

Admin function to set minimum  character length of CTAG display string.



Parameters:

| Name                | Type    | Description                         |
| :------------------ | :------ | :---------------------------------- |
| _tagMinStringLength | uint256 | minimum character length of string. |

### setOwnershipTermLength (0xf66e7623)

```solidity
function setOwnershipTermLength(uint256 _ownershipTermLength) external
```

Admin function to set the ownership term length of a CTAG is set.



Parameters:

| Name                 | Type    | Description                    |
| :------------------- | :------ | :----------------------------- |
| _ownershipTermLength | uint256 | Ownership term length in days. |

### preSetPremiumTags (0xa1de95e5)

```solidity
function preSetPremiumTags(string[] calldata _tags, bool _isPremium) external
```

Admin function to flag/unflag tag string(s) as premium prior to minting.



Parameters:

| Name       | Type     | Description                                      |
| :--------- | :------- | :----------------------------------------------- |
| _tags      | string[] | Array of tag strings.                            |
| _isPremium | bool     | Boolean true for premium, false for not premium. |

### setPremiumFlag (0x27a2e473)

```solidity
function setPremiumFlag(uint256[] calldata _tokenIds, bool _isPremium) external
```

Admin function to flag/unflag CTAG(s) as premium.



Parameters:

| Name       | Type      | Description                                      |
| :--------- | :-------- | :----------------------------------------------- |
| _tokenIds  | uint256[] | Array of CTAG Ids.                               |
| _isPremium | bool      | Boolean true for premium, false for not premium. |

### setReservedFlag (0xaf46adb8)

```solidity
function setReservedFlag(uint256[] calldata _tokenIds, bool _reserved) external
```

Admin function to flag/unflag CTAG(s) as reserved.

Tags flagged as reserved cannot be auctioned.



Parameters:

| Name      | Type      | Description                                        |
| :-------- | :-------- | :------------------------------------------------- |
| _tokenIds | uint256[] | Array of CTAG Ids.                                 |
| _reserved | bool      | Boolean true for reserved, false for not reserved. |

### getOrCreateTagId (0xfed6c2e9)

```solidity
function getOrCreateTagId(
    string calldata _tag,
    address payable _relayer,
    address payable _creator
) external payable returns (uint256 tokenId)
```

Get CTAG token Id from tag string.

Combo function that accepts a tag string and returns it's CTAG token Id if it exists,
or creates a new CTAG and returns corresponding Id.

Only ETS Core can call this function.



Parameters:

| Name     | Type            | Description                                    |
| :------- | :-------------- | :--------------------------------------------- |
| _tag     | string          | Tag string.                                    |
| _relayer | address payable | Address of Relayer contract calling ETS Core.  |
| _creator | address payable | Address credited with creating CTAG.           |


Return values:

| Name    | Type    | Description       |
| :------ | :------ | :---------------- |
| tokenId | uint256 | Id of CTAG token. |

### createTag (0xa675f1e3)

```solidity
function createTag(
    string calldata _tag,
    address payable _relayer,
    address payable _creator
) external payable returns (uint256 tokenId)
```

Create CTAG token from tag string.

Reverts if tag exists or is invalid.

Only ETS Core can call this function.



Parameters:

| Name     | Type            | Description                           |
| :------- | :-------------- | :------------------------------------ |
| _tag     | string          | Tag string.                           |
| _creator | address payable | Address credited with creating CTAG.  |


Return values:

| Name    | Type    | Description       |
| :------ | :------ | :---------------- |
| tokenId | uint256 | Id of CTAG token. |

### renewTag (0xc157daea)

```solidity
function renewTag(uint256 _tokenId) external
```

Renews ownership term of a CTAG.

A "CTAG ownership term" is utilized to prevent CTAGs from being abandoned or inaccessable
due to lost private keys.

Any wallet address may renew the term of a CTAG for an owner. When renewed, the term
is extended from the current block timestamp plus the ownershipTermLength public variable.



Parameters:

| Name     | Type    | Description       |
| :------- | :------ | :---------------- |
| _tokenId | uint256 | Id of CTAG token. |

### recycleTag (0xe8d3e4b6)

```solidity
function recycleTag(uint256 _tokenId) external
```

Recycles a CTAG back to ETS.

When ownership term of a CTAG has expired, any wallet or contract may call this function
to recycle the tag back to ETS. Once recycled, a tag may be auctioned again.



Parameters:

| Name     | Type    | Description       |
| :------- | :------ | :---------------- |
| _tokenId | uint256 | Id of CTAG token. |

### computeTagId (0xf143fc61)

```solidity
function computeTagId(string memory _tag) external pure returns (uint256)
```

Function to deterministically compute & return a CTAG token Id.

Every CTAG token and it's associated data struct is mapped to by it's token Id. This Id is computed
from the "display" tag string lowercased, hashed and cast as an unsigned integer.

Note: Function does not verify if CTAG record exists.



Parameters:

| Name | Type   | Description  |
| :--- | :----- | :----------- |
| _tag | string | Tag string.  |


Return values:

| Name | Type    | Description                    |
| :--- | :------ | :----------------------------- |
| [0]  | uint256 | Id of potential CTAG token id. |

### tagExistsByString (0xf6ba042a)

```solidity
function tagExistsByString(string calldata _tag) external view returns (bool)
```

Check that a CTAG token exists for a given tag string.



Parameters:

| Name | Type   | Description  |
| :--- | :----- | :----------- |
| _tag | string | Tag string.  |


Return values:

| Name | Type | Description                              |
| :--- | :--- | :--------------------------------------- |
| [0]  | bool | true if CTAG token exists; false if not. |

### tagExistsById (0xb7bd44ed)

```solidity
function tagExistsById(uint256 _tokenId) external view returns (bool)
```

Check that CTAG token exists for a given computed token Id.



Parameters:

| Name     | Type    | Description                                                    |
| :------- | :------ | :------------------------------------------------------------- |
| _tokenId | uint256 | Token Id uint computed from tag string via computeTargetId().  |


Return values:

| Name | Type | Description                              |
| :--- | :--- | :--------------------------------------- |
| [0]  | bool | true if CTAG token exists; false if not. |

### tagOwnershipTermExpired (0xe9bd8126)

```solidity
function tagOwnershipTermExpired(uint256 _tokenId) external view returns (bool)
```

Check if CTAG token ownership term has expired.



Parameters:

| Name     | Type    | Description                                                    |
| :------- | :------ | :------------------------------------------------------------- |
| _tokenId | uint256 | Token Id uint computed from tag string via computeTargetId().  |


Return values:

| Name | Type | Description                                            |
| :--- | :--- | :----------------------------------------------------- |
| [0]  | bool | true if CTAG ownership term has expired; false if not. |

### getTagByString (0x6c1244b6)

```solidity
function getTagByString(
    string calldata _tag
) external view returns (IETSToken.Tag memory)
```

Retrieve a CTAG record for a given tag string.

Note: returns a struct with empty members when no CTAG exists.



Parameters:

| Name | Type   | Description  |
| :--- | :----- | :----------- |
| _tag | string | Tag string.  |


Return values:

| Name | Type                 | Description                |
| :--- | :------------------- | :------------------------- |
| [0]  | struct IETSToken.Tag | CTAG record as Tag struct. |

### getTagById (0x4b3d267f)

```solidity
function getTagById(
    uint256 _tokenId
) external view returns (IETSToken.Tag memory)
```

Retrieve a CTAG record for a given token Id.

Note: returns a struct with empty members when no CTAG exists.



Parameters:

| Name     | Type    | Description     |
| :------- | :------ | :-------------- |
| _tokenId | uint256 | CTAG token Id.  |


Return values:

| Name | Type                 | Description                |
| :--- | :------------------- | :------------------------- |
| [0]  | struct IETSToken.Tag | CTAG record as Tag struct. |

### getPlatformAddress (0x3c0c4566)

```solidity
function getPlatformAddress() external view returns (address payable)
```

Retrieve wallet address for ETS Platform.



Return values:

| Name | Type            | Description                      |
| :--- | :-------------- | :------------------------------- |
| [0]  | address payable | wallet address for ETS Platform. |

### getCreatorAddress (0xa30b4db9)

```solidity
function getCreatorAddress(uint256 _tokenId) external view returns (address)
```

Retrieve Creator address for a CTAG token.



Parameters:

| Name     | Type    | Description     |
| :------- | :------ | :-------------- |
| _tokenId | uint256 | CTAG token Id.  |


Return values:

| Name | Type    | Description                           |
| :--- | :------ | :------------------------------------ |
| [0]  | address | _creator Creator address of the CTAG. |

### getLastRenewed (0xb06a89a7)

```solidity
function getLastRenewed(uint256 _tokenId) external view returns (uint256)
```

Retrieve last renewal block timestamp for a CTAG.



Parameters:

| Name     | Type    | Description     |
| :------- | :------ | :-------------- |
| _tokenId | uint256 | CTAG token Id.  |


Return values:

| Name | Type    | Description      |
| :--- | :------ | :--------------- |
| [0]  | uint256 | Block timestamp. |

### getOwnershipTermLength (0x500aac87)

```solidity
function getOwnershipTermLength() external view returns (uint256)
```

Retrieve CTAG ownership term length global setting.



Return values:

| Name | Type    | Description          |
| :--- | :------ | :------------------- |
| [0]  | uint256 | Term length in days. |
