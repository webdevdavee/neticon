// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./EnhancedLiquidityMining.sol";

contract LiquidityMiningFactory is Ownable, ReentrancyGuard {
    // Global Pool Metrics
    struct GlobalPoolMetrics {
        uint256 totalLiquidity;
        uint256 averageAPY;
        uint256 totalPools;
        uint256 totalDailyVolume;
    }

    // Pool Information Struct
    struct PoolInfo {
        address poolAddress;
        address liquidityToken;
        address rewardToken;
        string poolSymbol;
        bool isActive;
    }

    // Events
    event PoolCreated(
        address indexed poolAddress,
        address indexed liquidityToken,
        address indexed rewardToken,
        string poolSymbol
    );
    event PoolDeactivated(address indexed poolAddress);

    // Mappings
    mapping(address => PoolInfo) public pools;
    address[] public poolAddresses;
    mapping(address => bool) public isPoolValid;

    // Global metrics
    GlobalPoolMetrics public globalMetrics;

    constructor() Ownable(msg.sender) {}

    // Create a new liquidity mining pool
    function createLiquidityPool(
        LPToken _liquidityPoolToken,
        GovernanceToken _rewardToken,
        uint256 _initialRewardPerBlock,
        string memory _poolSymbol
    ) external returns (address) {
        require(
            address(_liquidityPoolToken) != address(0),
            "Invalid Liquidity Pool Token"
        );
        require(address(_rewardToken) != address(0), "Invalid Reward Token");

        // Create the new liquidity mining pool
        EnhancedLiquidityMining newPool = new EnhancedLiquidityMining(
            _liquidityPoolToken,
            _rewardToken,
            _initialRewardPerBlock,
            _poolSymbol
        );

        address poolAddress = address(newPool);

        // Store pool information
        pools[poolAddress] = PoolInfo({
            poolAddress: poolAddress,
            liquidityToken: address(_liquidityPoolToken),
            rewardToken: address(_rewardToken),
            poolSymbol: _poolSymbol,
            isActive: true
        });

        poolAddresses.push(poolAddress);
        isPoolValid[poolAddress] = true;

        // Update global metrics
        updateGlobalMetrics();

        emit PoolCreated(
            poolAddress,
            address(_liquidityPoolToken),
            address(_rewardToken),
            _poolSymbol
        );

        return poolAddress;
    }

    // Deactivate a pool
    function deactivatePool(address _poolAddress) external onlyOwner {
        require(isPoolValid[_poolAddress], "Pool does not exist");

        pools[_poolAddress].isActive = false;
        isPoolValid[_poolAddress] = false;

        // Update global metrics
        updateGlobalMetrics();

        emit PoolDeactivated(_poolAddress);
    }

    // Update global metrics
    function updateGlobalMetrics() public {
        uint256 totalLiquidity = 0;
        uint256 totalAPY = 0;
        uint256 activePools = 0;
        uint256 totalDailyVolume = 0;

        for (uint256 i = 0; i < poolAddresses.length; i++) {
            address poolAddress = poolAddresses[i];

            // Skip inactive pools
            if (!isPoolValid[poolAddress]) continue;

            EnhancedLiquidityMining pool = EnhancedLiquidityMining(poolAddress);

            // Fetch pool metrics
            EnhancedLiquidityMining.PoolMetrics memory metrics = pool
                .getPoolMetrics();

            totalLiquidity += metrics.totalLiquidity;
            totalDailyVolume += metrics.cumulativeVolume;

            // Calculate pool APR (convert to APY)
            uint256 poolAPR = pool.calculatePoolAPR();
            totalAPY += poolAPR;

            activePools++;
        }

        // Calculate average metrics
        globalMetrics.totalLiquidity = totalLiquidity;
        globalMetrics.averageAPY = activePools > 0
            ? (totalAPY / activePools)
            : 0;
        globalMetrics.totalPools = activePools;
        globalMetrics.totalDailyVolume = totalDailyVolume;
    }

    // Get global metrics
    function getGlobalMetrics()
        external
        view
        returns (GlobalPoolMetrics memory)
    {
        return globalMetrics;
    }

    // Get all active pool addresses
    function getActivePools() external view returns (address[] memory) {
        address[] memory activePoolList = new address[](
            globalMetrics.totalPools
        );
        uint256 index = 0;

        for (uint256 i = 0; i < poolAddresses.length; i++) {
            if (isPoolValid[poolAddresses[i]]) {
                activePoolList[index] = poolAddresses[i];
                index++;
            }
        }

        return activePoolList;
    }

    // User total staked across all pools
    function getUserTotalStakedAcrossPools(
        address user
    ) external view returns (uint256 totalStaked, uint256 totalEarned) {
        for (uint256 i = 0; i < poolAddresses.length; i++) {
            address poolAddress = poolAddresses[i];

            // Skip inactive pools
            if (!isPoolValid[poolAddress]) continue;

            EnhancedLiquidityMining pool = EnhancedLiquidityMining(poolAddress);

            (uint256 userStaked, uint256 userEarned, , , , , , , ) = pool
                .getUserStakingStats(user);

            totalStaked += userStaked;
            totalEarned += userEarned;
        }
    }
}
