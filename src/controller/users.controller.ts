// import ether from 'ethers';
const ether = require('ethers');
import { create } from 'ipfs-http-client';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import User, { NFT } from '../services/mongodb/users.schema';
import { createToken } from '../utils/jwt';
import { generateSecret } from '../utils/secret';
import CustomError from '../exceptions/custom_error';
import { logger } from '../utils/logger';

/**
 * This function receives the string binary, store it in the IPFS and return path
 * @param data
 * @returns
 */
const storeInIPFS = async (data: string | Buffer): Promise<string> => {
  const IPFSClient = create({ url: process.env.IPFS_CLIENT_URL as string });
  const storageResponse = await IPFSClient.add(data);
  return storageResponse.path as string;
};

/**
 * Creates user record for EarthMMO
 * @param userRequest
 * @returns
 */
export const createUser = async (userRequest: createUserRequest) => {
  try {
    const { firstName, lastName, email, ethereumAddress, signature } =
      userRequest;
    const exitingUserDetails = await User.findOne(
      { ethereumAddress },
      { _id: 1 }
    );

    if (exitingUserDetails)
      throw new CustomError('User already exists', 400, '400', ethereumAddress);
    // verify the signature
    const addressOfTheSigner = ether.utils.verifyMessage(
      Buffer.from('hello'),
      signature as string
    );
    if (addressOfTheSigner !== ethereumAddress)
      throw new CustomError('Invalid signature', 400, '400', ethereumAddress);

    //   ====  store the image in the IPFS  ===

    //read profile pic
    const userNFTFile = fs.readFileSync(
      path.join(`${__dirname}/../../../static`, 'profile.jpg')
    );

    // extract binary data from the file read
    const fileBuffer = Buffer.from(userNFTFile);

    // all the fileData to IPFS
    const profileImagePath = await storeInIPFS(fileBuffer);

    const bodyNFTMetaData = {
      image: `${process.env.IPFS_FILE_PATH_UR}/${profileImagePath}`,
      name: 'EarthMMO-Profile body',
    };

    // store the metaData in IPFS
    const NFTMetadataPath = await storeInIPFS(JSON.stringify(bodyNFTMetaData));
    const userId = uuidv4();
    const numberOfUsers = await User.countDocuments();
    const derivationSuffix: number = numberOfUsers + 1;

    // create a DB record
    const userDetails = {
      id: userId,
      firstName,
      lastName,
      email,
      profileNFTIPFSHash: NFTMetadataPath,
      ethereumAddress,
      derivationSuffix,
    };

    // Save document
    await User.create(userDetails);
    // create a JWT sign and send it

    //get secret passing the path
    const secret = generateSecret(derivationSuffix);

    // create JWT
    const jwt = await createToken(
      { id: userId, firstName, ethereumAddress, suffix: derivationSuffix },
      secret
    );
    return {
      NFTMetadataPath,
      jwt,
      userId,
      email,
    };
  } catch (error: any) {
    if (error instanceof CustomError) throw error;
    logger.error('Error in creating the user : ', error);
    throw new CustomError(
      'Oops! something went wrong',
      400,
      'undefined, error'
    );
  }
};

export const loginUser = async (ethereumAddress: string, signature: string) => {
  try {
    // verify the signature

    const addressOfTheSigner = ether.utils.verifyMessage(
      Buffer.from('hello'),
      signature as string
    );

    if (addressOfTheSigner !== ethereumAddress)
      throw new CustomError('Invalid signature', 401, '400', ethereumAddress);

    const userDetails = await User.findOne(
      { ethereumAddress },
      { derivationSuffix: 1, userId: 1, firstName: 1, id: 1 }
    );
    if (!userDetails)
      throw new CustomError('Please signup', 400, '400', ethereumAddress);
    const { id, firstName, derivationSuffix } = userDetails;
    const secret = generateSecret(derivationSuffix as number);

    // create JWT
    const jwt = await createToken(
      { id, firstName, ethereumAddress, suffix: derivationSuffix },
      secret
    );

    return { jwt, userId: id };
  } catch (error: any) {
    if (error instanceof CustomError) throw error;
    logger.error('Error in loggingin the user : ', error);
    throw new CustomError('Oops! something went wrong', 401, undefined, error);
  }
};

export const updateUser = async (NFT: NFT, userId: string) => {
  try {
    const user = await User.findOne({ id: userId });
    if (!user) throw new CustomError('User not found', 400, '400', userId);
    await User.updateOne({ id: userId }, { $push: { NFT } });
  } catch (error: any) {
    logger.error('Error in updating the user : ', error);
    if (error instanceof CustomError) throw error;
    throw new CustomError(
      undefined,
      error.statusCode ? error.statusCode : undefined,
      undefined,
      error
    );
  }
};

export interface createUserRequest {
  firstName: string;
  lastName?: string;
  email: string;
  ethereumAddress: string;
  signature: string;
}
