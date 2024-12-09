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
        uint256 upperTick,
        uint256 initialLiquidityA,
        uint256 initialLiquidityB,
        uint256 liquidityMinted
    );

    constructor() Ownable(msg.sender) {
        poolImplementation = address(new AMMPool());
    }

    function createPoolWithLiquidity(
        IERC20 tokenA,
        IERC20 tokenB,
        uint256 lowerTick,
        uint256 upperTick,
        AMMPool.FeeTier feeTier,
        uint256 amountA,
        uint256 amountB
    ) external returns (address pool) {
        // Validation checks (same as before)
        require(
            address(tokenA) != address(0) &&
                address(tokenB) != address(0) &&
                address(tokenA) != address(tokenB),
            "Invalid tokens"
        );

        require(
            getPools[address(tokenA)][address(tokenB)] == address(0) &&
                getPools[address(tokenB)][address(tokenA)] == address(0),
            "Pool already exists"
        );

        require(
            lowerTick > 0 &&
                upperTick > lowerTick &&
                upperTick < type(uint256).max,
            "Invalid price range"
        );

        // Validate initial liquidity amounts
        require(amountA > 0 && amountB > 0, "Initial liquidity must be > 0");

        // Clone pool implementation
        pool = Clones.clone(poolImplementation);

        // Initialize the pool
        AMMPool(pool).initialize(tokenA, tokenB, lowerTick, upperTick, feeTier);

        // Transfer tokens from msg.sender to the pool
        require(
            tokenA.transferFrom(msg.sender, pool, amountA),
            "TokenA transfer failed"
        );
        require(
            tokenB.transferFrom(msg.sender, pool, amountB),
            "TokenB transfer failed"
        );

        // Add initial liquidity in the same transaction
        uint256 liquidityMinted = AMMPool(pool).depositLiquidity(
            amountA,
            amountB
        );

        // Record pool addresses bidirectionally
        getPools[address(tokenA)][address(tokenB)] = pool;
        getPools[address(tokenB)][address(tokenA)] = pool;

        emit PoolCreated(
            address(tokenA),
            address(tokenB),
            pool,
            lowerTick,
            upperTick,
            amountA,
            amountB,
            liquidityMinted
        );

        return pool;
    }
}
