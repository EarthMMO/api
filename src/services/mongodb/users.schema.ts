import { Schema, model } from 'mongoose';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  twitterHandle?: string;
  profileNFTIPFSHash?: string;
  ethereumAddress: string;
  publicKey: string;
  pinHash: string;
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
    unique: true,
    minlength: 3,
    maxlength: 100,
  },

  twitterHandle: {
    type: String,
    unique: true,
    minlength: 1,
    maxlength: 100,
  },
  profileNFTIPFSHash: {
    type: String,
    unique: true,
    required: true,
    maxlength: 250,
  },
  ethereumAddress: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 350,
  },
  publicKey: {
    type: String,
    unique: true,
    maxlength: 350,
  },
  pinHash: {
    type: String,
    unique: true,
    maxLength: 350,
  },
});

const UserModel = model<IUser>('User', UserSchema);

export default UserModel;
