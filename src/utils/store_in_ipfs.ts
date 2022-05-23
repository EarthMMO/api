import { create } from 'ipfs-http-client';

const storeInIPFS = async (data: string | Buffer): Promise<string> => {
  const IPFSClient = create({ url: process.env.IPFS_CLIENT_URL as string });
  const storageResponse = await IPFSClient.add(data);
  return storageResponse.path as string;
};

export default storeInIPFS;
