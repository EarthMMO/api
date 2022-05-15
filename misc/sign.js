// Create a SHA3 hash of the message 'Apples'

const web3 = require('web3')
const messageHash = web3.sha3('Apples');

// Signs the messageHash with a given account
const signature = await web3.eth.personal.sign(messageHash, web3.eth.defaultAccount);
web3.eth.sign("Hello world", "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe")


console.log({ signature })

