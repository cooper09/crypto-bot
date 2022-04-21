const { ethers } = require('ethers');
const web3 = require('web3'); //for utilities only
const rpcURL = 'https://mainnet.infura.io/v3/4cd98623d90d401ca984c02080c6bf72';
//forked version
//const rpcURL = 'http://localhost:8545';
const provider = new ethers.providers.JsonRpcProvider(rpcURL);

const  {ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');

const chainId = 1;

//const {getWallet, getExchange, getToken } = require ("./modules/modules")

const daiAddr = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
   
const ERC20_ABI = [
    "function name() view returns (string)"
]
   
const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

const acct1 = "0x1BcFA34fC35C3eea82B90a21a4D1Ae3B17e90BC6";
const acct2 = "0xfFD5F5B573Ac9f6109C07822C74e0c96CbC81848"; 

const init = async () => {

//const signer = new ethers.Wallet('387a0732c908a5ea6aff719ce9c7d552452b52c12cc3b4922461b465784e87b7');
const signer = new ethers.Wallet('efc4c5c674dd95bf12a03a4b7b4fd55b99e1b099260a3d97c56ad3f5dbceb1ac');
const account = signer.connect(provider);

const dai = await Fetcher.fetchTokenData(chainId, tokenAddress );
const weth = WETH[chainId];
const pair = await Fetcher.fetchPairData(dai,weth);
const route = new Route([pair], weth );
console.log("Buy Dai token with WETH: ", route.midPrice.toSignificant(6) );
console.log("Buy WETH token with DAI: ", route.midPrice.invert().toSignificant(6) );

const senderBalanceBefore = await provider.getBalance(acct1);
const receiverBalanceBefore = await provider.getBalance(acct2);

console.log("Sender balance 1: ", ethers.utils.formatEther(senderBalanceBefore));

try {
    console.log("start trade");
    const trade = new Trade(route, new TokenAmount(weth, '10000000000000000'), TradeType.EXACT_INPUT );
    const slippageTolerance = new Percent ('50','10000') //50 bips = 0.050 or 5%
    const path = [weth.address, dai.address ];
    const to = '0xfFD5F5B573Ac9f6109C07822C74e0c96CbC81848';
    const deadline = Math.floor(Date.now()/1000) + 60 * 20;
    const value = new web3.utils.BN(trade.inputAmount.raw).toString();
    const amountOutMin =  await new web3.utils.BN(trade.minimumAmountOut(slippageTolerance).raw).toString();

   console.log("a landmark value: ", value );
   
const uniswapABI = require('./abis/UniswapRouter.json'); 
    
const uniswap = new ethers.Contract( 
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    uniswapABI,
    provider.account
);

/*
const rawTx = await uniswap.swapExactETHForTokens (
    amountOutMin, 
    path, 
    to, 
    deadline,
    {
        value, 
        gasPrice: 20e9,
        from: provider.address
    }); 
*/

const rawTx = await uniswap.populateTransaction.swapExactETHForTokens(amountOutMin, path, to, deadline, {
    value
})

let sendTx = await account.sendTransaction(rawTx);
let receipt = await sendTx.wait()

if (receipt ) {
        console.log(" - Transaction is mined - " + '\n' 
        + "Transaction Hash:", (await sendTx).hash
        + '\n' + "Block Number: " 
        + (await receipt).blockNumber + '\n' 
        + "Navigate to https://etherscan.io/txn/" 
        + (await sendTx).hash, "to see your transaction")
      }    //end iffy 

      //Send goodies to may wallet

        const senderBalanceBefore = await provider.getBalance(acct1);
        const receiverBalanceBefore = await provider.getBalance(acct2);

        console.log("Sender Balance 2: ", senderBalanceBefore );

        //const privateKey1 = '387a0732c908a5ea6aff719ce9c7d552452b52c12cc3b4922461b465784e87b7';
        //cams account
        const privateKey1 = 'efc4c5c674dd95bf12a03a4b7b4fd55b99e1b099260a3d97c56ad3f5dbceb1ac';
        const wallet = new ethers.Wallet(privateKey1, provider);

    //    const balance = await provider.getBalance(address)
    //    console.log(`Ethers - account balance of ${ address } --> ${ethers.utils.formatEther(balance)} ETH\n` );

        let val = new web3.utils.BN(value).toString();
        //console.log("Swap value: ", web3.utils.toGwei(val) );

        //val = "0.001";

        const tx = await wallet.sendTransaction({
            to: acct2,
            //value: ethers.utils.parseEther("0.25"),
            gasPrice: 20e9,
            value: '0.001'  //web3.utils.fromWei(val),
        })
    
        await tx.wait();
        console.log("Funds have been transferred: ", tx.hash );

    } catch (e) {
        console.log("try failed: ", e.message)
    } 

    process.exit();
}

init();