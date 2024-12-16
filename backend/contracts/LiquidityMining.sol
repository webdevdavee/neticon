// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./GovernanceToken.sol";
import "./LPToken.sol";

contract LiquidityMining is Ownable, ReentrancyGuard {
    // Staking period options
    enum StakingPeriod {
        FLEXIBLE,
        THIRTY_DAYS,
        SIXTY_DAYS,
        NINETY_DAYS
    }

    // User staking information
    struct UserStake {
        uint256 stakedAmount;
        uint256 calculatedRewardOffset;
        uint256 unclaimedRewards;
        uint256 stakingStartTime;
        uint256 lastStakeTimestamp;
        uint256 totalRewardsWithdrawn;
        StakingPeriod stakingPeriod;
        uint256 lockEndTimestamp;
        bool earlyUnstake;
    }

    // Staking period multipliers for rewards
    struct PeriodMultiplier {
        uint256 multiplier;
        uint256 minimumLockPeriod;
    }

    // Liquidity Pool Metrics
    struct PoolMetrics {
        string poolSymbol;
        uint256 totalLiquidity;
        uint256 cumulativeVolume;
        uint256 lastVolumeUpdateTimestamp;
        uint256 poolAPR;
        uint256 lastAPRUpdateTimestamp;
    }

    // Token distribution parameters
    uint256 public tokenRewardPerBlock; // How many reward tokens are distributed per blockchain block
    uint256 public constant MAX_REWARD_PER_BLOCK = 100 * 10 ** 18; // Max limit of tokens that can be distributed per block (100 tokens)
    uint256 public constant MAX_TOTAL_STAKE_ALLOWED = 1_000_000 * 10 ** 18; // Max total amount of tokens that can be staked (1 million tokens)
    uint256 public constant MIN_STAKE_REQUIRED = 10 * 10 ** 18; // Min amount of tokens a user must stake to participate (10 tokens)
    uint256 private constant REWARD_CALCULATION_PRECISION = 1e12; // To prevent rounding errors
    uint256 public constant SECONDS_IN_YEAR = 365 days; // This is for calculating Annual Percentage Yield (APY)

    // Penalty for early unstaking
    uint256 public constant EARLY_UNSTAKE_PENALTY_PERCENT = 20; // 20% penalty

    // Token interfaces
    LPToken public immutable liquidityPoolToken;
    GovernanceToken public immutable rewardToken;

    // Staking pool tracking variables
    uint256 public totalRewardSharePerToken;
    uint256 public lastUpdatedBlock;
    uint256 public totalTokensStaked;

    // Staking period multipliers
    mapping(StakingPeriod => PeriodMultiplier) public stakingPeriodMultipliers;

    // User stakes tracking
    mapping(address => UserStake) public userStakes;

    // Staking history
    struct StakingInterval {
        uint256 startTime;
        uint256 endTime;
        uint256 stakedAmount;
        StakingPeriod period;
    }
    mapping(address => StakingInterval[]) public userStakingHistory;

    // Pool metrics tracking
    PoolMetrics public poolMetrics;

    // Events
    event TokensStaked(
        address indexed user,
        uint256 amount,
        StakingPeriod stakingPeriod,
        uint256 timestamp
    );
    event TokensUnstaked(
        address indexed user,
        uint256 amount,
        uint256 penaltyAmount,
        uint256 timestamp
    );
    event RewardsWithdrawn(address indexed user, uint256 amount);
    event RewardRateChanged(uint256 newRewardRate);
    event PoolMetricsUpdated(
        uint256 totalLiquidity,
        uint256 dailyVolume,
        uint256 apy
    );

    constructor(
        LPToken _liquidityPoolToken,
        GovernanceToken _rewardToken,
        uint256 _initialRewardPerBlock,
        string memory _poolSymbol
    ) Ownable(msg.sender) {
        require(
            address(_liquidityPoolToken) != address(0),
            "Invalid Liquidity Pool Token"
        );
        require(address(_rewardToken) != address(0), "Invalid Reward Token");
        require(
            _initialRewardPerBlock > 0 &&
                _initialRewardPerBlock <= MAX_REWARD_PER_BLOCK,
            "Invalid reward per block"
        );

        liquidityPoolToken = _liquidityPoolToken;
        rewardToken = _rewardToken;
        tokenRewardPerBlock = _initialRewardPerBlock;
        lastUpdatedBlock = block.number;

        // Initialize pool metrics
        poolMetrics.poolSymbol = _poolSymbol;
        poolMetrics.lastUpdatedTimestamp = block.timestamp;
        poolMetrics.lastAPRUpdateTimestamp = block.timestamp;

        // Set up staking period multipliers
        stakingPeriodMultipliers[StakingPeriod.FLEXIBLE] = PeriodMultiplier(
            100,
            0
        );
        stakingPeriodMultipliers[StakingPeriod.THIRTY_DAYS] = PeriodMultiplier(
            120,
            30 days
        );
        stakingPeriodMultipliers[StakingPeriod.SIXTY_DAYS] = PeriodMultiplier(
            150,
            60 days
        );
        stakingPeriodMultipliers[StakingPeriod.NINETY_DAYS] = PeriodMultiplier(
            200,
            90 days
        );
    }

    // Update reward calculations
    function updateRewardCalculations() public {
        if (block.number <= lastUpdatedBlock) return;

        if (totalTokensStaked == 0) {
            lastUpdatedBlock = block.number;
            return;
        }

        uint256 blocksSinceLastUpdate = block.number - lastUpdatedBlock;
        uint256 totalRewardsGenerated = blocksSinceLastUpdate *
            tokenRewardPerBlock;

        totalRewardSharePerToken +=
            (totalRewardsGenerated * REWARD_CALCULATION_PRECISION) /
            totalTokensStaked;
        lastUpdatedBlock = block.number;
    }

    // Stake tokens
    function stakeTokens(
        uint256 amount,
        StakingPeriod stakingPeriod
    ) external nonReentrant {
        require(amount >= MIN_STAKE_REQUIRED, "Stake amount too low");
        require(
            totalTokensStaked + amount <= MAX_TOTAL_STAKE_ALLOWED,
            "Exceeds max total stake"
        );

        UserStake storage user = userStakes[msg.sender];
        updateRewardCalculations();

        // Calculate and store pending rewards
        if (user.stakedAmount > 0) {
            uint256 pendingRewards = (user.stakedAmount *
                totalRewardSharePerToken) /
                REWARD_CALCULATION_PRECISION -
                user.calculatedRewardOffset;
            user.unclaimedRewards += pendingRewards;
        }

        // Transfer tokens to contract
        require(
            liquidityPoolToken.transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );

        // Track staking history
        userStakingHistory[msg.sender].push(
            StakingInterval({
                startTime: block.timestamp,
                endTime: 0,
                stakedAmount: amount,
                period: stakingPeriod
            })
        );

        // Set lock end timestamp based on staking period
        uint256 lockEndTime = block.timestamp +
            stakingPeriodMultipliers[stakingPeriod].minimumLockPeriod;

        user.stakedAmount += amount;
        user.calculatedRewardOffset =
            (user.stakedAmount * totalRewardSharePerToken) /
            REWARD_CALCULATION_PRECISION;
        user.lastStakeTimestamp = block.timestamp;
        user.stakingStartTime = block.timestamp;
        user.stakingPeriod = stakingPeriod;
        user.lockEndTimestamp = lockEndTime;
        user.earlyUnstake = false;

        totalTokensStaked += amount;

        // Update pool metrics
        updatePoolMetrics(amount, 0);

        emit TokensStaked(msg.sender, amount, stakingPeriod, block.timestamp);
    }

    // Unstake tokens with period-based restrictions and potential penalty
    function unstakeTokens(uint256 amount) external nonReentrant {
        UserStake storage user = userStakes[msg.sender];
        require(user.stakedAmount >= amount, "Insufficient stake");

        updateRewardCalculations();

        // Calculate penalty if unstaking before lock period
        uint256 penaltyAmount = 0;
        if (block.timestamp < user.lockEndTimestamp) {
            user.earlyUnstake = true;
            penaltyAmount = (amount * EARLY_UNSTAKE_PENALTY_PERCENT) / 100;
        }

        uint256 pendingRewards = (user.stakedAmount *
            totalRewardSharePerToken) /
            REWARD_CALCULATION_PRECISION -
            user.calculatedRewardOffset;
        user.unclaimedRewards += pendingRewards;

        // Update staking history
        if (userStakingHistory[msg.sender].length > 0) {
            StakingInterval storage lastPeriod = userStakingHistory[msg.sender][
                userStakingHistory[msg.sender].length - 1
            ];
            lastPeriod.endTime = block.timestamp;
        }

        user.stakedAmount -= amount;
        user.calculatedRewardOffset =
            (user.stakedAmount * totalRewardSharePerToken) /
            REWARD_CALCULATION_PRECISION;

        totalTokensStaked -= amount;

        // Transfer tokens back to user (minus penalty)
        require(
            liquidityPoolToken.transfer(msg.sender, amount - penaltyAmount),
            "Token transfer failed"
        );

        // Update pool metrics
        updatePoolMetrics(0, amount);

        emit TokensUnstaked(msg.sender, amount, penaltyAmount, block.timestamp);
    }

    // Claim accumulated rewards with bonus based on staking period
    function claimRewards() external nonReentrant {
        UserStake storage user = userStakes[msg.sender];
        updateRewardCalculations();

        uint256 pendingRewards = (user.stakedAmount *
            totalRewardSharePerToken) /
            REWARD_CALCULATION_PRECISION -
            user.calculatedRewardOffset;
        uint256 totalRewards = user.unclaimedRewards + pendingRewards;

        // Apply reward multiplier based on staking period
        uint256 multiplier = stakingPeriodMultipliers[user.stakingPeriod]
            .multiplier;
        totalRewards = (totalRewards * multiplier) / 100;

        require(totalRewards > 0, "No rewards to claim");

        user.unclaimedRewards = 0;
        user.calculatedRewardOffset =
            (user.stakedAmount * totalRewardSharePerToken) /
            REWARD_CALCULATION_PRECISION;
        user.totalRewardsWithdrawn += totalRewards;

        rewardToken.allocateTokens("rewards", msg.sender, totalRewards);

        emit RewardsWithdrawn(msg.sender, totalRewards);
    }

    // Update pool metrics internal function
    function updatePoolMetrics(
        uint256 volumeAmount,
        uint256 unstakeAmount
    ) internal {
        // Update total liquidity and cumulative volume
        poolMetrics.totalLiquidity = totalTokensStaked;
        poolMetrics.cumulativeVolume += volumeAmount;
        poolMetrics.lastVolumeUpdateTimestamp = block.timestamp;

        // Periodically update pool APR (e.g., every 1 hour)
        if (block.timestamp >= poolMetrics.lastAPRUpdateTimestamp + 1 hours) {
            uint256 newPoolAPR = _calculatePoolAPR();
            poolMetrics.poolAPR = newPoolAPR;
            poolMetrics.lastAPRUpdateTimestamp = block.timestamp;
        }

        emit PoolMetricsUpdated(
            poolMetrics.totalLiquidity,
            poolMetrics.cumulativeVolume,
            poolMetrics.poolAPR
        );
    }

    // Calculate pool-level APR
    function _calculatePoolAPR() public view returns (uint256) {
        // If no tokens are staked, return 0
        if (totalTokensStaked == 0) return 0;

        // Calculate total annual rewards
        // Estimate annual rewards based on current block reward rate
        uint256 blocksPerYear = SECONDS_IN_YEAR / 15; // Assuming 15-second block time
        uint256 annualRewards = blocksPerYear * tokenRewardPerBlock;

        // Calculate pool-level APR
        // APR = (Annual Rewards / Total Staked) * 100
        uint256 poolAPR = (annualRewards * 100) / totalTokensStaked;

        // Apply an average of staking period multipliers
        uint256 avgMultiplier = (stakingPeriodMultipliers[
            StakingPeriod.THIRTY_DAYS
        ].multiplier +
            stakingPeriodMultipliers[StakingPeriod.SIXTY_DAYS].multiplier +
            stakingPeriodMultipliers[StakingPeriod.NINETY_DAYS].multiplier) / 3;

        // Adjust APR based on average multiplier
        poolAPR = (poolAPR * avgMultiplier) / 100;

        return poolAPR;
    }

    // Calculate APR
    function _calculateUserAPR(
        address userAddress
    ) external view returns (uint256) {
        UserStake storage user = userStakes[userAddress];

        // If no stake, return 0
        if (user.stakedAmount == 0) return 0;

        // Get period multiplier
        uint256 periodMultiplier = stakingPeriodMultipliers[user.stakingPeriod]
            .multiplier;

        // Calculate staking duration
        uint256 stakingDuration = block.timestamp - user.stakingStartTime;
        if (stakingDuration == 0) return 0;

        // Calculate total rewards (claimed + unclaimed)
        uint256 totalRewards = user.totalRewardsWithdrawn +
            user.unclaimedRewards;

        // APR Calculation
        uint256 apr = (totalRewards * SECONDS_IN_YEAR * periodMultiplier) /
            (user.stakedAmount * stakingDuration * 100);

        return apr;
    }

    // User staking information
    function getUserStakingStats(
        address user
    )
        external
        view
        returns (
            uint256 totalStaked,
            uint256 totalEarned,
            uint256 averageAPY,
            uint256 userAPR,
            uint256 totalStakingPeriods,
            StakingPeriod currentStakingPeriod,
            uint256 lockEndTimestamp,
            bool canUnstakeEarly
        )
    {
        UserStake storage userStake = userStakes[user];

        totalStaked = userStake.stakedAmount;
        totalEarned =
            userStake.unclaimedRewards +
            userStake.totalRewardsWithdrawn;
        totalStakingPeriods = userStakingHistory[user].length;
        currentStakingPeriod = userStake.stakingPeriod;
        lockEndTimestamp = userStake.lockEndTimestamp;
        canUnstakeEarly = block.timestamp < lockEndTimestamp;

        // Calculate APY with period multiplier
        if (totalStaked > 0 && totalEarned > 0) {
            uint256 totalStakingTime = block.timestamp -
                (
                    userStakingHistory[user].length > 0
                        ? userStakingHistory[user][0].startTime
                        : block.timestamp
                );

            if (totalStakingTime > 0) {
                uint256 multiplier = stakingPeriodMultipliers[
                    currentStakingPeriod
                ].multiplier;
                averageAPY =
                    ((totalEarned * SECONDS_IN_YEAR * multiplier) /
                        (totalStaked * 100)) /
                    (totalStakingTime > 0 ? totalStakingTime : 1);
            }
        }

        // Calculate user APR
        userAPR = _calculateUserAPR(user);
    }

    // Get pool metrics
    function getPoolMetrics() external view returns (PoolMetrics memory) {
        // Return pool metrics with the current or most recently calculated APR
        PoolMetrics memory metrics = poolMetrics;

        // If the last APR update is too old, calculate a fresh APR
        if (block.timestamp >= metrics.lastAPRUpdateTimestamp + 1 hours) {
            metrics.poolAPR = _calculatePoolAPR();
        }

        return metrics;
    }
}
