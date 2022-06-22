// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.6;

import { PausableUpgradeable } from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import { ReentrancyGuardUpgradeable } from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { IERC20Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import { SafeERC20Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import { SafeMathUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import { IETSAccessControls } from "./interfaces/IETSAccessControls.sol";
import { IETSAuctionHouse } from "./interfaces/IETSAuctionHouse.sol";
import { IETSToken } from "./interfaces/IETSToken.sol";
import { IWMATIC } from "./interfaces/IWMATIC.sol";

import "hardhat/console.sol";

/**
 * @title
 */
contract ETSAuctionHouse is IETSAuctionHouse, PausableUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable {
    using SafeMathUpgradeable for uint256;
    using SafeERC20Upgradeable for IERC20Upgradeable;

    IETSToken public etsToken;
    IETSAccessControls public etsAccessControls;

    /// Public constants

    string public constant NAME = "ETS Auction House";
    string public constant VERSION = "0.1.0";
    uint256 public constant modulo = 100;

    /// Public variables

    /// @dev The address of the WMATIC contract
    address public wmatic;

    /// @dev The minimum amount of time left in an auction after a new bid is created
    uint256 public timeBuffer;

    /// @dev The minimum price accepted in an auction
    uint256 public reservePrice;

    /// @dev The minimum percentage difference between the last bid amount and the current bid
    uint8 public minBidIncrementPercentage;

    /// @dev The duration of a single auction
    uint256 public duration;

    /// @dev Percentage of auction proceeds allocated to CTAG Creator
    uint256 public creatorPercentage;

    /// @dev Percentage of auction proceeds allocated to CTAG Publisher.
    uint256 public publisherPercentage;

    /// @dev Percentage of auction proceeds allocated to ETS.
    uint256 public platformPercentage;

    /// @dev Mapping of active auctions
    mapping(uint256 => IETSAuctionHouse.Auction) public auctions;

    /// Modifiers

    modifier tagExists(uint256 tokenId) {
        require(etsToken.tagExists(tokenId), "CTAG does not exist");
        _;
    }

    modifier platformOwned(uint256 tokenId) {
        // Returns "ERC721: owner query for nonexistent token" for non-existent token.
        require(etsToken.ownerOf(tokenId) == etsToken.getPlatformAddress(), "CTAG not owned by ETS");
        _;
    }

    // modifier notReserved(uint256 tokenId) {
    //     require(!etsToken.reserved, "CTAG reserved");
    //     _;
    // }

    modifier auctionExists(uint256 tokenId) {
        require(_exists(tokenId), "Auction doesn't exist");
        _;
    }

    modifier onlyAdmin() {
        require(etsAccessControls.isAdmin(_msgSender()), "Caller must be administrator");
        _;
    }

    // ============ UUPS INTERFACE ============

    function initialize(
        IETSToken _etsToken,
        IETSAccessControls _etsAccessControls,
        address _wmatic,
        uint256 _timeBuffer,
        uint256 _reservePrice,
        uint8 _minBidIncrementPercentage,
        uint256 _duration,
        uint256 _publisherPercentage,
        uint256 _creatorPercentage,
        uint256 _platformPercentage
    ) external initializer {
        __Pausable_init();
        __ReentrancyGuard_init();

        etsToken = _etsToken;
        etsAccessControls = _etsAccessControls;
        wmatic = _wmatic;
        timeBuffer = _timeBuffer; // 5 * 60 = extend 5 minutes after every bid made in last 15 minutes
        reservePrice = _reservePrice;
        minBidIncrementPercentage = _minBidIncrementPercentage; // 5
        duration = _duration;
        publisherPercentage = _publisherPercentage;
        creatorPercentage = _creatorPercentage;
        platformPercentage = _platformPercentage;
    }

    function _authorizeUpgrade(address) internal override onlyAdmin {}

    // ============ OWNER/ADMIN INTERFACE ============

    function pause() public onlyAdmin {
        _pause();
    }

    function unpause() public onlyAdmin {
        _unpause();
    }

    function setReservePrice(uint256 _reservePrice) public onlyAdmin {
        reservePrice = _reservePrice;
        emit AuctionReservePriceSet(_reservePrice);
    }

    function setTimeBuffer(uint256 _timeBuffer) 
    
    public 
    
    
    onlyAdmin 
    
    {
        timeBuffer = _timeBuffer;
        emit AuctionTimeBufferSet(_timeBuffer);
    }

    function setProceedPercentages(uint256 _platformPercentage, uint256 _publisherPercentage) public onlyAdmin {
        require(_platformPercentage + _publisherPercentage <= 100, "Input must not exceed 100%");
        platformPercentage = _platformPercentage;
        publisherPercentage = _publisherPercentage;
        creatorPercentage = modulo - platformPercentage - publisherPercentage;

        emit AuctionProceedPercentagesSet(platformPercentage, publisherPercentage, creatorPercentage);
    }

    // ============ PUBLIC INTERFACE ============

    function createBid(uint256 _tokenId)
        public
        payable
        nonReentrant
        whenNotPaused
        platformOwned(_tokenId)
    // TODO: Reserved/Premum tags. see issue https://github.com/ethereum-tag-service/ets/issues/129
    // notReserved(_tokenId)
    {
        // Retrieve active auction or create new one if _tokenId exists and is platform owned.
        Auction memory auction = _getAuction(_tokenId);

        require(block.timestamp < auction.endTime, "Auction ended");
        require(msg.value >= reservePrice, "Must send at least reservePrice");
        require(
            msg.value >= auction.amount + ((auction.amount * minBidIncrementPercentage) / 100),
            "Must send more than last bid by minBidIncrementPercentage amount"
        );

        address payable lastBidder = auction.bidder;

        // Refund the last bidder, if applicable
        if (lastBidder != address(0)) {
            _safeTransferETHWithFallback(lastBidder, auction.amount);
        }

        auctions[_tokenId].amount = msg.value;
        auctions[_tokenId].bidder = payable(msg.sender);

        // Extend the auction if the bid was received within `timeBuffer` of the auction end time
        bool extended = auction.endTime - block.timestamp < timeBuffer;
        if (extended) {
            auctions[_tokenId].endTime = auction.endTime = block.timestamp + timeBuffer;
            emit AuctionExtended(_tokenId, auction.endTime);
        }

        emit AuctionBid(_tokenId, msg.sender, msg.value, extended);
    }

    function settleAuction(uint256 _tokenId) public nonReentrant auctionExists(_tokenId) {
        Auction memory auction = _getAuction(_tokenId);

        require(block.timestamp >= auction.endTime, "Auction hasn't completed");

        // Transfer CTAG Token to winner.
        etsToken.transferFrom(etsToken.getPlatformAddress(), auction.bidder, _tokenId);

        // Distribute proceeds to actors.
        IETSToken.Tag memory ctag = etsToken.getTag(_tokenId);
        uint256 publisherProceeds = (auction.amount * publisherPercentage) / modulo;
        uint256 creatorProceeds = (auction.amount * creatorPercentage) / modulo;
        _safeTransferETHWithFallback(ctag.publisher, publisherProceeds);
        _safeTransferETHWithFallback(ctag.creator, creatorProceeds);

        emit AuctionSettled(_tokenId, auction.bidder, auction.amount, publisherProceeds, creatorProceeds);
        delete auctions[_tokenId];
    }

    // ============ INTERNAL FUNCTIONS ============

    function _getAuction(uint256 _tokenId) private returns (Auction memory auction) {
        if (auctions[_tokenId].startTime > 0) {
            return auctions[_tokenId];
        }
        return _createAuction(_tokenId);
    }

    function _createAuction(uint256 _tokenId) private returns (Auction memory auction) {
        // TODO: Have duration & reserve price configurable by standard vs. premium.
        auctions[_tokenId] = Auction({
            amount: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            reservePrice: reservePrice,
            bidder: payable(address(0))
        });

        emit AuctionCreated(_tokenId);
        return auctions[_tokenId];
    }

    function _safeTransferETHWithFallback(address to, uint256 amount) internal {
        if (!_safeTransferETH(to, amount)) {
            IWMATIC(wmatic).deposit{ value: amount }();
            IERC20Upgradeable(wmatic).transfer(to, amount);
        }
    }

    function _safeTransferETH(address to, uint256 value) internal returns (bool) {
        (bool success, ) = to.call{ value: value, gas: 30_000 }(new bytes(0));
        return success;
    }

    function _exists(uint256 _tokenId) internal view returns (bool) {
        return (auctions[_tokenId].startTime != 0);
    }

    // ============ PUBLIC VIEW FUNCTIONS ============

    function auctionActive(uint256 _tokenId) public view returns (bool) {
        return _exists(_tokenId);
    }

    function getAuction(uint256 _tokenId) public view returns (Auction memory) {
        return auctions[_tokenId];
    }

    function version() external pure returns (string memory) {
        return VERSION;
    }

    receive() external payable {}

    fallback() external payable {}
}
