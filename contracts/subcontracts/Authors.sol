// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Authors {
    struct User {
        string name;
        string avatar;
        string website;
        string username;
        address userAddress;
    }

    mapping(address => User) authorsMap;
    mapping(string => address) authorsUsernameToAddressMap;

    modifier isEmptyOrOwnProfile(string memory username) {
        // make sure profile doesn't exist or is already owner of profile
        require(
            authorsUsernameToAddressMap[username] == address(0) ||
                authorsUsernameToAddressMap[username] == msg.sender,
            "You can not make changes to this profile"
        );
        _;
    }

    event authorAdded(string name, string username, address authorsAddress);

    function authorCreateProfile(
        string memory name,
        string memory username,
        string memory website,
        string memory avatar
    ) public {
        authorUpdateProfile(name, username, website, avatar);
        emit authorAdded(name, username, msg.sender);
    }

    function authorUpdateProfile(
        string memory name,
        string memory username,
        string memory website,
        string memory avatar
    ) public isEmptyOrOwnProfile(username) {
        authorsMap[msg.sender] = User({
            name: name,
            username: username,
            avatar: avatar,
            website: website,
            userAddress: msg.sender
        });
        authorsUsernameToAddressMap[username] = msg.sender;
    }

    function authorFetchProfile(User memory profile)
        private
        pure
        returns (
            string memory name,
            string memory username,
            string memory avatar,
            string memory website
        )
    {
        name = profile.name;
        username = profile.username;
        avatar = profile.avatar;
        website = profile.website;
    }

    function authorFetchProfileByAddress(address userAddress)
        public
        view
        returns (
            string memory name,
            string memory username,
            string memory avatar,
            string memory website
        )
    {
        return authorFetchProfile(authorsMap[userAddress]);
    }

    function authorFetchProfileByUsername(string memory _username)
        public
        view
        returns (
            string memory name,
            string memory username,
            string memory avatar,
            string memory website
        )
    {
        address author = authorsUsernameToAddressMap[_username];
        require(author != address(0), "No profile with that username found");
        return authorFetchProfile(authorsMap[author]);
    }
}
