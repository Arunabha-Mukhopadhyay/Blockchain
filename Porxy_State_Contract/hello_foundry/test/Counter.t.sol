// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {Counter} from "../src/Counter.sol";

contract CounterTest is Test {
    Counter public c;

    receive() external payable {} // here recieve function is added to receive the ether sent by the contract when we call unStake function. If we do not add this function, then the test will fail because the contract will not be able to receive the ether and it will throw an error.

    //fallback() external payable {} 

    function setUp() public {
        c = new Counter();
    }

    function testStake() public{
        uint value = 10 ether;
        c.stake{value:value}(value);
        assert(c.totalStake() == value);
    }

//    function testFailStake() public{
//     uint value = 10 ether;
//     c.stake(value);
//     assert(c.totalStake() == value);
//    }

   function testUnstake() public{
    uint value = 10 ether;
    // vm.startPrank(0x0f1D1ca5b5Ac85DcBB0319bd8c083BFa0691F107);
    // vm.deal(0x0f1D1ca5b5Ac85DcBB0319bd8c083BFa0691F107, value);
    c.stake{value:value}(value);
    c.unStake(value);
    assert(c.totalStake() == 0);
   }
}
