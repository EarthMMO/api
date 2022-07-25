import { Request, Response } from "express";

import Friend from "models/friends.schema";
import User from "models/user.schema";

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
  onAcceptFriendRequest: async (request: Request, response: Response) => {
    try {
      const { requesterId, recipientId } = request.params;
      const friendRequest = await Friend.findOneAndUpdate({ 
          requesterId,
          recipientId,
          status: 1
        },
        { status: 2 });
      const user1 = await User.findOne({ _id: requesterId })
      if (user1) {
        user1.friends = [...user1.friends, recipientId]
        user1.save()
      }
      const user2 = await User.findOne({ _id: recipientId })  
      if (user2) {
        user2.friends = [...user2.friends, requesterId]
        user2.save()
      }
      return response.status(200).json(friendRequest);
    } catch (error: any) {
      console.error(error);
      return response.status(500).json(error);
    }
  },
  onGetAllFriends: async (request: Request, response: Response) => {
     try {
      console.log('##########', request.params);

     } catch (error) {
      console.error(error);
      return response.status(500).json(error);
     }
  } 
  // send request to friend => status 0 => return ?
  // reject request from other account => status 1 => return ?
  // accept and add to friends => status 2 => return friend data
  // remove friendship => delete entry?
  // block user => status 3 => return ?
  // unblock user
};
