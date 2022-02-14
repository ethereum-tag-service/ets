// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "hardhat/console.sol";

/// @title ETS access controls
/// @author Ethereum Tag Service <security@ets.xyz>
/// @dev Maintains a mapping of ethereum addresses and roles they have within the protocol
contract ETSAccessControls is Initializable, AccessControlUpgradeable, UUPSUpgradeable {
    /// Public constants
    string public constant NAME = "ETS access controls";
    string public constant VERSION = "0.0.1";
    bytes32 public constant PUBLISHER_ROLE = keccak256("PUBLISHER");
    bytes32 public constant SMART_CONTRACT_ROLE = keccak256("SMART_CONTRACT");

    function initialize() public initializer {
        __AccessControl_init();
        // Give default admin role to the deployer.
        // setupRole is should only be called within initialize().
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function postUpgrade(string calldata message) external view onlyRole(DEFAULT_ADMIN_ROLE) {
        console.log("ETSAccessControls upgraded", message);
    }

    // Ensure that only address with admin role can upgrade.
    function _authorizeUpgrade(address) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

    /// @dev Checks whether an address has a smart contract role.
    /// @param _addr Address being checked.
    /// @return bool True if the address has the role, false if not.
    function isSmartContract(address _addr) public view returns (bool) {
        return hasRole(SMART_CONTRACT_ROLE, _addr);
    }

    /// @dev Checks whether an address has an admin role
    /// @param _addr Address being checked
    /// @return bool True if the address has the role, false if not
    function isAdmin(address _addr) public view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, _addr);
    }

    /// @dev Checks whether an address has a publisher role
    /// @param _addr Address being checked
    /// @return bool True if the address has the role, false if not
    function isPublisher(address _addr) public view returns (bool) {
        return hasRole(PUBLISHER_ROLE, _addr);
    }

    function version() external pure returns (string memory) {
        return VERSION;
    }

    function upgraded() external pure returns (string memory) {
        return "you know it";
    }
}
