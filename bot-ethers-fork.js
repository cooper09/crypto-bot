const { ethers } = require('ethers');
//const rpcURL = 'https://mainnet.infura.io/v3/4cd98623d90d401ca984c02080c6bf72';
const rpcURL = 'http://localhost:8545';
const provider = new ethers.providers.JsonRpcProvider(rpcURL);

// Mainnet - const acct1 = "0x1BcFA34fC35C3eea82B90a21a4D1Ae3B17e90BC6";
const acct1 = '0x882D3750A0135513B6A51b57e716540d23b506C6';
//const acct2 = "0x00c3e8976ae622C79C6e33749eF999aa9ECba3c1";
//forked mainnet target account
const acct2 = "0xfFD5F5B573Ac9f6109C07822C74e0c96CbC81848";

//acct 1 is the signer...
const privateKey1 = '0x862bf9d7a945da9d25bd5d907b8d9bc44a7639f6535d5e5a6120ecef87142731';
// Mainnet - const privateKey1 = 'efc4c5c674dd95bf12a03a4b7b4fd55b99e1b099260a3d97c56ad3f5dbceb1ac';

const wallet = new ethers.Wallet(privateKey1, provider);

const init = async () => {
    console.log("Fred and Ether...");
    const senderBalanceBefore = await provider.getBalance(acct1);
    const receiverBalanceBefore = await provider.getBalance(acct2);


    console.log("Sender balance: ", ethers.utils.formatEther(senderBalanceBefore));
    console.log("Receiver balance: ", ethers.utils.formatEther(receiverBalanceBefore));

    const tx = await wallet.sendTransaction({
        to: acct2,
        value: ethers.utils.parseEther("0.001")
    })

    await tx.wait();
    console.log("The deal is done: ", tx.hash );

    const senderBalanceAfter = await provider.getBalance(acct1);
    const receiverBalanceAfter = await provider.getBalance(acct2);


    console.log("New Sender balance: ", ethers.utils.formatEther(senderBalanceAfter));
    console.log("New Receiver balance: ", ethers.utils.formatEther(receiverBalanceAfter));

    process.exit();
}

init();