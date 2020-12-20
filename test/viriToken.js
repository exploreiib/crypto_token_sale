const ViriToken = artifacts.require('ViriToken');

contract('ViriToken', function(accounts)  {

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

it('It allocates initial supply to the admin account', async () => {
    const adminBalance = await viriToken.balanceOf(accounts[0]);
    assert(adminBalance.toNumber() === 1000000);
});

it('It has correct token name', async () => {
    const tokenName = await viriToken.name();
    assert(tokenName==='Viri Token');
});

it('It has correct token symbol', async() => {
    const tokenSymbol = await viriToken.symbol();
    assert(tokenSymbol === 'VIRI');
});

it('It has correct standard', async() => {
    const standard = await viriToken.standard();
    assert(standard === 'Viri Token v1.0');
});

it('transfer token ownership should throw exception due to insufficient balance', async () => {

    try{
            await viriToken.transfer.call(accounts[1],99999999999);
            throw new Error('Expected an error and didnt get one!')

    }catch(err){
      assert(err.message.indexOf('revert') >=0, 'error message must contain revert');
    }
});

it('transfer token ownership from sender to receiver account', async () => {
    await viriToken.transfer(accounts[1],250000, {from : accounts[0]});
    const recieverBalance = await viriToken.balanceOf(accounts[1]);
    assert(recieverBalance,250000,'add the correct amount og token in to receiving account')
    const senderBalance = await viriToken.balanceOf(accounts[0]);
    assert(senderBalance,750000,'deduct the  correct amount of tokens from sender account')
});

it('transfer token ownership should emit transfer event', async () => {
    const reciept = await viriToken.transfer(accounts[1],250000,{from : accounts[0]});
    assert(reciept.logs.length,1,'triggers one event');
    assert(reciept.logs[0].event,'Transfer','Should be the "Transfer" event');
    assert(reciept.logs[0].args._from,accounts[0],'logs the account the tokens are transferred from');
    assert(reciept.logs[0].args._to,accounts[1],'logs the account the tokens are transferred to');
    assert(reciept.logs[0].args._value,250000,'logs the transfer amount');
});

it('transfer token ownership should return true', async () => {
    const result = await viriToken.transfer.call(accounts[1],250000,{from : accounts[0]});
    assert(result,true,'transfer should return true');
})

});