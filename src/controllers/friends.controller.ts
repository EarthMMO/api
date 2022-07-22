import { Request, Response } from "express";
const mongoose = require("mongoose");

import Friend from "models/friends.schema";

export default {
  onSendFriendRequest: async (request: Request, response: Response) => {
    try {
      const { requesterId, requesteeId } = request.params;
      console.log(requesterId.length, requesteeId);
      const friendRequest = await Friend.create({
        requester: mongoose.Types.ObjectId(requesterId),
        recipient: mongoose.Types.ObjectId(requesteeId),
        status: 1,
      });
      return response.status(200).json(friendRequest);
    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
};
