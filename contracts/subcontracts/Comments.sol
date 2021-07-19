// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Comments {
    struct commentStruct {
        bytes32 id;
        bytes32 postId;
        address owner;
        string contentId;
        bool hidden;
        bytes32 parent;
        bytes32[] replies;
    }

    bytes32[] public commentsArray;

    mapping(bytes32 => commentStruct) commentsMap;
    mapping(bytes32 => bytes32[]) commentsForPost;

    // modifiers
    modifier isCommentForPost(bytes32 postId, bytes32 commentId) {
        require(
            commentsMap[commentId].postId == postId,
            "Wrong comment for post"
        );
        _;
    }

    // events
    event commentAdded(bytes32 id, bytes32 postId);
    event replyAdded(bytes32 id, bytes32 parent, bytes32 postId);
    event commentHidden(bytes32 id, address admin);

    function _addComment(bytes32 postId, string memory contentId)
        internal
        returns (bytes32 id)
    {
        id = _createComment(postId, contentId);

        commentsForPost[postId].push(id);

        emit commentAdded(id, postId);
    }

    function _addComment(
        bytes32 postId,
        string memory contentId,
        bytes32 parent
    ) internal returns (bytes32 id) {
        id = _createComment(postId, contentId);

        commentsMap[id].parent = parent;
        commentsMap[parent].replies.push(id);

        emit replyAdded(id, parent, postId);
    }

    function _hideComment(bytes32 postId, bytes32 commentId)
        internal
        isCommentForPost(postId, commentId)
    {
        commentsMap[commentId].hidden = true;

        emit commentHidden(commentId, msg.sender);
    }

    function _createComment(bytes32 postId, string memory contentId)
        internal
        returns (bytes32 id)
    {
        id = keccak256(
            abi.encodePacked(postId, contentId, msg.sender, block.timestamp)
        );
        commentsMap[id].id = id;
        commentsMap[id].postId = postId;
        commentsMap[id].contentId = contentId;
        commentsMap[id].owner = msg.sender;
    }
}
