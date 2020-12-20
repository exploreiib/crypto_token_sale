const ViriToken = artifacts.require("ViriToken");

module.exports = function (deployer) {
  deployer.deploy(ViriToken,1000000);
};
