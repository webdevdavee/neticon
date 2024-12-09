// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC20, Ownable {
    address public faucet;

    constructor(
        string memory name,
        string memory symbol,
        uint256 _initialSupply,
        address _faucet
    ) ERC20(name, symbol) Ownable(msg.sender) {
        // Initialize the faucet address
        faucet = _faucet;

        // Mint the initial supply directly to the faucet
        _mint(faucet, _initialSupply);
    }

    // Function to mint additional tokens if needed
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // Optional: update faucet address in case needed
    function updateFaucetAddress(address newFaucet) external onlyOwner {
        faucet = newFaucet;
    }
}
