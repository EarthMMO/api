import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  twitterHandle?: string;
  profileImagePath?: string;
  profileNFTIPFSHash?: string;
  ethereumAddress: string;
  publicKey: string;
  pinHash?: string;
  signature?: string;
  derivationSuffix: number;
  NFTs: Array<NFT>;
}

export interface NFT {
  name?: string;
  contractAddress?: string;
  tokenId?: string;
  eventId: string;
}

export const UsernameRegex = /(?!^(1|3|bc1|lnbc1))^[0-9a-z_]{3,50}$/i;

const UserSchema = new Schema<IUser>(
  {
    _id: {
      type: String,
      default: () => uuidv4().replaceAll("-", ""),
    },
    firstName: {
      type: String,
      match: [
        UsernameRegex,
        "firstName can only have alphabets, numbers and underscores",
      ],
      minlength: 3,
      maxlength: 50,
    },
    lastName: {
      type: String,
      match: [
        UsernameRegex,
        "lastName can only have alphabets, numbers and underscores",
      ],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      minlength: 3,
      maxlength: 100,
    },
    profileImagePath: {
      type: String,
    },
    profileNFTIPFSHash: {
      type: String,
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
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", UserSchema);
