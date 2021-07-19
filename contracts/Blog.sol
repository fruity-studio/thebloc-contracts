// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./subcontracts/Authors.sol";
import "./subcontracts/Posts.sol";
import "./subcontracts/Comments.sol";

// import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Blog is Authors, Posts, Comments {
    string name;

    // modifiers
    modifier canComment(bytes32 postId) {
        require(
            commentsEnabledForPost(postId) == true,
            "Comments are disabled for this post"
        );
        _;
    }

    constructor(string memory _name) {
        name = _name;
    }

    /**
        Public functions to interface with sub contracts
     */

    /**
        Comments Public Functions
     */
    function addCommentToPost(bytes32 postId, string memory contentId)
        public
        canComment(postId)
    {
        _addComment(postId, contentId);
    }

    function addCommentToPost(
        bytes32 postId,
        string memory contentId,
        bytes32 parent
    ) public canComment(postId) {
        _addComment(postId, contentId, parent);
    }

    function hideComment(bytes32 postId, bytes32 commentId)
        public
        isPostAuthor(postId)
    {
        _hideComment(postId, commentId);
    }
}
