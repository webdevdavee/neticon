// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LiquidityMining is Ownable, ReentrancyGuard {
    // Staking information for each user
    struct StakeInfo {
        uint256 amount;
        uint256 lastStakeTime;
        uint256 unclaimedRewards;
    }

    // Rewards configuration
    uint256 public constant REWARD_RATE = 10; // 10 tokens per day per LP token
    uint256 private constant SECONDS_PER_DAY = 86400;

    // Tokens used in staking and rewards
    IERC20 public lpToken;
    IERC20 public governanceToken;

    // User stakes tracking
    mapping(address => StakeInfo) public stakes;

    // Total LP tokens staked
    uint256 public totalStaked;

    constructor(IERC20 _lpToken, IERC20 _governanceToken) {
        lpToken = _lpToken;
        governanceToken = _governanceToken;
    }

    // Stake LP tokens
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake zero");
        
        // Transfer LP tokens from user
        require(
            lpToken.transferFrom(msg.sender, address(this), amount), 
            "LP token transfer failed"
        );

        // Update user's stake
        StakeInfo storage userStake = stakes[msg.sender];
        
        // Calculate and add any pending rewards before updating stake
        if (userStake.amount > 0) {
            userStake.unclaimedRewards += _calculateRewards(
                userStake.amount, 
                userStake.lastStakeTime
            );
        }

        userStake.amount += amount;
        userStake.lastStakeTime = block.timestamp;
        
        // Update total staked
        totalStaked += amount;
    }

    // Unstake LP tokens
    function unstake(uint256 amount) external nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        
        require(
            userStake.amount >= amount, 
            "Insufficient staked amount"
        );

        // Calculate rewards
        userStake.unclaimedRewards += _calculateRewards(
            userStake.amount, 
            userStake.lastStakeTime
        );

        // Update stake
        userStake.amount -= amount;
        userStake.lastStakeTime = block.timestamp;
        totalStaked -= amount;

        // Return LP tokens to user
        require(
            lpToken.transfer(msg.sender, amount), 
            "LP token transfer failed"
        );
    }

    // Claim governance token rewards
    function claimRewards() external nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        
        // Calculate current rewards
        uint256 rewards = userStake.unclaimedRewards + 
            _calculateRewards(
                userStake.amount, 
                userStake.lastStakeTime
            );
        
        require(rewards > 0, "No rewards to claim");

        // Reset unclaimed rewards and update stake time
        userStake.unclaimedRewards = 0;
        userStake.lastStakeTime = block.timestamp;

        // Mint and transfer governance tokens
        require(
            governanceToken.transfer(msg.sender, rewards),
            "Reward transfer failed"
        );
    }

    // Internal function to calculate rewards
    function _calculateRewards(
        uint256 stakedAmount, 
        uint256 lastStakeTime
    ) internal view returns (uint256) {
        uint256 stakeDuration = block.timestamp - lastStakeTime;
        return (stakedAmount * REWARD_RATE * stakeDuration) / SECONDS_PER_DAY;
    }

    // Allow owner to update reward rates or tokens if needed
    function updateRewardConfiguration(
        uint256 newRewardRate, 
        IERC20 newGovernanceToken
    ) external onlyOwner {
        // Implementation for updating reward parameters
    }
}