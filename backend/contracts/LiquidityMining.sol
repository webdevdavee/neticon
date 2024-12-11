// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./GovernanceToken.sol";

contract LiquidityMining is Ownable, ReentrancyGuard {
    // User's staking information with more descriptive names
    struct UserStake {
        uint256 stakedAmount; // Amount of tokens the user has staked
        uint256 calculatedRewardOffset; // Helps track accurate reward calculations
        uint256 unclaimedRewards; // Rewards accumulated but not yet withdrawn
        uint256 lastStakeTimestamp; // When the user last staked or modified stake
        uint256 totalRewardsWithdrawn; // Total rewards the user has already claimed
    }

    // Token distribution parameters
    uint256 public tokenRewardPerBlock; // How many reward tokens are distributed per blockchain block
    uint256 public constant MAX_REWARD_PER_BLOCK = 100 * 10 ** 18; // Max limit of tokens that can be distributed per block (100 tokens)
    uint256 public constant MAX_TOTAL_STAKE_ALLOWED = 1_000_000 * 10 ** 18; // Max total amount of tokens that can be staked (1 million tokens)
    uint256 public constant MIN_STAKE_REQUIRED = 10 * 10 ** 18; // Min amount of tokens a user must stake to participate (10 tokens)
    uint256 private constant REWARD_CALCULATION_PRECISION = 1e12; // To prevent rounding errors
    uint256 public constant UNSTAKING_WAIT_PERIOD = 1 days; // Cooldown period after staking before you can unstake
    uint256 public constant SECONDS_IN_YEAR = 365 days; // This is for calculating Annual Percentage Yield (APY)

    // Token interfaces
    IERC20 public immutable liquidityPoolToken;
    GovernanceToken public immutable rewardToken;

    // Staking pool tracking variables
    uint256 public totalRewardSharePerToken;
    uint256 public lastUpdatedBlock;
    uint256 public totalTokensStaked;

    // User stakes tracking
    mapping(address => UserStake) public userStakes;

    // Track user's staking history
    struct StakingInterval {
        uint256 startTime;
        uint256 endTime;
        uint256 stakedAmount;
    }
    mapping(address => StakingInterval[]) public userStakingHistory;

    // Event
    event TokensStaked(address indexed user, uint256 amount, uint256 timestamp);
    event TokensUnstaked(
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );
    event RewardsWithdrawn(address indexed user, uint256 amount);
    event RewardRateChanged(uint256 newRewardRate);

    constructor(
        IERC20 _liquidityPoolToken,
        GovernanceToken _rewardToken,
        uint256 _initialRewardPerBlock
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

    // Stake tokens into the liquidity pool
    function stakeTokens(uint256 amount) external nonReentrant {
        require(amount >= MIN_STAKE_REQUIRED, "Stake amount too low");

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
        if (user.stakedAmount == 0) {
            userStakingHistory[msg.sender].push(
                StakingInterval({
                    startTime: block.timestamp,
                    endTime: 0,
                    stakedAmount: amount
                })
            );
        }

        user.stakedAmount += amount;
        user.calculatedRewardOffset =
            (user.stakedAmount * totalRewardSharePerToken) /
            REWARD_CALCULATION_PRECISION;
        user.lastStakeTimestamp = block.timestamp;

        totalTokensStaked += amount;
        emit TokensStaked(msg.sender, amount, block.timestamp);
    }

    // Unstake tokens
    function unstakeTokens(uint256 amount) external nonReentrant {
        UserStake storage user = userStakes[msg.sender];
        require(user.stakedAmount >= amount, "Insufficient stake");
        require(
            block.timestamp >= user.lastStakeTimestamp + UNSTAKING_WAIT_PERIOD,
            "Unstaking cooldown not elapsed"
        );

        updateRewardCalculations();

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
        require(
            liquidityPoolToken.transfer(msg.sender, amount),
            "Token transfer failed"
        );

        emit TokensUnstaked(msg.sender, amount, block.timestamp);
    }

    // Claim accumulated rewards
    function claimRewards() external nonReentrant {
        UserStake storage user = userStakes[msg.sender];
        updateRewardCalculations();

        uint256 pendingRewards = (user.stakedAmount *
            totalRewardSharePerToken) /
            REWARD_CALCULATION_PRECISION -
            user.calculatedRewardOffset;
        uint256 totalRewards = user.unclaimedRewards + pendingRewards;

        require(totalRewards > 0, "No rewards to claim");

        user.unclaimedRewards = 0;
        user.calculatedRewardOffset =
            (user.stakedAmount * totalRewardSharePerToken) /
            REWARD_CALCULATION_PRECISION;
        user.totalRewardsWithdrawn += totalRewards;

        rewardToken.allocateTokens("rewards", msg.sender, totalRewards);

        emit RewardsWithdrawn(msg.sender, totalRewards);
    }

    // Calculate pending rewards for a user
    function pendingRewards(address account) external view returns (uint256) {
        UserStake storage user = userStakes[account];
        uint256 tempTotalRewardSharePerToken = totalRewardSharePerToken;

        if (block.number > lastUpdatedBlock && totalTokensStaked > 0) {
            uint256 blocksSinceLastUpdate = block.number - lastUpdatedBlock;
            uint256 totalRewardsGenerated = blocksSinceLastUpdate *
                tokenRewardPerBlock;
            tempTotalRewardSharePerToken +=
                (totalRewardsGenerated * REWARD_CALCULATION_PRECISION) /
                totalTokensStaked;
        }

        return
            user.unclaimedRewards +
            ((user.stakedAmount * tempTotalRewardSharePerToken) /
                REWARD_CALCULATION_PRECISION -
                user.calculatedRewardOffset);
    }

    // Get detailed user staking information
    function getUserStakingStats(
        address user
    )
        external
        view
        returns (
            uint256 totalStaked,
            uint256 totalEarned,
            uint256 averageAPY,
            uint256 totalStakingPeriods
        )
    {
        UserStake storage userStake = userStakes[user];

        // Total staked by user
        totalStaked = userStake.stakedAmount;

        // Total earned (pending + claimed)
        totalEarned =
            userStake.unclaimedRewards +
            userStake.totalRewardsWithdrawn;

        // Total staking periods
        totalStakingPeriods = userStakingHistory[user].length;

        // Calculate APY
        if (totalStaked > 0 && totalEarned > 0) {
            // Annual Percentage Yield calculation
            uint256 totalStakingTime = block.timestamp -
                (
                    userStakingHistory[user].length > 0
                        ? userStakingHistory[user][0].startTime
                        : block.timestamp
                );

            if (totalStakingTime > 0) {
                averageAPY =
                    ((totalEarned * SECONDS_IN_YEAR * 100) / totalStaked) /
                    (totalStakingTime > 0 ? totalStakingTime : 1);
            }
        }
    }

    // Update reward rate by the owner
    function updateRewardRate(uint256 newRewardPerBlock) external onlyOwner {
        require(
            newRewardPerBlock > 0 && newRewardPerBlock <= MAX_REWARD_PER_BLOCK,
            "Invalid reward per block"
        );
        updateRewardCalculations();
        tokenRewardPerBlock = newRewardPerBlock;
        emit RewardRateChanged(newRewardPerBlock);
    }

    // Get current stake of a user
    function getStake(address account) external view returns (uint256) {
        return userStakes[account].stakedAmount;
    }
}
