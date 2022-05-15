const EthCrypto = require('eth-crypto');
const ethers = require('ethers');
const ethUtils = require('ethereumjs-util');


// We use the same derivation path for creating new wallets and importing the previous ones
// For earthMMO, lets keep this derivation path constant for the prototype, eventually , we will generate new addresses for security.

const path = `m/44'/60'/0'/0/1`;



let walletAddress;
let privateKey;
let mnemonics;
const wallet = ethers.Wallet.createRandom({ path });
walletAddress = wallet.address;
privateKey = wallet.privateKey;
publicKey = wallet.publicKey;
console.log({ publicKey })
mnemonics = wallet.mnemonic.phrase;
console.log("\n Wallet creation successful : ", { walletAddress, privateKey, mnemonics });
const run = async () => {

    const a = await wallet.signMessage(Buffer.from("hello"))
    ethers
    console.log(ethers.verifyMessage(Buffer.from("hello"), a))
    return a
}

function sign(message, pkey) {
    let mHash = ethUtils.sha3(message);
    let keyBuf = new Buffer(pkey.slice(2), 'hex');
    let vrs = ethUtils.ecsign(mHash, keyBuf);
    let sigBuf = Buffer.concat([vrs.r, vrs.s, ethUtils.toBuffer(vrs.v)]);
    let signature = ethUtils.bufferToHex(sigBuf);
    return signature;
}
const createSignature = ({ _privateKey, message }) => {

    const messageHash = EthCrypto.hash.keccak256(message);
    const signature = EthCrypto.sign(
        _privateKey, // privateKey
        messageHash // hash of message
    );
    return signature
}

const verifySignatureOffline = ({ signature, message }) => {
    const signer = EthCrypto.recover(
        signature,
        EthCrypto.hash.keccak256(message) // signed message hash
    );
    return signer;
}

function getAddr(message, signature) {

    let mHash = ethUtils.keccak256(Buffer.from(message));
    let vrs = {
        r: Buffer.from(signature.slice(2, 66), 'hex'),
        s: Buffer.from(signature.slice(66, 130), 'hex'),
        v: Number('0x' + signature.slice(130, 132))
    };
    let pubkey = ethUtils.ecrecover(mHash, vrs.v, vrs.r, vrs.s);
    var addr = '0x' + ethUtils.publicToAddress(pubkey).toString('hex');
    return addr;
}


run().then(sign => {
    console.log("sign : ", sign)

    console.log("sign : ", createSignature({ _privateKey: privateKey, message: "hello" }))
    console.log("addeess : ", verifySignatureOffline({ signature: sign, message: "hello" }))
    // console.log("verify : ",,))
    console.log("address : ", getAddr("hello", sign))
})




// // // const createSignature = ({ _privateKey, message }) => {

// // //     const messageHash = EthCrypto.hash.keccak256(message);
// // //     const signature = EthCrypto.sign(
// // //         _privateKey, // privateKey
// // //         messageHash // hash of message
// // //     );
// // //     return signature
// // // }

// // // const verifySignatureOffline = ({ signature, message }) => {
// // //     const signer = EthCrypto.recover(
// // //         signature,
// // //         EthCrypto.hash.keccak256(message) // signed message hash
// // //     );
// // //     return signer;
// // // }
// // // const importWalletAndSign = ({ words }) => {

// // //     const wallet2 = ethers.Wallet.fromMnemonic(words, path);
// // //     const message = "Hello";
// // //     const signature = createSignature({ _privateKey: wallet2.privateKey, message });
// // //     return signature;


// // // }



// // // const validate = async () => {
// // //     // create a new wallet
// // //     createNewWallet();

// // //     // Simple message to sign and the test the signature ownership
// // //     const message = "Hello";

// // //     // create a signature from above derived wallet's private key
// // //     const signature = createSignature({ _privateKey: privateKey, message });
// // //     console.log("Signature generated from the newly created wallet : ", signature)


// // //     // Derive wallet address from signature
// // //     const addressFromSignature = verifySignatureOffline({ signature, message })
// // //     console.log("Address generated from the signature : ", addressFromSignature)

// // //     if (addressFromSignature == walletAddress)
// // //         console.log("Nice! the address derived from the signature is same address of the wallet we generated above")


// // //     // Here we will try to import the same mnemonic, create wallet, generate signature and derive the address from that,
// // //     // the address should be our wallet address
// // //     const addressFromSignatureOfImportedWallet = verifySignatureOffline({ signature: importWalletAndSign({ words: mnemonics }), message })

// // //     if (addressFromSignatureOfImportedWallet == walletAddress)
// // //         console.log("Import wallet works successfully")


// // // }
// // // validate()


// // // // run()


// // // // > '0xc04b809d8f33c46ff80c44ba58e866ff0d5..'



// // // const EthCrypto = require('eth-crypto');
// // const ethers = require('ethers')

// // let walletAddress;
// // let privateKey;
// // let mnemonics;


// // /**
// //  * Create a new wallet with random mnemoinc words
// //  * @returns 
// //  */
// // const path = `m/44'/60'/0'/0/1`;

// // const wallet = ethers.Wallet.createRandom({ path });
// // walletAddress = wallet.address;
// // privateKey = wallet.privateKey;
// // mnemonics = wallet.mnemonic.phrase;
// // console.log("\n Wallet creation successful : ", { walletAddress, privateKey, mnemonics });







// // // We use the same derivation path for creating new wallets and importing the previous ones
// // // For earthMMO, lets keep this derivation path constant for the prototype, eventually , we will generate new addresses for security.

// // var Accounts = require('web3-eth-accounts');

// // // Passing in the eth or web3 package is necessary to allow retrieving chainId, gasPrice and nonce automatically
// // // for accounts.signTransaction().
// // var accounts = new Accounts('ws://localhost:8546');


// var crypto = require("crypto");
// var eccrypto = require("eccrypto");

// // A new random 32-byte private key.
// var privateKey = eccrypto.generatePrivate();
// // Corresponding uncompressed (65-byte) public key.
// var publicKey = eccrypto.getPublic(privateKey);

// var str = "message to sign";
// // Always hash you message to sign!
// var msg = crypto.createHash("sha256").update(str).digest();

// eccrypto.sign(privateKey, msg).then(function (sig) {
//     console.log("Signature in DER format:", sig);
//     eccrypto.verify(publicKey, msg, sig).then(function () {
//         console.log("Signature is OK");
//     }).catch(function () {
//         console.log("Signature is BAD");
//     });
// });

// const messageHash = web3.sha3('Apples');
// const signature = await web3.eth.personal.sign(messageHash, web3.eth.defaultAccount);