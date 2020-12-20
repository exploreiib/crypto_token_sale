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

it('transfer token ownership should emit Transfer event', async () => {
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

it('tranfer token approve should return true', async () => {
    const result = await viriToken.approve.call(accounts[1],100);
    assert(result,true,'it should return true value');
});

it('transfer token approve should emit Approval event', async () => {
    const reciept = await viriToken.approve(accounts[1],100,{from : accounts[0]});
    assert(reciept.logs.length,1,'triggers one event');
    assert(reciept.logs[0].event,'Approval','Should be the "Approval" event');
    assert(reciept.logs[0].args._owner,accounts[0],'logs the account the tokens are authorized by');
    assert(reciept.logs[0].args._spender,accounts[1],'logs the account the tokens are authorized to');
    assert(reciept.logs[0].args._value,250000,'logs the transfer amount');
});

it('transfer token approve should set allownace to 100 tokens', async () => {
    await viriToken.approve(accounts[1],100,{from : accounts[0]});
    const allowance = await viriToken.allowance(accounts[0],accounts[1]);
    assert(allowance.toNumber(),100,'allowance correctly set');
});

it('handles delegated transfer', async() => {

    const fromAccount = accounts[2];
    const toAccount = accounts[3];
    const spendingAccount = accounts[4];

    //transfer s0me tokens to _fromAccount    
    await viriToken.transfer(fromAccount,100,{from: accounts[0]});
    //approve spendingAccount to transfer 10 accounts from fromAccount
    await viriToken.approve(spendingAccount,10,{from: fromAccount});
    //try transferring something larger than the sender balance
    try{
      await viriToken.transferFrom(fromAccount,toAccount,99999,{from: spendingAccount});
      throw new Error('Expected an error and didnt get one!')
    } catch(err){
        assert(err.message.indexOf('revert') >=0, 'cannot transfer value larger than the balance');
    }

    //try transferring something larger than the allowed amount
    try{
        await viriToken.transferFrom(fromAccount,toAccount,20,{from: spendingAccount});
        throw new Error('Expected an error and didnt get one!')
      } catch(err){
          assert(err.message.indexOf('revert') >=0, 'cannot transfer value larger than the allowance');
      }

      const resultValue = await viriToken.transferFrom.call(fromAccount,toAccount,10,{from: spendingAccount});
      assert(resultValue,true,'should return true value');

      const reciept = await viriToken.transferFrom(fromAccount,toAccount,10,{from : spendingAccount});
      assert(reciept.logs.length,1,'triggers one event');
      assert(reciept.logs[0].event,'Transfer','Should be the "Transfer" event');
      assert(reciept.logs[0].args._from,accounts[0],'logs the account the tokens are transferred from');
      assert(reciept.logs[0].args._to,accounts[1],'logs the account the tokens are transferred to');
      assert(reciept.logs[0].args._value,250000,'logs the transfer amount');

      const balanceOfFromAccount = await viriToken.balanceOf(fromAccount);
      assert(balanceOfFromAccount.toNumber() === 90);
      const balanceOfToAccount = await viriToken.balanceOf(toAccount);
      assert(balanceOfToAccount.toNumber() === 10);

      const allowance = await viriToken.allowance(fromAccount,spendingAccount);
      assert.equal(allowance.toNumber() === 0 );


})
});