const { ethers } = require('ethers');
const web3 = require('web3'); //for utilities only
const rpcURL = 'http://localhost:8545';
const provider = new ethers.providers.JsonRpcProvider(rpcURL);

const  {ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');

//const {getWallet, getExchange, getToken } = require ("./modules/modules")

const daiAddr = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
   
const ERC20_ABI = [
    "function name() view returns (string)"
]

const chainId = ChainId.MAINNET;
const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

const init = async () => {

const signer = new ethers.Wallet('83fc1fdc7044ae9f295eadb44b2847eaf6725493cf3a939f8297fc63b3c8a951');
const account = signer.connect(provider);

const dai = await Fetcher.fetchTokenData(chainId, tokenAddress );
const weth = WETH[chainId];
const pair = await Fetcher.fetchPairData(dai,weth);
const route = new Route([pair], weth );
console.log("Buy Dai token with WETH: ", route.midPrice.toSignificant(6) );
console.log("Buy WETH token with DAI: ", route.midPrice.invert().toSignificant(6) );

try {
    console.log("start trade");
    const trade = new Trade(route, new TokenAmount(weth, '10000000000000000'), TradeType.EXACT_INPUT );
    const slippageTolerance = new Percent ('50','10000') //50 bips = 0.050 or 5%
    const path = [weth.address, dai.address ];
    const to = '0x00c3e8976ae622C79C6e33749eF999aa9ECba3c1';
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
    } catch (e) {
        console.log("try failed: ", e.message)
    } 
    
    process.exit();
}

init();