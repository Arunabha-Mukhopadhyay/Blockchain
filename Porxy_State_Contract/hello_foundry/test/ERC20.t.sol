// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import "../src/ERC20.sol";

contract ERC20Test is Test {
    ArunCoin c;

    function setUp() public {
      c = new ArunCoin(address(this));
    }

    function testMint() public {
        uint value = 10;
        c.mint(address(this), value);

        assert(c.balanceOf(address(this)) == value);
    }

    function test_RevertMint() public {
        uint value = 10;
        vm.startPrank(0x587EFaEe4f308aB2795ca35A27Dff8c1dfAF9e3f);
        vm.expectRevert("Only Staking Contract can call this function");
        c.mint(address(this), value);
        vm.stopPrank();
    }
}