// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IERC20Burnable is IERC20 {
    function burn(uint256 amount) external;
    function mint(address to, uint256 amount) external;
}

contract BridgeSepolia is Ownable {
  address public tokenAddress;
  uint public balance;

  event burn(address indexed to, uint amount);
  mapping(address =>uint) public pendingAmount;

  constructor(address _tokenAddress) Ownable(msg.sender){
    tokenAddress = _tokenAddress;
  }

  function burn(IERC20 _tokenAddress, uint amount) public  {
    require(address(_tokenAddress) == tokenAddress);
    _tokenAddress.burn(msg.sender,amount);
    emit burn(msg.sender, amount);
  }

  function withdraw(IERC20 _tokenAddress, uint amount) public  {
    require(pendingAmount[msg.sender] >= amount);
    pendingAmount[msg.sender] -= balance;
    _tokenAddress.mint(msg.sender,balance);
  }

  function depositOnOtherSide(address UserAccount, uint amount) public onlyOwner{
    pendingAmount[UserAccount] += amount;
  }

}
