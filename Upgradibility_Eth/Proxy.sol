// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

// proxy contract:
contract Storage{
    uint public num;
    address implementation;

    constructor(address _implementation) {
        num = 0;
        implementation = _implementation;
    }

    fallback() external  { 
        (bool success, ) = implementation.delegatecall(msg.data);
        if(!success){
            revert();
        }
    }

    function setImplementation(address _implementation) public{
        implementation = _implementation;
    }
}


//logic contract:
contract ImplementationV1{
    uint public num;

    function setNum(uint _num) public {
        num = _num;
    }
}
