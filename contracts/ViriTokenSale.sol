// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.2 <0.9.0;

import "./ViriToken.sol";

contract ViriTokenSale {

    address admin;
    ViriToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokenSold;

    event Sell(address  _buyer,
               uint256 _amount);

    constructor(ViriToken _tokenContract,uint256 _tokenPrice) public {
      //Assign an admin
      admin = msg.sender;
      //Token Contract
      tokenContract = _tokenContract;
      //Token Price
      tokenPrice = _tokenPrice;
    }

 function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
      //Require that value is equalt to tokens
      require(msg.value == multiply(_numberOfTokens , tokenPrice));
      //Require that contract has enough tokens
      require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
      require(tokenContract.transfer(msg.sender,_numberOfTokens));
      //keep track of tokens sold
      tokenSold += _numberOfTokens;
      //Emit Sell Event
      emit Sell(msg.sender,_numberOfTokens);
      
    }

    function endSale() public {
        //Require admin
        //Transfer remaining viritokens to admin
        //Destroy the token contract
    }
}