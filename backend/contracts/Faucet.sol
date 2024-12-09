// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract FlexibleFaucet is Ownable, ReentrancyGuard {
    // Constant for 1-day cooldown (in seconds)
    uint256 private constant COOLDOWN_PERIOD = 1 days;

    // Constant for default max request amount
    uint256 private constant DEFAULT_MAX_REQUEST_AMOUNT = 100 * 10 ** 18; // 100 tokens (assuming 18 decimals)

    struct TokenInfo {
        bool isSupported;
        uint256 maxRequestAmount;
        uint256 totalDistributed;
    }

    mapping(address => TokenInfo) public supportedTokens;

    // Mapping to track user request history
    mapping(address => mapping(address => uint256)) public lastRequestTime;
    mapping(address => mapping(address => uint256)) public totalUserReceived;

    // Events
    event TokensRegistered(address[] tokens, uint256[] maxRequestAmounts);
    event TokenRemoved(address indexed token);
    event TokensRequested(
        address indexed token,
        address indexed recipient,
        uint256 amount
    );

    constructor() Ownable(msg.sender) {}

    // Batch registration of tokens with optional custom max request amounts
    function registerTokens(
        address[] calldata tokens,
        uint256[] calldata maxRequestAmounts
    ) external onlyOwner {
        require(
            tokens.length == maxRequestAmounts.length ||
                maxRequestAmounts.length == 0,
            "Mismatched array lengths"
        );

        for (uint256 i = 0; i < tokens.length; i++) {
            address token = tokens[i];
            require(token != address(0), "Invalid token address");

            // Use provided max amount or default if not specified
            uint256 maxAmount = maxRequestAmounts.length > 0
                ? maxRequestAmounts[i]
                : DEFAULT_MAX_REQUEST_AMOUNT;

            require(maxAmount > 0, "Max request amount must be positive");

            supportedTokens[token] = TokenInfo({
                isSupported: true,
                maxRequestAmount: maxAmount,
                totalDistributed: 0
            });
        }

        emit TokensRegistered(tokens, maxRequestAmounts);
    }

    // Request tokens without explicit registration
    function requestTokens(
        address token,
        uint256 amount
    ) external nonReentrant {
        IERC20 erc20Token = IERC20(token);

        TokenInfo storage tokenInfo = supportedTokens[token];

        // If not registered, use default settings
        if (!tokenInfo.isSupported) {
            tokenInfo.isSupported = true;
            tokenInfo.maxRequestAmount = DEFAULT_MAX_REQUEST_AMOUNT;
        }

        // Check request amount
        require(
            amount > 0 && amount <= tokenInfo.maxRequestAmount,
            "Invalid request amount"
        );

        // Check cooldown period
        require(
            block.timestamp >=
                lastRequestTime[token][msg.sender] + COOLDOWN_PERIOD,
            "Cooldown period not elapsed"
        );

        // Check faucet balance
        uint256 faucetBalance = erc20Token.balanceOf(address(this));
        require(faucetBalance >= amount, "Insufficient token balance");

        // Update user and token tracking
        lastRequestTime[token][msg.sender] = block.timestamp;
        totalUserReceived[token][msg.sender] += amount;
        tokenInfo.totalDistributed += amount;

        // Transfer tokens
        require(
            erc20Token.transfer(msg.sender, amount),
            "Token transfer failed"
        );

        emit TokensRequested(token, msg.sender, amount);
    }

    // Remove a token from supported list
    function removeToken(address token) external onlyOwner {
        require(supportedTokens[token].isSupported, "Token not registered");

        delete supportedTokens[token];
        emit TokenRemoved(token);
    }

    // Withdraw tokens in case of emergency
    function withdrawTokens(address token, uint256 amount) external onlyOwner {
        IERC20 erc20Token = IERC20(token);
        require(erc20Token.transfer(owner(), amount), "Withdrawal failed");
    }

    // View functions to check token and user details
    function getLastRequestTime(
        address token,
        address user
    ) external view returns (uint256) {
        return lastRequestTime[token][user];
    }

    function getTotalUserReceived(
        address token,
        address user
    ) external view returns (uint256) {
        return totalUserReceived[token][user];
    }
}
