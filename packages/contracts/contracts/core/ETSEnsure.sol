// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {ETSAccessControls} from "./ETSAccessControls.sol";
import {ETS} from "./ETS.sol";


/// @title ETSEnsure target contract.
/// @author Ethereum Tag Service <security@ets.xyz>
/// @dev Used by ETS to ensure targets using off-chain data.
contract ETSEnsure is Initializable, ContextUpgradeable, UUPSUpgradeable {

    /// Variable storage
    /// @notice ETS access controls smart contract.
    ETSAccessControls public accessControls;

    /// @notice ETS access controls smart contract.
    ETS public ets;

    /// @notice ETS Platform account.
    address payable public platform;

    /// Public constants

    string public constant NAME = "ETSEnsure";
    string public constant VERSION = "0.0.1";

    /// Events

    event RequestEnsureTarget(
      uint256 targetId
    );

    /// Modifiers

    modifier onlyAdmin() {
        require(accessControls.isAdmin(_msgSender()), "Caller must have administrator access");
        _;
    }

    /// Initialization

    function initialize(ETSAccessControls _accessControls, ETS _ets) public initializer {
        // Initialize access controls & ETS
        accessControls = _accessControls;
        ets = _ets;
    }



    function _authorizeUpgrade(address) internal override onlyAdmin {}

    /// @notice Ensure a target Id using the off chain ETS Ensure Target API.
    /// @dev Emits a RequestEnsureTarget event with targetId to Openzeppelin
    /// Defender which is listening for event. When event is detected, OZ makes
    /// callout to ETS.targets(targetId) to collect targetType and targetURI.
    /// With these, OZ makes callout to ETS Ensure Target API which collects
    /// metadata for target, pins it to IPFS and returns pin to ETS blockchain
    /// via fulfillEnsureTarget()
    /// @param targetId Unique id of target to be ensured.
    function requestEnsureTarget(uint256 targetId) public {
        require (ets.targetExists(targetId) == true, "Invalid target");
        // TODO: Only ensure if not previously ensured or user wants to re-ensure.
        emit RequestEnsureTarget(targetId);
    }

    /// @notice Decorates target with additional metadata stored in IPFS hash.
    /// see requestEnsureTarget()
    /// TODO: 1) consider access restricting this? ie. not public function.
    /// 2) add another field for 200 status, but failed metadata collection.
    /// @param _targetId Unique id of target being ensured.
    /// @param _ipfsHash IPFS hash containing metadata related to the unique target.
    /// @param _status HTTP response code from ETS Ensure Target API.
    function fulfillEnsureTarget(uint256 _targetId, string calldata _ipfsHash, uint _status) public {
        // Load up current values for this target.
        // Note: not naming unnecessary local variable avoids compiler warnings.
        (string memory targetType, string memory targetURI,,,,) = ets.targets(_targetId);
        ets.updateTarget(_targetId, targetType, targetURI, block.timestamp, _status, _ipfsHash);
    }
}
