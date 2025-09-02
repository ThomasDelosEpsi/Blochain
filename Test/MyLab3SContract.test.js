const assert  = require('assert');
const ganache = require('ganache'); // v7
const Web3    = require('web3');
const fs      = require('fs');
const path    = require('path');

// ⚠️ Aligne Ganache sur Shanghai (support PUSH0)
const web3 = new Web3(ganache.provider({ chain: { hardfork: 'shanghai' } }));

const abiPath  = path.join(__dirname, '..', 'build', 'MyLab3SContract.abi');
const binPath  = path.join(__dirname, '..', 'build', 'MyLab3SContract.bin');
const abi      = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
const bytecode = '0x' + fs.readFileSync(binPath, 'utf8').trim();

let accounts, contract;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  contract = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode, arguments: ['Bonjour'] })
    .send({ from: accounts[0], gas: 6000000 }); // gas ample
});

describe('MyLab3SContract', () => {
  it('se déploie avec une adresse', () => {
    assert.ok(contract.options.address);
  });
  it('retourne le message initial', async () => {
    const msg = await contract.methods.getMyLab3SContract().call();
    assert.strictEqual(msg, 'Bonjour');
  });
  it('peut modifier le message', async () => {
    await contract.methods.setMyLab3SContract('Salut').send({ from: accounts[0] });
    const msg = await contract.methods.getMyLab3SContract().call();
    assert.strictEqual(msg, 'Salut');
  });
});
