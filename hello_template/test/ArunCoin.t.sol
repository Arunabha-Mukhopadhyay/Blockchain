// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "src/ArunCoin.sol";


contract ArunCoinTest is Test {
  ArunCoin arunCoin;

  function setUp() public {
    arunCoin = new ArunCoin(1000);
  }

  event Transfer(address indexed from, address indexed to, uint256 value);

  function testMintTokens() public {
    arunCoin.mint(address(this),1000);
    assertEq(arunCoin.balanceOf(address(this)),2000,"Balance should be 1000");

    arunCoin.mint(address(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c),500);
    assertEq(arunCoin.balanceOf(address(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c)),500,"Balance should be 500");
  }

  function testTransfer() public {    
    arunCoin.mint(address(this),1000);
    assertEq(arunCoin.balanceOf(address(this)), 2000,"Balance should be 1000");

    arunCoin.transfer(address(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c),50);
    assertEq(arunCoin.balanceOf(address(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c)),50,"this balance should be 50");

    vm.prank(address(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c));
    arunCoin.transfer(address(this),20);
    assertEq(arunCoin.balanceOf(address(this)),1970,"Balance should be 970");
    assertEq(arunCoin.balanceOf(address(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c)),30,"this balance should be 30");
  }


  function testApprovals() public {
    arunCoin.mint(address(this),100);
    arunCoin.approve(address(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c),10);
    assertEq(arunCoin.allowance(address(this),address(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c)),10,"Allowance should be 10");

    vm.prank(address(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c));
    arunCoin.transferFrom(address(this),address(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c),5);
    assertEq(arunCoin.balanceOf(address(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c)),5,"Balance should be 5");
    assertEq(arunCoin.balanceOf(address(this)), 1095,"Balance should be 95");
  }

  // failed transfer test:
  function test_FailMint() public {
    vm.prank(address(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c));
    vm.expectRevert("Only owner can call this function");
    arunCoin.mint(address(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c), 100);
  }


  function test_FailTransfer() public {
    arunCoin.mint(address(this),1000);
    vm.expectRevert();
    arunCoin.transfer(address(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c),2050);
  }

  function test_FailApproval() public {
    arunCoin.mint(address(this),1000);
    arunCoin.approve(address(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c), 100);
    vm.prank(address(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c));
    vm.expectRevert();
    arunCoin.transferFrom(address(this), address(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c), 200);
  }


  function test_EmitTransferEvent() public{
    arunCoin.mint(address(this),1000);
    vm.expectEmit(true, true, false, true);
    emit Transfer(address(this),address(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c),100);
    arunCoin.transfer(address(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c),100);
  }
}