// import { create } from 'ipfs-http-client';
const { create } = require('ipfs-http-client')
const client = create(new URL('https://ipfs.infura.io:5001/api/v0'));

const run = async () => {
    try {
        // console.log(client.getEndpointConfig())
        const { path } = await client.add(JSON.stringify({
            image: `https://ipfs/ips/QmQzCQn4puG4qu8PVysxZmscmQ5vT1ZXpqo7f58Uh9QfyY`,
            name: 'EarthMMO-Profile body',
        }))

        console.log(path)
    } catch (e) {
        console.log({ e })
    }
}
run()