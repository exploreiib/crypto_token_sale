// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.2 <0.9.0;

contract ViriToken {

//state variable to hold the totalSupply of viriTokens
uint256 public totalSupply;

//constructor to initilize totalSupply of viriTokens

constructor() public {
 totalSupply=1000000;
}

}