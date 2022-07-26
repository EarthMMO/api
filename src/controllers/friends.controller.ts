import { Request, Response } from "express";

import Friend from "models/friends.schema";
import User from "models/user.schema";

export default {
  // @desc Send request to friend => status 0 => return ?
  // @route POST /api/SERVER_VERSION/friends/:requesterId/:recipientId
  // @access Private
  // TODO: make the route private
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
  // @desc Accept a friend request
  // @route PATCH /api/SERVER_VERSION/friends/:requesterId/:recipientId
  // @access Private
  // TODO: make the route private
  onAcceptFriendRequest: async (request: Request, response: Response) => {
    try {
      const { requesterId, recipientId } = request.params;
      const friendRequest = await Friend.findOneAndUpdate({ 
          requesterId,
          recipientId,
          status: 1
        },
        { status: 2 },
        { new: true });
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
  // @desc Get all friends based on userId
  // @route GET /api/SERVER_VERSION/friends/:userId
  // @access Private
  // TODO: make the route private
  onGetAllFriends: async (request: Request, response: Response) => {
     try {
      const friends = await User
        .findOne({ _id: request.params.userId })
        .populate('friends')
        .select('friends');
      return response.status(200).json(friends);
     } catch (error) {
      console.error(error);
      return response.status(500).json(error);
     }
  },
  // @desc Delete a friend
  // @route DELETE /api/SERVER_VERSION/friends/:deleteUid
  // @access Private
  // TODO: make the route private
  onDeleteFriend: async (request: Request, response: Response) => {
    try {
      const friendToRemove = request.params.deleteUid;
      const userId = request.body.userId
      const user = await User.findByIdAndUpdate(
        { _id: userId },
        { $pull: { friends: friendToRemove } },
        { new: true }
        );
      // remove from friends collection
      await Friend.findOneAndDelete(
        { $or: [{ requesterId: userId, recipientId: friendToRemove }, { requesterId: friendToRemove, recipientId: userId }] }
        );
      return response.status(200).json(user);
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
  // get all friends requests
};
