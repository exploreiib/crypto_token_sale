// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.2 <0.9.0;

contract ViriToken {
//Token name
string public name = "Viri Token";
//Token symbol
string public symbol = "VIRI";
//Token standard (not part of ERC20 guidelines)
string public standard = "Viri Token v1.0";
//state variable to hold the totalSupply of viriTokens
uint256 public totalSupply;

event Transfer(
address indexed _from,
address indexed _to,
uint256 _value
);

event Approval(
    address indexed _owner,
    address indexed _spender,
    uint256 _value
);

mapping(address => uint256) public balanceOf;
mapping(address => mapping(address => uint256)) public allowance;
//constructor to initilize totalSupply of viriTokens

constructor(uint256 _initialSupply) public {
    totalSupply=_initialSupply;
    //allocate initial supply to the admin account
    balanceOf[msg.sender] = _initialSupply;
}

//Transfer ownership of token from sender account to given oaccount
function transfer(address _to,uint256 _value) public returns(bool success){
    //Exception, if sender account doesn't have enough tokens
    require(balanceOf[msg.sender] >= _value,"Insufficint funds in the account and revert the transaction");
    //Transfer tokens
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
    //Trigger/emit transfer event
    emit Transfer(msg.sender,_to,_value);
    //return boolean
    return true;
}

//approve

function approve(address _spender,uint256 _value) public returns(bool success){
    allowance[msg.sender][_spender] = _value;
    emit Approval(msg.sender,_spender,_value);
    return true;
}

//transferFrom

function transferFrom(address _from,address _to,uint256 _value) public returns(bool success){
    //Require _from has enough tokens
    require(_value <= balanceOf[_from]);
    //Require allowance is bigenough
    require(_value <= allowance[_from][msg.sender]);
    //Change the Balance
    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;
    //Update the allowance
    allowance[_from][msg.sender] -= _value;
    //Trigger Transferevent
    emit Transfer(_from,_to,_value);
    return true;

}

}