# IETSAuctionHouse

## Overview

#### License: GPL-3.0

```solidity
interface IETSAuctionHouse
```


## Structs info

### Auction

```solidity
struct Auction {
	uint256 auctionId;
	uint256 tokenId;
	uint256 amount;
	uint256 startTime;
	uint256 endTime;
	uint256 reservePrice;
	address payable bidder;
	address payable auctioneer;
	bool settled;
}
```


## Events info

### RequestCreateAuction

```solidity
event RequestCreateAuction()
```


### AuctionBid

```solidity
event AuctionBid(uint256 indexed auctionId, address sender, uint256 value, bool extended)
```


### AuctionCreated

```solidity
event AuctionCreated(uint256 indexed auctionId, uint256 indexed tokenId, uint256 tokenAuctionNumber)
```


### AuctionExtended

```solidity
event AuctionExtended(uint256 indexed auctionId, uint256 endTime)
```


### AuctionSettled

```solidity
event AuctionSettled(uint256 indexed auctionId)
```


### AuctionsMaxSet

```solidity
event AuctionsMaxSet(uint256 maxAuctions)
```


### AuctionDurationSet

```solidity
event AuctionDurationSet(uint256 duration)
```


### AuctionMinBidIncrementPercentageSet

```solidity
event AuctionMinBidIncrementPercentageSet(uint8 minBidIncrementPercentagePrice)
```


### AuctionReservePriceSet

```solidity
event AuctionReservePriceSet(uint256 reservePrice)
```


### AuctionTimeBufferSet

```solidity
event AuctionTimeBufferSet(uint256 timeBuffer)
```


### AuctionProceedPercentagesSet

```solidity
event AuctionProceedPercentagesSet(uint256 platformPercentage, uint256 relayerPercentage, uint256 creatorPercentage)
```


### AuctionProceedsWithdrawn

```solidity
event AuctionProceedsWithdrawn(address indexed who, uint256 amount)
```


## Functions info

### pause (0x8456cb59)

```solidity
function pause() external
```


### unpause (0x3f4ba83a)

```solidity
function unpause() external
```


### setReservePrice (0xce9c7c0d)

```solidity
function setReservePrice(uint256 _reservePrice) external
```


### setTimeBuffer (0x7120334b)

```solidity
function setTimeBuffer(uint256 timeBuffer) external
```


### setProceedPercentages (0xb68bb0ba)

```solidity
function setProceedPercentages(
    uint256 _platformPercentage,
    uint256 _relayerPercentage
) external
```


### createBid (0x659dd2b4)

```solidity
function createBid(uint256 auctionId) external payable
```


### settleCurrentAndCreateNewAuction (0x666077c9)

```solidity
function settleCurrentAndCreateNewAuction(uint256 _tokenId) external
```


### settleAuction (0x2e993611)

```solidity
function settleAuction(uint256 _tokenId) external
```


### createNextAuction (0x01810a96)

```solidity
function createNextAuction() external
```


### fulfillRequestCreateAuction (0x279a0147)

```solidity
function fulfillRequestCreateAuction(uint256 _tokenId) external
```


### auctionExists (0x3c0868f0)

```solidity
function auctionExists(uint256 _tokenId) external returns (bool)
```


### auctionEnded (0x9e712387)

```solidity
function auctionEnded(uint256 _tokenId) external returns (bool)
```


### auctionSettled (0x28b9e726)

```solidity
function auctionSettled(uint256 _tokenId) external returns (bool)
```


### getActiveCount (0x63338b17)

```solidity
function getActiveCount() external returns (uint256)
```


### getTotalCount (0x56d42bb3)

```solidity
function getTotalCount() external returns (uint256)
```


### getAuction (0x78bd7935)

```solidity
function getAuction(
    uint256 _tokenId
) external returns (IETSAuctionHouse.Auction memory auction)
```


### getBalance (0x12065fe0)

```solidity
function getBalance() external returns (uint256)
```


### totalDue (0x0ad2f0c3)

```solidity
function totalDue(address _account) external returns (uint256 _due)
```


### drawDown (0xc2062005)

```solidity
function drawDown(address payable _account) external
```

