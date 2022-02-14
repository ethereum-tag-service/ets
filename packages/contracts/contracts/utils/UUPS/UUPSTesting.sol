// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ETSAccessControls} from "../../core/ETSAccessControls.sol";
import {ETSTag} from "../../core/ETSTag.sol";
import {ETS} from "../../core/ETS.sol";

contract ETSAccessControlsUpgrade is ETSAccessControls {
    // Extend existing contract with new function.
    function upgradeTest() public pure returns (bool) {
        return true;
    }
}

contract ETSTagUpgrade is ETSTag {
    // Extend existing contract with new function.
    function upgradeTest() public pure returns (bool) {
        return true;
    }
}

contract ETSUpgrade is ETS {
    // Extend existing contract with new function.
    function upgradeTest() public pure returns (bool) {
        return true;
    }
}
