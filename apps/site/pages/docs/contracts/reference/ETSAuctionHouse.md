# ETSAuctionHouse

## Overview

#### License: GPL-3.0

```solidity
contract ETSAuctionHouse is Initializable, PausableUpgradeable, ReentrancyGuardUpgradeable, IETSAuctionHouse, UUPSUpgradeable
```

Author: Ethereum Tag Service <team@ets.xyz>


ETSAuctionHouse contract governs the sale of Ethereum Tag Service composable tags (CTAGs).
## Constants info

### NAME (0xa3f4df7e)

```solidity
string constant NAME = "ETS Auction House"
```

Public constants
### MODULO (0xa8586f7b)

```solidity
uint256 constant MODULO = 100
```


## State variables info

### etsToken (0x46ca0f4d)

```solidity
contract IETSToken etsToken
```


### etsAccessControls (0x8299f9f9)

```solidity
contract IETSAccessControls etsAccessControls
```


### maxAuctions (0x69a6e9c6)

```solidity
uint256 maxAuctions
```

Public variables
### auctions (0x571a26a0)

```solidity
mapping(uint256 => struct IETSAuctionHouse.Auction) auctions
```

Mapping of auction ID to auction.
### auctionsByTokenId (0x69f37887)

```solidity
mapping(uint256 => uint256[]) auctionsByTokenId
```

Mapping of tokenId to array of auction ids.
### wmatic (0xfb41be16)

```solidity
address wmatic
```

The address of the WMATIC contract
### timeBuffer (0xec91f2a4)

```solidity
uint256 timeBuffer
```

The minimum amount of time left in an auction after a new bid is created
### reservePrice (0xdb2e1eed)

```solidity
uint256 reservePrice
```

The minimum price accepted in an auction
### minBidIncrementPercentage (0xb296024d)

```solidity
uint8 minBidIncrementPercentage
```

The minimum percentage difference between the last bid amount and the current bid
### duration (0x0fb5a6b4)

```solidity
uint256 duration
```

The duration of a single auction
### creatorPercentage (0xf071bf4f)

```solidity
uint256 creatorPercentage
```

Percentage of auction proceeds allocated to CTAG Creator
### relayerPercentage (0x2a1e1ee1)

```solidity
uint256 relayerPercentage
```

Percentage of auction proceeds allocated to CTAG Relayer.
### platformPercentage (0x1f741897)

```solidity
uint256 platformPercentage
```

Percentage of auction proceeds allocated to ETS.
### accrued (0xb148440f)

```solidity
mapping(address => uint256) accrued
```

Map for holding amount accrued to participant address wallets.
### paid (0xa340cf79)

```solidity
mapping(address => uint256) paid
```

Map for holding lifetime amount drawn down from accrued by participants.
## Modifiers info

### tagExists

```solidity
modifier tagExists(uint256 tokenId)
```

Modifiers
### platformOwned

```solidity
modifier platformOwned(uint256 tokenId)
```


### onlyAuctionOracle

```solidity
modifier onlyAuctionOracle()
```


### onlyAdmin

```solidity
modifier onlyAdmin()
```


### onlyPlatform

```solidity
modifier onlyPlatform()
```


## Functions info

### constructor

```solidity
constructor()
```

oz-upgrades-unsafe-allow: constructor
### initialize (0x0acc9e09)

```solidity
function initialize(
    IETSToken _etsToken,
    IETSAccessControls _etsAccessControls,
    address _wmatic,
    uint256 _maxAuctions,
    uint256 _timeBuffer,
    uint256 _reservePrice,
    uint8 _minBidIncrementPercentage,
    uint256 _duration,
    uint256 _relayerPercentage,
    uint256 _platformPercentage
) external initializer
```


### pause (0x8456cb59)

```solidity
function pause() public onlyAdmin
```


### unpause (0x3f4ba83a)

```solidity
function unpause() public onlyAdmin
```


### setMaxAuctions (0x3b6e0ef5)

```solidity
function setMaxAuctions(uint256 _maxAuctions) public onlyAdmin
```


### setDuration (0xf6be71d1)

```solidity
function setDuration(uint256 _duration) public onlyAdmin
```


### setMinBidIncrementPercentage (0x36ebdb38)

```solidity
function setMinBidIncrementPercentage(
    uint8 _minBidIncrementPercentage
) public onlyAdmin
```


### setReservePrice (0xce9c7c0d)

```solidity
function setReservePrice(uint256 _reservePrice) public onlyAdmin
```


### setTimeBuffer (0x7120334b)

```solidity
function setTimeBuffer(uint256 _timeBuffer) public onlyAdmin
```


### setProceedPercentages (0xb68bb0ba)

```solidity
function setProceedPercentages(
    uint256 _platformPercentage,
    uint256 _relayerPercentage
) public onlyAdmin
```


### settleCurrentAndCreateNewAuction (0x666077c9)

```solidity
function settleCurrentAndCreateNewAuction(
    uint256 _auctionId
) public nonReentrant whenNotPaused
```

Settle auction, and release next auction.
### settleAuction (0x2e993611)

```solidity
function settleAuction(uint256 _auctionId) public whenPaused nonReentrant
```

Settle the auction.

This function can only be called when the contract is paused.
### createNextAuction (0x01810a96)

```solidity
function createNextAuction() public whenNotPaused
```


### fulfillRequestCreateAuction (0x279a0147)

```solidity
function fulfillRequestCreateAuction(uint256 _tokenId) public onlyAuctionOracle
```


### createBid (0x659dd2b4)

```solidity
function createBid(
    uint256 _auctionId
) public payable nonReentrant whenNotPaused
```


### drawDown (0xc2062005)

```solidity
function drawDown(address payable _account) external nonReentrant
```

Function for withdrawing funds from an accrual account. Can be called by the account owner
or on behalf of the account. Does nothing when there is nothing due to the account.



Parameters:

| Name     | Type            | Description                                                           |
| :------- | :-------------- | :-------------------------------------------------------------------- |
| _account | address payable | Address of account being drawn down and which will receive the funds. |

### auctionExists (0x3c0868f0)

```solidity
function auctionExists(uint256 _auctionId) public view returns (bool)
```


### auctionExistsForTokenId (0x3799cd57)

```solidity
function auctionExistsForTokenId(uint256 _tokenId) public view returns (bool)
```


### auctionEnded (0x9e712387)

```solidity
function auctionEnded(uint256 _auctionId) public view returns (bool)
```


### auctionSettled (0x28b9e726)

```solidity
function auctionSettled(uint256 _auctionId) public view returns (bool)
```


### getAuction (0x78bd7935)

```solidity
function getAuction(
    uint256 _auctionId
) public view returns (IETSAuctionHouse.Auction memory)
```


### getAuctionForTokenId (0xb53fb508)

```solidity
function getAuctionForTokenId(
    uint256 _tokenId
) public view returns (IETSAuctionHouse.Auction memory)
```


### getAuctionCountForTokenId (0xd178687a)

```solidity
function getAuctionCountForTokenId(
    uint256 _tokenId
) public view returns (uint256)
```


### getActiveCount (0x63338b17)

```solidity
function getActiveCount() public view returns (uint256)
```


### getTotalCount (0x56d42bb3)

```solidity
function getTotalCount() public view returns (uint256)
```


### getBalance (0x12065fe0)

```solidity
function getBalance() public view returns (uint256)
```


### totalDue (0x0ad2f0c3)

```solidity
function totalDue(address _account) public view returns (uint256 _due)
```


### receive

```solidity
receive() external payable
```


### fallback

```solidity
fallback() external payable
```

