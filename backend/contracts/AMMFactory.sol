// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./AMMPool.sol";

contract AMMFactory is Ownable {
    address public immutable poolImplementation;
    mapping(address => mapping(address => address)) public getPools;

    event PoolCreated(
        address indexed tokenA, 
        address indexed tokenB, 
        address pool,
        uint256 lowerTick,
        uint256 upperTick
    );

    constructor() {
        // Create an implementation contract that cannot be initialized
        poolImplementation = address(new AMMPool());
    }

    function createPool(
        IERC20 tokenA, 
        IERC20 tokenB,
        uint256 lowerTick,
        uint256 upperTick
    ) external returns (address pool) {
        // Prevent duplicate pools and ensure valid tokens
        require(
            address(tokenA) != address(0) && 
            address(tokenB) != address(0) && 
            address(tokenA) != address(tokenB),
            "Invalid tokens"
        );

        // Check if pool already exists. Check both directions to prevent duplicate pools
        require(
            getPools[address(tokenA)][address(tokenB)] == address(0) &&
        getPools[address(tokenB)][address(tokenA)] == address(0),
            "Pool already exists"
        );

        // Validate price range
        require(
            lowerTick > 0 && 
            upperTick > lowerTick && 
            upperTick < type(uint256).max,
            "Invalid price range"
        );

        // Use minimal proxy pattern for gas efficiency
        pool = Clones.clone(poolImplementation);
        
        // Initialize the cloned pool
        AMMPool(pool).initialize(tokenA, tokenB, lowerTick, upperTick, feeTier);

        // Record pool addresses bidirectionally
        getPools[address(tokenA)][address(tokenB)] = pool;
        getPools[address(tokenB)][address(tokenA)] = pool;

        emit PoolCreated(
            address(tokenA), 
            address(tokenB), 
            pool,
            lowerTick,
            upperTick
        );
    }
}