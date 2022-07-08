import { Request, Response } from "express";
import { ethers } from "ethers";
import { v4 as uuidv4 } from "uuid";

import CustomError from "exceptions/custom_error";
import User from "models/user.schema";
import generateSecret from "utils/secret";
import { createToken } from "utils/jwt";
import { fetchEventNFTHashes } from "utils";

export default {
  onCreateOrLoginUser: async (request: Request, response: Response) => {
    try {
      const { firstName, lastName, email, ethereumAddress, signature } =
        request.body;

      const signerAddress = ethers.utils.verifyMessage(
        Buffer.from("hello"),
        signature as string
      );
      if (signerAddress !== ethereumAddress) {
        throw new CustomError("Invalid signature", 401, "401", {
          ethereumAddress,
        });
      }

      let user = await User.findOne({ ethereumAddress });
      let userId;
      let derivationSuffix;
      if (user) {
        userId = user.id;
        derivationSuffix = user.derivationSuffix;
      } else {
        userId = uuidv4();
        const numberOfUsers = await User.countDocuments();
        derivationSuffix = numberOfUsers + 1;
        user = await User.create({
          id: userId,
          derivationSuffix,
          email,
          ethereumAddress,
          firstName,
          lastName,
        });
      }

      const jwt = await createToken(
        { id: user.id, ethereumAddress, suffix: derivationSuffix },
        generateSecret(derivationSuffix)
      );

      return response.status(200).json({ jwt, userId });
    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
  onGetAllUsers: async (request: Request, response: Response) => {
    try {
      const users = await User.find();
      return response.status(200).json(users);
    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
  onGetUserById: async (request: Request, response: Response) => {
    try {
      const userId = request.params.userId;
      let user = await User.findOne({ id: userId });
      const eventImageHashed = await fetchEventNFTHashes(user.NFTs);
      user = { ...user.toObject(), NFTs: eventImageHashed };
      return response.status(200).json(user);
    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
  onUpdateUser: async (request: Request, response: Response) => {
    try {
      const user = await User.findOneAndUpdate(
        { id: request.params.userId },
        { $push: { NFTs: request.body.NFT } },
        { new: true }
      );
      return response.status(200).json(user);
    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
  onUploadUserImage: async (request: Request, response: Response) => {
    try {
      const userId = request.params.userId;
      const user = await User.updateOne(
        { id: userId },
        { profileImagePath: request.file.path }
      );
      return response.status(200).json(user);
    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
};
