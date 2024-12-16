// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./LPToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LPTokenFactory is Ownable {
    // Mapping to track LP tokens by pool
    mapping(address => address) public poolToLPToken;
    mapping(address => address) public lpTokenToPool;

    // User LP token tracking
    mapping(address => address[]) private userLPTokens;
    mapping(address => mapping(address => bool)) private userLPTokenOwnership;

    // Event for LP token creation
    event LPTokenCreated(
        address indexed pool,
        address indexed lpToken,
        address tokenA,
        address tokenB
    );

    // Events
    event LPTokenRegistered(address indexed user, address indexed lpToken);

    event LPTokenUnregistered(address indexed user, address indexed lpToken);

    constructor() Ownable(msg.sender) {}

    // Create a new LP token for a specific pool
    function createLPToken(
        address pool,
        address tokenA,
        address tokenB
    ) external returns (address) {
        // Ensure the pool doesn't already have an LP token
        require(
            poolToLPToken[pool] == address(0),
            "LP token for this pool already exists"
        );

        // Create LP token with a dynamic name and symbol
        string memory name = string(
            abi.encodePacked(
                "LP-",
                ERC20(tokenA).name(),
                "-",
                ERC20(tokenB).name()
            )
        );
        string memory symbol = string(
            abi.encodePacked(
                "LP_",
                ERC20(tokenA).symbol(),
                "_",
                ERC20(tokenB).symbol()
            )
        );

        // Create the LP token
        LPToken newLPToken = new LPToken(name, symbol, pool);
        address lpTokenAddress = address(newLPToken);

        // Track the LP token
        poolToLPToken[pool] = lpTokenAddress;
        lpTokenToPool[lpTokenAddress] = pool;

        emit LPTokenCreated(pool, lpTokenAddress, tokenA, tokenB);
        return lpTokenAddress;
    }

    // Register an LP token for a user
    function registerLPToken(address lpToken, address _user) external {
        require(lpTokenToPool[lpToken] != address(0), "Invalid LP token");

        // Prevent duplicate registration
        require(
            !userLPTokenOwnership[_user][lpToken],
            "LP token already registered"
        );

        // Register LP token for the user
        userLPTokens[_user].push(lpToken);
        userLPTokenOwnership[_user][lpToken] = true;

        emit LPTokenRegistered(_user, lpToken);
    }

    // Unregister an LP token for a user
    function unregisterLPToken(address lpToken) external {
        require(
            userLPTokenOwnership[msg.sender][lpToken],
            "LP token not registered"
        );

        // Remove LP token from user's list
        address[] storage userTokens = userLPTokens[msg.sender];
        for (uint256 i = 0; i < userTokens.length; i++) {
            if (userTokens[i] == lpToken) {
                // Replace with last element and pop
                userTokens[i] = userTokens[userTokens.length - 1];
                userTokens.pop();
                break;
            }
        }

        // Update ownership status
        userLPTokenOwnership[msg.sender][lpToken] = false;

        emit LPTokenUnregistered(msg.sender, lpToken);
    }

    // Get LP tokens for a user
    function getUserLPTokens(
        address user
    ) external view returns (address[] memory) {
        return userLPTokens[user];
    }

    // Check if a user has a specific LP token registered
    function hasLPToken(
        address user,
        address lpToken
    ) external view returns (bool) {
        return userLPTokenOwnership[user][lpToken];
    }

    // Get the LP token for a specific pool
    function getLPTokenForPool(address pool) external view returns (address) {
        return poolToLPToken[pool];
    }

    // Get the pool for a specific LP token
    function getPoolForLPToken(
        address lpToken
    ) external view returns (address) {
        return lpTokenToPool[lpToken];
    }
}
