const _deploy_contracts = require("../migrations/2_deploy_contracts");

const ViriTokenSale = artifacts.require('ViriTokenSale');
const ViriToken = artifacts.require('ViriToken');

contract('ViriTokenSale', function(accounts)  {

    let tokenInstance;
    let tokenSaleInstance;
    let tokenPrice = 1000000000000000; //in wei
    let buyer = accounts[1];
    let numberOfTokens = 10;
    let admin = accounts[0];
    let tokensAvailable = 750000;
    it('initializes the contract with the correct values ', function(){
       
        return ViriTokenSale.deployed().then(function(instance){
            tokenSaleInstance=instance;
            return tokenSaleInstance.address
        }).then(function(address){
           assert.notEqual(address,0x0,'has contract address');
           return tokenSaleInstance.tokenContract();   
        }).then(function(address){
            assert.notEqual(address,0x0,'has token contract address');
            return tokenSaleInstance.tokenPrice();
        }).then(function(price){
           assert.equal(price,tokenPrice,'token price is correct');
        });
    }); 

    it('facilitates the token buying', function(){

        return ViriToken.deployed().then(function(instance){
            //Grab token instance first
            tokenInstance=instance;
            return ViriTokenSale.deployed();
        }).then(function(instance){
            //Grab token sale instance
            tokenSaleInstance=instance;
            //Provision 75% of all tokens to the token sale
            return tokenInstance.transfer(tokenSaleInstance.address,tokensAvailable, {from: admin})
        }).then(function(reciept){
          return tokenSaleInstance.buyTokens(numberOfTokens,{from: buyer, value: numberOfTokens * tokenPrice})
        }).then(function(reciept){
            assert.equal(reciept.logs.length,1,'triggers one event');
            assert.equal(reciept.logs[0].event,'Sell','Should be the "Sell" event');
            assert.equal(reciept.logs[0].args._buyer,buyer,'logs the account that purchased the tokens');
            assert.equal(reciept.logs[0].args._amount,numberOfTokens,'logs the number of tokens purchased');
            return tokenSaleInstance.tokenSold();
        }).then(function(amount){
            assert.equal(amount.toNumber(),numberOfTokens,'Increement the number of tokens sold');
            return tokenInstance.balanceOf(buyer);
        }).then(function(balance){
            assert.equal(balance.toNumber(),numberOfTokens);
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(function(balance){
            assert.equal(balance.toNumber(),tokensAvailable - numberOfTokens);
            //try to buy the tokens different from the ether value
            return tokenSaleInstance.buyTokens(numberOfTokens,{from: buyer, value: 1}) 
        }).then(assert.fail).catch(function(error){
           assert(error.message.indexOf('revert') >=0,'msg.value must equal to number of tokens in wei');
           return tokenSaleInstance.buyTokens(800000,{from: buyer, value: 1})
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >=0,'cannot purchase more tokens than available');
        });
    });
    
    it('end token sale',function(){
        return ViriToken.deployed().then(function(instance){
            //Grab token instance first
            tokenInstance=instance;
            return ViriTokenSale.deployed();
        }).then(function(instance){
            //Grab token sale instance
            tokenSaleInstance=instance;
            //Try to end the sale from account other than admin
            return tokenSaleInstance.endOfSale({from: buyer});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >=0,'must be admin to end sale');
            //End sale as admin
            return tokenSaleInstance.endOfSale({from: admin});
        }).then(function(receipt){
            return tokenInstance.balanceOf(admin);
        }).then(function(amount){
           //console.log(amount);
          assert.equal(amount.toNumber(),999990,'return all unsold tokens to admin');
          //Check that token price was reset when selfDestruct was called
          //return(tokenSaleInstance.tokenPrice());
        //}).then(function(price){
          //  console.log(price);

            //assert.equal(price.toNumber(),0,'token price was reset ');
        })
        
    })

});