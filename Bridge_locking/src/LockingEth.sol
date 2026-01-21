// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LockingEth is IERC20 {
    address public usdtAddress;

    mapping(address =>uint) public pendingAmount;
    constructor(address _usdtAddress) {
        usdtAddress = _usdtAddress;
        pendingAmount[msg.sender] = 0;
    }

    function deposit(uint _amount) public {
        require(IERC20(usdtAddress).allowance(msg.sender, address(this)) >= _amount, "Approve USDT first");
        IERC20(usdtAddress).transferFrom(msg.sender, address(this), _amount);
        pendingAmount[msg.sender] += _amount;
    }

    function withdraw() public {
      uint amount = pendingAmount[msg.sender];
      require(amount >= _amount, "Insufficient locked balance");
      IERC20(usdtAddress).transfer(msg.sender, _amount);
      pendingAmount[msg.sender] =0;
    }
}