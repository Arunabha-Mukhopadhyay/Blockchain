// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BridgeSepolia is IERC20 {
  address public tokenAddress;
  uint public balance;

  event burn(address indexed from, uint amount);

  mapping(address =>uint) public pendingAmount;
  constructor(address _tokenAddress) Ownable(msg.sender) {
    tokenAddress = _tokenAddress;
    pendingAmount[msg.sender] = 0;
  }

  function burn(IERC20 _address,uint _amount) public{
    require(tokenAddress == address(_address), "Invalid token address");
    require(pendingAmount[msg.sender] >= _amount, "Insufficient locked balance");
    _address.burn(msg.sender, _amount);
    emit burn(msg.sender, _amount);
  }

  function withdraw(IERC20 _address, uint _amount) public{
    require(pendingAmount[msg.sender] >= _amount, "Insufficient locked balance");
    pendingAmount[msg.sender] -= balance;
    _address.transfer(msg.sender, balance);
  }

  function depositedOnOtherSide(address UserAccount, uint amount) public onlyOwner {
    pendingAmount[UserAccount] += amount;

  }
}