const ViriToken = artifacts.require('ViriToken');

contract('ViriToken', () => {

let viriToken = null;

before(async () => {
    viriToken = await ViriToken.deployed();
});

it('Should deploy smart contract properly', async () => {
    assert(viriToken.address !== '');
});

it('sets the total supply upon deployment', async () => {
    const totalSupply = await viriToken.totalSupply();
    assert(totalSupply.toNumber() === 1000000); 
});

});