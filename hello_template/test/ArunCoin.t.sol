// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "src/ArunCoin.sol";


contract ArunCoinTest is Test {
  ArunCoin arunCoin;

  function setUp() public {
    arunCoin = new ArunCoin(1000);
  }

  function testMintTokens() public {
    arunCoin.mint(address(this),1000);
    assertEq(arunCoin.balanceOf(address(this)),2000,"Balance should be 1000");

    arunCoin.mint(address(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c),500);
    assertEq(arunCoin.balanceOf(address(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c)),500,"Balance should be 500");
  }
}