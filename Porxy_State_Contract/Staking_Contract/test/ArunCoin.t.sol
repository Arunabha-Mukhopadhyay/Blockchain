// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {ArunCoin} from "../src/ArunCoin.sol";

contract ArunCoinTest is Test {
    ArunCoin public arunCoin;

    function setUp() public {
        arunCoin = new ArunCoin(address(this)); 
    }

    function testInitialSupply() public view
    {
        assertEq(arunCoin.totalSupply(), 0);
    }

    function test_RevertMint() public{
        vm.startPrank(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c);
        vm.expectRevert("Only Staking Contract can call this function");
        arunCoin.mint(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c,10);
        vm.stopPrank();
    }

    function testMint() public{
        arunCoin.mint(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c,10);
        assert(arunCoin.balanceOf(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c) == 10);
    }

    function testupdateContract() public{
        arunCoin.updateContract(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c);
        vm.startPrank(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c);
        arunCoin.mint(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c,10);
        assert(arunCoin.balanceOf(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c) == 10);
    }
}
