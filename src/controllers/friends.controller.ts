import { Request, Response } from "express";

import Friend from "models/friends.schema";

export default {
  onSendFriendRequest: async (request: Request, response: Response) => {
    try {
      const { requesterId, recipientId } = request.params;
      console.log('##########', request.params);
      const friendRequest = await Friend.create({
        requesterId,
        recipientId,
        status: 1,
      });
      return response.status(200).json(friendRequest);
    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
  
};
