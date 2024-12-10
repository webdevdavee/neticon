// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GovernanceToken is ERC20Permit, Ownable2Step, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18; // 1 billion tokens

    struct TokenReserve {
        uint256 total;
        uint256 allocated;
    }

    // Only rewards and team reserves
    mapping(string => TokenReserve) public reserves;

    // Events
    event TokensAllocated(
        string indexed reserveName,
        address indexed recipient,
        uint256 amount
    );
    event TokensReallocated(
        string indexed fromReserve,
        string indexed toReserve,
        uint256 amount
    );

    constructor() ERC20Permit("Neticon") ERC20("Neticon", "NETI") {
        // 70% allocated to rewards, 30% to team
        reserves["rewards"] = TokenReserve({
            total: (MAX_SUPPLY * 70) / 100,
            allocated: 0
        });

        reserves["team"] = TokenReserve({
            total: (MAX_SUPPLY * 30) / 100,
            allocated: 0
        });

        // Mint tokens to the contract
        _mint(address(this), MAX_SUPPLY);
    }

    // Allocate tokens from a specific reserve to the recipient
    function allocateTokens(
        string memory reserveName,
        address recipient,
        uint256 amount
    ) external nonReentrant onlyOwner {
        TokenReserve storage reserve = reserves[reserveName];

        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be positive");
        require(
            reserve.allocated + amount <= reserve.total,
            "Exceeds reserve allocation"
        );

        // Update allocation tracking
        reserve.allocated += amount;

        // Transfer tokens
        _transfer(address(this), recipient, amount);

        emit TokensAllocated(reserveName, recipient, amount);
    }

    // Reallocate tokens between reserves
    function reallocateTokens(
        string memory fromReserve,
        string memory toReserve,
        uint256 amount
    ) external nonReentrant onlyOwner {
        TokenReserve storage sourceReserve = reserves[fromReserve];
        TokenReserve storage destinationReserve = reserves[toReserve];

        require(amount > 0, "Amount must be positive");
        require(
            sourceReserve.allocated >= amount,
            "Insufficient tokens in source reserve"
        );
        require(
            destinationReserve.allocated + amount <= destinationReserve.total,
            "Reallocation exceeds destination reserve limit"
        );

        // Update reserve allocations
        sourceReserve.allocated -= amount;
        destinationReserve.allocated += amount;

        emit TokensReallocated(fromReserve, toReserve, amount);
    }

    // Get available tokens in a specific reserve
    function getAvailableReserveTokens(
        string memory reserveName
    ) external view returns (uint256) {
        TokenReserve storage reserve = reserves[reserveName];
        return reserve.total - reserve.allocated;
    }

    // Recover tokens accidentally sent to the contract
    function recoverERC20(IERC20 token, uint256 amount) external onlyOwner {
        require(
            address(token) != address(this),
            "Cannot recover governance tokens"
        );
        token.transfer(owner(), amount);
    }
}
