// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (utils/introspection/IERC1820Registry.sol)

pragma solidity ^0.8.0;

interface IETSTargetType {

    // not sure if you can have a string as an argument?
    function validateTargetURI(string calldata targetURI) external view returns (bool);

    // These will be a way to pause and check for 
    function pauseTargetType() external;
    function targetTypePaused() external view returns (bool);

    event TargetTypePaused(string targetType, bool paused);

}
