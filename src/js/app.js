App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenPrice: 1000000000000000,
    tokensSold: 0,
    tokensAvailable: 750000,

    init: function() {
        console.log("App intialized....");
        return App.initWeb3();
    },

    initWeb3: function() {

        if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'){
            //getting Permission to access. This is for when the user has new MetaMask
            window.ethereum.enable();
            App.web3Provider = window.ethereum;
            web3 = new Web3(window.ethereum);
          
          }else if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
            web3 = new Web3(window.web3.currentProvider);
            // Acccounts always exposed. This is those who have old version of MetaMask
          
          } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
          
          }
        return App.initContracts();

        //0xC02e23F8107a7927e82651b9e4ec4cdEfA1D1592
    },
    
    initContracts: function(){
        $.getJSON("ViriTokenSale.json", function(viriTokenSale){
            App.contracts.ViriTokenSale = TruffleContract(viriTokenSale);
            App.contracts.ViriTokenSale.setProvider(App.web3Provider);
            App.contracts.ViriTokenSale.deployed().then(function(viriTokenSale){
               console.log("Viri Token Sale contrct:",viriTokenSale.address);
            });
        }).done(function(){
        $.getJSON("ViriToken.json", function(viriToken){
            App.contracts.ViriToken = TruffleContract(viriToken);
            App.contracts.ViriToken.setProvider(App.web3Provider);
            App.contracts.ViriToken.deployed().then(function(viriToken){
              console.log("Viri Token contrct:",viriToken.address);
            });
            App.listenForEvents();
            return App.render();
        });
      })
    },

    listenForEvents: function(){
      App.contracts.ViriTokenSale.deployed().then(function(instance){
          instance.Sell({},{
              fromBlock: 0,
              toBlock: 'latest'
          }).watch(function(error,event){
              console.log("event triggered",event);
              App.render();
          })
      })
    },

    render: function(){
        if(App.loading){
            return;
        }
        App.loading = true;

        let loader = $("#loader");
        let content = $("#content");

        loader.show();
        content.hide();
                
        //Load account data
        web3.eth.getAccounts(function(err,accounts) {
            console.log(accounts[0]);
           if(err === null){
               App.account = accounts[0];
               $("#accountAddress").html("Your Account: "+App.account);
           }
        })
        //Load token sale contract    
        App.contracts.ViriTokenSale.deployed().then(function(instance){
            viriTokenSaleInstance = instance;
            return viriTokenSaleInstance.tokenPrice();
        }).then(function(tokenPrice){
            console.log("token price",tokenPrice);
            App.tokenPrice = tokenPrice;
            $(".token-price").html(web3.fromWei(App.tokenPrice,"ether").toNumber());
            return viriTokenSaleInstance.tokenSold();
        }).then(function(tokensSold){
            App.tokensSold = tokensSold.toNumber();
            $(".tokens-sold").html(App.tokensSold);
            $(".tokens-available").html(App.tokensAvailable);
            let progressPercent = (App.tokensSold/App.tokensAvailable) * 100;
            $("#progress").css('width',progressPercent+'%');

            //Load token contract
            App.contracts.ViriToken.deployed().then(function(instance){
             viriTokenInstance = instance;
             return viriTokenInstance.balanceOf(App.account);
            }).then(function(balance){
             $(".dapp-balance").html(balance.toNumber());
            })
        })
        
        //0xC02e23F8107a7927e82651b9e4ec4cdEfA1D1592
        //0xC6D5c611EA20A0A2a863CEdDAD912461547E0c24
        //0x756B278ac0FC2Da09cb42083AFBB2A261413fF3A

        App.loading = false;
        loader.hide();
        content.show();      

    },

    buyTokens: function(){
        let loader = $("#loader");
        let content = $("#content");

        loader.show();
        content.hide();

        let numberOfTokens = $("#numberOfTokens").val();
        App.contracts.ViriTokenSale.deployed().then(function(instance){
            return instance.buyTokens(numberOfTokens,{
               from: App.account,
               value: numberOfTokens *  App.tokenPrice,
               gas: 500000   
            });
        }).then(function(result){
          console.log("Token Bought...");
          $('form').trigger('reset');
          //wait for sell event
        });
    }
}

$(function() {
    $(window).load(function() {
        App.init();
    })
});