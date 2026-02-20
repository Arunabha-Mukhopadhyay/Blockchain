// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ArunCoin is ERC20{
  address public StakingContract;

  constructor(address _StakingContract) ERC20("ArunCoin", "ARUN"){
    StakingContract = _StakingContract;
  }

  modifier onlyStakingContract() {
    require(msg.sender == StakingContract, "Only Staking Contract can call this function");
    _;
  }

  function mint(address to, uint256 amount) external onlyStakingContract {
    _mint(to, amount);
  }

  function updateContract(address newContract) external onlyStakingContract {
    StakingContract = newContract;
  }
}