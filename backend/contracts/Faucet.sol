// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenFaucet is Ownable {
    // Mapping to track last request time for each user
    mapping(address => uint256) public lastRequestTime;

    // Cooldown period between token requests
    uint256 public constant COOLDOWN_PERIOD = 1 hours;

    // Maximum tokens that can be requested
    uint256 public constant MAX_REQUEST_AMOUNT = 1000 * 10**18;

    // Supported test tokens
    ERC20 public testToken;

    constructor(ERC20 _testToken) {
        testToken = _testToken;
    }

    // Request test tokens with cooldown and max amount
    function requestTokens() external {
        require(
            block.timestamp >= lastRequestTime[msg.sender] + COOLDOWN_PERIOD,
            "Cooldown period not elapsed"
        );

        lastRequestTime[msg.sender] = block.timestamp;
        
        testToken.transfer(msg.sender, MAX_REQUEST_AMOUNT);
    }

    // Owner can update the test token if needed
    function updateTestToken(ERC20 _newToken) external onlyOwner {
        testToken = _newToken;
    }
}