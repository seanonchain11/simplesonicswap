// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SonicTokenWrapper is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public wSonic;
    uint256 public fee = 30; // 0.3% default fee (30 basis points)
    uint256 private constant FEE_DENOMINATOR = 10000;

    event Wrap(address indexed user, uint256 amount, uint256 fee);
    event Unwrap(address indexed user, uint256 amount, uint256 fee);
    event FeeUpdated(uint256 newFee);

    constructor(address _wSonic) {
        require(_wSonic != address(0), "Invalid wSonic address");
        wSonic = IERC20(_wSonic);
    }

    function wrap() external payable nonReentrant whenNotPaused {
        require(msg.value > 0, "Amount must be greater than 0");
        
        uint256 feeAmount = (msg.value * fee) / FEE_DENOMINATOR;
        uint256 wrapAmount = msg.value - feeAmount;
        
        // Transfer fee to contract owner
        if (feeAmount > 0) {
            (bool success, ) = owner().call{value: feeAmount}("");
            require(success, "Fee transfer failed");
        }

        // Mint wrapped tokens
        wSonic.safeTransfer(msg.sender, wrapAmount);
        
        emit Wrap(msg.sender, wrapAmount, feeAmount);
    }

    function unwrap(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        
        uint256 feeAmount = (amount * fee) / FEE_DENOMINATOR;
        uint256 unwrapAmount = amount - feeAmount;

        // Transfer wrapped tokens from user
        wSonic.safeTransferFrom(msg.sender, address(this), amount);
        
        // Transfer fee in wrapped tokens to owner
        if (feeAmount > 0) {
            wSonic.safeTransfer(owner(), feeAmount);
        }

        // Send unwrapped tokens to user
        (bool success, ) = msg.sender.call{value: unwrapAmount}("");
        require(success, "Unwrap transfer failed");
        
        emit Unwrap(msg.sender, unwrapAmount, feeAmount);
    }

    function setFee(uint256 newFee) external onlyOwner {
        require(newFee <= 500, "Fee cannot exceed 5%");
        fee = newFee;
        emit FeeUpdated(newFee);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    receive() external payable {
    }
} 