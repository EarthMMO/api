import { Schema, model } from 'mongoose';

export interface NFT {
  name?: string;
  contractAddress?: string;
  tokenId?: string;
  eventId: string;
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  twitterHandle?: string;
  profileNFTIPFSHash?: string;
  ethereumAddress: string;
  publicKey: string;
  pinHash?: string;
  signature?: string;
  derivationSuffix: number;
  NFTs: Array<NFT>;
}

export const UsernameRegex = /(?!^(1|3|bc1|lnbc1))^[0-9a-z_]{3,50}$/i;

const UserSchema = new Schema<IUser>({
  id: {
    type: String,
    unique: true,
    require: true,
  },
  firstName: {
    type: String,
    match: [
      UsernameRegex,
      'firstName can only have alphabets, numbers and underscores',
    ],
    minlength: 3,
    maxlength: 50,
  },
  lastName: {
    type: String,
    match: [
      UsernameRegex,
      'lastName can only have alphabets, numbers and underscores',
    ],
    minlength: 3,
    maxlength: 50,
  },

  email: {
    type: String,
    minlength: 3,
    maxlength: 100,
  },
  profileNFTIPFSHash: {
    type: String,
    required: true,
    maxlength: 250,
  },
  NFTs: [
    {
      name: { type: String },
      contractAddress: { type: String },
      tokenId: { type: String },
      eventId: { type: String },
    },
  ],
  ethereumAddress: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 350,
  },
  publicKey: {
    type: String,
    maxlength: 350,
  },

  derivationSuffix: {
    type: Number,
    unique: true,
    require: true,
  },
});

const UserModel = model<IUser>('User', UserSchema);

export default UserModel;
