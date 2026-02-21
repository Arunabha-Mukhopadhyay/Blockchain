// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract StakingContract{
  uint public totalSupply;
  mapping(address => uint) public stake;

  function Stake(uint _amount) public payable {
    require(_amount > 0,"must be greater than zero:" );
    require(msg.value == _amount,"amount should be equal to the sender value");
    totalSupply += _amount;
    stake[msg.sender] += _amount;
  }


  function Unstake(uint _amount) public payable{
    require(stake[msg.sender] >= _amount,"amount should be less than the staked amount");
    totalSupply -= _amount;
    stake[msg.sender] -= _amount;
    payable(msg.sender).transfer(_amount);
  }
}