// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IArunCoin{
  function mint(address to, uint256 amount) external;
}

contract StakingContract{
  address StakingAddress;
  mapping(address =>uint) stakes;

  uint STAKE_REWARD_RATE_ETH = 1;

  struct User{
    uint stakeAmount;
    uint unClaimedrewards;
    uint lastClaimedTime;
  }

  IArunCoin public aruncoin;
  mapping(address => User) public users;

  // constructor(IArunCoin _aruncoin){
  //   aruncoin = _aruncoin;
  // }

  function stake() public payable{
    require(msg.value > 0, "Stake amount must be greater than 0");

    require(block.timestamp >= users[msg.sender].lastClaimedTime, "Staking is not allowed at this time");

    uint timeGap = block.timestamp - users[msg.sender].lastClaimedTime;
    if(timeGap == 0){
      return;
    }

    if(users[msg.sender].lastClaimedTime == 0){
      users[msg.sender].lastClaimedTime = block.timestamp;
    } else{
      users[msg.sender].unClaimedrewards += timeGap * stakes[msg.sender];
      users[msg.sender].lastClaimedTime = block.timestamp;
    }

    stakes[msg.sender] += msg.value;
  }



  function unstake(uint _amount) public{
    require(_amount <= stakes[msg.sender], "Unstaking amount exceeds stake amount");

    uint timeGap = block.timestamp - users[msg.sender].lastClaimedTime;
    users[msg.sender].unClaimedrewards += timeGap * stakes[msg.sender];
    users[msg.sender].lastClaimedTime = block.timestamp;

    payable(msg.sender).transfer(_amount);
    stakes[msg.sender] -= _amount;
  }

  function getReward(address _address) public view returns(uint){
    uint currentReward = users[_address].unClaimedrewards;
    uint updateTime = users[_address].lastClaimedTime;
    uint newReward = (block.timestamp - updateTime) * stakes[_address];
    return currentReward + newReward;
  }

  function claimReward() public{
    uint currentReward = users[msg.sender].unClaimedrewards;
    uint updateTime = users[msg.sender].lastClaimedTime;
    uint newReward = (block.timestamp - updateTime) * stakes[msg.sender];
    users[msg.sender].unClaimedrewards = 0;
    users[msg.sender].lastClaimedTime = block.timestamp;

  }


  function BalanceOf(address _address) public view returns(uint){
    return stakes[_address];
  }
}