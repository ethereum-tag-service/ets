# ETSToken

## Overview

#### License: MIT

```solidity
contract ETSToken is ERC721PausableUpgradeable, ERC721BurnableUpgradeable, IETSToken, ReentrancyGuardUpgradeable, UUPSUpgradeable, StringHelpers
```


## Constants info

### NAME (0xa3f4df7e)

```solidity
string constant NAME = "CTAG Token"
```


## State variables info

### ets (0x15ccda22)

```solidity
contract IETS ets
```


### etsAccessControls (0x8299f9f9)

```solidity
contract IETSAccessControls etsAccessControls
```


### tagMinStringLength (0xadf63cd2)

```solidity
uint256 tagMinStringLength
```


### tagMaxStringLength (0x2e611630)

```solidity
uint256 tagMaxStringLength
```


### ownershipTermLength (0xdb7af5fb)

```solidity
uint256 ownershipTermLength
```


### tokenIdToTag (0xad014a5b)

```solidity
mapping(uint256 => struct IETSToken.Tag) tokenIdToTag
```

Map of CTAG id to CTAG record.
### tokenIdToLastRenewed (0xcd025dea)

```solidity
mapping(uint256 => uint256) tokenIdToLastRenewed
```

Mapping of tokenId to last renewal.
### isTagPremium (0xc45b5ee1)

```solidity
mapping(string => bool) isTagPremium
```

Defines whether a tag has been set up as premium
## Modifiers info

### onlyETSCore

```solidity
modifier onlyETSCore()
```

Modifiers
### onlyAdmin

```solidity
modifier onlyAdmin()
```


### onlyRelayer

```solidity
modifier onlyRelayer()
```


## Functions info

### constructor

```solidity
constructor()
```

oz-upgrades-unsafe-allow: constructor
### initialize (0x4ec81af1)

```solidity
function initialize(
    IETSAccessControls _etsAccessControls,
    uint256 _tagMinStringLength,
    uint256 _tagMaxStringLength,
    uint256 _ownershipTermLength
) public initializer
```


### setETSCore (0xfd524313)

```solidity
function setETSCore(IETS _ets) public onlyAdmin
```

Sets ETS core on the ETSToken contract so functions can be
restricted to ETS platform only.



Parameters:

| Name | Type          | Description              |
| :--- | :------------ | :----------------------- |
| _ets | contract IETS | Address of ETS contract. |

### setAccessControls (0xcd15832f)

```solidity
function setAccessControls(IETSAccessControls _accessControls) public onlyAdmin
```

Sets ETSAccessControls on the ETSToken contract function calls can be
restricted to ETS platform only. Note: Caller of this function must be deployer
or pre-set as admin of new contract.



Parameters:

| Name            | Type                        | Description                            |
| :-------------- | :-------------------------- | :------------------------------------- |
| _accessControls | contract IETSAccessControls | Address of ETSAccessControls contract. |

### pause (0x8456cb59)

```solidity
function pause() public onlyAdmin whenNotPaused
```

Pauses ETSToken contract.
### unPause (0xf7b188a5)

```solidity
function unPause() public onlyAdmin whenPaused
```

Unpauses ETSToken contract.
### burn (0x42966c68)

```solidity
function burn(uint256 tokenId) public override onlyAdmin
```

Burns `tokenId`. See {ERC721-_burn}.

Requirements:

- The caller must own `tokenId` or be an approved operator.
### setTagMaxStringLength (0x060defec)

```solidity
function setTagMaxStringLength(uint256 _tagMaxStringLength) public onlyAdmin
```

admin function to set maximum character length of CTAG display string.



Parameters:

| Name                | Type    | Description                         |
| :------------------ | :------ | :---------------------------------- |
| _tagMaxStringLength | uint256 | maximum character length of string. |

### setTagMinStringLength (0x86f57171)

```solidity
function setTagMinStringLength(uint256 _tagMinStringLength) public onlyAdmin
```

Admin function to set minimum  character length of CTAG display string.



Parameters:

| Name                | Type    | Description                         |
| :------------------ | :------ | :---------------------------------- |
| _tagMinStringLength | uint256 | minimum character length of string. |

### setOwnershipTermLength (0xf66e7623)

```solidity
function setOwnershipTermLength(uint256 _ownershipTermLength) public onlyAdmin
```

