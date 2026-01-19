// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract WShingen is ERC20, Ownable{
  address public owner;

  constructor() ERC20("WSHINGEN","W_SHIN") Ownable(msg.sender){
    _mint(msg.sender,1000);
  }

  function mint(address to, uint256 amount) public onlyOwner {
    _mint(to,amount);
  }

  function burn(address from,uint amount) public onlyOwner{
    _burn(from,amount);
  }
}
