// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LPToken is ERC20, Ownable {
    address public immutable pool;

    constructor(
        string memory name, 
        string memory symbol, 
        address _pool
    ) ERC20(name, symbol) {
        pool = _pool;
    }

    // Mint LP tokens (only callable by the pool contract)
    function mint(address to, uint256 amount) external {
        require(msg.sender == pool, "Only pool can mint");
        _mint(to, amount);
    }

    // Burn LP tokens (only callable by the pool contract)
    function burn(address from, uint256 amount) external {
        require(msg.sender == pool, "Only pool can burn");
        _burn(from, amount);
    }
}