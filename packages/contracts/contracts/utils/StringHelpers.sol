// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title StringHelpers Contract
/// @author Ethereum Tag Service <security@ets.xyz>
/// @notice Helper functions for common string operations.
abstract contract StringHelpers {

    /// @notice Convert a string to its lowercase equivalent.
    /// @param _base String to convert.
    /// @return string Lowercase version of string supplied.
    function __lower(string memory _base) internal pure returns (string memory) {
        bytes memory bStr = bytes(_base);
        bytes memory bLower = new bytes(bStr.length);
        for (uint256 i = 0; i < bStr.length; i++) {
            // Uppercase character.
            if ((bStr[i] >= 0x41) && (bStr[i] <= 0x5A)) {
                // So we add 32 to make it lowercase.
                bLower[i] = bytes1(uint8(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }
        return string(bLower);
    }
}
