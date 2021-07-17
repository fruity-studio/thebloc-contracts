// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Posts {
    enum PostType {
        text,
        image,
        video,
        document
    }
    enum PostStatus {
        unpublished,
        published
    }

    struct Author {
        address authorAddress;
        bool preapproved; // approval from other approved authors of the post
        bool approved; // approval from this specific author
    }

    struct Post {
        bytes32 id;
        string title;
        string slug;
        string synopsis;
        string image;
        address[] authors;
        mapping(address => Author) authorsParams;
        bool nsfw;
        bool comments;
        PostType postType;
        string contentId;
        uint256 createdAt;
        PostStatus status;
    }

    bytes32[] public postsArray;
    mapping(bytes32 => Post) postsMap;
    mapping(string => bytes32) postsBySlug;
    mapping(address => bytes32[]) postsByAuthor;

    // events
    event postCreated(bytes32 id, string title, address poster);
    event postPublished(bytes32 id, string title, string slug);
    event postUnpublished(bytes32 id, string title, string slug);
    event postUnlisted(bytes32 id, string title, string slug);

    // modifiers
    modifier isUniqueSlug(string memory slug) {
        require(
            postsBySlug[slug] == "",
            "Please choose a unique slug for your post."
        );
        _;
    }

    modifier postWithSlugExists(string memory slug) {
        require(postsBySlug[slug] != "", "This post does not exist");
        _;
    }

    modifier postExists(bytes32 id) {
        require(postsMap[id].id != "", "This post doesn't exist.");
        _;
    }

    modifier isPostAuthor(bytes32 id) {
        require(
            postsMap[id].authors[0] == msg.sender,
            "You are not the primary author for this post."
        );
        _;
    }

    // functions
    function createNewPost(
        string memory title,
        string memory slug,
        string memory image,
        string memory synopsis,
        bool nsfw,
        string memory contentId
    ) public isUniqueSlug(slug) returns (bytes32 postId) {
        postId = keccak256(abi.encodePacked(title, slug, msg.sender));
        require(
            postsMap[postId].id == "",
            "A post with this ID already exists"
        );

        postsMap[postId].id = postId;
        postsMap[postId].title = title;
        postsMap[postId].slug = slug;
        postsMap[postId].image = image;
        postsMap[postId].synopsis = synopsis;
        postsMap[postId].nsfw = nsfw;
        postsMap[postId].comments = true;
        postsMap[postId].postType = PostType.text;
        postsMap[postId].contentId = contentId;
        postsMap[postId].createdAt = block.timestamp;
        postsMap[postId].status = PostStatus.published;
        // set up msg.sender as main author of post
        postsMap[postId].authors.push(msg.sender);
        postsMap[postId].authorsParams[msg.sender] = Author({
            authorAddress: msg.sender,
            preapproved: true,
            approved: true
        });

        // setup for slug based search (like a traditional blog)
        postsBySlug[slug] = postId;
        // setup for fetching author profile
        postsByAuthor[msg.sender].push(postId);
        // setup posts array
        postsArray.push(postId);

        // emit event for post published
        emit postPublished(postId, title, slug);
    }

    function changePostNSFWStatus(bytes32 postId, bool nsfw)
        public
        postExists(postId)
        isPostAuthor(postId)
    {
        postsMap[postId].nsfw = nsfw;
    }

    function publishPost(bytes32 postId)
        public
        postExists(postId)
        isPostAuthor(postId)
    {
        postsMap[postId].status = PostStatus.published;
        emit postPublished(
            postId,
            postsMap[postId].title,
            postsMap[postId].slug
        );
    }

    function unPublishPost(bytes32 postId)
        public
        postExists(postId)
        isPostAuthor(postId)
    {
        postsMap[postId].status = PostStatus.unpublished;
        emit postUnpublished(
            postId,
            postsMap[postId].title,
            postsMap[postId].slug
        );
    }

    function getPostBySlug(string memory _slug)
        public
        view
        postWithSlugExists(_slug)
        returns (
            bytes32 postId,
            string memory title,
            string memory image,
            string memory slug,
            string memory synopsis,
            bool nsfw,
            PostType postType,
            string memory contentId,
            uint256 createdAt,
            uint256 published
        )
    {
        return getPost(postsBySlug[_slug]);
    }

    function getPost(bytes32 _postId)
        public
        view
        postExists(_postId)
        returns (
            bytes32 postId,
            string memory title,
            string memory image,
            string memory slug,
            string memory synopsis,
            bool nsfw,
            PostType postType,
            string memory contentId,
            uint256 createdAt,
            uint256 published
        )
    {
        postId = _postId;
        title = postsMap[_postId].title;
        slug = postsMap[_postId].slug;
        image = postsMap[_postId].image;
        synopsis = postsMap[_postId].synopsis;
        nsfw = postsMap[_postId].nsfw;
        postType = postsMap[_postId].postType;
        contentId = postsMap[_postId].contentId;
        createdAt = postsMap[_postId].createdAt;
        published = uint256(postsMap[_postId].status);
    }

    function fetchPaginatedPosts(uint256 page)
        public
        view
        returns (bytes32[12] memory)
    {
        uint256 totalCount = 12;
        bytes32[12] memory posts;
        if (page == 0) {
            page = 1;
        }
        uint256 startIndex = page * totalCount;
        uint256 counter = 0;

        // empty state
        if (postsArray.length < 1) {
            return posts;
        }

        // change start if total posts smaller than specified index
        if (postsArray.length <= startIndex) {
            startIndex = postsArray.length - 1;
        }

        for (uint256 index = 0; index <= totalCount; index++) {
            posts[counter] = postsArray[startIndex];
            if (startIndex == 0) {
                break;
            }
            counter++;
            startIndex--;
        }

        return posts;
    }
}
