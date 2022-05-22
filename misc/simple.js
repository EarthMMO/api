const ethers = require('ethers');
// import { ethers } from 'ethers';


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
// const wallet2 = ethers.Wallet.fromMnemonic("measure vast project finish repair donate smoke category tunnel blue cave call", path)
// console.log({ walletAddress: wallet2.address, privateKey: wallet2.privateKey, mnemonics: wallet2.mnemonic.phrase })
const run = async () => {

    const a = await wallet.signMessage(Buffer.from("hello"))
    console.log(a)
    // ethers.utils.verifyMessage
    console.log(ethers.utils.verifyMessage(Buffer.from("hello"), a))
    // return a
}



run()

