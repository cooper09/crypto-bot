const {getWallet, getExchange, getToken } = require ("./modules/modules")

/*
    Experimental bot. Modules include: 
        1) Create Wallet and assign provider
            - web3
            - ethers
        2) Create Exchange Contract
        3) Create Token Contract
*/

const init = async () => {
    console.log ("Bot me, baby!")
    //console.log("wallet: ", getWallet());
    const web3Obj = await getWallet();

    console.log("exchange: ", await getExchange(web3Obj));
    console.log("token: ", await getToken());


    process.exit();
}

init();