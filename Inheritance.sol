// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract Inheritance{
    uint startTime;
    uint tenYears;
    address private owner;
    address private recipient;
    uint private lastVisited;

    uint totalAmount;

    constructor(address payable _recipient){
        tenYears = 10;
        owner = msg.sender;
        recipient = _recipient;

        startTime = block.timestamp;
        lastVisited = block.timestamp;
    }

    modifier OnlyOwner(){
        require(owner == msg.sender,"only should be owner");
        _;
    }

    modifier OnlyRecipient(){
        require(recipient == msg.sender,"only should be owner");
        _;
    }

    function deposit() public payable OnlyOwner{
        lastVisited = block.timestamp;
        totalAmount += msg.value;
    }

    function ping() OnlyOwner public{
        lastVisited = block.timestamp;
    }

    function claim() external payable OnlyRecipient {
    require(lastVisited < block.timestamp - tenYears, "10 years not elapsed");
    uint256 amount = totalAmount;
    totalAmount = 0;

    (bool success, ) = recipient.call{value: amount}("");
    require(success, "Transfer failed");
}
}