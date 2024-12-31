# IETS

## Overview

#### License: MIT

```solidity
interface IETS
```

## Data Structures

### TaggingRecordRawInput

Raw client input data structure for creating tagging records. This structure represents the basic input data needed from clients to create or modify tagging records in ETS.

```solidity
struct TaggingRecordRawInput {
    string targetURI;
    string[] tagStrings;
    string recordType;
}
```

#### Fields

| Name       | Type      | Description                                                |
| :--------- | :-------- | :--------------------------------------------------------- |
| targetURI  | string    | Unique resource identifier string, eg. \"<https://google.com\>" |
| tagStrings | string[]  | Array of hashtag strings, eg. [\"#Love\", \"#Blue\"]        |
| recordType | string    | Arbitrary identifier for type of tagging record            |

### TaggingRecord

The fundamental data structure of ETS that reflects \"who tagged what, where and why\". Every Tagging record has a unique Id computed from the hashed composite of targetId, recordType, tagger and relayer addresses cast as a uint256.

```solidity
struct TaggingRecord {
    uint256[] tagIds;
    uint256 targetId;
    string recordType;
    address relayer;
    address tagger;
}
```

#### Fields

| Name       | Type      | Description                                                    |
| :--------- | :-------- | :------------------------------------------------------------- |
| tagIds     | uint256[] | Ids of CTAG token(s)                                          |
| targetId   | uint256   | Id of target being tagged                                     |
| recordType | string    | Arbitrary identifier for type of tagging record               |
| relayer    | address   | Address of Relayer contract that wrote tagging record         |
| tagger     | address   | Address of wallet that initiated tagging record via relayer   |

### TaggingAction

Action types available for modifying tags in a tagging record. These actions determine how new tags will be applied to existing tagging records.

```solidity
enum TaggingAction {
    APPEND,
    REPLACE,
    REMOVE
}
```

#### Fields

| Name    | Value | Description                                     |
| :------ | :---- | :---------------------------------------------- |
| APPEND  | 0     | Add new tags to an existing tagging record      |
| REPLACE | 1     | Overwrite all existing tags with new tag set    |
| REMOVE  | 2     | Remove specified tags from the tagging record   |

## Events info

### AccessControlsSet

```solidity
event AccessControlsSet(address newAccessControls)
```

emitted when the ETS Access Controls is set.

Parameters:

| Name              | Type    | Description                                 |
| :---------------- | :------ | :------------------------------------------ |
| newAccessControls | address | contract address access controls is set to. |

### TaggingFeeSet

```solidity
event TaggingFeeSet(uint256 newTaggingFee)
```

emitted when ETS tagging fee is set.

Parameters:

| Name          | Type    | Description      |
| :------------ | :------ | :--------------- |
| newTaggingFee | uint256 | new tagging fee. |

### PercentagesSet

```solidity
event PercentagesSet(uint256 platformPercentage, uint256 relayerPercentage)
```

emitted when participant distribution percentages are set.

Parameters:

| Name               | Type    | Description                                                                                     |
| :----------------- | :------ | :---------------------------------------------------------------------------------------------- |
| platformPercentage | uint256 | percentage of tagging fee allocated to ETS.                                                     |
| relayerPercentage  | uint256 | percentage of tagging fee allocated to relayer of record for CTAG being used in tagging record. |

### TaggingRecordCreated

```solidity
event TaggingRecordCreated(uint256 taggingRecordId)
```

emitted when a new tagging record is recorded within ETS.

Parameters:

| Name            | Type    | Description                          |
| :-------------- | :------ | :----------------------------------- |
| taggingRecordId | uint256 | Unique identifier of tagging record. |

### TaggingRecordUpdated

```solidity
event TaggingRecordUpdated(uint256 taggingRecordId, IETS.TaggingAction action)
```

emitted when a tagging record is updated.

Parameters:

| Name            | Type                    | Description                                   |
| :-------------- | :---------------------- | :-------------------------------------------- |
| taggingRecordId | uint256                 | tagging record being updated.                 |
| action          | enum IETS.TaggingAction | Type of update applied as TaggingAction enum. |

### FundsWithdrawn

```solidity
event FundsWithdrawn(address indexed who, uint256 amount)
```

emitted when ETS participant draws down funds accrued to their contract or wallet.

Parameters:

| Name   | Type    | Description                                   |
| :----- | :------ | :-------------------------------------------- |
| who    | address | contract or wallet address being drawn down.  |
| amount | uint256 | amount being drawn down.                      |

## Functions info

### createTaggingRecord (0xc38f3037)

```solidity
function createTaggingRecord(
    uint256[] memory _tagIds,
    uint256 _targetId,
    string calldata _recordType,
    address _tagger
) external payable
```

Create a new tagging record.

Requirements:

- Caller must be relayer contract.
- CTAG(s) and TargetId must exist.

Parameters:

| Name        | Type      | Description                                                |
| :---------- | :-------- | :--------------------------------------------------------- |
| _tagIds     | uint256[] | Array of CTAG token Ids.                                   |
| _targetId   | uint256   | targetId of the URI being tagged. See ETSTarget.sol        |
| _recordType | string    | Arbitrary identifier for type of tagging record.           |
| _tagger     | address   | Address calling Relayer contract to create tagging record. |

### getOrCreateTagId (0xa27eee3c)

```solidity
function getOrCreateTagId(
    string calldata _tag,
    address payable _creator
) external payable returns (uint256 tokenId)
```

Get or create CTAG token from tag string.

Combo function that accepts a tag string and returns corresponding CTAG token Id if it exists,
or if it doesn't exist, creates a new CTAG and then returns corresponding Id.

Only ETS Relayer contracts may call this function.

Parameters:

| Name     | Type            | Description                           |
| :------- | :-------------- | :------------------------------------ |
| _tag     | string          | Tag string.                           |
| _creator | address payable | Address credited with creating CTAG.  |

Return values:

| Name    | Type    | Description       |
| :------ | :------ | :---------------- |
| tokenId | uint256 | Id of CTAG token. |

### createTag (0x54b4d676)

```solidity
function createTag(
    string calldata _tag,
    address payable _creator
) external payable returns (uint256 tokenId)
```

Create CTAG token from tag string.

Reverts if tag exists or is invalid.

Only ETS Relayer contracts may call this function.

Parameters:

| Name     | Type            | Description                           |
| :------- | :-------------- | :------------------------------------ |
| _tag     | string          | Tag string.                           |
| _creator | address payable | Address credited with creating CTAG.  |

Return values:

| Name    | Type    | Description       |
| :------ | :------ | :---------------- |
| tokenId | uint256 | Id of CTAG token. |

### applyTagsWithRawInput (0x01f1e2d8)

```solidity
function applyTagsWithRawInput(
    IETS.TaggingRecordRawInput calldata _rawInput,
    address payable _tagger
) external payable
```

Apply one or more tags to a targetURI using tagging record raw client input data.

Like it's sister function applyTagsWithCompositeKey, records new ETS Tagging Record or appends tags to an
existing record if found to already exist. This function differs in that it creates new ETS target records
and CTAG tokens for novel targetURIs and hastag strings respectively. This function can only be called by
Relayer contracts.

Parameters:

| Name      | Type                              | Description                                                    |
| :-------- | :-------------------------------- | :------------------------------------------------------------- |
| _rawInput | struct IETS.TaggingRecordRawInput | Raw client input data formed as TaggingRecordRawInput struct.  |
| _tagger   | address payable                   | Address that calls Relayer to tag a targetURI.                 |

### applyTagsWithCompositeKey (0x8361d140)

```solidity
function applyTagsWithCompositeKey(
    uint256[] calldata _tagIds,
    uint256 _targetId,
    string memory _recordType,
    address payable _tagger
) external payable
```

Apply one or more tags to a targetId using using tagging record composite key.

Records new ETS Tagging Record to the blockchain or appends tags if Tagging Record already exists. CTAGs and
targetId are created if they don't exist. Caller must be Relayer contract.

Parameters:

| Name        | Type            | Description                                             |
| :---------- | :-------------- | :------------------------------------------------------ |
| _tagIds     | uint256[]       | Array of CTAG token Ids.                                |
| _targetId   | uint256         | targetId of the URI being tagged. See ETSTarget.sol     |
| _recordType | string          | Arbitrary identifier for type of tagging record.        |
| _tagger     | address payable | Address of that calls Relayer to create tagging record. |

### replaceTagsWithRawInput (0x70a306f7)

```solidity
function replaceTagsWithRawInput(
    IETS.TaggingRecordRawInput calldata _rawInput,
    address payable _tagger
) external payable
```

Replace entire tag set in tagging record using raw data for record lookup.

If supplied tag strings don't have CTAGs, new ones are minted.

Parameters:

| Name      | Type                              | Description                                                    |
| :-------- | :-------------------------------- | :------------------------------------------------------------- |
| _rawInput | struct IETS.TaggingRecordRawInput | Raw client input data formed as TaggingRecordRawInput struct.  |
| _tagger   | address payable                   | Address that calls Relayer to tag a targetURI.                 |

### replaceTagsWithCompositeKey (0x5bb0b13b)

```solidity
function replaceTagsWithCompositeKey(
    uint256[] calldata _tagIds,
    uint256 _targetId,
    string memory _recordType,
    address payable _tagger
) external payable
```

Replace entire tag set in tagging record using composite key for record lookup.

This function overwrites the tags in a tagging record with the supplied tags, only
charging for the new tags in the replacement set.

Parameters:

| Name        | Type            | Description                                             |
| :---------- | :-------------- | :------------------------------------------------------ |
| _tagIds     | uint256[]       | Array of CTAG token Ids.                                |
| _targetId   | uint256         | targetId of the URI being tagged. See ETSTarget.sol     |
| _recordType | string          | Arbitrary identifier for type of tagging record.        |
| _tagger     | address payable | Address of that calls Relayer to create tagging record. |

### removeTagsWithRawInput (0x7e2babd0)

```solidity
function removeTagsWithRawInput(
    IETS.TaggingRecordRawInput calldata _rawInput,
    address _tagger
) external
```

Remove one or more tags from a tagging record using raw data for record lookup.

Parameters:

| Name      | Type                              | Description                                                    |
| :-------- | :-------------------------------- | :------------------------------------------------------------- |
| _rawInput | struct IETS.TaggingRecordRawInput | Raw client input data formed as TaggingRecordRawInput struct.  |
| _tagger   | address                           | Address that calls Relayer to tag a targetURI.                 |

### removeTagsWithCompositeKey (0x3f9fc582)

```solidity
function removeTagsWithCompositeKey(
    uint256[] calldata _tagIds,
    uint256 _targetId,
    string memory _recordType,
    address payable _tagger
) external
```

Remove one or more tags from a tagging record using composite key for record lookup.

Parameters:

| Name        | Type            | Description                                             |
| :---------- | :-------------- | :------------------------------------------------------ |
| _tagIds     | uint256[]       | Array of CTAG token Ids.                                |
| _targetId   | uint256         | targetId of the URI being tagged. See ETSTarget.sol     |
| _recordType | string          | Arbitrary identifier for type of tagging record.        |
| _tagger     | address payable | Address of that calls Relayer to create tagging record. |

### appendTags (0x0410ca9f)

```solidity
function appendTags(
    uint256 _taggingRecordId,
    uint256[] calldata _tagIds
) external payable
```

Append one or more tags to a tagging record.

Parameters:

| Name             | Type      | Description                    |
| :--------------- | :-------- | :----------------------------- |
| _taggingRecordId | uint256   | tagging record being updated.  |
| _tagIds          | uint256[] | Array of CTAG token Ids.       |

### replaceTags (0x46444c09)

```solidity
function replaceTags(
    uint256 _taggingRecordId,
    uint256[] calldata _tagIds
) external payable
```

Replaces tags in tagging record.

This function overwrites the tags in a tagging record with the supplied tags, only
charging for the new tags in the replacement set.

Parameters:

| Name             | Type      | Description                    |
| :--------------- | :-------- | :----------------------------- |
| _taggingRecordId | uint256   | tagging record being updated.  |
| _tagIds          | uint256[] | Array of CTAG token Ids.       |

### removeTags (0xa0e0da18)

```solidity
function removeTags(
    uint256 _taggingRecordId,
    uint256[] calldata _tagIds
) external
```

Remove one or more tags from a tagging record.

Parameters:

| Name             | Type      | Description                    |
| :--------------- | :-------- | :----------------------------- |
| _taggingRecordId | uint256   | tagging record being updated.  |
| _tagIds          | uint256[] | Array of CTAG token Ids.       |

### drawDown (0xc2062005)

```solidity
function drawDown(address payable _account) external
```

Function for withdrawing funds from an accrual account. Can be called by the account owner
or on behalf of the account. Does nothing when there is nothing due to the account.

Parameters:

| Name     | Type            | Description                                                           |
| :------- | :-------------- | :-------------------------------------------------------------------- |
| _account | address payable | Address of account being drawn down and which will receive the funds. |

### computeTaggingRecordIdFromRawInput (0x1632a9bc)

```solidity
function computeTaggingRecordIdFromRawInput(
    IETS.TaggingRecordRawInput calldata _rawInput,
    address _relayer,
    address _tagger
) external view returns (uint256 taggingRecordId)
```

Compute a taggingRecordId from raw input.

Parameters:

| Name      | Type                              | Description                                                    |
| :-------- | :-------------------------------- | :------------------------------------------------------------- |
| _rawInput | struct IETS.TaggingRecordRawInput | Raw client input data formed as TaggingRecordRawInput struct.  |
| _relayer  | address                           | Address of tagging record Relayer contract.                    |
| _tagger   | address                           | Address interacting with Relayer to tag content ("Tagger").    |

Return values:

| Name            | Type    | Description                             |
| :-------------- | :------ | :-------------------------------------- |
| taggingRecordId | uint256 | Unique identifier for a tagging record. |

### computeTaggingRecordIdFromCompositeKey (0x06d05ed2)

```solidity
function computeTaggingRecordIdFromCompositeKey(
    uint256 _targetId,
    string memory _recordType,
    address _relayer,
    address _tagger
) external pure returns (uint256 taggingRecordId)
```

Compute & return a taggingRecordId.

Every TaggingRecord in ETS is mapped to by it's taggingRecordId. This Id is a composite key
composed of targetId, recordType, relayer contract address and tagger address hashed and cast as a uint256.

Parameters:

| Name        | Type    | Description                                                   |
| :---------- | :------ | :------------------------------------------------------------ |
| _targetId   | uint256 | Id of target being tagged (see ETSTarget.sol).                |
| _recordType | string  | Arbitrary identifier for type of tagging record.              |
| _relayer    | address | Address of tagging record Relayer contract.                   |
| _tagger     | address | Address interacting with Relayer to tag content ("Tagger").   |

Return values:

| Name            | Type    | Description                             |
| :-------------- | :------ | :-------------------------------------- |
| taggingRecordId | uint256 | Unique identifier for a tagging record. |

### computeTaggingFeeFromRawInput (0x249f3eec)

```solidity
function computeTaggingFeeFromRawInput(
    IETS.TaggingRecordRawInput memory _rawInput,
    address _relayer,
    address _tagger,
    IETS.TaggingAction _action
) external view returns (uint256 fee, uint256 tagCount)
```

Compute tagging fee for raw input and desired action.

Parameters:

| Name      | Type                              | Description                                                                    |
| :-------- | :-------------------------------- | :----------------------------------------------------------------------------- |
| _rawInput | struct IETS.TaggingRecordRawInput | Raw client input data formed as TaggingRecordRawInput struct.                  |
| _relayer  | address                           | Address of tagging record Relayer contract.                                    |
| _tagger   | address                           | Address interacting with Relayer to tag content ("Tagger").                    |
| _action   | enum IETS.TaggingAction           | Integer representing action to be performed according to enum TaggingAction.   |

Return values:

| Name     | Type    | Description                                       |
| :------- | :------ | :------------------------------------------------ |
| fee      | uint256 | Calculated tagging fee in ETH/Matic               |
| tagCount | uint256 | Number of new tags being added to tagging record. |

### computeTaggingFeeFromCompositeKey (0x50064ea4)

```solidity
function computeTaggingFeeFromCompositeKey(
    uint256[] memory _tagIds,
    uint256 _targetId,
    string calldata _recordType,
    address _relayer,
    address _tagger,
    IETS.TaggingAction _action
) external view returns (uint256 fee, uint256 tagCount)
```

Compute tagging fee for CTAGs, tagging record composite key and desired action.

Parameters:

| Name     | Type                    | Description                                                                    |
| :------- | :---------------------- | :----------------------------------------------------------------------------- |
| _tagIds  | uint256[]               | Array of CTAG token Ids.                                                       |
| _relayer | address                 | Address of tagging record Relayer contract.                                    |
| _tagger  | address                 | Address interacting with Relayer to tag content ("Tagger").                    |
| _action  | enum IETS.TaggingAction | Integer representing action to be performed according to enum TaggingAction.   |

Return values:

| Name     | Type    | Description                                       |
| :------- | :------ | :------------------------------------------------ |
| fee      | uint256 | Calculated tagging fee in ETH/Matic               |
| tagCount | uint256 | Number of new tags being added to tagging record. |

### computeTaggingFee (0xa53d30a4)

```solidity
function computeTaggingFee(
    uint256 _taggingRecordId,
    uint256[] memory _tagIds,
    IETS.TaggingAction _action
) external view returns (uint256 fee, uint256 tagCount)
```

Compute tagging fee for CTAGs, tagging record id and desired action.

If the global, service wide tagging fee is set (see ETS.taggingFee() & ETS.setTaggingFee()) ETS charges a per tag for all
new tags applied to a tagging record. This applies to both new tagging records and modified tagging records.

Computing the tagging fee involves checking to see if a tagging record exists and if so, given the desired action
(append or replace) determining the number of new tags being added and multiplying by the ETS per tag fee.

Parameters:

| Name             | Type                    | Description                                                                    |
| :--------------- | :---------------------- | :----------------------------------------------------------------------------- |
| _taggingRecordId | uint256                 | Id of tagging record.                                                          |
| _tagIds          | uint256[]               | Array of CTAG token Ids.                                                       |
| _action          | enum IETS.TaggingAction | Integer representing action to be performed according to enum TaggingAction.   |

Return values:

| Name     | Type    | Description                                       |
| :------- | :------ | :------------------------------------------------ |
| fee      | uint256 | Calculated tagging fee in ETH/Matic               |
| tagCount | uint256 | Number of new tags being added to tagging record. |

### getTaggingRecordFromRawInput (0x8633899c)

```solidity
function getTaggingRecordFromRawInput(
    IETS.TaggingRecordRawInput memory _rawInput,
    address _relayer,
    address _tagger
)
    external
    view
    returns (
        uint256[] memory tagIds,
        uint256 targetId,
        string memory recordType,
        address relayer,
        address tagger
    )
```

Retrieve a tagging record from it's raw input.

Parameters:

| Name      | Type                              | Description                                                    |
| :-------- | :-------------------------------- | :------------------------------------------------------------- |
| _rawInput | struct IETS.TaggingRecordRawInput | Raw client input data formed as TaggingRecordRawInput struct.  |
| _relayer  | address                           | Address of tagging record Relayer contract.                    |
| _tagger   | address                           | Address interacting with Relayer to tag content ("Tagger").    |

Return values:

| Name       | Type      | Description                                                 |
| :--------- | :-------- | :---------------------------------------------------------- |
| tagIds     | uint256[] | CTAG token ids.                                             |
| targetId   | uint256   | TargetId that was tagged.                                   |
| recordType | string    | Type of tagging record.                                     |
| relayer    | address   | Address of tagging record Relayer contract.                 |
| tagger     | address   | Address interacting with Relayer to tag content ("Tagger"). |

### getTaggingRecordFromCompositeKey (0xa33def15)

```solidity
function getTaggingRecordFromCompositeKey(
    uint256 _targetId,
    string memory _recordType,
    address _relayer,
    address _tagger
)
    external
    view
    returns (
        uint256[] memory tagIds,
        uint256 targetId,
        string memory recordType,
        address relayer,
        address tagger
    )
```

Retrieve a tagging record from composite key parts.

Parameters:

| Name        | Type    | Description                                                    |
| :---------- | :------ | :------------------------------------------------------------- |
| _targetId   | uint256 | Id of target being tagged.                                     |
| _recordType | string  | Arbitrary identifier for type of tagging record.               |
| _relayer    | address | Address of Relayer contract that wrote tagging record.         |
| _tagger     | address | Address of wallet that initiated tagging record via relayer.   |

Return values:

| Name       | Type      | Description                                                 |
| :--------- | :-------- | :---------------------------------------------------------- |
| tagIds     | uint256[] | CTAG token ids.                                             |
| targetId   | uint256   | TargetId that was tagged.                                   |
| recordType | string    | Type of tagging record.                                     |
| relayer    | address   | Address of tagging record Relayer contract.                 |
| tagger     | address   | Address interacting with Relayer to tag content ("Tagger"). |

### getTaggingRecordFromId (0x68fd4dee)

```solidity
function getTaggingRecordFromId(
    uint256 _id
)
    external
    view
    returns (
        uint256[] memory tagIds,
        uint256 targetId,
        string memory recordType,
        address relayer,
        address tagger
    )
```

Retrieve a tagging record from Id.

Parameters:

| Name | Type    | Description        |
| :--- | :------ | :----------------- |
| _id  | uint256 | taggingRecordId.   |

Return values:

| Name       | Type      | Description                                                 |
| :--------- | :-------- | :---------------------------------------------------------- |
| tagIds     | uint256[] | CTAG token ids.                                             |
| targetId   | uint256   | TargetId that was tagged.                                   |
| recordType | string    | Type of tagging record.                                     |
| relayer    | address   | Address of tagging record Relayer contract.                 |
| tagger     | address   | Address interacting with Relayer to tag content ("Tagger"). |

### taggingRecordExistsByRawInput (0xea552bc1)

```solidity
function taggingRecordExistsByRawInput(
    IETS.TaggingRecordRawInput memory _rawInput,
    address _relayer,
    address _tagger
) external view returns (bool)
```

Check that a tagging record exists for given raw input.

Parameters:

| Name      | Type                              | Description                                                    |
| :-------- | :-------------------------------- | :------------------------------------------------------------- |
| _rawInput | struct IETS.TaggingRecordRawInput | Raw client input data formed as TaggingRecordRawInput struct.  |
| _relayer  | address                           | Address of tagging record Relayer contract.                    |
| _tagger   | address                           | Address interacting with Relayer to tag content ("Tagger").    |

Return values:

| Name | Type | Description                              |
| :--- | :--- | :--------------------------------------- |
| [0]  | bool | boolean; true for exists, false for not. |

### taggingRecordExistsByCompositeKey (0xf79fa988)

```solidity
function taggingRecordExistsByCompositeKey(
    uint256 _targetId,
    string memory _recordType,
    address _relayer,
    address _tagger
) external view returns (bool)
```

Check that a tagging record exists by it's componsite key parts.

Parameters:

| Name        | Type    | Description                                                    |
| :---------- | :------ | :------------------------------------------------------------- |
| _targetId   | uint256 | Id of target being tagged.                                     |
| _recordType | string  | Arbitrary identifier for type of tagging record.               |
| _relayer    | address | Address of Relayer contract that wrote tagging record.         |
| _tagger     | address | Address of wallet that initiated tagging record via relayer.   |

Return values:

| Name | Type | Description                              |
| :--- | :--- | :--------------------------------------- |
| [0]  | bool | boolean; true for exists, false for not. |

### taggingRecordExists (0x18fc4776)

```solidity
function taggingRecordExists(
    uint256 _taggingRecordId
) external view returns (bool)
```

Check that a tagging record exsits by it's Id.

Parameters:

| Name             | Type    | Description        |
| :--------------- | :------ | :----------------- |
| _taggingRecordId | uint256 | taggingRecordId.   |

Return values:

| Name | Type | Description                              |
| :--- | :--- | :--------------------------------------- |
| [0]  | bool | boolean; true for exists, false for not. |

### totalDue (0x0ad2f0c3)

```solidity
function totalDue(address _account) external view returns (uint256 _due)
```

Function to check how much MATIC has been accrued by an address factoring in amount paid out.

Parameters:

| Name     | Type    | Description                            |
| :------- | :------ | :------------------------------------- |
| _account | address | Address of the account being queried.  |

Return values:

| Name | Type    | Description                            |
| :--- | :------ | :------------------------------------- |
| _due | uint256 | Amount of WEI in MATIC due to account. |

### taggingFee (0xfe52656f)

```solidity
function taggingFee() external view returns (uint256)
```

Function to retrieve the ETS platform tagging fee.

Return values:

| Name | Type    | Description  |
| :--- | :------ | :----------- |
| [0]  | uint256 | tagging fee. |
