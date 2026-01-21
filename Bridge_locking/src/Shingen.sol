// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Shingen is ERC20, Ownable{
  address public owner;

  constructor() ERC20("SHINGEN","SHIN") Ownable(msg.sender){
    _mint(msg.sender,1000);
  }

  function mint(address to, uint256 amount) public onlyOwner {
    _mint(to,amount);
  }

}