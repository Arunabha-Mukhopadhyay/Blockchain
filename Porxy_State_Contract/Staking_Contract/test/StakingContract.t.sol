// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {StakingContract} from "../src/StakingContract.sol";

contract StakingContractTest is Test {
    StakingContract  stakingContract;

    receive() external payable {}

    function setUp() public {
        stakingContract = new StakingContract(); 
    }

    function testStake() public{
      stakingContract.stake{value: 200}();
      assert(stakingContract.BalanceOf(address(this)) == 200);
    }

    function testSTAKES() public{
      vm.startPrank(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c);
      vm.deal(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c, 10 ether);
      stakingContract.stake{value: 1 ether}();
      assert(stakingContract.BalanceOf(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c) == 1 ether);
    }

    function testUnstake() public{
      stakingContract.stake{value: 200}();
      stakingContract.unstake(100);
      //assert(stakingContract.BalanceOf(address(this)) == 100);
    }

    function test_RevertUnstake() public{
      stakingContract.stake{value:200}();
      vm.expectRevert("Unstaking amount exceeds stake amount");
      stakingContract.unstake(300);
    }

    function testGetReward() public{
      uint value = 1 ether;
      vm.deal(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c, 10 ether);
      vm.startPrank(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c);
      stakingContract.stake{value:value}();

      vm.warp(block.timestamp + 1);
      //console.log(block.timestamp);
      uint rewards = stakingContract.getReward(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c);
      //console.log(rewards);
      assert(rewards == 1 ether);
    }


    function testGetRewardAfterUnstake() public{
      uint value = 2 ether;
      vm.deal(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c, 10 ether);
      vm.startPrank(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c);
      stakingContract.stake{value:value}();
      vm.warp(block.timestamp + 1);
      stakingContract.unstake( 1 ether);
      uint rewards = stakingContract.getReward(0x65dD388D90920df649c2740Fb58cAc89b5C23D1c);
      assert(rewards == 2 ether);
    }

}
