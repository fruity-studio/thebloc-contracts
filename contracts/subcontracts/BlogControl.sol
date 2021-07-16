// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../../node_modules/@openzeppelin/contracts/access/AccessControl.sol";

contract BlogControl is AccessControl {
    bytes32 private constant ADMIN_ACCESS = keccak256("ADMIN_ACCESS");

    mapping(address => bool) moderators;
    mapping(bytes32 => bool) unlistedPosts;
    mapping(address => bool) unlistedAuthors;

    // events
    event moderatorAdded(address moderator);
    event moderatorRemoved(address moderator);

    // modifiers
    modifier isModerator() {
        require(moderators[msg.sender] == true, "You're not a moderator.");
        _;
    }

    modifier postIsNotUnlisted(bytes32 postId) {
        require(unlistedPosts[postId] == false, "This post is unlisted");
        _;
    }

    modifier authorIsNotUnlisted(address author) {
        require(unlistedAuthors[author] == false, "This author is unlisted");
        _;
    }

    // functions
    constructor() {
        _setupRole(ADMIN_ACCESS, msg.sender);
    }

    function addModerator(address moderator) public onlyRole(ADMIN_ACCESS) {
        moderators[moderator] = true;
        emit moderatorAdded(moderator);
    }

    function removeModerator(address moderator) public onlyRole(ADMIN_ACCESS) {
        delete moderators[moderator];
        emit moderatorRemoved(moderator);
    }
}
