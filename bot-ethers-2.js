const { ethers } = require('ethers');
const rpcURL = 'http://localhost:8545';
const provider = new ethers.providers.JsonRpcProvider(rpcURL);

const acct1 = "0x34A2fF8DF9580C977eF00fcE9F33Ac29816F544C";
//const acct2 = "0x00c3e8976ae622C79C6e33749eF999aa9ECba3c1";
//forked mainnet target account
const acct2 = "0xfFD5F5B573Ac9f6109C07822C74e0c96CbC81848";

//acct 1 is the signer...
const privateKey1 = '387a0732c908a5ea6aff719ce9c7d552452b52c12cc3b4922461b465784e87b7';
const wallet = new ethers.Wallet(privateKey1, provider);

const init = async () => {
    console.log("Fred and Ether...");
    const senderBalanceBefore = await provider.getBalance(acct1);
    const receiverBalanceBefore = await provider.getBalance(acct2);


    console.log("Sender balance: ", ethers.utils.formatEther(senderBalanceBefore));
    console.log("Receiver balance: ", ethers.utils.formatEther(receiverBalanceBefore));

    const tx = await wallet.sendTransaction({
        to: acct2,
        value: ethers.utils.parseEther("0.25")
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