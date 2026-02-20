// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// import {Ownable} from  "@openzeppelin/contracts/access/Ownable.sol";

contract Counter {
    mapping(address => uint) public stakes;
    uint public totalStake;

    constructor(){

    }

    function stake(uint amount)public payable{
        require(amount > 0, "Amount must be greater than 0");
        require(amount == msg.value, "Amount must be equal to msg.value");
        stakes[msg.sender] += amount;
        totalStake += amount;
    }

    function unStake(uint _amount) public payable {
        require(_amount > 0, "Amount must be greater than 0");
        require(stakes[msg.sender] >= _amount, "Amount must be less than or equal to your stake");
        payable(msg.sender).transfer(_amount/2);
        stakes[msg.sender] -= _amount;
        totalStake -= _amount;
    }
}


contract CounterV2 {
    uint public totalStake;
    mapping(address => uint) public stakes;
    address implementation;

    constructor(address _implementation) {
        implementation = _implementation;
    }

    function stake(uint amount)public payable{
        require(amount > 0, "Amount must be greater than 0");
        require(amount == msg.value, "Amount must be equal to msg.value");
        stakes[msg.sender] += amount;
        totalStake += amount;
    }

    function unStake(uint _amount) public payable {
        require(_amount > 0, "Amount must be greater than 0");
        require(stakes[msg.sender] >= _amount, "Amount must be less than or equal to your stake");
        totalStake -= _amount;
        stakes[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
    }
}