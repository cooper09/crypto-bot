require('dotenv').config();
const web3 = require('web3');
const ethers = require('ethers');

const  {ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');

const uniswapTrade = async (wallet, acct1, acct2, provider) => {
    console.log("uniswapTrade... ");

    const chainId = 1;
    const daiAddr = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
    const ERC20_ABI = [
        "function name() view returns (string)"
        ]

        const signer = wallet.connect(provider);
        const uniswapABI = require('../abis/UniswapRouter.json'); 

        const dai = await Fetcher.fetchTokenData(chainId, daiAddr );
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
            const to = '0xfFD5F5B573Ac9f6109C07822C74e0c96CbC81848';//acct2;
            const deadline = Math.floor(Date.now()/1000) + 60 * 20;
            const value = new web3.utils.BN(trade.inputAmount.raw).toString();
            const amountOutMin =  await new web3.utils.BN(trade.minimumAmountOut(slippageTolerance).raw).toString();
        
           console.log("a landmark value: ", ethers.utils.formatEther(value) );
           const stinky = ethers.utils.formatEther(value);

           const goober = ethers.utils.parseUnits(stinky, 18);

           console.log("stinky goodie: ", stinky );
           console.log("goober goodie: ", goober );

           const weiBigNumber = ethers.utils.parseEther("0.000000000046")
           const wei = weiBigNumber.toString();
           console.log("wei: ", wei)

           const uniswap = new ethers.Contract( 
                "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
                uniswapABI,
                provider.signer //account
            );//end uniswap
        
            //execute trade
            const rawTx = await uniswap.populateTransaction.swapExactETHForTokens(amountOutMin, path, to, deadline, {
                value
            })
            
            let sendTx = await signer.sendTransaction(rawTx);
            let receipt = await sendTx.wait()
            
            if (receipt ) {
                    console.log(" - Transaction is mined - " + '\n' 
                    + "Transaction Hash:", (await sendTx).hash
                    + '\n' + "Block Number: " 
                    + (await receipt).blockNumber + '\n' 
                    + "Navigate to https://etherscan.io/txn/" 
                    + (await sendTx).hash, "to see your transaction")

                    return value;
                  } 
                  
        } catch (e) {
            console.log("Sorry charlie: ", e.message)
        }//end try

}//end uniswap trade

module.exports.uniswapTrade = uniswapTrade; 