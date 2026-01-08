// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ArunCoin is ERC20{
  address public owner;

  constructor(uint _initialSupply) ERC20("ArunCoin", "ARUN"){
    _mint(msg.sender,_initialSupply);
    owner = msg.sender;
  }

  modifier onlyOwner(){
    require(msg.sender == owner, "Only owner can call this function");
    _;
  }

  function mint(address to, uint value) public onlyOwner{
    _mint(to, value);
  }

}