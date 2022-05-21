const ethers = require('ethers');


const path = `m/44'/60'/0'/0/1`;



let walletAddress;
let privateKey;
let mnemonics;
// TODO get randomBytes from expo-random, pass it as entropy in Wallet.createRandom function below along with path. 
const wallet = ethers.Wallet.createRandom({ path });

walletAddress = wallet.address;
privateKey = wallet.privateKey;
mnemonics = wallet.mnemonic.phrase;

console.log("\n Wallet creation successful : ", { walletAddress, privateKey, mnemonics });
const run = async () => {

    const a = await wallet.signMessage(Buffer.from("hello"))
    console.log(a)
    // ethers.utils.verifyMessage
    console.log(ethers.utils.verifyMessage(Buffer.from("hello"), a))
    // return a
}

// const wallet2 = ethers.Wallet.fromMnemonic(words, path)

run()

