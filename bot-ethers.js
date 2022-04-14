const { ethers } = require('ethers');
const rpcURL = 'http://localhost:8545';
const provider = new ethers.providers.JsonRpcProvider(rpcURL);

//const {getWallet, getExchange, getToken } = require ("./modules/modules")

/*
    Experimental bot. Modules include: 
        1) Create Wallet and assign provider
            - web3
            - ethers
        2) Create Exchange Contract
        3) Create Token Contract
*/

const daiAddr = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
   
const ERC20_ABI = [
    "function name() view returns (string)"
]

const contract = new ethers.Contract(daiAddr, ERC20_ABI, provider);

const init = async () => {
    console.log('farts 1');
 
    const address = "0x3Ecdfe1Dad9Dc1aB0dB9e0bdE2F6E9D769efDB83";

    const balance = await provider.getBalance(address)
        console.log(`Ethers - account balance of ${ address } --> ${ethers.utils.formatEther(balance)} ETH\n` );


        //console.log("Ethers contract: ", contract );

    try {   
        const name = await contract.name();
        console.log("The name of the game: ", name );
    } catch (e) {
        console.log("ethers fails: ", e.message )
    }

    process.exit();
}

init();