// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "./LPToken.sol";

contract AMMPool is ReentrancyGuard, Ownable {
    using Math for uint256;

    // LP Token for this pool
    LPToken public lpToken;

    enum FeeTier {
        STABLE,       // 0.01%
        LOW_VOLATILITY, // 0.05%
        STANDARD,     // 0.3%
        EXOTIC        // 1%
    }

    // Pool config
    IERC20 public tokenA;
    IERC20 public tokenB;
    address public factory;
    FeeTier public feeTier;
    
    // Enhanced Pool Metrics
    uint256 public totalValueLocked;
    uint256 public volumeLast24h;
    uint256 public volumeAllTime;
    uint256 public activeUserCount;
    uint256 public lastVolumeResetTimestamp;

    uint256 public reserveA;
    uint256 public reserveB;
    uint256 public totalLiquidity;
    
    // Price range configuration
    uint256 public lowerTick;
    uint256 public upperTick;
    
    // Fee tracking
    uint256 public feesToken0;
    uint256 public feesToken1;
    
    // Liquidity position tracking
    mapping(address => LiquidityPosition[]) public userPositions;
    mapping(address => bool) public hasProvidedLiquidity;

    // Pool initialization flag
    bool private initialized;

    struct LiquidityPosition {
        uint256 amountA;
        uint256 amountB;
        uint256 liquidityProvided;
        uint256 timestamp;
        uint256 lowerTick;
        uint256 upperTick;
    }

    event LiquidityAdded(
        address indexed provider, 
        uint256 amountA, 
        uint256 amountB, 
        uint256 liquidityMinted,
        uint256 lowerTick,
        uint256 upperTick
    );

    event LiquidityRemoved(
        address indexed provider, 
        uint256 amountA, 
        uint256 amountB, 
        uint256 liquidityBurned
    );

    event FeesCollected(
        uint256 feesToken0,
        uint256 feesToken1,
        uint256 timestamp
    );

    event Swap(
        address indexed sender, 
        address indexed tokenIn, 
        address indexed tokenOut, 
        uint256 amountIn, 
        uint256 amountOut,
        uint256 feeAmount
    );

    event VolumeReset(
        uint256 volumeLast24h,
        uint256 timestamp
    );

    event PoolInitialized(
        address tokenA,
        address tokenB,
        uint256 lowerTick,
        uint256 upperTick,
        FeeTier _feeTier
    );

    constructor() {
        // Prevent direct initialization of this contract
        initialized = true;
    }

    // Initialization function for clone factories
    function initialize(
        IERC20 _tokenA, 
        IERC20 _tokenB,
        uint256 _lowerTick,
        uint256 _upperTick,
        FeeTier _feeTier
    ) external {
        // Prevent re-initialization and direct calls
        require(!initialized, "Pool already initialized");
        require(_lowerTick < _upperTick, "Invalid price range");

        // Set initialization flag
        initialized = true;

        // Create LP Token for this pool
        lpToken = new LPToken(
            string(abi.encodePacked("LP-", _tokenA.symbol(), "-", _tokenB.symbol())),
            string(abi.encodePacked("LP_", _tokenA.symbol(), "_", _tokenB.symbol())),
            address(this)
        );

        // Configure pool tokens and parameters
        tokenA = _tokenA;
        tokenB = _tokenB;
        factory = msg.sender;
        lowerTick = _lowerTick;
        upperTick = _upperTick;
        feeTier = _feeTier;
        lastVolumeResetTimestamp = block.timestamp;

        // Transfer ownership to the factory
        _transferOwnership(msg.sender);

        emit PoolInitialized(
            address(_tokenA), 
            address(_tokenB), 
            _lowerTick, 
            _upperTick,
            _feeTier
        );
    }

    function depositLiquidity(
        uint256 amountA, 
        uint256 amountB
    ) external nonReentrant returns (uint256 liquidityMinted) {
        // Validate initialization
        require(initialized, "Pool not initialized");
        
        // Validate input amounts
        require(amountA > 0 && amountB > 0, "Amounts must be greater than 0");

        // Validate price range
        _validatePriceRange(amountA, amountB);

        // Transfer tokens to the pool
        require(
            tokenA.transferFrom(msg.sender, address(this), amountA),
            "TokenA transfer failed"
        );
        require(
            tokenB.transferFrom(msg.sender, address(this), amountB),
            "TokenB transfer failed"
        );

        // Track new metrics
        if (!hasProvidedLiquidity[msg.sender]) {
            hasProvidedLiquidity[msg.sender] = true;
            activeUserCount++;
        }

        // First liquidity deposit with more robust initialization
        if (totalLiquidity == 0) {
            // Initial liquidity calculation with stricter requirements
            liquidityMinted = _sqrt(amountA * amountB);
            require(
                liquidityMinted > 10000, 
                "Insufficient initial liquidity"
            );

            // Permanently lock minimum liquidity
            totalLiquidity = 10000;
            liquidityMinted -= 10000;
        } else {
            // Subsequent liquidity deposits with optimized calculations
            liquidityMinted = _calculateLiquidityMinted(
                reserveA,
                reserveB,
                totalLiquidity,
                amountA,
                amountB
            );
        }

        // Advanced liquidity position tracking
        LiquidityPosition memory newPosition = LiquidityPosition({
            amountA: amountA,
            amountB: amountB,
            liquidityProvided: liquidityMinted,
            timestamp: block.timestamp,
            lowerTick: lowerTick,
            upperTick: upperTick
        });

        // Use push with memory to optimize gas
        userPositions[msg.sender].push(newPosition);

        // Update pool reserves
        reserveA += amountA;
        reserveB += amountB;
        totalLiquidity += liquidityMinted;

        // Update Total Value Locked with more precise calculation
        uint256 depositValue = (amountA + amountB);
        totalValueLocked += depositValue;

        emit LiquidityAdded(
            msg.sender, 
            amountA, 
            amountB, 
            liquidityMinted,
            lowerTick,
            upperTick
        );

         // Mint LP tokens to the depositor
        lpToken.mint(msg.sender, liquidityMinted);

        return liquidityMinted;
    }

    function removeLiquidity(
        uint256 liquidityToRemove
    ) external nonReentrant returns (uint256 amountA, uint256 amountB) {
        require(liquidityToRemove > 0, "Invalid liquidity amount");
        require(initialized, "Pool not initialized");

        // Track total user liquidity
        uint256 totalUserLiquidity = _calculateTotalUserLiquidity(msg.sender);
        require(liquidityToRemove <= totalUserLiquidity, "Cannot remove more liquidity than provided");

        // Advanced position management
        LiquidityPosition[] storage positions = userPositions[msg.sender];
        uint256 remainingToRemove = liquidityToRemove;
        uint256 totalAmountA;
        uint256 totalAmountB;

        for (uint256 i = 0; i < positions.length; i++) {
            if (remainingToRemove == 0) break;

            LiquidityPosition storage position = positions[i];
            uint256 positionLiquidity = position.liquidityProvided;
            
            if (positionLiquidity > 0) {
                uint256 liquidityToUse = Math.min(positionLiquidity, remainingToRemove);
                
                // Proportional amount calculation with more precise math
                uint256 proportionalAmountA = (reserveA * liquidityToUse) / totalLiquidity;
                uint256 proportionalAmountB = (reserveB * liquidityToUse) / totalLiquidity;

                totalAmountA += proportionalAmountA;
                totalAmountB += proportionalAmountB;

                // Update position
                position.liquidityProvided -= liquidityToUse;
                remainingToRemove -= liquidityToUse;

                // Remove position if fully liquidated
                if (position.liquidityProvided == 0) {
                    positions[i] = positions[positions.length - 1];
                    positions.pop();
                    i--;
                }
            }
        }

        // Update pool reserves
        reserveA -= totalAmountA;
        reserveB -= totalAmountB;
        totalLiquidity -= liquidityToRemove;

        // Update Total Value Locked
        uint256 withdrawalValue = totalAmountA + totalAmountB;
        totalValueLocked -= withdrawalValue;

        // Transfer tokens back to user
        require(tokenA.transfer(msg.sender, totalAmountA), "TokenA transfer failed");
        require(tokenB.transfer(msg.sender, totalAmountB), "TokenB transfer failed");

        emit LiquidityRemoved(
            msg.sender, 
            totalAmountA, 
            totalAmountB, 
            liquidityToRemove
        );

        // Burn LP tokens from the user
        lpToken.burn(msg.sender, liquidityToRemove);

        return (totalAmountA, totalAmountB);
    }

    // New function to calculate total user liquidity
    function _calculateTotalUserLiquidity(address user) internal view returns (uint256 totalLiquidity) {
        LiquidityPosition[] storage positions = userPositions[user];
        for (uint256 i = 0; i < positions.length; i++) {
            totalLiquidity += positions[i].liquidityProvided;
        }
        return totalLiquidity;
    }

    // Swap tokens
    function swap(
        IERC20 tokenIn, 
        IERC20 tokenOut, 
        uint256 amountIn
    ) external nonReentrant returns (uint256 amountOut) {
        require(initialized, "Pool not initialized");
        require(amountIn > 0, "Invalid input amount");

        // Fee calculation with more flexible tier system
        uint256 feeTier = _calculateFeeTier(amountIn);
        uint256 feeAmount = (amountIn * feeTier) / 10000;
        uint256 amountInAfterFee = amountIn - feeAmount;

       // Determine reserves and calculate swap
        uint256 reserveIn = address(tokenIn) == address(tokenA) ? reserveA : reserveB;
        uint256 reserveOut = address(tokenIn) == address(tokenA) ? reserveB : reserveA;

        amountOut = (reserveOut * amountInAfterFee) / (reserveIn + amountInAfterFee);

        // Validate price range
        _validateSwapPriceRange(amountIn, amountOut);

        // Transfer tokens
        require(
            tokenIn.transferFrom(msg.sender, address(this), amountIn),
            "Input token transfer failed"
        );
        require(
            tokenOut.transfer(msg.sender, amountOut),
            "Output token transfer failed"
        );

        // Update reserves
        if (address(tokenIn) == address(tokenA)) {
            reserveA += amountIn;
            reserveB -= amountOut;
            feesToken0 += feeAmount;
        } else {
            reserveB += amountIn;
            reserveA -= amountOut;
            feesToken1 += feeAmount;
        }

        // Volume tracking
        volumeLast24h += amountIn;
        volumeAllTime += amountIn;

        // Reset 24h volume if needed
        if (block.timestamp - lastVolumeResetTimestamp >= 1 days) {
            emit VolumeReset(volumeLast24h, block.timestamp);
            volumeLast24h = 0;
            lastVolumeResetTimestamp = block.timestamp;
        }

        emit Swap(
            msg.sender, 
            address(tokenIn), 
            address(tokenOut), 
            amountIn, 
            amountOut,
            feeAmount
        );

        // Emit fees collected event
        emit FeesCollected(feesToken0, feesToken1, block.timestamp);

        return amountOut;
    }

    // Price range validation for deposits
    function _validatePriceRange(uint256 amountA, uint256 amountB) internal view {
        require(initialized, "Pool not initialized");
        
        // Prevent division by zero
        require(amountB > 0, "Invalid amount B");
        
        // Calculate current price with 18 decimal precision
        uint256 currentPrice = (amountA * 1e18) / amountB;
        
        require(
            currentPrice >= lowerTick && 
            currentPrice <= upperTick, 
            "Deposit outside allowed price range"
        );
    }

    // Price range validation for swaps
    function _validateSwapPriceRange(uint256 amountIn, uint256 amountOut) internal view {
        require(initialized, "Pool not initialized");
        
        // Prevent division by zero
        require(amountOut > 0, "Invalid amount out");
        
        // Calculate swap price with 18 decimal precision
        uint256 swapPrice = (amountIn * 1e18) / amountOut;
        
        require(
            swapPrice >= lowerTick && 
            swapPrice <= upperTick, 
            "Swap outside allowed price range"
        );
    }

    // Fee tier calculation
    function _calculateFeeTier() internal view returns (uint256) {
        // Precise fee calculation based on predefined tiers
        if (feeTier == FeeTier.STABLE) return 1; // 0.01%
        if (feeTier == FeeTier.LOW_VOLATILITY) return 5; // 0.05%
        if (feeTier == FeeTier.STANDARD) return 30; // 0.3%
        if (feeTier == FeeTier.EXOTIC) return 100; // 1%
        
        return 30; // Default to standard tier
    }


    function getPoolMetrics() external view returns (
        uint256 _totalValueLocked,
        uint256 _volumeLast24h,
        uint256 _volumeAllTime,
        uint256 _activeUserCount,
        uint256 _reserveA,
        uint256 _reserveB,
        uint256 _feesToken0,
        uint256 _feesToken1,
        uint256 _apr
    ) {
        // Prorated APR calculation
        uint256 feesGenerated = feesToken0 + feesToken1;
        uint256 timeSinceLastReset = block.timestamp - lastVolumeResetTimestamp;
        uint256 apr = totalValueLocked > 0 
            ? (feesGenerated * (365 days / timeSinceLastReset) * 100) / totalValueLocked
            : 0;

        return (
            totalValueLocked,
            volumeLast24h,
            volumeAllTime,
            activeUserCount,
            reserveA,
            reserveB,
            feesToken0,
            feesToken1,
            apr
        );
    }

    function _sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function _calculateLiquidityMinted(
        uint256 reserveA,
        uint256 reserveB,
        uint256 totalLiquidity,
        uint256 amountA,
        uint256 amountB
    ) internal pure returns (uint256) {
        uint256 liquidityA = (amountA * totalLiquidity) / reserveA;
        uint256 liquidityB = (amountB * totalLiquidity) / reserveB;
        return liquidityA < liquidityB ? liquidityA : liquidityB;
    }
}