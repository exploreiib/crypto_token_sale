// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.2 <0.9.0;

import "./ViriToken.sol";

contract ViriTokenSale {

    address admin;
    ViriToken public tokenContract;
    uint256 public tokenPrice;
    constructor(ViriToken _tokenContract,uint256 _tokenPrice) public {
      //Assign an admin
      admin = msg.sender;
      //Token Contract
      tokenContract = _tokenContract;
      //Token Price
      tokenPrice = _tokenPrice;
    }
}