// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// interface IUSDT is IERC20{
//   function transfer(address to, uint256 value) external returns (bool);
//   function transfer(address to, uint256 value) external returns (bool);
// }

contract LockUSDT is IERC20 { 
  address public usdtAddress;
  mapping(address => uint256) private pendingAmount;
  constructor(address _usdtAddress) {
    usdtAddress = _usdtAddress;
    pendingAmount[msg.sender] = 0;
  }

  function deposit(uint256 _amount) public {
    require(IERC20(usdtAddress).allowance(msg.sender, address(this)) >= _amount, "Insufficient allowance");
    IERC20(usdtAddress).transferFrom(msg.sender, address(this), _amount);
    pendingAmount[msg.sender] += _amount;
  }

  function withdraw() public {
    uint256 amount = pendingAmount[msg.sender];
    IERC20(usdtAddress).transfer(msg.sender, amount);
    pendingAmount[msg.sender] = 0;
  }
}