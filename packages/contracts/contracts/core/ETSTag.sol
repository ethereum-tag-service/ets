// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "hardhat/console.sol";

import {ETSAccessControls} from "./ETSAccessControls.sol";
import "../utils/StringHelpers.sol";

/// @title ETSTag ERC-721 NFT contract
/// @author Ethereum Tag Service <security@ets.xyz>
/// @notice Contract that governs the creation of ETSTAG non-fungible tokens.
/// @dev UUPS upgradable.
contract ETSTag is ERC721PausableUpgradeable, ERC721BurnableUpgradeable, UUPSUpgradeable, StringHelpers {
    using AddressUpgradeable for address;
    using StringsUpgradeable for uint256;
    using SafeMathUpgradeable for uint256;

    /// Variable storage

    // baseURI for looking up tokenURI for a token
    string public baseURI;

    /// @notice Term length in seconds that a ETSTAG is owned before it needs to be renewed.
    uint256 public ownershipTermLength;

    /// @notice Sequential integer counter for ETSTAG Id and total count.
    uint256 public tokenPointer;

    /// @notice minimum ETSTAG string length.
    uint256 public tagMinStringLength;

    /// @notice maximum ETSTAG string length.
    uint256 public tagMaxStringLength;

    /// @notice ETS Platform account.
    address payable public platform;

    /// @notice ETS access controls smart contract.
    ETSAccessControls public accessControls;

    /// @notice Map of ETSTAG id to ETSTAG record.
    mapping(uint256 => Tag) public tokenIdToTag;

    /// @notice lookup of (lowercase) tag string to ETSTAG Id.
    mapping(string => uint256) public tagToTokenId;

    /// @notice Last time a ETSTAG was transfered.
    mapping(uint256 => uint256) public tokenIdToLastTransferTime;

    /// Public constants

    string public constant NAME = "ETSTAG Token";
    string public constant VERSION = "0.2.0";

    /// Modifiers

    modifier onlyAdmin() {
        require(accessControls.isAdmin(_msgSender()), "Caller must have administrator access");
        _;
    }

    /// Structs

    // Container for ETSTAG token
    struct Tag {
        address originalPublisher;
        address creator;
        string displayVersion;
        string machineName;
    }

    /// Events

    event MintTag(uint256 indexed tokenId, string displayVersion, address indexed publisher, address creator);

    event TagBurned(uint256 indexed tokenId);

    event TagRecycled(uint256 indexed tokenId, address indexed owner);

    event TagRenewed(uint256 indexed tokenId, address indexed caller);

    event OwnershipTermLengthUpdated(uint256 originalOwnershipLength, uint256 updatedOwnershipLength);

    event TagMaxStringLengthUpdated(uint256 previousMaxStringLength, uint256 newMaxStringLength);

    event PlatformSet(address previousPlatformAddress, address newPlatformAddress);

    event AccessControlsUpdated(ETSAccessControls previousAccessControls, ETSAccessControls newAccessControls);

    event NewBaseURI(string baseURI);

    event RenewalPeriodUpdated(uint256 originalRenewalPeriod, uint256 updatedRenewalPeriod);

    function initialize(ETSAccessControls _accessControls, address payable _platform) public initializer {
        __ERC721_init("Ethereum Tag Service", "ETSTAG");
        __ERC721Pausable_init();
        __ERC721Burnable_init();

        // Initialize access controls.
        accessControls = _accessControls;
        // Set platform address.
        platform = _platform;
        ownershipTermLength = 730 days;
        baseURI = "https://api.hashtag-protocol.io/";
        tagMinStringLength = 1;
        tagMaxStringLength = 32;
    }

    function _authorizeUpgrade(address) internal override onlyAdmin {}

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Upgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /// Minting

    /// @notice Mint a new ETSTAG token.
    /// @dev Tag string must pass validation and publisher must be whitelisted.
    /// @param _tag Tag string to mint - must include hashtag (#) at beginning of string.
    /// @param _publisher Address to be logged as publisher.
    /// @param _creator Address to be logged as creator.
    /// @return _tokenId for newly minted ETSTAG.
    function mint(
        string calldata _tag,
        address payable _publisher,
        address _creator
    ) external payable returns (uint256 _tokenId) {
        require(accessControls.isPublisher(_publisher), "Mint: The publisher must be whitelisted");

        // Perform basic tag string validation.
        string memory machineName = _assertTagIsValid(_tag);

        // generate the new ETSTAG token id.
        tokenPointer = tokenPointer.add(1);
        uint256 tokenId = tokenPointer;

        // mint the token, transferring it to the platform.
        _safeMint(platform, tokenId);

        // Store ETSTAG data in state.
        tokenIdToTag[tokenId] = Tag({
            displayVersion: _tag,
            machineName: machineName,
            originalPublisher: _publisher,
            creator: _creator
        });

        // Store a reverse lookup.
        tagToTokenId[machineName] = tokenId;

        emit MintTag(tokenId, _tag, _publisher, _creator);
        return tokenId;
    }

    /// @notice Burns a given tokenId.
    /// @param tokenId Token Id to burn.
    /// @dev Caller must have administrator role.
    function burn(uint256 tokenId) public virtual override onlyAdmin {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721Burnable: caller is not owner nor approved");
        _burn(tokenId);

        emit TagBurned(tokenId);
    }

    /// @notice Renews an ETSTAG by setting its last transfer time to current time.
    /// @dev Can only be called by token owner.
    /// @param _tokenId The identifier for etstag token.
    function renewTag(uint256 _tokenId) external {
        require(_msgSender() == ownerOf(_tokenId), "renewTag: Invalid sender");

        tokenIdToLastTransferTime[_tokenId] = block.timestamp;

        emit TagRenewed(_tokenId, _msgSender());
    }

    /// @notice Recycling an ETSTAG i.e. transferring ownership back to the platform due to stale ownership.
    /// @dev Token must exist, be not already be owned by platform and time of TX must be greater than lastTransferTime.
    /// @param _tokenId The id of the ETSTAG being recycled.
    function recycleTag(uint256 _tokenId) external {
        require(_exists(_tokenId), "recycleTag: Invalid token ID");
        require(ownerOf(_tokenId) != platform, "recycleTag: Tag already owned by the platform");

        uint256 lastTransferTime = tokenIdToLastTransferTime[_tokenId];
        require(
            lastTransferTime.add(ownershipTermLength) < block.timestamp,
            "recycleTag: Token not eligible for recycling yet"
        );

        _transfer(ownerOf(_tokenId), platform, _tokenId);

        emit TagRecycled(_tokenId, _msgSender());
    }

    /// Administration

    /// @dev Pause ETSTAG token contract.
    function pause() external onlyAdmin {
        _pause();
    }

    /// @dev Unpause ETSTAG token contract.
    function unPause() external onlyAdmin {
        _unpause();
    }

    /// @dev Set base metadata api url.
    /// @param newBaseURI base url
    function setBaseURI(string calldata newBaseURI) public onlyAdmin {
        baseURI = newBaseURI;
        emit NewBaseURI(baseURI);
    }

    /// @notice Admin method for updating the max string length of an ETSTAG.
    /// @param _tagMaxStringLength max length.
    function setTagMaxStringLength(uint256 _tagMaxStringLength) public onlyAdmin {
        uint256 prevTagMaxStringLength = tagMaxStringLength;
        tagMaxStringLength = _tagMaxStringLength;
        emit TagMaxStringLengthUpdated(prevTagMaxStringLength, _tagMaxStringLength);
    }

    /// @notice Admin method for updating the ownership term length for all ETSTAG tokens.
    /// @param _ownershipTermLength New length in unix epoch seconds.
    function setOwnershipTermLength(uint256 _ownershipTermLength) public onlyAdmin {
        uint256 prevOwnershipTermLength = ownershipTermLength;
        ownershipTermLength = _ownershipTermLength;
        emit OwnershipTermLengthUpdated(prevOwnershipTermLength, _ownershipTermLength);
    }

    /// @notice Admin method for updating the address that receives the commission on behalf of the platform.
    /// @param _platform Address that receives minted NFTs.
    function setPlatform(address payable _platform) external onlyAdmin {
        address prevPlatform = platform;
        platform = _platform;
        emit PlatformSet(prevPlatform, _platform);
    }

    /// @notice Admin functionality for updating the access controls.
    /// @param _accessControls Address of the access controls contract.
    function updateAccessControls(ETSAccessControls _accessControls) external onlyAdmin {
        require(address(_accessControls) != address(0), "ETSTag.updateAccessControls: Cannot be zero");
        ETSAccessControls prevAccessControls = accessControls;
        accessControls = _accessControls;
        emit AccessControlsUpdated(prevAccessControls, _accessControls);
    }

    /// external/public view functions

    function getTagId(string calldata tag) public view returns (uint256 etstagId) {
        return (tagToTokenId[__lower(tag)]);
    }

    /// @notice Existence check on a ETSTAG token.
    /// @param tokenId token ID.
    /// @return true if exists.
    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    /// @notice Returns the commission addresses related to a token.
    /// @param _tokenId ID of a ETSTAG.
    /// @return _platform Platform commission address.
    /// @return _owner Address of the owner of the ETSTAG.
    function getPaymentAddresses(uint256 _tokenId)
        public
        view
        returns (address payable _platform, address payable _owner)
    {
        return (platform, payable(ownerOf(_tokenId)));
    }

    /// @notice Returns creator of a ETSTAG token.
    /// @param _tokenId ID of a ETSTAG.
    /// @return _creator creator of the ETSTAG.
    function getCreatorAddress(uint256 _tokenId) public view returns (address _creator) {
        return tokenIdToTag[_tokenId].creator;
    }

    function version() external pure returns (string memory) {
        return VERSION;
    }

    /// internal functions

    /// @dev Base URI for computing {tokenURI}.
    function _baseURI() internal view override(ERC721Upgradeable) returns (string memory) {
        return baseURI;
    }

    /// @dev See {ERC721-_beforeTokenTransfer}. Contract must not be paused.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721PausableUpgradeable, ERC721Upgradeable) {
        super._beforeTokenTransfer(from, to, tokenId);

        require(!paused(), "ERC721Pausable: token transfer while paused");

        // Set last transfer time for use in renewal/reset functionality.
        tokenIdToLastTransferTime[tokenId] = block.timestamp;
    }

    /// @notice Private method used for validating a ETSTAG string before minting.
    /// @dev A series of assertions are performed reverting the transaction for any validation violations.
    /// @param _tag Proposed tag string.
    function _assertTagIsValid(string memory _tag) private view returns (string memory) {
        string memory tagKey = __lower(_tag);
        require(tagToTokenId[tagKey] == 0, "ERC721: token already minted");

        bytes memory tagStringBytes = bytes(_tag);
        require(
            tagStringBytes.length >= tagMinStringLength && tagStringBytes.length <= tagMaxStringLength,
            "Invalid format: tag does not meet min/max length requirements"
        );

        require(tagStringBytes[0] == 0x23, "Tag must start with #");

        // start from first char after #
        for (uint256 i = 1; i < tagStringBytes.length; i++) {
            bytes1 char = tagStringBytes[i];
            require(
                char != 0x20,
                "Space found: tag may not contain spaces"
            );
        }
        return tagKey;
    }
}