Admin function to set the ownership term length of a CTAG is set.



Parameters:

| Name                 | Type    | Description                    |
| :------------------- | :------ | :----------------------------- |
| _ownershipTermLength | uint256 | Ownership term length in days. |

### preSetPremiumTags (0xa1de95e5)

```solidity
function preSetPremiumTags(
    string[] calldata _tags,
    bool _enabled
) public onlyAdmin
```

Admin function to flag/unflag tag string(s) as premium prior to minting.



Parameters:

| Name       | Type     | Description                                      |
| :--------- | :------- | :----------------------------------------------- |
| _tags      | string[] | Array of tag strings.                            |
| _isPremium | bool     | Boolean true for premium, false for not premium. |

### setPremiumFlag (0x27a2e473)

```solidity
function setPremiumFlag(
    uint256[] calldata _tokenIds,
    bool _isPremium
) public onlyAdmin
```

Admin function to flag/unflag CTAG(s) as premium.



Parameters:

| Name       | Type      | Description                                      |
| :--------- | :-------- | :----------------------------------------------- |
| _tokenIds  | uint256[] | Array of CTAG Ids.                               |
| _isPremium | bool      | Boolean true for premium, false for not premium. |

### setReservedFlag (0xaf46adb8)

```solidity
function setReservedFlag(
    uint256[] calldata _tokenIds,
    bool _reserved
) public onlyAdmin
```

Admin function to flag/unflag CTAG(s) as reserved.

Tags flagged as reserved cannot be auctioned.



Parameters:

| Name      | Type      | Description                                        |
| :-------- | :-------- | :------------------------------------------------- |
| _tokenIds | uint256[] | Array of CTAG Ids.                                 |
| _reserved | bool      | Boolean true for reserved, false for not reserved. |

### getOrCreateTag (0x07348e26)

```solidity
function getOrCreateTag(
    string calldata _tag,
    address payable _relayer,
    address payable _creator
) public payable returns (IETSToken.Tag memory tag)
```


### getOrCreateTagId (0xfed6c2e9)

```solidity
function getOrCreateTagId(
    string calldata _tag,
    address payable _relayer,
    address payable _creator
) public payable returns (uint256 tokenId)
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
) public payable nonReentrant onlyETSCore returns (uint256 _tokenId)
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
function renewTag(uint256 _tokenId) public
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
function recycleTag(uint256 _tokenId) public
```

Recycles a CTAG back to ETS.

When ownership term of a CTAG has expired, any wallet or contract may call this function
to recycle the tag back to ETS. Once recycled, a tag may be auctioned again.



Parameters:

| Name     | Type    | Description       |
| :------- | :------ | :---------------- |
| _tokenId | uint256 | Id of CTAG token. |

### supportsInterface (0x01ffc9a7)

```solidity
function supportsInterface(
    bytes4 interfaceId
) public view virtual override returns (bool)
```


### computeTagId (0xf143fc61)

```solidity
function computeTagId(string memory _tag) public pure returns (uint256)
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
function tagExistsByString(string calldata _tag) public view returns (bool)
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
function tagExistsById(uint256 _tokenId) public view returns (bool)
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
function tagOwnershipTermExpired(uint256 _tokenId) public view returns (bool)
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
) public view returns (IETSToken.Tag memory)
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
) public view returns (IETSToken.Tag memory)
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

### getOwnershipTermLength (0x500aac87)

```solidity
function getOwnershipTermLength() public view returns (uint256)
```

Retrieve CTAG ownership term length global setting.



Return values:

| Name | Type    | Description          |
| :--- | :------ | :------------------- |
| [0]  | uint256 | Term length in days. |

### getLastRenewed (0xb06a89a7)

```solidity
function getLastRenewed(uint256 _tokenId) public view returns (uint256)
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

### getPlatformAddress (0x3c0c4566)

```solidity
function getPlatformAddress() public view returns (address payable)
```

Retrieve wallet address for ETS Platform.



Return values:

| Name | Type            | Description                      |
| :--- | :-------------- | :------------------------------- |
| [0]  | address payable | wallet address for ETS Platform. |

### getCreatorAddress (0xa30b4db9)

```solidity
function getCreatorAddress(uint256 _tokenId) public view returns (address)
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
