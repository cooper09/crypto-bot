
require('dotenv').config();
const Web3 = require('web3');
const ethers = require('ethers');

const getWallet = async () => {
    //console.log("Get that wallet: ", process.env.MAINNET_PRIVATE_KEY)
    
   const Provider = require('@truffle/hdwallet-provider');
   const mainURL = 'http://127.0.0.1:8545/';

   const privateKey = '83fc1fdc7044ae9f295eadb44b2847eaf6725493cf3a939f8297fc63b3c8a951';
   const provider = new Provider(privateKey, mainURL);
   const web3 = new Web3(provider);

   web3Obj = {
       web3,
       provider
   }
   
    return web3Obj;
} 

const getExchange = async (web3Obj) => {
  //  console.log("Get that exchange, baby");
  const  {ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');

  const chainId = 1;
  //mainnet dai: 
  const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const dai = await Fetcher.fetchTokenData(chainId, daiAddress );
  const weth = WETH[chainId];
  const pair = await Fetcher.fetchPairData(dai,weth);

  const route = new Route([pair], weth );
  console.log("Buy Dai token with WETH: ", route.midPrice.toSignificant(6) );
  console.log("Buy WETH token with DAI: ", route.midPrice.invert().toSignificant(6) );

  try {
    const trade = new Trade(
            route, 
            new TokenAmount(weth, '10000000000000000'), 
            TradeType.EXACT_INPUT 
            )
            console.log("Execution Price: ", trade.executionPrice.toSignificant(6) );
            console.log("Next Mid Price: ", trade.nextMidPrice.toSignificant(6) );

        const slippageTolerance = new Percent ('50','10000') //50 bips = 0.050 or 5%
        const path = [weth.address, dai.address];
        const to = '0x00c3e8976ae622C79C6e33749eF999aa9ECba3c1';
        const deadline = Math.floor(Date.now()/1000) + 60 * 20;

        const value = new web3Obj.web3.utils.BN(trade.inputAmount.raw).toString();
        const amountOutMin = new web3Obj.web3.utils.BN(trade.minimumAmountOut(slippageTolerance).raw).toString();
  
        //console.log("Web3 provider: ", web3Obj.provider );

        //const myProvider = await getProvider();
        const myProvider = web3Obj.provider;

        const uniswapABI = require('../abis/UniswapRouter.json'); 
    
        const uniswap = new ethers.Contract( 
            "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            uniswapABI,
            myProvider.account
        );

        // swap tokens

        tx = await sendTx (uniswap, amountOutMin, path, to, deadline, value, myProvider);

        console.log("Final result: ", tx );

  } catch(e) {
      console.log("Uniswap trade error: ", e.message)
  }
    return "getExchange speaks";
} 

const getToken = async () => {
 //   console.log("Get that token, baby")
    return "getToken speaks";
} 

const getProvider = async () =>{
    console.log("GetProvider...");

    const provider = ethers.getDefaultProvider('mainnet', {
        //infura: 'https://mainnet.infura.io/v3/4cd98623d90d401ca984c02080c6bf72'
        infura: 'http://localhost:8545'
    }); 

    const signer = new ethers.Wallet('83fc1fdc7044ae9f295eadb44b2847eaf6725493cf3a939f8297fc63b3c8a951');
    const account = signer.connect(provider);

    const providerObj = {
        signer,
        account,
    }

    return providerObj
}//end getProvider

const sendTx= async (uniswap, amountOutMin, path, to, deadline, value, provider ) => {

    console.log("sendTx - provider: ", provider.typeof(wallets) );
    const tx = await uniswap.swapExactETHForTokens (
        amountOutMin, 
        path, 
        to, 
        deadline,
        {
            value, 
            gasPrice: 20e9,
            from: provider.account.address
        },
                
    ); 

    console.log(`Uniswap transaction hash: ${tx.hash} `);
    const receipt = await tx.wait(); console.log(`Transaction was mined in block ${receipt.blockNumber}`);

    return tx;
}//end sendTransaction

module.exports.getWallet = getWallet;
module.exports.getExchange = getExchange;
module.exports.getToken = getToken;
module.exports.getProvider = getProvider;