// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LPToken is ERC20Permit, Ownable {
    address public immutable pool;

    // Maximum total supply to prevent excessive dilution
    uint256 public constant MAX_SUPPLY = 10_000_000 * 10 ** 18; // 10 million tokens

    // Events
    event Minted(address indexed to, uint256 amount);
    event Burned(address indexed from, uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        address _pool
    ) ERC20Permit(name) ERC20(name, symbol) Ownable(msg.sender) {
        require(_pool != address(0), "Invalid pool address");
        pool = _pool;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == pool, "Only pool can mint");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");

        _mint(to, amount);
        emit Minted(to, amount);
    }

    function burn(address from, uint256 amount) external {
        require(msg.sender == pool, "Only pool can burn");

        _burn(from, amount);
        emit Burned(from, amount);
    }
}
