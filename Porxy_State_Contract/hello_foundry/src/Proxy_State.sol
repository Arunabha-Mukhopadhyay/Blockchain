// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IArunCoin{
  function mint (address to, uint256 amount) external;
}

contract Proxy{
  uint totalStaked;
  mapping(address => uint) public stakes;
  uint public constant REWARD_PER_ETH_STAKE = 1;

  IArunCoin public aruncoin;

  struct userInfo{
    uint stakeAmount;
    uint rewardAmount;
    uint lasttimeOfStake;
  }

  constructor(IArunCoin _aruncoin) {
    aruncoin = _aruncoin;
  }

  mapping(address => userInfo) public userInfos;

  function stake() external{
    userInfo storage user = userInfos[msg.sender];
    if(user.lasttimeOfStake ==0){
      user.lasttimeOfStake = block.timestamp;
      return;
    }

    uint timegap = block.timestamp - user.lasttimeOfStake;
    if(timegap == 0){
      return;
    }
  }

}