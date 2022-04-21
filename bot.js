require('dotenv').config
const ethers = require('ethers');
const Web3 = require('web3');
const {getWallet, getExchange, getToken } = require ("./modules/modules");
const {uniswapTrade} = require('./modules/uniswap');

/*
    Experimental bot. Modules include: 
        1) Create Wallet and assign provider
            - web3
            - ethers
        2) Create Exchange Contract
        3) Create Token Contract
*/

const rpcURL = 'https://mainnet.infura.io/v3/4cd98623d90d401ca984c02080c6bf72';
//const rpcURL = "http://127.0.0.1:8545";
const provider = new ethers.providers.JsonRpcProvider(rpcURL);

const acct1 = '0x1BcFA34fC35C3eea82B90a21a4D1Ae3B17e90BC6'; //Mainnet Account: 
//const acct1 = '0x882D3750A0135513B6A51b57e716540d23b506C6';
const acct2 = "0xfFD5F5B573Ac9f6109C07822C74e0c96CbC81848";

//acct 1 is the signer...//Mainnet key: 
const privateKey1 = 'efc4c5c674dd95bf12a03a4b7b4fd55b99e1b099260a3d97c56ad3f5dbceb1ac'; //Mainnet key: 
//const privateKey1 = '0x862bf9d7a945da9d25bd5d907b8d9bc44a7639f6535d5e5a6120ecef87142731';

const wallet = new ethers.Wallet(privateKey1, provider);

const init = async () => {
    console.log ("Bot me, baby! ", process.env.NODE_URL);

    //Gather all our goodies
    const network = await provider.getNetwork();
    console.log("network chain id:",network.chainId);

    const accounts = await provider.listAccounts();
    console.log("Current account: ", accounts[0]);

   
    //await contract.transfer(userAddress, dai);


    // Uniswap section goes here...
    result =  await uniswapTrade(wallet, acct1, acct2, provider);
    console.log("uniswapTrade result: ", result )
    const amt = ethers.utils.formatEther(result);
    console.log("amt to send: ", amt );
    //
    const senderBalanceBefore = await provider.getBalance(acct1);
    const receiverBalanceBefore = await provider.getBalance(acct2);

    console.log("Sender balance: ", ethers.utils.formatEther(senderBalanceBefore));
    console.log("Receiver balance: ", ethers.utils.formatEther(receiverBalanceBefore));

    
    const tx = await wallet.sendTransaction({
        to: acct2,
        //value: ethers.utils.parseEther("0.00123")
        value: ethers.utils.parseEther(amt)
    })

    await tx.wait();
    console.log("The deal is done: ", tx.hash );


    const senderBalanceAfter = await provider.getBalance(acct1);
    const receiverBalanceAfter = await provider.getBalance(acct2);

    console.log("New Sender balance: ", ethers.utils.formatEther(senderBalanceAfter));
    console.log("New Receiver balance: ", ethers.utils.formatEther(receiverBalanceAfter));

  
    /*
    //const web3Obj = await getWallet();

    console.log("exchange: ", await getExchange(wallet));
    console.log("token: ", await getToken());

*/
    process.exit();
}

init();
/*
setInterval ( () => {
    console.log("tic");
    init();
}, 300000)
*/