// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./subcontracts/Authors.sol";
import "./subcontracts/Posts.sol";

// import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Blog is Authors, Posts {
    string name;

    constructor(string memory _name) {
        name = _name;
    }
}
