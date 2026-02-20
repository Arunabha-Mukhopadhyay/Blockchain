// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ArunCoin is ERC20{
  address  StakingContract;
  address  owner;

  constructor(address _StakingContract) ERC20("ArunCoin", "ARUN"){
    StakingContract = _StakingContract;
    owner = msg.sender;
  }

  function mint(address to, uint256 amount) external {
    require(msg.sender == StakingContract, "Only Staking Contract can call this function");
    _mint(to, amount);
  }

  function updateContract(address _stakingContract) external {
    require(msg.sender == owner, "Only Staking Contract can call this function");
    StakingContract = _stakingContract;
  }

}