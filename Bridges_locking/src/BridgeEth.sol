// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BridgeEth is Ownable {
  uint public balance;
  address public tokenAddress;

  event Deposit(address indexed from, uint amount); 
  mapping(address =>uint) public pendingAmount;

  constructor(address _tokenAddress) Ownable(msg.sender) {
    tokenAddress = _tokenAddress;
  }

  function lock(IERC20 _tokenAddress, uint amount) public {
    require(address(_tokenAddress) == tokenAddress, "Invalid token address");
    require(_tokenAddress.allowance(msg.sender,address(this)) >= amount, "Insufficient allowance");
    require(_tokenAddress.transferFrom(msg.sender,address(this),amount));
    emit Deposit(msg.sender, amount);
  }

  function unlock(IERC20 _tokenAddress, uint _amount) public {
    require(address(_tokenAddress) == tokenAddress, "Invalid token address");
    require(pendingAmount[msg.sender] >= _amount);
    pendingAmount[msg.sender] -= _amount;
    _tokenAddress.transfer(msg.sender, _amount);
  }

  function burnOnOtherSide(address UserAccount) public onlyOwner {
    pendingAmount[UserAccount] += balance;
  }
}
