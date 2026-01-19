// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "src/LockUSDT.sol";

contract TestLockUSDT is Test{
  LockUSDT lockusdt;

  function setUp() public {
    lockusdt = new LockUSDT(address(this)); 
  }

  function testDeposit() public{
    usdt.mint(address(0x0f1D1ca5b5Ac85DcBB0319bd8c083BFa0691F107), 200);
    vm.startPrank(0x0f1D1ca5b5Ac85DcBB0319bd8c083BFa0691F107);
    usdt.approve(address(lockusdt), 200);

    lockusdt.deposit(100);
    assertEq(usdt.balanceOf(address(0x0f1D1ca5b5Ac85DcBB0319bd8c083BFa0691F107)),0);
    assertEq(usdt.balanceOf(address(lockusdt)),200);
    
    usdt.withdraw(100);
    assertEq(usdt.balanceOf(address(0x0f1D1ca5b5Ac85DcBB0319bd8c083BFa0691F107)), 100);
    assertEq(usdt.balanceOf(address(0x0f1D1ca5b5Ac85DcBB0319bd8c083BFa0691F107)), 200);
  }
}