// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "./ETSTag.sol";
import "./ETSEnsure.sol";

/// @title ETS Core
/// @author Ethereum Tag Service <security@ets.xyz>
/// @notice Core tagging contract that enables any online target to be tagged with an ETSTAG token.
/// @dev ETS Core utilizes Open Zeppelin UUPS upgradability pattern.
contract ETS is Initializable, ContextUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable {
    using SafeMathUpgradeable for uint256;

    /// Storage

    /// @dev ETS access controls contract.
    ETSAccessControls public accessControls;

    /// @dev ETSTAG erc-721 token contract.
    ETSTag public etsTag;

    /// @dev ETSEnsure target contract.
    ETSEnsure public etsEnsure;

    /// @dev Percentage of tagging fee allocated to ETS.
    uint256 public platformPercentage;

    /// @dev Percentage of tagging fee allocated to Publisher.
    uint256 public publisherPercentage;

    /// @dev Percentage of tagging fee allocated to Creator or Owner.
    uint256 public remainingPercentage;

    /// @dev Incremental tagging record counter. Used for tagging record ID.
    uint256 public taggingCounter;

    /// @dev Fee in ETH Collected by ETS for tagging.
    uint256 public taggingFee;

    /// @dev Map for holding amount accrued to participant address wallets.
    mapping(address => uint256) public accrued;

    /// @dev Map for holding lifetime amount drawn down from accrued by participants.
    mapping(address => uint256) public paid;

    /// @dev Map for holding permitted tagging target chain ids.
    mapping(uint256 => bool) public permittedNftChainIds;

    /// @dev Map of tagging id to tagging record.
    mapping(uint256 => TaggingRecord) public taggingRecords;

    /// @dev Map of target id to Target embodied by Target struct.
    mapping(uint256 => Target) public targets;

    /// @dev Placeholder map for enabled target types.
    /**
      Currently, types are a simple string identifying the target type.
       eg. "nft", "url". These are set using setTargetType()
       Obviously, this is a key area to break out into it's own
       contract/interface logic so service can be extended by 3rd parties.
    */
    mapping(string => bool) public targetType; // target => Target struct

    /// Public constants

    string public constant NAME = "ETS Core";
    string public constant VERSION = "0.0.1";
    uint256 public constant modulo = 100;

    /// Structs

    /**
     * @dev Data structure for a tagging record.
     * @param etsTagId Id of ETSTAG token being used to tag a target.
     * @param targetId Id of target being tagged with ETSTAG.
     * @param tagger Address of wallet being credited with tagging record.
     * @param publisher Address of wallet being credited with enabling tagging record.
     * @param timestamp Time when target was tagged.
     */
    struct TaggingRecord {
        uint256 etsTagId;
        uint256 targetId;
        address tagger;
        address publisher;
        uint256 timestamp;
    }

    /**
     * @dev Data structure for tagging targets
     * @param targetType Identifier for type of target being tagged
     *        TODO:
     *         1) Consider renaming in the struct to just 'type'
     *         2) depending on how types are coded/handled. consider
     *         a better datatype to hold this. eg. bytes2, bytes4
     *         and perhaps have that be a map of it's own eg:
     *           struct TaggingType {
     *             bytes8 name; // human readable name.
     *             address implemenation; // address of type contract implementation.
     *             address publisher; // address of third party that published implementation.
     *             uint created;
     *             bool enabled;
     *          }
     * @param targetURI Unique resource identifier for tagging target
     *        TODO:
     *        1) Consider calling just 'uri'
     *        2) Storage opmtimization of input string from client. eg.
     *           is there anyway to store URI as bytes32?
     * @param created timestamp of when target was created in ETS.
     * @param lastEnsured timestamp of when target was last ensured. Defaults to 0
     * @param status https status of last response from ensure target api eg. "404", "200". defaults to 0.
     * @param ipfsHash ipfsHash of additional metadata surrounding target provided by ETS Ensure target API.
     *        TODO:
     *        1) Optimization. Would be nice to do better than a string here (eg. bytes32).
     *        There's much talk/issues around the length of IPFS hashes and how to store them as bytes
     */
    struct Target {
      string targetType;
      string targetURI;
      uint created;
      uint lastEnsured;
      uint status;
      string ipfsHash;
    }

    /// Events

    event TargetTagged(
        uint256 taggingId
    );

    event FundsWithdrawn(
        address indexed who,
        uint256 amount
    );

    event TaggingFeeSet(
        uint256 previousFee,
        uint256 taggingFee
    );

    event AccessControlsUpdated(
        ETSAccessControls previousAccessControls, 
        ETSAccessControls newAccessControls
    );

    event ETSEnsureUpdated(
        ETSEnsure previousETSEnsure, 
        ETSEnsure newETSEnsure
    );

    event PercentagesSet(
        uint256 platformPercentage,
        uint256 publisherPercentage,
        uint256 remainingPercentage
    );

    event PermittedNftChainIdSet(
        uint256 nftChainId,
        bool setting
    );

    event TargetTypeSet(
        string typeName,
        bool setting
    );

    event TargetCreated(
        uint256 targetId
    );

    event TargetUpdated(
        uint256 targetId
    );

    event RequestEnsureTarget(
      uint256 targetId
    );

    /// Modifiers

    /// @dev When applied to a method, only allows execution when the sender has the admin role.
    modifier onlyAdmin() {
        require(accessControls.isAdmin(_msgSender()), "Caller must be admin");
        _;
    }

    /// @dev Replaces contructor function for UUPS Proxy contracts. Called upon first deployment.
    function initialize(ETSAccessControls _accessControls, ETSTag _etsTag) public initializer {
        accessControls = _accessControls;
        etsTag = _etsTag;
        taggingCounter = 0;
        taggingFee = 0.001 ether;
        platformPercentage = 20;
        publisherPercentage = 30;
        remainingPercentage = 50;
    }

    // Ensure that only address with admin role can upgrade.
    function _authorizeUpgrade(address) internal override onlyAdmin {}

    // External write

    /// @notice Tag a target with an tag string.
    /// @param _tagString String target is being tagged with.
    /// @param _targetType Type of target being tagged. eg. nft.
    /// @param _targetURI Uniform resource identifier of the target being tagged.
    /// @param _publisher Address of publisher enabling the tagging record.
    /// @param _tagger Address of tagger being credited performing tagging record.
    /// @param _ensure Boolean flag, set true to ensure the target at time of tagging.
    function tagTarget(
        string calldata _tagString,
        string calldata _targetType,
        string calldata _targetURI,
        address payable _publisher,
        address _tagger,
        bool _ensure
    ) public payable nonReentrant {
        require(accessControls.isPublisher(_publisher), "Tag: The publisher must be whitelisted");
        require(msg.value >= taggingFee, "Tag: You must send the fee");
        require(targetType[_targetType], "Target type: Type not permitted");

        // Get targetId if the target exists, otherwise, create a new one.
        uint256 targetId = getTargetId(_targetType, _targetURI);

        // Get etsTagId if the tag exists, otherwise, mint a new one.
        uint256 etsTagId = getTagId(_tagString, _publisher, _tagger);

        if (_ensure) {
            // TODO: Only ensure if not previously ensured or user wants to re-ensure.
            // TODO: put all of this into it's own function in ETS?
            etsEnsure.requestEnsureTarget(targetId);
        }

        // could probably put a conditional in here that
        // only tags target if it's ensured.
        _tagTarget(etsTagId, targetId, _publisher, _tagger);
    }

    /// @notice Fetch an etstagId from tag string.
    /// @dev Looks in tagToTokenId map and returns if ETSTag is found for tag string 
    /// Otherwise mints a new ETSTag and returns id.
    /// @param _tagString tag string for ETSTag we are looking up.
    /// @param _publisher publisher address, to attribute new ETSTag to if one s minted
    /// @param _tagger tagger address, to attribute new ETSTag to if one s minted
    /// @return etstagId Id of ETSTag token.
    function getTagId(
        string calldata _tagString,
        address payable _publisher,
        address _tagger
    ) public payable returns (uint256 etstagId) {
        uint256 _etstagId = etsTag.getTagId(_tagString);
        if (_etstagId == 0) {
            _etstagId = etsTag.mint(_tagString, _publisher, _tagger);
        }
        return _etstagId;
    }

    /// @notice Get a target Id from target type and target uri.
    /// TODO: Perhaps rename this with a better name, because it's
    /// also creating a target record if it doesn't exist?
    // Or perthaps breakout another function called create target?
    function getTargetId(string calldata _targetType, string calldata _targetURI) public returns (uint256 targetId) {
        uint256 _targetId = _makeTargetId(_targetType, _targetURI);
        if (targets[_targetId].created != 0) {
          return _targetId;
        }
        return createTarget(_targetType, _targetURI);
    }

    /// TODO: Finish documentation.
    function createTarget(string calldata _targetType, string calldata _targetURI) public returns (uint256 targetId){
        uint256 _targetId = _makeTargetId(_targetType, _targetURI);
        targets[_targetId] = Target({
            targetType: _targetType,
            targetURI: _targetURI, // todo: consider ways to encode _targetURI as some sort of fixed length bytes type.
            created: block.timestamp,
            lastEnsured: 0, // if null, target has never been ensured.
            status: 0,
            ipfsHash: ""
        });
        emit TargetCreated(_targetId);
        return _targetId;
    }


    /// @notice Updates a target with new values.
    /// @dev TODO: gate this function to be callable only by platform?
    /// @return success boolean
    function updateTarget(
        uint256 _targetId,
        string calldata _targetType,
        string calldata _targetURI,
        uint _lastEnsured,
        uint _status,
        string calldata _ipfsHash
    ) external returns(bool success) {
        targets[_targetId].targetType = _targetType;
        targets[_targetId].targetURI = _targetURI;
        targets[_targetId].lastEnsured = _lastEnsured;
        targets[_targetId].status = _status;
        targets[_targetId].ipfsHash = _ipfsHash;
        emit TargetUpdated(_targetId);
        return true;
    }

    /// @notice Enables anyone to send ETH accrued by an account.
    /// @dev Can be called by the account owner or on behalf of someone.
    /// @dev Does nothing when there is nothing due to the account.
    /// @param _account Target address that has had accrued ETH and which will receive the ETH.
    function drawDown(address payable _account) external nonReentrant {
        uint256 balanceDue = accrued[_account].sub(paid[_account]);
        if (balanceDue > 0 && balanceDue <= address(this).balance) {
            paid[_account] = paid[_account].add(balanceDue);
            _account.transfer(balanceDue);

            emit FundsWithdrawn(_account, balanceDue);
        }
    }

    /// @notice Sets the fee required to tag an NFT asset.
    /// @param _fee Value of the fee in WEI.
    function setTaggingFee(uint256 _fee) external onlyAdmin {
        uint previousFee = taggingFee;
        taggingFee = _fee;
        emit TaggingFeeSet(previousFee, taggingFee);
    }

    /// @notice Admin functionality for updating the access controls.
    /// @param _accessControls Address of the access controls contract.
    function updateAccessControls(ETSAccessControls _accessControls) external onlyAdmin {
        require(address(_accessControls) != address(0), "ETS.updateAccessControls: Cannot be zero");
        ETSAccessControls prevAccessControls = accessControls;
        accessControls = _accessControls;
        emit AccessControlsUpdated(prevAccessControls, accessControls);
    }

    /// @notice Admin functionality for updating the ETSEnsure contract address.
    /// @param _etsEnsure Address of the ETSEnsure contract.
    function updateETSEnsure(ETSEnsure _etsEnsure) external onlyAdmin {
        require(address(_etsEnsure) != address(0), "ETS.updateETSEnsure: Cannot be zero");
        ETSEnsure previousETSEnsure = etsEnsure;
        etsEnsure = _etsEnsure;
        emit ETSEnsureUpdated(previousETSEnsure, etsEnsure);
    }

    /// @notice Admin functionality for updating the percentages.
    /// @param _platformPercentage percentage for platform.
    /// @param _publisherPercentage percentage for publisher.
    function updatePercentages(uint256 _platformPercentage, uint256 _publisherPercentage) external onlyAdmin {
        require(
            _platformPercentage.add(_publisherPercentage) <= 100,
            "ETS.updatePercentages: percentages must not be over 100"
        );
        platformPercentage = _platformPercentage;
        publisherPercentage = _publisherPercentage;
        remainingPercentage = modulo.sub(platformPercentage).sub(publisherPercentage);
        
        emit PercentagesSet(platformPercentage, publisherPercentage, remainingPercentage);
    }

    function setTargetType(string calldata _typeName, bool _setting) external onlyAdmin {
        targetType[_typeName] = _setting;
        emit TargetTypeSet(_typeName, _setting);
    }

    /// @notice Admin functionality for enabling/disabling target chains.
    /// @param _nftChainId EVM compatible chain id.
    /// @param _setting Boolean, set true for enabled, false for disabled.
    function setPermittedNftChainId(uint256 _nftChainId, bool _setting) external onlyAdmin {
        permittedNftChainIds[_nftChainId] = _setting;
        emit PermittedNftChainIdSet(_nftChainId, _setting);
    }

    /// External read

    /// @notice Used to check how much ETH has been accrued by an address factoring in amount paid out.
    /// @param _account Address of the account being queried.
    /// @return _due Amount of WEI in ETH due to account.
    function totalDue(address _account) external view returns (uint256 _due) {
        return accrued[_account].sub(paid[_account]);
    }

    /// @dev Retrieves a tagging record.
    /// @param _taggingId ID of the tagging record.
    /// @return _etsTagId token ID of ETSTAG used.
    /// @return _targetId Id of tagging target.
    /// @return _tagger Address that tagged the NFT asset.
    /// @return _publisher Publisher through which the tag took place.
    /// @return _timestamp When the tagging record took place.
    function getTaggingRecord(uint256 _taggingId)
        external
        view
        returns (
          uint256 _etsTagId,
          uint256 _targetId,
          address _tagger,
          address _publisher,
          uint256 _timestamp
        )
    {
        TaggingRecord storage taggingRecord = taggingRecords[_taggingId];
        return (
            taggingRecord.etsTagId,
            taggingRecord.targetId,
            taggingRecord.tagger,
            taggingRecord.publisher,
            taggingRecord.timestamp
        );
    }

    /// @notice Check if a target chain is permitted for tagging.
    /// @param _nftChainId EVM compatible chain id.
    /// @return true for enabled, false for disabled.
    function getPermittedNftChainId(uint256 _nftChainId) external view returns (bool) {
        return permittedNftChainIds[_nftChainId];
    }

    /// @notice check for existence of target.
    /// @param targetId token ID.
    /// @return true if exists.
    function targetExists(uint256 targetId) external view returns (bool) {
        return targets[targetId].created > 0 ? true : false;
    }

    function version() external pure returns (string memory) {
        return VERSION;
    }

    /// Internal

    function _makeTargetId(string calldata _targetType, string calldata _targetURI) private pure returns (uint256 targetId) {
        string memory parts = string(abi.encodePacked(_targetType, _targetURI));
        // The following is how ENS creates ID for their domain names.
        bytes32 label = keccak256(bytes(parts));
        return uint256(label);
    }

   function _tagTarget(
        uint256 _etsTagId,
        uint256 _targetId,
        address _publisher,
        address _tagger
    ) private {

        // Generate a new taggging record id.
        taggingCounter = taggingCounter.add(1);
        uint256 taggingId = taggingCounter;

        taggingRecords[taggingId] = TaggingRecord({
            etsTagId: _etsTagId,
            targetId: _targetId,
            tagger: _tagger,
            publisher: _publisher,
            timestamp: block.timestamp
        });

        (address _platform, address _owner) = etsTag.getPaymentAddresses(_etsTagId);

        // pre-auction.
        if (_owner == _platform) {
            accrued[_platform] = accrued[_platform].add(msg.value.mul(platformPercentage).div(modulo));
            accrued[_publisher] = accrued[_publisher].add(msg.value.mul(publisherPercentage).div(modulo));

            address creator = etsTag.getCreatorAddress(_etsTagId);
            accrued[creator] = accrued[creator].add(msg.value.mul(remainingPercentage).div(modulo));
        }
        // post-auction.
        else {
            accrued[_platform] = accrued[_platform].add(msg.value.mul(platformPercentage).div(modulo));
            accrued[_publisher] = accrued[_publisher].add(msg.value.mul(publisherPercentage).div(modulo));

            accrued[_owner] = accrued[_owner].add(msg.value.mul(remainingPercentage).div(modulo));
        }

        // Log that a target has been tagged.
        emit TargetTagged(taggingId);
    }
}
