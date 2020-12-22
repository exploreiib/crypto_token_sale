const ViriToken = artifacts.require("ViriToken");
const ViriTokenSale = artifacts.require("ViriTokenSale");

module.exports = function (deployer) {
  deployer.deploy(ViriToken,1000000).then(function(){
    let tokenPrice = 1000000000000000; // 0.001 ether

    return deployer.deploy(ViriTokenSale,ViriToken.address,tokenPrice);
  });
};
